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
    public static class FiltrarItensCatalogo
    {
        [FunctionName("FiltrarItensCatalogo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "catalogo/filtrar/{categoria}")] HttpRequest req,
            string categoria,
            ILogger log)
        {
            log.LogInformation($"C# HTTP trigger function to filter catalog items by category: {categoria}.");
            
            var connectionString = Environment.GetEnvironmentVariable("MySqlConnectionString");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT * FROM Itens WHERE Categoria = @Categoria";
            var itens = await connection.QueryAsync<CatalogoItem>(sql, new { Categoria = categoria });
            
            if (itens == null || !itens.Any())
            {
                return new NotFoundResult();
            }

            return new OkObjectResult(itens);
        }
    }
}