import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../services/api";
import SubNavbar from "../components/SubNavbar";
import ModalCrud from "../components/ModalCrud";
import ConfirmModal from "../components/ConfirmModal";
import AlertaPopup from "../components/AlertaPopup";

function Telefones() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentTel, setCurrentTel] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Telefone");
      setData(response.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Erro ao carregar telefones:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (tel = null) => {
    setCurrentTel(tel);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentTel(null);
  };

  const handleSave = async () => {
    const form = document.getElementById("formTelefone");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      if (currentTel?.id) {
        await api.put(`/Telefone/${currentTel.id}`, currentTel);
        setAlerta({
          mensagem: "Telefone atualizado com sucesso!",
          tipo: "sucesso",
        });
      } else {
        const novoTelefone = { ...currentTel, status: "Ativo" };
        await api.post("/Telefone", novoTelefone);
        setAlerta({
          mensagem: "Telefone cadastrado com sucesso!",
          tipo: "sucesso",
        });
      }

      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar telefone:", err);

      const mensagemApi = err.response?.data?.mensagem;

      setAlerta({
        mensagem: mensagemApi || "Erro ao salvar telefone!",
        tipo: "erro",
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentTel((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/Telefone/${deleteId}`);
      fetchData();
      setAlerta({
        mensagem: "Telefone removido com sucesso!",
        tipo: "sucesso",
      });
    } catch (err) {
      console.error("Erro ao excluir telefone:", err);
      setAlerta({ mensagem: "Erro ao excluir telefone.", tipo: "erro" });
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    {
      name: "Número",
      selector: (row) => `${row.ddd ? `(${row.ddd}) ` : ""}${row.numero}`,
      sortable: true,
    },
    {
      name: "Tipo",
      selector: (row) => row.tipo,
      cell: (row) =>
        row.tipo === "Movel" ? (
          <>
            <i className="bi bi-phone-fill me-1 text-primary"></i> Móvel
          </>
        ) : (
          <>
            <i className="bi bi-telephone-fill me-1 text-secondary"></i> Fixo
          </>
        ),
      sortable: true,
    },
    {
      name: "Patrimônio",
      selector: (row) => row.patrimonio,
      cell: (row) =>
        row.patrimonio === "Corporativo" ? (
          <>
            <i className="bi bi-building me-1 text-info"></i> Corporativo
          </>
        ) : (
          <>
            <i className="bi bi-person-badge me-1 text-warning"></i> Pessoal
          </>
        ),
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      cell: (row) => {
        if (row.status === "Ativo") {
          return (
            <span className="badge bg-success">
              <i className="bi bi-check-circle me-1"></i> Ativo
            </span>
          );
        } else if (row.status === "Manutencao") {
          return (
            <span className="badge bg-danger">
              <i className="bi bi-tools me-1"></i> Manutenção
            </span>
          );
        } else if (row.status === "Desativado") {
          return (
            <span className="badge bg-secondary">
              <i className="bi bi-x-circle me-1"></i> Desativado
            </span>
          );
        } else {
          return <span className="badge bg-light text-dark">{row.status}</span>;
        }
      },
      width: "160px",
    },
    {
      name: "Ações",
      cell: (row) => (
        <div className="d-flex justify-content-center">
          <button
            className="btn btn-sm btn-warning me-1"
            title="Editar Telefone"
            onClick={() => handleOpenModal(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>

          <button
            className="btn btn-sm btn-danger"
            title="Excluir Telefone"
            onClick={() => handleDeleteClick(row.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
      width: "120px",
      center: true,
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.numero?.includes(filterText) ||
      item.tipo?.toLowerCase().includes(filterText.toLowerCase())
  );

  const customStyles = {
    table: {
      style: {
        borderRadius: "8px",
        border: "1px solid #dee2e6",
        backgroundColor: "#fff",
      },
    },
    headRow: {
      style: {
        backgroundColor: "#f8f9fa",
        borderBottom: "2px solid #dee2e6",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "bold",
        color: "#495057",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        color: "#212529",
        minHeight: "50px",
        borderBottom: "1px solid #dee2e6",
      },
    },
    cells: {
      style: {
        padding: "12px 16px",
      },
    },
  };

  const TableHeader = (
    <div className="d-flex justify-content-between align-items-center w-100">
      <button className="btn btn-success" onClick={() => handleOpenModal()}>
        <i className="bi bi-plus-lg"></i> Adicionar
      </button>

      <div className="d-flex align-items-center">
        <input
          type="text"
          placeholder="Pesquisar"
          className="form-control form-control-sm"
          style={{ width: "200px" }}
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button
          className="btn btn-outline-secondary btn-sm ms-2"
          onClick={fetchData}
        >
          <i className="bi bi-arrow-clockwise"></i>
        </button>
      </div>
    </div>
  );

  return (
    <div className="container mt-3">
      <SubNavbar />

      <div className="d-flex align-items-center mt-4 mb-2">
        <div className="icon-box icon-green me-2">
          <i className="bi bi-telephone"></i>
        </div>
        <h5 className="mb-0 fw-bold text-secondary">Telefones</h5>
      </div>
      <p className="text-muted small mb-3">
        Cadastre os telefones e gerencie seus tipos e status
      </p>

      <div className="data-table-wrapper">
        <DataTable
          columns={columns}
          data={filteredData}
          progressPending={loading}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
          subHeader
          subHeaderComponent={TableHeader}
          paginationRowsPerPageOptions={[5, 10, 20, 50]}
          paginationPerPage={10}
          noDataComponent="Nenhum telefone encontrado"
          paginationComponentOptions={{
            rowsPerPageText: "Registros por página:",
            rangeSeparatorText: "de",
            selectAllRowsItem: true,
            selectAllRowsItemText: "Todos",
          }}
        />
      </div>

      <ModalCrud
        title={currentTel?.id ? "Editar Telefone" : "Novo Telefone"}
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
      >
        <form id="formTelefone">
          <div className="row">
            <div className="col-md-4 mb-3">
              <label className="form-label">DDD</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-telephone"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="ddd"
                  placeholder="000"
                  value={currentTel?.ddd || ""}
                  maxLength={3}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "ddd",
                        value: e.target.value.replace(/\D/g, ""),
                      },
                    })
                  }
                />
              </div>
            </div>

            <div className="col-md-8 mb-3">
              <label className="form-label">Número</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-123"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="numero"
                  placeholder="999999999"
                  value={currentTel?.numero || ""}
                  maxLength={9}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  required
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "numero",
                        value: e.target.value.replace(/\D/g, ""),
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Tipo</label>
            <select
              className="form-select"
              name="tipo"
              value={currentTel?.tipo || ""}
              required
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="Movel">Móvel</option>
              <option value="Fixo">Fixo</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Patrimônio</label>
            <select
              className="form-select"
              name="patrimonio"
              value={currentTel?.patrimonio || ""}
              required
              onChange={handleChange}
            >
              <option value="">Selecione...</option>
              <option value="Pessoal">Pessoal</option>
              <option value="Corporativo">Corporativo</option>
            </select>
          </div>

          {currentTel?.id && (
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                name="status"
                value={currentTel?.status || ""}
                required
                onChange={handleChange}
              >
                <option value="Ativo">Ativo</option>
                <option value="Manutencao">Manutenção</option>
                <option value="Desativado">Desativado</option>
              </select>
            </div>
          )}
        </form>
      </ModalCrud>
      <ConfirmModal
        show={showConfirm}
        title="Excluir Telefone"
        message="Tem certeza que deseja excluir este telefone?"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
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

export default Telefones;
