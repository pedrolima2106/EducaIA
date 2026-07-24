using EducaIA.API.Services;
using Microsoft.AspNetCore.Mvc;

namespace EducaIA.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GeradorController : ControllerBase
    {
        private readonly IGeradorPlanoAula _gerador;
        private readonly ILogger<GeradorController> _logger;

        public GeradorController(IGeradorPlanoAula gerador, ILogger<GeradorController> logger)
        {
            _gerador = gerador;
            _logger = logger;
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
                _logger.LogInformation("📥 Gerando plano: Série={Serie}, Disciplina={Disciplina}, Tema={Tema}",
                    dados.Serie, dados.Disciplina, dados.Tema);

                var conteudo = await _gerador.GerarAsync(
                    dados.Serie,
                    dados.Disciplina,
                    dados.Duracao,
                    dados.Tema,
                    dados.Objetivos
                );

                _logger.LogInformation("✅ Plano gerado com sucesso! Tamanho do conteúdo: {Caracteres} caracteres",
                    conteudo?.Length ?? 0);

                return Ok(new
                {
                    Sucesso = true,
                    Titulo = $"Plano de Aula: {dados.Tema}",
                    Conteudo = conteudo
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "❌ Erro ao gerar plano");
                return StatusCode(500, new
                {
                    Sucesso = false,
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