using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AIResumeProject.Backend
{
    public class PDFExtractorService
    {
        public void ExtractTextFromPDF(MemoryStream stream)
        {
            if(stream == null)
            {
                throw new ArgumentException("Invalid or empty PDF");
            }
        }
    }
}
