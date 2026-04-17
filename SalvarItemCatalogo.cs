using System.IO;
using System.Threading.Tasks;
using GerenciadorDeCatalogos.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using MySqlConnector;
using Dapper;

namespace GerenciadorDeCatalogos.Functions
{
    public static class SalvarItemCatalogo
    {
        [FunctionName("SalvarItemCatalogo")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "catalogo/item")] HttpRequest req,
            ILogger log)
        {
            log.LogInformation("C# HTTP trigger function to save a catalog item.");

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            var item = JsonConvert.DeserializeObject<CatalogoItem>(requestBody);

            if (string.IsNullOrEmpty(item.Nome))
            {
                return new BadRequestObjectResult("O nome do item é obrigatório.");
            }

            item.Id = System.Guid.NewGuid().ToString();

            var connectionString = Environment.GetEnvironmentVariable("MySqlConnectionString");
            using var connection = new MySqlConnection(connectionString);
            await connection.OpenAsync();

            const string sql = @"INSERT INTO Itens (Id, Nome, Descricao, UrlDaImagem, Categoria) 
                                 VALUES (@Id, @Nome, @Descricao, @UrlDaImagem, @Categoria)";
            
            await connection.ExecuteAsync(sql, item);

            return new CreatedResult($"/catalogo/item/{item.Id}", item);
        }
    }
}