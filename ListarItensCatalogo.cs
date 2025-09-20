using System.Collections.Generic;
using GerenciadorDeCatalogos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace GerenciadorDeCatalogos.Functions
{
    public static class ListarItensCatalogo
    {
        [FunctionName("ListarItensCatalogo")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "catalogo/itens")] HttpRequest req,
            [CosmosDB(
                databaseName: "CatalogoDB",
                containerName: "Itens",
                ConnectionStringSetting = "CosmosDbConnectionString",
                SqlQuery = "SELECT * FROM c")] IEnumerable<CatalogoItem> itens,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function to list catalog items.");
            return new OkObjectResult(itens);
        }
    }
}