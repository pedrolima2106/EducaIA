import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [modo, setModo] = useState("login");
  const [formLogin, setFormLogin] = useState({ email: "", senha: "" });
  const [formCadastro, setFormCadastro] = useState({ nome: "", email: "", senha: "", disciplina: "", nivelEnsino: "" });

  async function entrar(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5276/api/Acesso/login", formLogin);
      localStorage.setItem("usuario", JSON.stringify(res.data));
      navigate("/painel");
    } catch (err) {
      console.error("Detalhes do erro:", err);
      const mensagem = 
        err.response?.data?.Mensagem || 
        err.response?.data?.message || 
        err.message || 
        "Verifique se a API está rodando";
      alert("Erro: " + mensagem);
    }
  }

  async function cadastrar(e) {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5276/api/Acesso/cadastro", formCadastro);
      alert("✅ Cadastro realizado! Agora faça login.");
      setModo("login");
      setFormCadastro({ nome: "", email: "", senha: "", disciplina: "", nivelEnsino: "" });
    } catch (err) {
      console.error("Detalhes do erro:", err);
      const mensagem = 
        err.response?.data?.Mensagem || 
        err.response?.data?.message || 
        err.message || 
        "Verifique se a API está rodando";
      alert("Erro: " + mensagem);
    }
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#F3F4F6",
      padding: "20px"
    }}>
      <div style={{
        background: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        width: "100%",
        maxWidth: "420px"
      }}>
        <h1 style={{ textAlign: "center", color: "#2563EB", marginBottom: "24px" }}>EducaIA</h1>

        <div style={{ display: "flex", marginBottom: "32px", borderRadius: "8px", overflow: "hidden", border: "1px solid #E5E7EB" }}>
          <button
            onClick={() => setModo("login")}
            style={{
              flex: 1, padding: "10px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer",
              background: modo === "login" ? "#2563EB" : "white",
              color: modo === "login" ? "white" : "#6B7280"
            }}
          >
            Entrar
          </button>
          <button
            onClick={() => setModo("cadastro")}
            style={{
              flex: 1, padding: "10px", border: "none", fontSize: "15px", fontWeight: "600", cursor: "pointer",
              background: modo === "cadastro" ? "#2563EB" : "white",
              color: modo === "cadastro" ? "white" : "#6B7280"
            }}
          >
            Cadastrar
          </button>
        </div>

        {modo === "login" && (
          <form onSubmit={entrar}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151" }}>E-mail</label>
              <input
                type="email"
                value={formLogin.email}
                onChange={e => setFormLogin({...formLogin, email: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151" }}>Senha</label>
              <input
                type="password"
                value={formLogin.senha}
                onChange={e => setFormLogin({...formLogin, senha: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px" }}
                required
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%", padding: "12px", background: "#2563EB", color: "white", border: "none", borderRadius: "8px",
                fontSize: "16px", fontWeight: "600", cursor: "pointer"
              }}
            >
              Entrar
            </button>
          </form>
        )}

        {modo === "cadastro" && (
          <form onSubmit={cadastrar}>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151" }}>Nome completo</label>
              <input
                type="text"
                value={formCadastro.nome}
                onChange={e => setFormCadastro({...formCadastro, nome: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151" }}>E-mail</label>
              <input
                type="email"
                value={formCadastro.email}
                onChange={e => setFormCadastro({...formCadastro, email: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151" }}>Senha</label>
              <input
                type="password"
                value={formCadastro.senha}
                onChange={e => setFormCadastro({...formCadastro, senha: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px" }}
                required
              />
            </div>
            <div style={{ marginBottom: "14px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151" }}>Disciplina (opcional)</label>
              <input
                type="text"
                value={formCadastro.disciplina}
                onChange={e => setFormCadastro({...formCadastro, disciplina: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px" }}
                placeholder="Ex: Física, Matemática"
              />
            </div>
            <div style={{ marginBottom: "24px" }}>
              <label style={{ display: "block", marginBottom: "6px", fontWeight: "500", color: "#374151" }}>Nível de ensino (opcional)</label>
              <input
                type="text"
                value={formCadastro.nivelEnsino}
                onChange={e => setFormCadastro({...formCadastro, nivelEnsino: e.target.value})}
                style={{ width: "100%", padding: "12px", border: "1px solid #D1D5DB", borderRadius: "8px", fontSize: "15px" }}
                placeholder="Ex: Ensino Médio"
              />
            </div>
            <button
              type="submit"
              style={{
                width: "100%", padding: "12px", background: "#16A34A", color: "white", border: "none", borderRadius: "8px",
                fontSize: "16px", fontWeight: "600", cursor: "pointer"
              }}
            >
              Criar conta
            </button>
          </form>
        )}
      </div>
    </div>
  );
}