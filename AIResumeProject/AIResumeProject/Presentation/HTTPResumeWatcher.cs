using AIResumeProject.Backend;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AIResumeProject.Presentation
{
    [DisableCors]
    public class HTTPResumeWatcher
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HTTPResumeWatcher> _logger;
        private readonly PDFExtractorService _pdfExtractorService;

        public HTTPResumeWatcher(
            ILogger<HTTPResumeWatcher> logger,
            IHttpClientFactory httpClientFactory,
            PDFExtractorService _pdfExtractrorService)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
            _pdfExtractorService = _pdfExtractrorService;
        }

        [Function("UploadResume")]
        public async Task<ObjectResult> HandleResumePDF(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            using var memoryStream = new MemoryStream();
            await req.Body.CopyToAsync(memoryStream);
            memoryStream.Position = 0;

            string pdfText = _pdfExtractorService.ExtractTextFromPDF(memoryStream);

            string systemPrompt = """"
            You are a resume reviewer for early-career students.
            Give actionable, specific tips.
            Do not invent experience

            Rules:
            - Each section must contain 2–5 concise tips
            - Tips must be actionable and specific
            - Do not invent experience
            - If a section is missing, explain what to add
            """";

            string userPrompt = $"""
            Analyze the following resume and provide improvement tips:

            {pdfText}
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
                    temperature = 0.2 // Creativeness of the model (very deterministic, consistent, factual)
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
            var modelResponse = doc.RootElement.GetProperty("response").GetString();

            if (string.IsNullOrEmpty(modelResponse)) {
                return new BadRequestObjectResult("Something went wrong!");
            }

            var structuredObject = JsonSerializer.Deserialize<object>(modelResponse);
            return new OkObjectResult(structuredObject);
        }
    }
}