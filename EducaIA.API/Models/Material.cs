using System.ComponentModel.DataAnnotations;

namespace EducaIA.API.Models
{
    public class Material
    {
        [Key]
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public string Titulo { get; set; } = "";
        public string Tipo { get; set; } = "";
        public string Conteudo { get; set; } = "";
        public string DataCriacao { get; set; } = "";
    }
}