import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Cadastro() {
  const navigate = useNavigate();
  const [dados, setDados] = useState({
    nome: '',
    email: '',
    senha: '',
    disciplina: '',
    nivelEnsino: ''
  });

  const alterarCampo = (e) => {
    const { name, value } = e.target;
    setDados(prev => ({ ...prev, [name]: value }));
  };

  const cadastrar = async (e) => {
    e.preventDefault();
    try {
      const resposta = await axios.post(
        'http://localhost:5276/api/Usuarios/cadastrar',
        {
          Nome: dados.nome,
          Email: dados.email,
          SenhaHash: dados.senha,
          Disciplina: dados.disciplina,
          NivelEnsino: dados.nivelEnsino
        }
      );
      alert(resposta.data.mensagem);
      navigate('/');
    } catch (erro) {
      const mensagem = erro.response?.data?.mensagem || erro.response?.data || "Erro ao cadastrar.";
      alert(mensagem);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '3rem auto', padding: '2rem', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#166534', marginBottom: '1.5rem' }}>Criar Nova Conta</h2>

      <form onSubmit={cadastrar}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nome Completo:</label>
          <input type="text" name="nome" value={dados.nome} onChange={alterarCampo} required style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>E-mail:</label>
          <input type="email" name="email" value={dados.email} onChange={alterarCampo} required style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Senha:</label>
          <input type="password" name="senha" value={dados.senha} onChange={alterarCampo} required minLength={6} style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Disciplina que leciona:</label>
          <input type="text" name="disciplina" value={dados.disciplina} onChange={alterarCampo} style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label>Nível de Ensino:</label>
          <input type="text" name="nivelEnsino" value={dados.nivelEnsino} onChange={alterarCampo} style={{ width: '100%', padding: '0.7rem', border: '1px solid #ccc', borderRadius: '6px' }} />
        </div>

        <button type="submit" style={{ width: '100%', padding: '0.9rem', backgroundColor: '#166534', color: 'white', border: 'none', borderRadius: '6px', fontSize: '1rem', cursor: 'pointer' }}>Cadastrar</button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem' }}>Já tem uma conta? <Link to="/" style={{ color: '#2563eb', textDecoration: 'none' }}>Faça login aqui</Link></p>
    </div>
  );
}

export default Cadastro;