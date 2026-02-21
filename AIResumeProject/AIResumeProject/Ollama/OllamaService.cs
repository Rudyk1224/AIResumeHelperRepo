using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AIResumeProject.Ollama
{
    public class OllamaService
    {
        private readonly HttpClient _http;

        public OllamaService(IHttpClientFactory factory)
        {
            _http = factory.CreateClient("Ollama");
        }
    }
}
