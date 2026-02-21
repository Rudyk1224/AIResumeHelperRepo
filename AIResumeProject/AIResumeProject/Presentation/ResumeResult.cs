using AIResumeProject.Backend;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using System.Threading.Tasks;

namespace AIResumeProject
{
    public class ResumeResult
    {
        [Function("GetResumeResult")]
        public Task<IActionResult> GetResumeResult(
            [HttpTrigger(
                AuthorizationLevel.Anonymous,
                "get",
                Route = "resumes/{id}")]
            HttpRequest req,
            string id)
        {
            if (!ResumeJobStore.Jobs.TryGetValue(id, out var job))
                return Task.FromResult<IActionResult>(
                    new NotFoundObjectResult("Job not found"));

            if (job.Status != "done")
                return Task.FromResult<IActionResult>(
                    new ConflictObjectResult(new
                    {
                        status = job.Status
                    }));

            return Task.FromResult<IActionResult>(
                new OkObjectResult(job.Result));
        }
    }
}