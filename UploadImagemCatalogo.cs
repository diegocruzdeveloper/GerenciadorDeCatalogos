using System.IO;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Microsoft.WindowsAzure.Storage.Blob;

namespace GerenciadorDeCatalogos.Functions
{
    public static class UploadImagemCatalogo
    {
        [FunctionName("UploadImagemCatalogo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "catalogo/upload")] HttpRequest req,
            [Blob("imagens-catalogo", FileAccess.Write, Connection = "AzureWebJobsStorage")] CloudBlobContainer blobContainer,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function processed a request to upload an image.");

            if (req.Form.Files.Count == 0)
            {
                return new BadRequestObjectResult("Nenhum arquivo foi enviado.");
            }

            var file = req.Form.Files[0];
            var fileName = System.Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);

            await blobContainer.CreateIfNotExistsAsync();
            
            CloudBlockBlob cloudBlockBlob = blobContainer.GetBlockBlobReference(fileName);
            cloudBlockBlob.Properties.ContentType = file.ContentType;
            
            using (var fileStream = file.OpenReadStream())
            {
                await cloudBlockBlob.UploadFromStreamAsync(fileStream);
            }
            
            log.LogInformation($"Arquivo {fileName} salvo com sucesso no container imagens-catalogo.");

            return new OkObjectResult(new { url = cloudBlockBlob.Uri.ToString() });
        }
    }
}