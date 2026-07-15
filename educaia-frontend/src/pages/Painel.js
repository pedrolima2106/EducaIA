import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import "../styles/painel.css";

export default function Painel() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [materiais, setMateriais] = useState([]);
  const [mostrarGerador, setMostrarGerador] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [modoVisualizacao, setModoVisualizacao] = useState("texto"); // "texto" ou "formatado"
  const [form, setForm] = useState({
    id: "",
    titulo: "",
    tipo: "Plano de Aula",
    conteudo: "",
    serie: "",
    disciplina: "",
    duracao: "",
    tema: "",
    objetivos: ""
  });

  useEffect(() => {
    const dadosUsuario = localStorage.getItem("usuario");
    if (!dadosUsuario) {
      navigate("/login");
      return;
    }
    setUsuario(JSON.parse(dadosUsuario));
    carregarMateriais();
  }, [navigate]);

  async function carregarMateriais() {
    try {
      const dados = localStorage.getItem("usuario");
      if (!dados) return;
      const id = JSON.parse(dados).id;
      const res = await axios.get(`http://localhost:5276/api/Materiais/usuario/${id}`);
      setMateriais(res.data);
    } catch (err) {
      console.error("Erro ao carregar materiais:", err);
    }
  }

  async function gerarPlano() {
    if (!form.serie || !form.disciplina || !form.tema) {
      alert("Preencha Série, Disciplina e Tema!");
      return;
    }

    setCarregando(true);
    try {
      const res = await axios.post("http://localhost:5276/api/Gerador/plano-aula", {
        serie: form.serie,
        disciplina: form.disciplina,
        duracao: form.duracao || "1 aula",
        tema: form.tema,
        objetivos: form.objetivos
      });

      setForm(prev => ({
        ...prev,
        titulo: res.data.Titulo,
        conteudo: res.data.Conteudo
      }));
      setMostrarGerador(true);
      setModoVisualizacao("formatado"); // Já abre formatado por padrão
    } catch (err) {
      console.error("Erro completo:", err);
      const msg = err.response?.data?.Erro || err.response?.data?.Mensagem || err.message || "Verifique se a API está rodando";
      alert("Erro ao gerar plano: " + msg);
    } finally {
      setCarregando(false);
    }
  }

  async function salvarMaterial() {
    if (!form.titulo || !form.conteudo) {
      alert("Preencha Título e Conteúdo!");
      return;
    }

    try {
      const dados = localStorage.getItem("usuario");
      if (!dados) return;
      const idUsuario = JSON.parse(dados).id;

      if (form.id) {
        await axios.put(`http://localhost:5276/api/Materiais/${form.id}`, {
          titulo: form.titulo,
          tipo: form.tipo,
          conteudo: form.conteudo,
          usuarioId: idUsuario
        });
      } else {
        await axios.post("http://localhost:5276/api/Materiais", {
          titulo: form.titulo,
          tipo: form.tipo,
          conteudo: form.conteudo,
          usuarioId: idUsuario
        });
      }

      limparFormulario();
      await carregarMateriais();
      alert("Material salvo com sucesso!");
    } catch (err) {
      console.error("Erro ao salvar:", err);
      alert("Erro ao salvar: " + (err.response?.data?.Mensagem || err.message));
    }
  }

  function editarMaterial(mat) {
    setForm({
      id: mat.id,
      titulo: mat.titulo,
      tipo: mat.tipo,
      conteudo: mat.conteudo,
      serie: "",
      disciplina: "",
      duracao: "",
      tema: "",
      objetivos: ""
    });
    setMostrarGerador(true);
    setModoVisualizacao("texto");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function excluirMaterial(id) {
    if (!window.confirm("Tem certeza que deseja excluir este material?")) return;
    try {
      await axios.delete(`http://localhost:5276/api/Materiais/${id}`);
      await carregarMateriais();
    } catch (err) {
      console.error("Erro ao excluir:", err);
      alert("Erro ao excluir: " + (err.response?.data?.Mensagem || err.message));
    }
  }

  function limparFormulario() {
    setForm({
      id: "",
      titulo: "",
      tipo: "Plano de Aula",
      conteudo: "",
      serie: "",
      disciplina: "",
      duracao: "",
      tema: "",
      objetivos: ""
    });
    setMostrarGerador(false);
    setModoVisualizacao("texto");
  }

  async function exportarPDF() {
    if (!form.conteudo) {
      alert("Gere ou preencha o conteúdo primeiro!");
      return;
    }

    const elemento = document.createElement("div");
    elemento.style.padding = "40px";
    elemento.style.fontFamily = "Arial, sans-serif";
    elemento.style.maxWidth = "800px";
    elemento.innerHTML = `
      <h1 style="color: #2563EB; margin-bottom: 8px;">${form.titulo}</h1>
      <p style="color: #6B7280; margin-bottom: 24px;">Tipo: ${form.tipo} | Gerado por EducaIA</p>
      <div style="line-height: 1.6; font-size: 14px; color: #1F2937; white-space: pre-wrap;">
        ${form.conteudo.replace(/\n/g, "<br>")}
      </div>
    `;

    document.body.appendChild(elemento);

    try {
      const canvas = await html2canvas(elemento, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const largura = pdf.internal.pageSize.getWidth();
      const altura = (canvas.height * largura) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, largura, altura);
      pdf.save(`${form.titulo || "plano-aula"}.pdf`);
    } catch (err) {
      console.error("Erro ao gerar PDF:", err);
      alert("Não foi possível gerar o PDF. Tente novamente!");
    } finally {
      document.body.removeChild(elemento);
    }
  }

  function sair() {
    localStorage.removeItem("usuario");
    navigate("/login");
  }

  if (!usuario) return null;

  return (
    <div className="pagina-painel">
      {/* Cabeçalho */}
      <header className="cabecalho">
        <h1>EducaIA</h1>
        <div className="usuario-logado">
          <span>👤 {usuario.nome}</span>
          <button className="btn-sair" onClick={sair}>🚪 Sair</button>
        </div>
      </header>

      <main className="conteudo-painel">
        {/* Seção Gerador de Plano */}
        <section className="secao-gerador">
          <h2>🤖 Gerador Inteligente de Planos de Aula</h2>
          <p>Gere planos completos, formatados e exportáveis em PDF em segundos</p>
          
          {!mostrarGerador && (
            <button 
              className="btn-gerar-plano" 
              onClick={() => setMostrarGerador(true)}
            >
              ✨ Gerar Plano com IA
            </button>
          )}
        </section>

        {/* Formulário */}
        {mostrarGerador && (
          <section className="form-material">
            <h3>{form.id ? "✏ Editar Material" : "📄 Novo Material"}</h3>

            {!form.id && (
              <>
                <div className="grupo-campo">
                  <label>Série/Ano *</label>
                  <input
                    type="text"
                    value={form.serie}
                    onChange={e => setForm({...form, serie: e.target.value})}
                    placeholder="Ex: 5º Ano do Ensino Fundamental"
                    required
                  />
                </div>

                <div className="grupo-campo">
                  <label>Disciplina *</label>
                  <input
                    type="text"
                    value={form.disciplina}
                    onChange={e => setForm({...form, disciplina: e.target.value})}
                    placeholder="Ex: Matemática"
                    required
                  />
                </div>

                <div className="grupo-campo">
                  <label>Duração</label>
                  <input
                    type="text"
                    value={form.duracao}
                    onChange={e => setForm({...form, duracao: e.target.value})}
                    placeholder="Ex: 2 aulas de 45min"
                  />
                </div>

                <div className="grupo-campo">
                  <label>Tema *</label>
                  <input
                    type="text"
                    value={form.tema}
                    onChange={e => setForm({...form, tema: e.target.value})}
                    placeholder="Ex: Frações equivalentes"
                    required
                  />
                </div>

                <div className="grupo-campo">
                  <label>Objetivos Gerais</label>
                  <textarea
                    rows="3"
                    value={form.objetivos}
                    onChange={e => setForm({...form, objetivos: e.target.value})}
                    placeholder="O que os alunos devem aprender?"
                  />
                </div>

                <button 
                  className="btn-gerar-plano" 
                  onClick={gerarPlano}
                  disabled={carregando}
                  style={{marginBottom: "24px", width: "100%"}}
                >
                  {carregando ? "⏳ Gerando plano..." : "✨ Gerar Plano com IA"}
                </button>
              </>
            )}

            <div className="grupo-campo">
              <label>Título *</label>
              <input
                type="text"
                value={form.titulo}
                onChange={e => setForm({...form, titulo: e.target.value})}
                placeholder="Título do material"
                required
              />
            </div>

            <div className="grupo-campo">
              <label>Tipo de Material</label>
              <select
                value={form.tipo}
                onChange={e => setForm({...form, tipo: e.target.value})}
              >
                <option>Plano de Aula</option>
                <option>Resumo</option>
                <option>Exercícios</option>
                <option>Avaliação</option>
              </select>
            </div>

            {/* Alternância de visualização */}
            {form.conteudo && (
              <div style={{ marginBottom: "16px", display: "flex", gap: "12px", alignItems: "center" }}>
                <span style={{ fontWeight: "500", color: "#374151" }}>Visualização:</span>
                <button
                  type="button"
                  onClick={() => setModoVisualizacao("texto")}
                  style={{
                    padding: "6px 12px",
                    border: modoVisualizacao === "texto" ? "2px solid #2563EB" : "1px solid #D1D5DB",
                    background: modoVisualizacao === "texto" ? "#EFF6FF" : "white",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Texto simples
                </button>
                <button
                  type="button"
                  onClick={() => setModoVisualizacao("formatado")}
                  style={{
                    padding: "6px 12px",
                    border: modoVisualizacao === "formatado" ? "2px solid #2563EB" : "1px solid #D1D5DB",
                    background: modoVisualizacao === "formatado" ? "#EFF6FF" : "white",
                    borderRadius: "6px",
                    fontSize: "14px",
                    cursor: "pointer"
                  }}
                >
                  Formatado
                </button>
                <button
                  type="button"
                  onClick={exportarPDF}
                  style={{
                    marginLeft: "auto",
                    padding: "6px 12px",
                    background: "#FBBF24",
                    color: "#1F2937",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    fontWeight: "500",
                    cursor: "pointer"
                  }}
                >
                  📄 Exportar PDF
                </button>
              </div>
            )}

            <div className="grupo-campo">
              <label>Conteúdo *</label>
              {modoVisualizacao === "texto" ? (
                <textarea
                  rows="14"
                  value={form.conteudo}
                  onChange={e => setForm({...form, conteudo: e.target.value})}
                  placeholder="Conteúdo do material..."
                  required
                />
              ) : (
                <div style={{
                  minHeight: "300px",
                  padding: "16px",
                  border: "1px solid #D1D5DB",
                  borderRadius: "8px",
                  background: "#FAFAFA",
                  lineHeight: "1.7",
                  color: "#1F2937"
                }}>
                  <ReactMarkdown>{form.conteudo || "Nenhum conteúdo gerado ainda."}</ReactMarkdown>
                </div>
              )}
            </div>

            <div style={{display: "flex", gap: "12px", flexWrap: "wrap"}}>
              <button className="btn-salvar" onClick={salvarMaterial}>
                💾 Salvar Material
              </button>
              <button 
                className="btn-cancelar" 
                onClick={limparFormulario}
              >
                Cancelar
              </button>
            </div>
          </section>
        )}

        {/* Lista de Materiais */}
        <section className="secao-materiais">
          <h3>📚 Meus Materiais</h3>

          {materiais.length === 0 ? (
            <div className="vazio-materiais">
              <p>Você ainda não tem materiais salvos.</p>
              <p>Clique em "Gerar Plano com IA" para começar!</p>
            </div>
          ) : (
            <div className="lista-materiais">
              {materiais.map(mat => (
                <div key={mat.id} className="card-material">
                  <h4>{mat.titulo}</h4>
                  <span className="tipo-material">{mat.tipo}</span>
                  {mat.dataCriacao && (
                    <div className="data-material">
                      📅 {new Date(mat.dataCriacao).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                  <div className="acoes-card">
                    <button className="btn-editar" onClick={() => editarMaterial(mat)}>
                      ✏ Editar
                    </button>
                    <button className="btn-excluir" onClick={() => excluirMaterial(mat.id)}>
                      🗑 Excluir
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}