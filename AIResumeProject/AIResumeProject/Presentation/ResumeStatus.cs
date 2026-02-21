using AIResumeProject.Backend;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace AIResumeProject
{
    public class ResumeStatus
    {
        private readonly ILogger<ResumeStatus> _logger;

        public ResumeStatus(ILogger<ResumeStatus> logger)
        {
            _logger = logger;
        }

        [Function("GetResumeStatus")]
        public Task<IActionResult> GetResumeStatus(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "resumes/status")]
            HttpRequest req)
        {
            var jobId = req.Query["id"].ToString();

            if (string.IsNullOrWhiteSpace(jobId))
                return Task.FromResult<IActionResult>(
                    new BadRequestObjectResult("Missing job id"));

            if (!ResumeJobStore.Jobs.TryGetValue(jobId, out var job))
                return Task.FromResult<IActionResult>(
                    new NotFoundObjectResult("Job not found"));

            return Task.FromResult<IActionResult>(
                new OkObjectResult(new
                {
                    jobId = job.Id,
                    status = job.Status
                }));
        }
    }
}