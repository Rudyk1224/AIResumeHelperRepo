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
        public IActionResult GetResumeResult(
    [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "resumes/{id}")]
    HttpRequest req,
    string id)
        {
            if (!ResumeJobStore.Jobs.TryGetValue(id, out var job))
                return new NotFoundResult();

            if (job.Status != "completed")
            {
                return new OkObjectResult(new
                {
                    status = job.Status
                });
            }

            return new OkObjectResult(job.Result);
        }
    }
}