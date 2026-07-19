# 📚 EducaIA – Gerador Inteligente de Planos de Aula
**Projeto desenvolvido para o Hackathon FIAP – Pós Tech 6FSDT**

---

## 🎯 Sobre o Projeto
O **EducaIA** é uma solução voltada para professores da rede pública de ensino, que automatiza a criação de planos de aula, materiais complementares, resumos e avaliações — alinhados à BNCC — usando Inteligência Artificial.

Nosso objetivo é reduzir o tempo gasto com planejamento, permitindo que os educadores foquem no que realmente importa: a aprendizagem dos alunos.

---

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React, JavaScript, CSS, React Markdown, jsPDF
- **Backend:** .NET 8, C#, Entity Framework Core, SQL Server
- **Inteligência Artificial:** API Groq (Modelo Llama 3.1)
- **Versionamento:** Git + GitHub

---

## 📂 Estrutura do Repositório

EducaIA/
├── educaia-frontend/   # Interface do usuário
├── EducaIA.API/        # API e regras de negócio
├── .gitignore
└── README.md

---

## 🚀 Como Executar
### Pré-requisitos
- Node.js 18+
- .NET SDK 8.0+
- SQL Server
- Chave de API da Groq

### 1. Rodar o Backend
bash
cd EducaIA.API
dotnet restore
dotnet run

A API fica em http://localhost:5276

###2. Rodar o Frontend

bash
Run
cd educaia-frontend
npm install
npm start

A interface fica em http://localhost:3000

###✨ Funcionalidades Principais
Cadastro e login seguro de professores
Geração automática de planos de aula com IA
Visualização formatada em Markdown
Exportação direta para PDF
Salvar, editar e excluir materiais

###👥 Equipe
Pedro Lima – Desenvolvimento Full Stack

---

### 📌 Como colocar direto por essa tela:
1. Clique no botão verde **"Add a README"**
2. Apague o texto que já aparece lá
3. Cole **todo o conteúdo acima**
4. Role a página para baixo e clique em **"Commit new file"**

Pronto! Agora essa página vai mostrar todo o resumo do projeto automaticamente. 😊
