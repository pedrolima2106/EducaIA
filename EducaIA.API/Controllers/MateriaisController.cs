using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EducaIA.API.Data;
using EducaIA.API.Models;

namespace EducaIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MateriaisController : ControllerBase
    {
        private readonly AppDbContext _db;

        public MateriaisController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> Listar(int usuarioId)
        {
            var lista = await _db.Materiais
                .Where(m => m.UsuarioId == usuarioId)
                .OrderByDescending(m => m.Id)
                .ToListAsync();

            return Ok(lista);
        }

        [HttpPost]
        public async Task<IActionResult> Criar([FromBody] Material dados)
        {
            Console.WriteLine("📥 Dados recebidos na API:");
            Console.WriteLine($"UsuarioId: {dados.UsuarioId}");
            Console.WriteLine($"Titulo: '{dados.Titulo}'");
            Console.WriteLine($"Tipo: '{dados.Tipo}'");
            Console.WriteLine($"Conteudo: '{dados.Conteudo}'");

            if (dados == null || dados.UsuarioId <= 0)
                return BadRequest("Dados inválidos");

            dados.DataCriacao = DateTime.Now.ToString("dd/MM/yyyy HH:mm");

            _db.Materiais.Add(dados);
            await _db.SaveChangesAsync();

            return Ok(new { mensagem = "Salvo", id = dados.Id });
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Atualizar(int id, [FromBody] Material dados)
        {
            var item = await _db.Materiais.FindAsync(id);
            if (item == null) return NotFound();

            item.Titulo = dados.Titulo;
            item.Tipo = dados.Tipo;
            item.Conteudo = dados.Conteudo;

            await _db.SaveChangesAsync();
            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Excluir(int id)
        {
            var item = await _db.Materiais.FindAsync(id);
            if (item == null) return NotFound();

            _db.Materiais.Remove(item);
            await _db.SaveChangesAsync();
            return Ok();
        }
    }
}