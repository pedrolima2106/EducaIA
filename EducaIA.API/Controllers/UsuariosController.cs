using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducaIA.API.Data;
using EducaIA.API.Models;
using BCrypt.Net;

namespace EducaIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("cadastrar")]
        public async Task<IActionResult> Cadastrar([FromBody] Usuario usuario)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(usuario.Nome) ||
                    string.IsNullOrWhiteSpace(usuario.Email) ||
                    string.IsNullOrWhiteSpace(usuario.SenhaHash))
                {
                    return BadRequest(new { mensagem = "Nome, e-mail e senha são obrigatórios!" });
                }

                var existe = await _context.Usuarios
                    .AnyAsync(u => u.Email.ToLower() == usuario.Email.ToLower());

                if (existe)
                    return BadRequest(new { mensagem = "Esse e-mail já está cadastrado!" });

                usuario.SenhaHash = BCrypt.Net.BCrypt.HashPassword(usuario.SenhaHash);
                usuario.DataCadastro = DateTime.Now;

                _context.Usuarios.Add(usuario);
                await _context.SaveChangesAsync();

                return Ok(new { mensagem = "Cadastro realizado com sucesso!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = $"Erro interno: {ex.Message}" });
            }
        }

        // ✅ Login usando DTO próprio, sem validação de campos desnecessários
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto dados)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(dados.Email) || string.IsNullOrWhiteSpace(dados.Senha))
                    return BadRequest(new { mensagem = "Informe e-mail e senha!" });

                var usuario = await _context.Usuarios
                    .FirstOrDefaultAsync(u => u.Email.ToLower() == dados.Email.ToLower());

                if (usuario == null)
                    return Unauthorized(new { mensagem = "E-mail não encontrado!" });

                bool senhaCorreta = BCrypt.Net.BCrypt.Verify(dados.Senha, usuario.SenhaHash);

                if (!senhaCorreta)
                    return Unauthorized(new { mensagem = "Senha incorreta!" });

                return Ok(new
                {
                    mensagem = "Login realizado com sucesso!",
                    nome = usuario.Nome,
                    usuarioId = usuario.Id,
                    disciplina = usuario.Disciplina
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { mensagem = $"Erro no servidor: {ex.Message}" });
            }
        }
    }
}