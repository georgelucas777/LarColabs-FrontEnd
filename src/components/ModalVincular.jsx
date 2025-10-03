import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import api from "../services/api";
import AlertaPopup from "./AlertaPopup";

function ModalVincular({ show, onClose, colaborador }) {
  const [telefonesVinculados, setTelefonesVinculados] = useState([]);
  const [todosTelefones, setTodosTelefones] = useState([]);
  const [alerta, setAlerta] = useState(null);
  const [filterText, setFilterText] = useState("");

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

  // ===== FORMATADORES =====
  const formatarStatus = (status) => {
    if (!status) return "";
    switch (status.toLowerCase()) {
      case "ativo":
        return "Ativo";
      case "manutencao":
        return "Manutenção";
      case "desativado":
        return "Desativado";
      default:
        return status;
    }
  };

  const formatarTipo = (tipo) => {
    if (!tipo) return "";
    switch (tipo.toLowerCase()) {
      case "movel":
        return "Móvel";
      case "fixo":
        return "Fixo";
      default:
        return tipo;
    }
  };

  const formatarPatrimonio = (patrimonio) => {
    if (!patrimonio) return "";
    switch (patrimonio.toLowerCase()) {
      case "pessoal":
        return "Pessoal";
      case "corporativo":
        return "Corporativo";
      default:
        return patrimonio;
    }
  };

  // Telefones disponíveis (sem colaborador e não desativados)
  const telefonesDisponiveis = todosTelefones.filter(
    (tel) =>
      !telefonesVinculados.some((v) => v.id === tel.id) &&
      tel.status?.toLowerCase() !== "desativado"
  );

  // ===== COLUNAS DATATABLE =====
  const colunas = (acoes) => [
    {
      name: "DDD",
      selector: (row) => row.ddd,
      sortable: true,
      center: true,
      width: "100px",
    },
    {
      name: "Número",
      selector: (row) => row.numero,
      sortable: true,
      center: true,
    },
    {
      name: "Tipo",
      selector: (row) => formatarTipo(row.tipo),
      sortable: true,
      center: true,
    },
    {
      name: "Patrimônio",
      selector: (row) => formatarPatrimonio(row.patrimonio),
      sortable: true,
      center: true,
    },
    {
      name: "Status",
      selector: (row) => formatarStatus(row.status),
      sortable: true,
      center: true,
      width: "120px",
    },
    {
      name: "Ações",
      center: true,
      width: "160px",
      cell: (row) => acoes(row),
    },
  ];

  // ===== ESTILO IGUAL AO HOME =====
  const customStyles = {
    table: {
      style: { borderRadius: "8px", overflow: "hidden" },
    },
    headCells: {
      style: { fontSize: "15px", fontWeight: "bold", textAlign: "center" },
    },
    cells: {
      style: { fontSize: "14px", paddingTop: "10px", paddingBottom: "10px" },
    },
  };

  // Header de pesquisa
  const TableHeader = (titulo, placeholder, reload) => (
    <div className="d-flex justify-content-between align-items-center w-100">
      <h6 className="fw-bold text-secondary mb-0 d-flex align-items-center">
        {titulo}
      </h6>
      <div className="d-flex align-items-center">
        <input
          type="text"
          placeholder={placeholder}
          className="form-control form-control-sm"
          style={{ width: "220px" }}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        {reload && (
          <button
            className="btn btn-outline-secondary btn-sm ms-2"
            onClick={carregarTelefones}
          >
            <i className="bi bi-arrow-clockwise"></i>
          </button>
        )}
      </div>
    </div>
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
          <DataTable
            columns={colunas((t) => (
              <button
                className="btn btn-sm btn-danger"
                onClick={() => handleDesvincular(t.id)}
              >
                <i className="bi bi-x-circle"></i> Desvincular
              </button>
            ))}
            data={telefonesVinculados.filter(
              (item) =>
                item.ddd.includes(filterText) ||
                item.numero.includes(filterText) ||
                formatarTipo(item.tipo)
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
            )}
            pagination
            highlightOnHover
            striped
            responsive
            customStyles={customStyles}
            subHeader
            subHeaderComponent={TableHeader(
              "📞 Telefones vinculados",
              "Pesquisar telefone vinculado", 
              true
            )}
            paginationRowsPerPageOptions={[5, 10]}
            noDataComponent="Nenhum telefone vinculado"
            paginationComponentOptions={{
              rowsPerPageText: "Registros por página:",
              rangeSeparatorText: "de",
            }}
          />

          <hr />

          <DataTable
            columns={colunas((t) => (
              <button
                className="btn btn-sm btn-success"
                onClick={() => handleVincular(t.id)}
              >
                <i className="bi bi-link"></i> Vincular
              </button>
            ))}
            data={telefonesDisponiveis.filter(
              (item) =>
                item.ddd.includes(filterText) ||
                item.numero.includes(filterText) ||
                formatarTipo(item.tipo)
                  .toLowerCase()
                  .includes(filterText.toLowerCase())
            )}
            pagination
            highlightOnHover
            striped
            responsive
            customStyles={customStyles}
            subHeader
            subHeaderComponent={TableHeader(
              "➕ Telefones disponíveis",
              "Pesquisar telefone disponível",
              true
            )}
            paginationRowsPerPageOptions={[5, 10]}
            noDataComponent="Nenhum telefone disponível"
            paginationComponentOptions={{
              rowsPerPageText: "Registros por página:",
              rangeSeparatorText: "de",
            }}
          />
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
