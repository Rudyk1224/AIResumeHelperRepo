using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;

namespace AIResumeProject.Backend
{
    public class PDFExtractorService
    {
        public string ExtractTextFromPDF(MemoryStream stream)
        {
            if(stream == null)
            {
                throw new ArgumentException("Invalid or empty PDF");
            }

            PdfReader reader = new PdfReader(stream);
            PdfDocument pdfDoc = new PdfDocument(reader);

            int numPages = pdfDoc.GetNumberOfPages();
            string text = "";

            for (int i = 0; i < numPages; i++)
            {
                text += PdfTextExtractor.GetTextFromPage(pdfDoc.GetPage(i + 1));
            }
            
            return text;
        }
    }
}
