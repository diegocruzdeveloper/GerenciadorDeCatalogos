# Gerenciador de Catálogos

Um sistema completo de gerenciamento de catálogos com backend em Azure Functions (.NET) e frontend em React + Vite.

## 📋 Visão Geral

Este projeto consiste em uma API RESTful desenvolvida com Azure Functions para gerenciar itens de catálogo, incluindo operações CRUD e upload de imagens, juntamente com um frontend moderno construído com React e Vite.

## 🏗️ Arquitetura

### Backend (Azure Functions - .NET 10.0)

O backend é composto por 4 funções HTTP:

| Função | Método | Rota | Descrição |
|--------|--------|------|-----------|
| `ListarItensCatalogo` | GET | `/catalogo/itens` | Lista todos os itens do catálogo |
| `FiltrarItensCatalogo` | GET | `/catalogo/filtrar/{categoria}` | Filtra itens por categoria |
| `SalvarItemCatalogo` | POST | `/catalogo/item` | Cria um novo item no catálogo |
| `UploadImagemCatalogo` | POST | `/catalogo/upload` | Faz upload de imagens para o catálogo |

### Frontend (React + Vite)

- **Framework:** React 19.2.4
- **Build Tool:** Vite 8.0.4
- **Estilização:** TailwindCSS 4.2.2
- **HTTP Client:** Axios 1.15.0
- **Ícones:** Lucide React 1.8.0

## 🚀 Pré-requisitos

- [.NET 10.0 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) (versão recomendada: 18+)
- [Azure Functions Core Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local)
- Banco de dados MySQL
- Variável de ambiente `MySqlConnectionString` configurada

## 📦 Estrutura do Projeto

```
/workspace
├── GerenciadorDeCatalogos.csproj    # Projeto .NET
├── local.settings.json              # Configurações locais do Azure Functions
├── Models/
│   └── CatalogoItem.cs              # Modelo de dados do item
├── ListarItensCatalogo.cs           # Função: Listar itens
├── FiltrarItensCatalogo.cs          # Função: Filtrar por categoria
├── SalvarItemCatalogo.cs            # Função: Salvar item
├── UploadImagemCatalogo.cs          # Função: Upload de imagem
└── frontend/
    ├── package.json                 # Dependências do frontend
    ├── vite.config.js               # Configuração do Vite
    ├── index.html                   # HTML principal
    └── src/                         # Código fonte React
```

## 🔧 Configuração

### Backend

1. Configure a string de conexão do MySQL no arquivo `local.settings.json`:

```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "dotnet",
    "MySqlConnectionString": "Server=localhost;Database=catalogo;User Id=root;Password=sua_senha;"
  }
}
```

2. Crie a tabela no banco de dados MySQL:

```sql
CREATE TABLE Itens (
    Id VARCHAR(36) PRIMARY KEY,
    Nome VARCHAR(255) NOT NULL,
    Descricao TEXT,
    UrlDaImagem VARCHAR(500),
    Categoria VARCHAR(100)
);
```

### Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure a URL da API no seu código (se necessário)

## ▶️ Como Executar

### Backend

```bash
# No diretório raiz do projeto
func start
```

Ou usando .NET CLI:
```bash
dotnet run
```

### Frontend

```bash
# No diretório frontend/
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (porta padrão do Vite).

## 📡 Endpoints da API

### Listar todos os itens
```http
GET /catalogo/itens
```

### Filtrar itens por categoria
```http
GET /catalogo/filtrar/{categoria}
```

### Criar novo item
```http
POST /catalogo/item
Content-Type: application/json

{
  "nome": "Nome do Item",
  "descricao": "Descrição do item",
  "urlDaImagem": "/uploads/imagem.jpg",
  "categoria": "Categoria"
}
```

### Upload de imagem
```http
POST /catalogo/upload
Content-Type: multipart/form-data

[arquivo de imagem]
```

## 🛠️ Tecnologias Utilizadas

### Backend
- .NET 10.0
- Azure Functions 4.x
- Dapper 2.1.35 (ORM leve)
- MySqlConnector 2.4.0
- Entity Framework Core 9.0.0
- Pomelo.EntityFrameworkCore.MySql 8.0.3

### Frontend
- React 19.2.4
- Vite 8.0.4
- TailwindCSS 4.2.2
- Axios 1.15.0
- Lucide React 1.8.0
- ESLint 9.39.4

## 📝 Scripts Disponíveis (Frontend)

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera build de produção |
| `npm run lint` | Executa linting do código |
| `npm run preview` | Visualiza build de produção |

## 🌍 Implantação

### Azure Functions

Para publicar no Azure:

```bash
# Build do projeto
dotnet publish -c Release

# Deploy via Azure CLI
az functionapp deployment source config-zip \
  --resource-group <grupo-de-recursos> \
  --name <nome-do-function-app> \
  --src <caminho-para-zip>
```

### Frontend

Para build de produção:

```bash
cd frontend
npm run build
```

Os arquivos estáticos serão gerados na pasta `dist/`.

## ⚙️ Variáveis de Ambiente

### Backend
- `MySqlConnectionString`: String de conexão com o banco MySQL
- `AzureWebJobsStorage`: Storage account do Azure (para execução local: `UseDevelopmentStorage=true`)
- `FUNCTIONS_WORKER_RUNTIME`: Deve ser definido como `dotnet`

## 📄 Licença

Este projeto está sob licença MIT.

## 👥 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commitar suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abrir um Pull Request

---

**Desenvolvido com ❤️ usando .NET e React**
