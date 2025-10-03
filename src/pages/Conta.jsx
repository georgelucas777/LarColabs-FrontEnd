import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { formatCpf } from "../utils/cpf.utils";
import ConfirmModal from "../components/ConfirmModal";
import AlertaPopup from "../components/AlertaPopup";

function Conta() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [editado, setEditado] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setCpf(user.cpf || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleChangeNome = (e) => {
    setNome(e.target.value);
    setEditado(true);
  };

  const handleChangeSenha = (e) => {
    setSenha(e.target.value);
    setEditado(true);
  };

  const handleSalvar = () => {
    setShowConfirm(true);
  };

  const confirmSalvar = async () => {
    setShowConfirm(false);

    try {
      await api.put(`/Usuario/${user.id}`, {
        cpf: user.cpf,
        email: user.email,
        nome,
        senha: senha || null,
        ativo: user.ativo,
      });

      setAlerta({
        mensagem: "Alterações salvas com sucesso! Você será deslogado.",
        tipo: "sucesso",
      });
      setTimeout(() => {
        logout();
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar alterações:", error);
      setAlerta({
        mensagem: "Erro ao salvar alterações.",
        tipo: "erro",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Minha Conta</h3>
      <div className="card shadow-sm p-3">
        <div className="mb-3">
          <label className="form-label">CPF</label>
          <input type="text" className="form-control" value={cpf} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">E-mail</label>
          <input type="email" className="form-control" value={email} disabled />
        </div>

        <div className="mb-3">
          <label className="form-label">Nome</label>
          <input
            type="text"
            className="form-control"
            value={nome}
            onChange={handleChangeNome}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Senha</label>
          <input
            type="password"
            className="form-control"
            value={senha}
            onChange={handleChangeSenha}
            placeholder="Digite a nova senha"
          />
        </div>

        <div className="d-flex justify-content-between">
          <button className="btn btn-secondary" onClick={() => navigate("/")}>
            Voltar
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSalvar}
            disabled={!editado}
          >
            Salvar
          </button>
        </div>
      </div>
      <ConfirmModal
        show={showConfirm}
        title="Confirmação"
        message="Você será deslogado para aplicar as mudanças. Deseja continuar?"
        tipo="warning"
        onConfirm={confirmSalvar}
        onCancel={() => setShowConfirm(false)}
      />
      {alerta && (
        <AlertaPopup
          mensagem={alerta.mensagem}
          tipo={alerta.tipo}
          aoFechar={() => setAlerta(null)}
        />
      )}
    </div>
  );
}

export default Conta;
