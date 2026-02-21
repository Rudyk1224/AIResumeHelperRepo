using AIResumeProject.Backend;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace AIResumeProject
{
    public class HTTPResumeWatcher
    {
        private readonly ILogger<HTTPResumeWatcher> _logger;
        private readonly PDFExtractorService pdfExtractorService;

        public HTTPResumeWatcher(ILogger<HTTPResumeWatcher> logger, PDFExtractorService pdfService)
        {
            _logger = logger;
            pdfExtractorService = pdfService;
        }

        [Function("UploadResume")]
        public async Task<IActionResult> HandleResumePDF([HttpTrigger(AuthorizationLevel.Anonymous, "get", "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request. Handling Resume PDF");
            using var memoryStream = new MemoryStream();
            await req.Body.CopyToAsync(memoryStream); //copy the request's body containing the data (or PDF bytes) to the blank memory stream
            memoryStream.Position = 0; //reset the position of the pointer to the start of the PDF bytes

            pdfExtractorService.ExtractTextFromPDF(memoryStream);

            return new OkObjectResult("Welcome to Azure Functions!");
        }
    }
}
