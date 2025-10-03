import React, { useEffect, useState } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import api from "../services/api";
import AlertaPopup from "./AlertaPopup";

function ModalVincular({ show, onClose, colaborador }) {
  const [telefonesVinculados, setTelefonesVinculados] = useState([]);
  const [todosTelefones, setTodosTelefones] = useState([]);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (show && colaborador?.id) {
      carregarTelefones();
    }
  }, [show, colaborador]);

  const carregarTelefones = async () => {
    try {
      if (!colaborador?.id) return;

      const respVinculados = await api.get(
        `/Colaborador/${colaborador.id}/ListaTelefones`
      );
      setTelefonesVinculados(respVinculados.data.telefones || []);

      const respTodos = await api.get("/Telefone");
      setTodosTelefones(respTodos.data);
    } catch (err) {
      console.error("Erro ao carregar telefones:", err);
      setAlerta({ mensagem: "Erro ao carregar telefones", tipo: "erro" });
    }
  };

  const handleVincular = async (telefoneId) => {
    try {
      await api.post(
        `/Colaborador/${colaborador.id}/VincularTelefone/${telefoneId}`
      );
      setAlerta({
        mensagem: "Telefone vinculado com sucesso!",
        tipo: "sucesso",
      });
      carregarTelefones();
    } catch (err) {
      console.error("Erro ao vincular telefone:", err);
      setAlerta({ mensagem: "Erro ao vincular telefone", tipo: "erro" });
    }
  };

  const handleDesvincular = async (telefoneId) => {
    try {
      await api.delete(
        `/Colaborador/${colaborador.id}/DesvincularTelefone/${telefoneId}`
      );
      setAlerta({
        mensagem: "Telefone desvinculado com sucesso!",
        tipo: "sucesso",
      });
      carregarTelefones();
    } catch (err) {
      console.error("Erro ao desvincular telefone:", err);
      setAlerta({ mensagem: "Erro ao desvincular telefone", tipo: "erro" });
    }
  };

  const telefonesDisponiveis = todosTelefones.filter(
    (tel) => !telefonesVinculados.some((v) => v.id === tel.id)
  );

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Gerenciar Telefones - {colaborador?.nomeCompleto}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Telefones vinculados */}
          <h6 className="fw-bold text-secondary mb-2">
            <i className="bi bi-telephone-fill me-1 text-danger"></i> Telefones
            vinculados
          </h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>DDD</th>
                <th>Número</th>
                <th>Tipo</th>
                <th>Patrimônio</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {telefonesVinculados.map((t) => (
                <tr key={t.id}>
                  <td>{t.ddd}</td>
                  <td>{t.numero}</td>
                  <td>{t.tipo}</td>
                  <td>{t.patrimonio}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDesvincular(t.id)}
                    >
                      <i className="bi bi-x-circle"></i> Desvincular
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <hr />

          {/* Telefones disponíveis */}
          <h6 className="fw-bold text-secondary mb-2">
            <i className="bi bi-plus-circle me-1 text-success"></i> Adicionar
            Telefone
          </h6>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>DDD</th>
                <th>Número</th>
                <th>Tipo</th>
                <th>Patrimônio</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {telefonesDisponiveis.map((t) => (
                <tr key={t.id}>
                  <td>{t.ddd}</td>
                  <td>{t.numero}</td>
                  <td>{t.tipo}</td>
                  <td>{t.patrimonio}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => handleVincular(t.id)}
                    >
                      <i className="bi bi-link"></i> Vincular
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      {alerta && (
        <AlertaPopup
          mensagem={alerta.mensagem}
          tipo={alerta.tipo}
          aoFechar={() => setAlerta(null)}
        />
      )}
    </>
  );
}

export default ModalVincular;
