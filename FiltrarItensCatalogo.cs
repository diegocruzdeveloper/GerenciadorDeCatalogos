using System.Collections.Generic;
using GerenciadorDeCatalogos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;

namespace GerenciadorDeCatalogos.Functions
{
    public static class FiltrarItensCatalogo
    {
        [FunctionName("FiltrarItensCatalogo")]
        public static IActionResult Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "catalogo/filtrar/{categoria}")] HttpRequest req,
            [CosmosDB(
                databaseName: "CatalogoDB",
                containerName: "Itens",
                ConnectionStringSetting = "CosmosDbConnectionString",
                SqlQuery = "SELECT * FROM c WHERE c.categoria = {categoria}")] IEnumerable<CatalogoItem> itens,
            string categoria,
            ILogger log)
        {
            log.LogInformation($"C# HTTP trigger function to filter catalog items by category: {categoria}.");
            
            if (itens == null)
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(itens);
        }
    }
}