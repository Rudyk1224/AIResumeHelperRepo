using AIResumeProject.Backend;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AIResumeProject
{
    public class ResumeProcessorFunction
    {

        private readonly ILogger<ResumeProcessorFunction> _logger;
        private readonly HttpClient _httpClient;

        public ResumeProcessorFunction(
            ILogger<ResumeProcessorFunction> logger,
            IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
        }

        // Runs every 5 seconds
        [Function("ResumeBackgroundProcessor")]
        public async Task Run([TimerTrigger("*/5 * * * * *")] TimerInfo timer)
        {
            var job = ResumeJobStore.Jobs.Values
                .FirstOrDefault(j => j.Status == "queued");

            if (job == null)
                return;

            job.Status = "processing";
            _logger.LogInformation("Processing job {JobId}", job.Id);

            try
            {
                string systemPrompt = """
                You are a resume reviewer for early-career students.
                Give actionable, specific tips.
                Do not invent experience.

                Rules:
                - Each section must contain 2–5 concise tips
                - Tips must be actionable and specific
                - If a section is missing, explain what to add
                """;

                string userPrompt = $"""
                Analyze the following resume and provide improvement tips:

                {job.ResumeText}
                """;

                var format = new
                {
                    type = "object",
                    properties = new
                    {
                        overall_feedback = new { type = "array", items = new { type = "string" } },
                        education_tips = new { type = "array", items = new { type = "string" } },
                        experience_tips = new { type = "array", items = new { type = "string" } },
                        projects_tips = new { type = "array", items = new { type = "string" } },
                        skills_tips = new { type = "array", items = new { type = "string" } },
                        ats_tips = new { type = "array", items = new { type = "string" } }
                    },
                    required = new[]
                    {
                        "overall_feedback",
                        "education_tips",
                        "experience_tips",
                        "projects_tips",
                        "skills_tips",
                        "ats_tips"
                    }
                };

                var payload = new
                {
                    model = "phi3",
                    system = systemPrompt,
                    prompt = userPrompt,
                    format = format,
                    stream = false,
                    options = new
                    {
                        temperature = 0.2
                    }
                };

                var response = await _httpClient.PostAsync(
                    "http://localhost:11434/api/generate",
                    new StringContent(
                        JsonSerializer.Serialize(payload),
                        Encoding.UTF8,
                        "application/json"));

                var json = await response.Content.ReadAsStringAsync();

                using var doc = JsonDocument.Parse(json);
                var modelResponse = doc.RootElement
                    .GetProperty("response")
                    .GetString();

                if (string.IsNullOrWhiteSpace(modelResponse))
                    throw new System.Exception("Empty model response");

                job.Result = JsonSerializer.Deserialize<object>(modelResponse);
                job.Status = "completed";
            }
            catch (System.Exception ex)
            {
                job.Status = "failed";
                job.Error = ex.Message;
                _logger.LogError(ex, "Job {JobId} failed", job.Id);
            }
        }
    }
}