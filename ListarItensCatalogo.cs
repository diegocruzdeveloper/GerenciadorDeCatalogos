using System.Collections.Generic;
using GerenciadorDeCatalogos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using Dapper;

namespace GerenciadorDeCatalogos.Functions
{
    public static class ListarItensCatalogo
    {
        [FunctionName("ListarItensCatalogo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "catalogo/itens")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function to list catalog items.");

            var connectionString = Environment.GetEnvironmentVariable("MySqlConnectionString");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT * FROM Itens";
            var itens = await connection.QueryAsync<CatalogoItem>(sql);

            return new OkObjectResult(itens);
        }
    }
}