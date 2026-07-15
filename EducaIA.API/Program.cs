using EducaIA.API.Data;
using EducaIA.API.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// Banco SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlite(
        builder.Configuration.GetConnectionString("DefaultConnection"));
});

// Configuração da IA (Groq)
builder.Services.Configure<GroqOpcoes>(
    builder.Configuration.GetSection("Groq"));

builder.Services.AddScoped<IGeradorPlanoAula, GeradorPlanoAula>();

// HttpClient
builder.Services.AddHttpClient();

// CORS — DEVE VIR ANTES DE OUTROS MIDDLEWARES
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirFront", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}

// ✅ ORDEM CORRETA: CORS PRIMEIRO
app.UseCors("PermitirFront");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();