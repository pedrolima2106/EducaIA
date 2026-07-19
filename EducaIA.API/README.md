# ⚙️ EducaIA – Backend API
Serviço de regras de negócio, integração com Inteligência Artificial e persistência de dados do sistema EducaIA, desenvolvido em **.NET 8 com C#**.

---

## 🛠️ Tecnologias Utilizadas
- `.NET 8 / ASP.NET Core Web API` – Framework principal da aplicação
- `Entity Framework Core` – ORM para comunicação com o banco de dados
- `SQL Server` – Banco de dados relacional
- `API Groq` – Integração com modelo de IA (Llama 3.1) para geração de conteúdo

---

## 📂 Estrutura de Pastas

EducaIA.API/
├── Controllers/ # Endpoints da API (Acesso, Gerador, Materiais)
├── Data/ # Contexto do banco de dados
├── Migrations/ # Histórico de alterações no banco
├── Models/ # Entidades: Usuario, Material
├── Services/ # Serviços: integração com IA, lógica de negócio
├── Program.cs # Arquivo de inicialização da API
├── appsettings.json # Configurações gerais
└── EducaIA.API.csproj # Arquivo do projeto
plaintext

---

## 🚀 Como Executar
### 1. Restaurar pacotes
dotnet restore

### 2. Configurar chave da IA
Crie o arquivo appsettings.Development.json (não enviado ao GitHub):
json
{
  "Groq": {
    "ApiKey": "sua-chave-groq-aqui",
    "Modelo": "llama-3.1-70b-versatile"
  }
}

### 3. Aplicar migrações e iniciar

Run
dotnet ef database update
dotnet run

A API ficará disponível em: http://localhost:5276

📋 Endpoints Principais
Tabela
Método	Rota	Função
POST	/api/Acesso/cadastrar	Cadastrar novo professor
POST	/api/Acesso/login	Autenticar usuário
POST	/api/Gerador/plano-aula	Gerar plano de aula com IA
GET	/api/Materiais/usuario/{id}	Listar materiais salvos do usuário
POST	/api/Materiais	Salvar novo material
PUT	/api/Materiais/{id}	Atualizar material existente
DELETE	/api/Materiais/{id}	Excluir material
plaintext

---

### 📌 Como adicionar aqui:
1. Clique em **"Add file"** → **"Create new file"** no canto superior direito
2. No nome do arquivo, escreva **`README.md`**
3. Cole todo o conteúdo acima na área de texto
4. Role para baixo e clique em **"Commit new file"**

Pronto! Agora os 3 READMEs estão todos no lugar certinho. 🚀
