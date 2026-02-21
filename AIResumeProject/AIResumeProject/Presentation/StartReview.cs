using AIResumeProject.Backend;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace AIResumeProject.Presentation;

public class StartReview
{
    private readonly ILogger<StartReview> _logger;
    private readonly PDFExtractorService _pdfExtractorService;

    public StartReview(
        ILogger<StartReview> logger,
        PDFExtractorService pdfExtractorService)
    {
        _logger = logger;
        _pdfExtractorService = pdfExtractorService;
    }

    [Function("SubmitResumeReview")]
    public async Task<IActionResult> SubmitResumeReview(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "resumes/review")]
            HttpRequest req)
    {
        // 1. Read PDF (or raw body for now)
        using var memoryStream = new MemoryStream();
        await req.Body.CopyToAsync(memoryStream);
        memoryStream.Position = 0;

        string extractedText = _pdfExtractorService.ExtractTextFromPDF(memoryStream);

        var jobId = Guid.NewGuid().ToString();

        ResumeJobStore.Jobs[jobId] = new ResumeJob
        {
            Id = jobId,
            Status = "queued"
        };

        _logger.LogInformation("Resume review job {JobId} queued", jobId);

        return new AcceptedResult(
            $"/api/resumes/status?id={jobId}",
            new
            {
                jobId,
                status = "queued"
            });
    }
}