using Newtonsoft.Json;

namespace GerenciadorDeCatalogos.Models
{
    public class CatalogoItem
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("nome")]
        public string Nome { get; set; }

        [JsonProperty("descricao")]
        public string Descricao { get; set; }

        [JsonProperty("urlDaImagem")]
        public string UrlDaImagem { get; set; }

        [JsonProperty("categoria")]
        public string Categoria { get; set; }
    }
}