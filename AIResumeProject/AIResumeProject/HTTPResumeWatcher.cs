using AIResumeProject.Backend;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace AIResumeProject
{
    public class HTTPResumeWatcher
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<HTTPResumeWatcher> _logger;

        public HTTPResumeWatcher(
            ILogger<HTTPResumeWatcher> logger,
            IHttpClientFactory httpClientFactory)
        {
            _logger = logger;
            _httpClient = httpClientFactory.CreateClient();
        }

        [Function("UploadResume")]
        public async Task<IActionResult> HandleResumePDF(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post")] HttpRequest req)
        {
            var payload = new
            {
                model = "phi3:medium-128k",
                prompt = req.Body.ToString(),
                system = "Reply shortly.",
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
            var modelResponse = doc.RootElement.GetProperty("response").GetString();

            return new OkObjectResult(modelResponse);
        }
    }
}