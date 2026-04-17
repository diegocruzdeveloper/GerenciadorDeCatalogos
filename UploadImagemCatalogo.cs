using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace GerenciadorDeCatalogos.Functions
{
    public static class UploadImagemCatalogo
    {
        [FunctionName("UploadImagemCatalogo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "catalogo/upload")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request to upload an image.");

            if (req.Form.Files.Count == 0)
            {
                return new BadRequestObjectResult("Nenhum arquivo foi enviado.");
            }

            var file = req.Form.Files[0];
            var fileName = System.Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            // Salvar em disco local ao invés de Azure Blob Storage
            var uploadsFolder = Path.Combine(Directory.GetCurrentDirectory(), "uploads");
            Directory.CreateDirectory(uploadsFolder);
            
            var filePath = Path.Combine(uploadsFolder, fileName);
            
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(fileStream);
            }
            
            var imageUrl = $"/uploads/{fileName}";
            
            log.LogInformation($"Arquivo {fileName} salvo com sucesso na pasta uploads.");

            return new OkObjectResult(new { url = imageUrl });
        }
    }
}