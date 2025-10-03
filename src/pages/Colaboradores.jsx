import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../services/api";
import SubNavbar from "../components/SubNavbar";
import ModalCrud from "../components/ModalCrud"; // ✅ agora é ModalCrud
import { formatCpf } from "../utils/cpf.utils";
import ConfirmModal from "../components/ConfirmModal";
import ModalVincular from "../components/ModalVincular";
import AlertaPopup from "../components/AlertaPopup";

function Colaboradores() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentColab, setCurrentColab] = useState(null);
  const [cpfVisible, setCpfVisible] = useState({});
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [alerta, setAlerta] = useState(null);
  const [showVincular, setShowVincular] = useState(false);
  const [colabSelecionado, setColabSelecionado] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Colaborador");
      setData(response.data.sort((a, b) => b.id - a.id));
    } catch (error) {
      console.error("Erro ao carregar colaboradores:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (colab = null) => {
    setCurrentColab(colab);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentColab(null);
  };

  const handleSave = async () => {
    const form = document.getElementById("formColaborador");
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    try {
      if (currentColab?.id) {
        await api.put(`/Colaborador/${currentColab.id}`, currentColab);
        setAlerta({
          mensagem: "Colaborador atualizado com sucesso!",
          tipo: "sucesso",
        });
      } else {
        const novoColab = { ...currentColab, ativo: true };
        await api.post("/Colaborador", novoColab);
        setAlerta({
          mensagem: "Colaborador cadastrado com sucesso!",
          tipo: "sucesso",
        });
      }

      fetchData();
      handleCloseModal();
    } catch (err) {
      console.error("Erro ao salvar colaborador:", err);
      setAlerta({ mensagem: "Erro ao salvar colaborador!", tipo: "erro" });
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentColab((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await api.delete(`/Colaborador/${deleteId}`);
      fetchData();
      setAlerta({
        mensagem: "Colaborador removido com sucesso!",
        tipo: "sucesso",
      });
    } catch (err) {
      console.error("Erro ao excluir colaborador:", err);
      setAlerta({ mensagem: "Erro ao excluir colaborador.", tipo: "erro" });
    } finally {
      setShowConfirm(false);
      setDeleteId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleTelefones = (colab) => {
    setColabSelecionado(colab);
    setShowVincular(true);
  };

  // Função para mascarar CPF
  const maskCpf = (cpf) => {
    const formatted = formatCpf(cpf);
    return formatted.replace(
      /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/,
      "$1.***.***-$4"
    );
  };

  // Alternar visibilidade do CPF
  const toggleCpfVisibility = (id) => {
    setCpfVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },

    { name: "Nome", selector: (row) => row.nomeCompleto, sortable: true },

    {
      name: "CPF",
      selector: (row) => row.cpf,
      cell: (row) => (
        <div className="d-flex align-items-center">
          <span className="me-2">
            {cpfVisible[row.id] ? formatCpf(row.cpf) : maskCpf(row.cpf)}
          </span>
          <button
            className="btn btn-sm p-1"
            onClick={() => toggleCpfVisibility(row.id)}
          >
            <i
              className={`bi ${cpfVisible[row.id] ? "bi-eye-slash" : "bi-eye"}`}
            ></i>
          </button>
        </div>
      ),
      width: "160px", // 🔹 reduzido
    },

    {
      name: "Data Nascimento",
      selector: (row) => row.dataNascimento,
      cell: (row) => (
        <span>
          <i className="bi bi-calendar me-1 text-secondary"></i>
          {new Date(row.dataNascimento).toLocaleDateString("pt-BR")}
        </span>
      ),
      sortable: true,
      width: "160px", // 🔹 reduzido
    },

    {
      name: "Status",
      selector: (row) => row.ativo,
      cell: (row) =>
        row.ativo ? (
          <span className="badge bg-success">
            <i className="bi bi-check-circle me-1"></i> Ativo
          </span>
        ) : (
          <span className="badge bg-secondary">
            <i className="bi bi-x-circle me-1"></i> Desativado
          </span>
        ),
      width: "120px",
    },

    {
      name: "Ações",
      cell: (row) => (
        <div className="d-flex justify-content-center">
          {/* Telefones */}
          <button
            className="btn btn-sm btn-primary me-1"
            title="Gerenciar Telefones"
            onClick={() => handleTelefones(row)}
          >
            <i className="bi bi-telephone"></i>
          </button>

          {/* Editar */}
          <button
            className="btn btn-sm btn-warning me-1"
            title="Editar Colaborador"
            onClick={() => handleOpenModal(row)}
          >
            <i className="bi bi-pencil"></i>
          </button>

          {/* Excluir */}
          <button
            className="btn btn-sm btn-danger"
            title="Excluir Colaborador"
            onClick={() => handleDeleteClick(row.id)}
          >
            <i className="bi bi-trash"></i>
          </button>
        </div>
      ),
      width: "160px",
      center: true,
    },
  ];

  const filteredData = data.filter(
    (item) =>
      item.nomeCompleto.toLowerCase().includes(filterText.toLowerCase()) ||
      item.cpf.includes(filterText)
  );

  const customStyles = {
    table: {
      style: {
        borderRadius: "8px",
        overflow: "hidden",
      },
    },
    headCells: {
      style: {
        fontSize: "15px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };

  const TableHeader = (
    <div className="d-flex justify-content-between align-items-center w-100">
      <button className="btn btn-primary" onClick={() => handleOpenModal()}>
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
        <div className="icon-box icon-blue me-2">
          <i className="bi bi-people"></i>
        </div>
        <h5 className="mb-0 fw-bold text-secondary">Colaboradores</h5>
      </div>
      <p className="text-muted small mb-3">
        Cadastre os colaboradores e gerencie suas informações
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
          paginationPerPage={5}
          noDataComponent="Nenhum colaborador encontrado"
        />
      </div>

      {/* ✅ ModalCrud */}
      <ModalCrud
        title={currentColab?.id ? "Editar Colaborador" : "Novo Colaborador"}
        show={showModal}
        onClose={handleCloseModal}
        onSave={handleSave}
      >
        <form id="formColaborador">
          {/* Nome */}
          <div className="mb-3">
            <label className="form-label">Nome Completo</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-person"></i>
              </span>
              <input
                type="text"
                className="form-control"
                name="nomeCompleto"
                placeholder="Digite o nome completo"
                value={currentColab?.nomeCompleto || ""}
                required
                onChange={handleChange}
              />
            </div>
          </div>

          {/* CPF + Data Nascimento lado a lado */}
          <div className="row">
            {/* CPF */}
            <div className="col-md-6 mb-3">
              <label className="form-label">CPF</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-credit-card-2-front"></i>
                </span>
                <input
                  type="text"
                  className="form-control"
                  name="cpf"
                  placeholder="000.000.000-00"
                  value={formatCpf(currentColab?.cpf || "")} // mostra formatado
                  required
                  maxLength={14}
                  pattern="\d{3}\.\d{3}\.\d{3}-\d{2}" // aceita 000.000.000-00
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: "cpf",
                        value: e.target.value.replace(/\D/g, ""), // salva só números no state
                      },
                    })
                  }
                />
              </div>
            </div>

            {/* Data de Nascimento */}
            <div className="col-md-6 mb-3">
              <label className="form-label">Data de Nascimento</label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-calendar-event"></i>
                </span>
                <input
                  type="date"
                  className="form-control"
                  name="dataNascimento"
                  required
                  value={currentColab?.dataNascimento?.substring(0, 10) || ""}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Ativo -> apenas na edição */}
          {currentColab?.id && (
            <div className="form-check mt-2">
              <input
                type="checkbox"
                className="form-check-input"
                name="ativo"
                checked={currentColab?.ativo || false}
                onChange={handleChange}
              />
              <label className="form-check-label">Ativo</label>
            </div>
          )}
        </form>
      </ModalCrud>

      <ModalVincular
        show={showVincular}
        onClose={() => setShowVincular(false)}
        colaborador={colabSelecionado}
      />

      <ConfirmModal
        show={showConfirm}
        title="Excluir Colaborador"
        message="Tem certeza que deseja excluir este colaborador?"
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

export default Colaboradores;
