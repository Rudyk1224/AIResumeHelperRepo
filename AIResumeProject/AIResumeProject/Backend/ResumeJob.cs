using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AIResumeProject.Backend
{
    public static class ResumeJobStore
    {
        public static ConcurrentDictionary<string, ResumeJob> Jobs = new();
    }

    public class ResumeJob
    {
        public string Id { get; set; } = default!;
        public string Status { get; set; } = "queued"; // queued or processing or done or failed
        public object? Result { get; set; }
        public string? Error { get; set; }
    }
}
