using EducaIA.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EducaIA.API.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<Material> Materiais { get; set; }
    }
}