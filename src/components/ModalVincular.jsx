import { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import api from "../services/api";
import AlertaPopup from "./AlertaPopup";

function ModalVincular({ show, onClose, colaborador }) {
  const [telefonesVinculados, setTelefonesVinculados] = useState([]);
  const [todosTelefones, setTodosTelefones] = useState([]);
  const [telefoneSelecionado, setTelefoneSelecionado] = useState("");
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (show && colaborador) {
      fetchTelefones();
    }
  }, [show, colaborador]);

  const fetchTelefones = async () => {
    try {
      // Telefones já vinculados
      const respVinc = await api.get(`/Colaborador/${colaborador.id}/Telefones`);
      setTelefonesVinculados(respVinc.data);

      // Todos os telefones disponíveis
      const respTodos = await api.get("/Telefone");
      setTodosTelefones(respTodos.data);
    } catch (err) {
      console.error("Erro ao buscar telefones:", err);
    }
  };

  const handleVincular = async () => {
    if (!telefoneSelecionado) return;

    try {
      await api.post(`/Colaborador/${colaborador.id}/Telefones`, {
        idTelefone: telefoneSelecionado,
      });
      setAlerta({ mensagem: "Telefone vinculado com sucesso!", tipo: "sucesso" });
      setTelefoneSelecionado("");
      fetchTelefones();
    } catch (err) {
      console.error("Erro ao vincular telefone:", err);
      setAlerta({ mensagem: "Erro ao vincular telefone.", tipo: "erro" });
    }
  };

  const handleRemover = async (idTelefone) => {
    try {
      await api.delete(`/Colaborador/${colaborador.id}/Telefones/${idTelefone}`);
      setAlerta({ mensagem: "Telefone desvinculado!", tipo: "sucesso" });
      fetchTelefones();
    } catch (err) {
      console.error("Erro ao remover vínculo:", err);
      setAlerta({ mensagem: "Erro ao remover vínculo.", tipo: "erro" });
    }
  };

  return (
    <>
      <Modal show={show} onHide={onClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Telefones de {colaborador?.nomeCompleto}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {/* Telefones vinculados */}
          <h6>Telefones Vinculados</h6>
          {telefonesVinculados.length === 0 ? (
            <p className="text-muted">Nenhum telefone vinculado.</p>
          ) : (
            <ul className="list-group mb-3">
              {telefonesVinculados.map((tel) => (
                <li
                  key={tel.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span>
                    ({tel.ddd}) {tel.numero} - {tel.tipo} ({tel.patrimonio})
                  </span>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleRemover(tel.id)}
                  >
                    <i className="bi bi-x-circle"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* Vincular novo telefone */}
          <h6>Vincular Novo Telefone</h6>
          <div className="d-flex">
            <select
              className="form-select me-2"
              value={telefoneSelecionado}
              onChange={(e) => setTelefoneSelecionado(e.target.value)}
            >
              <option value="">Selecione um telefone...</option>
              {todosTelefones
                .filter(
                  (tel) =>
                    !telefonesVinculados.some((v) => v.id === tel.id) // exclui os já vinculados
                )
                .map((tel) => (
                  <option key={tel.id} value={tel.id}>
                    ({tel.ddd}) {tel.numero} - {tel.tipo} ({tel.patrimonio})
                  </option>
                ))}
            </select>
            <Button variant="primary" onClick={handleVincular}>
              <i className="bi bi-plus-circle"></i> Adicionar
            </Button>
          </div>
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
