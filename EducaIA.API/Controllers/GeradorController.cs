using EducaIA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EducaIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeradorController : ControllerBase
    {
        private readonly IGeradorPlanoAula _gerador;

        public GeradorController(IGeradorPlanoAula gerador)
        {
            _gerador = gerador;
        }

        [HttpPost("plano-aula")]
        public async Task<IActionResult> GerarPlano([FromBody] DadosPlano dados)
        {
            if (string.IsNullOrWhiteSpace(dados.Serie) ||
                string.IsNullOrWhiteSpace(dados.Disciplina) ||
                string.IsNullOrWhiteSpace(dados.Tema))
            {
                return BadRequest(new { Erro = "Preencha Série, Disciplina e Tema." });
            }

            try
            {
                var conteudo = await _gerador.GerarAsync(
                    dados.Serie,
                    dados.Disciplina,
                    dados.Duracao,
                    dados.Tema,
                    dados.Objetivos
                );

                return Ok(new
                {
                    Titulo = $"Plano de Aula: {dados.Tema}",
                    Conteudo = conteudo
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    Erro = ex.Message,
                    Detalhe = ex.InnerException?.Message
                });
            }
        }
    }

    public class DadosPlano
    {
        public string Serie { get; set; } = string.Empty;
        public string Disciplina { get; set; } = string.Empty;
        public string Duracao { get; set; } = "1 aula";
        public string Tema { get; set; } = string.Empty;
        public string Objetivos { get; set; } = string.Empty;
    }
}