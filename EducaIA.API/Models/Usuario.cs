using System.ComponentModel.DataAnnotations;

namespace EducaIA.API.Models
{
    public class Usuario
    {
        [Key]
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string SenhaHash { get; set; } = string.Empty;
        public string? Disciplina { get; set; }
        public string? NivelEnsino { get; set; }
        public DateTime DataCadastro { get; set; }
    }
}