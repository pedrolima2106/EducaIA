using EducaIA.API.Data;
using EducaIA.API.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace EducaIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AcessoController : ControllerBase
    {
        private readonly AppDbContext _db;

        public AcessoController(AppDbContext db)
        {
            _db = db;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] DadosLogin dados)
        {
            if (string.IsNullOrWhiteSpace(dados.Email) || string.IsNullOrWhiteSpace(dados.Senha))
                return BadRequest(new { Mensagem = "Preencha e-mail e senha." });

            var usuario = await _db.Usuarios
                .FirstOrDefaultAsync(u => u.Email.ToLower() == dados.Email.ToLower());

            if (usuario == null)
                return Unauthorized(new { Mensagem = "Usuário ou senha inválidos." });

            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dados.Senha));
            var senhaHash = Convert.ToBase64String(hashBytes);

            if (usuario.SenhaHash != senhaHash)
                return Unauthorized(new { Mensagem = "Usuário ou senha inválidos." });

            return Ok(new
            {
                id = usuario.Id,
                nome = usuario.Nome,
                email = usuario.Email,
                disciplina = usuario.Disciplina,
                nivelEnsino = usuario.NivelEnsino
            });
        }

        // ✅ NOVA ROTA: Cadastro
        [HttpPost("cadastro")]
        public async Task<IActionResult> Cadastrar([FromBody] DadosCadastro dados)
        {
            if (string.IsNullOrWhiteSpace(dados.Nome) || 
                string.IsNullOrWhiteSpace(dados.Email) || 
                string.IsNullOrWhiteSpace(dados.Senha))
                return BadRequest(new { Mensagem = "Preencha Nome, E-mail e Senha." });

            var existe = await _db.Usuarios.AnyAsync(u => u.Email.ToLower() == dados.Email.ToLower());
            if (existe)
                return Conflict(new { Mensagem = "Esse e-mail já está cadastrado." });

            using var sha256 = SHA256.Create();
            var hashBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(dados.Senha));
            var senhaHash = Convert.ToBase64String(hashBytes);

            var novoUsuario = new Usuario
            {
                Nome = dados.Nome,
                Email = dados.Email,
                SenhaHash = senhaHash,
                Disciplina = dados.Disciplina ?? "Não informada",
                NivelEnsino = dados.NivelEnsino ?? "Não informado",
                DataCadastro = DateTime.Now
            };

            _db.Usuarios.Add(novoUsuario);
            await _db.SaveChangesAsync();

            return Ok(new { Mensagem = "Cadastro feito! Faça login para continuar." });
        }
    }

    public class DadosLogin
    {
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
    }

    // ✅ Classe para receber dados do cadastro
    public class DadosCadastro
    {
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Senha { get; set; } = string.Empty;
        public string? Disciplina { get; set; }
        public string? NivelEnsino { get; set; }
    }
}