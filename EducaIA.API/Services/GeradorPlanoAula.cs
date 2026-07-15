using System.Text;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace EducaIA.API.Services
{
    public class GroqOpcoes
    {
        public string ApiKey { get; set; } = string.Empty;
        public string Modelo { get; set; } = "llama-3.3-70b-versatile";
    }

    public interface IGeradorPlanoAula
    {
        Task<string> GerarAsync(
            string serie,
            string disciplina,
            string duracao,
            string tema,
            string objetivos
        );
    }

    public class GeradorPlanoAula : IGeradorPlanoAula
    {
        private readonly HttpClient _http;
        private readonly GroqOpcoes _opcoes;

        public GeradorPlanoAula(
            IHttpClientFactory factory,
            IOptions<GroqOpcoes> opcoes)
        {
            _opcoes = opcoes.Value ?? throw new ArgumentNullException(nameof(opcoes));
            
            if (string.IsNullOrWhiteSpace(_opcoes.ApiKey))
                throw new InvalidOperationException(
                    "A chave da API Groq não foi configurada corretamente."
                );

            _http = factory.CreateClient() ?? throw new ArgumentNullException(nameof(factory));
            _http.Timeout = TimeSpan.FromSeconds(90);
            _http.DefaultRequestHeaders.Clear();
            _http.DefaultRequestHeaders.Add(
                "Authorization",
                $"Bearer {_opcoes.ApiKey.Trim()}"
            );
        }

        public async Task<string> GerarAsync(
            string serie,
            string disciplina,
            string duracao,
            string tema,
            string objetivos)
        {
            // Validação de parâmetros de entrada
            if (string.IsNullOrWhiteSpace(serie)) throw new ArgumentException("Informe a série.", nameof(serie));
            if (string.IsNullOrWhiteSpace(disciplina)) throw new ArgumentException("Informe a disciplina.", nameof(disciplina));
            if (string.IsNullOrWhiteSpace(duracao)) throw new ArgumentException("Informe a duração.", nameof(duracao));
            if (string.IsNullOrWhiteSpace(tema)) throw new ArgumentException("Informe o tema da aula.", nameof(tema));

            var prompt = $@"
Você é um professor especialista da educação brasileira.

Sua tarefa é elaborar um plano de aula completo,
bem organizado e alinhado à BNCC.

Responda utilizando Markdown.

O plano deve possuir exatamente esta estrutura:

# Plano de Aula

## Identificação

- Série: {serie}
- Disciplina: {disciplina}
- Duração: {duracao}
- Tema: {tema}

## Objetivos Gerais

## Objetivos Específicos

## Competências da BNCC

## Conteúdos

## Metodologia

## Desenvolvimento da Aula

Descreva passo a passo como o professor deverá conduzir a aula.

## Recursos Didáticos

## Avaliação

## Referências

Considere também estes objetivos informados pelo professor:

{objetivos}

Utilize linguagem formal, clara e objetiva.
";

            var corpo = new
            {
                model = _opcoes.Modelo,
                messages = new object[]
                {
                    new
                    {
                        role = "system",
                        content = "Você é um especialista em educação brasileira e elaboração de planos de aula alinhados à BNCC."
                    },
                    new
                    {
                        role = "user",
                        content = prompt
                    }
                },
                temperature = 0.7,
                max_tokens = 2500
            };

            var json = JsonConvert.SerializeObject(corpo);
            var conteudo = new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

            Console.WriteLine();
            Console.WriteLine("======================================");
            Console.WriteLine("EDUCAIA - GERADOR DE PLANO DE AULA");
            Console.WriteLine("======================================");
            Console.WriteLine("Enviando solicitação para a API Groq...");
            Console.WriteLine($"Modelo utilizado: {_opcoes.Modelo}");
            Console.WriteLine("======================================");

            try
            {
                var resposta = await _http.PostAsync(
                    "https://api.groq.com/openai/v1/chat/completions",
                    conteudo
                );

                var respostaTexto = await resposta.Content.ReadAsStringAsync();
                Console.WriteLine($"Status da requisição: {(int)resposta.StatusCode} - {resposta.ReasonPhrase}");

                if (!resposta.IsSuccessStatusCode)
                {
                    Console.WriteLine();
                    Console.WriteLine("========== ERRO NA API DO GROQ ==========");
                    Console.WriteLine(respostaTexto);
                    Console.WriteLine("==========================================");
                    Console.WriteLine();

                    throw new HttpRequestException(
                        $"Falha na requisição: {resposta.StatusCode} - {resposta.ReasonPhrase}",
                        null,
                        resposta.StatusCode
                    );
                }

                var jsonResposta = JObject.Parse(respostaTexto);
                var texto = jsonResposta["choices"]?[0]?["message"]?["content"]?.ToString();

                if (string.IsNullOrWhiteSpace(texto))
                {
                    Console.WriteLine("Resposta completa da API:");
                    Console.WriteLine(respostaTexto);
                    throw new InvalidOperationException("A API retornou uma resposta vazia ou sem conteúdo.");
                }

                Console.WriteLine();
                Console.WriteLine("======================================");
                Console.WriteLine("✅ Plano de aula gerado com sucesso!");
                Console.WriteLine("======================================");
                Console.WriteLine();

                return texto;
            }
            catch (Exception ex)
            {
                Console.WriteLine();
                Console.WriteLine("======================================");
                Console.WriteLine("❌ ERRO NO PROCESSAMENTO");
                Console.WriteLine("======================================");
                Console.WriteLine($"Mensagem: {ex.Message}");
                
                if (ex.InnerException != null)
                    Console.WriteLine($"Detalhes: {ex.InnerException.Message}");
                
                Console.WriteLine("======================================");
                Console.WriteLine();

                throw new InvalidOperationException(
                    "Não foi possível gerar o plano de aula. Verifique os logs para mais detalhes.",
                    ex
                );
            }
        }
    }
}