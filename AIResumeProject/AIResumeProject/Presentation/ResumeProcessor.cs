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
                var payload = new
                {
                    model = "phi3",
                    prompt = "Give 3 resume improvement tips for a CS student.",
                    stream = false
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

                job.Result = modelResponse;
                job.Status = "done";
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