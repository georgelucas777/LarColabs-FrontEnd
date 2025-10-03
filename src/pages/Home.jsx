// src/pages/Home.jsx
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../services/api";
import SubNavbar from "../components/SubNavbar";

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/Colaborador"); // mock
      setData(response.data);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true, width: "70px" },
    { name: "Nome", selector: (row) => row.nomeCompleto, sortable: true },
    { name: "CPF", selector: (row) => row.cpf },
    {
      name: "Data Nascimento",
      selector: (row) =>
        new Date(row.dataNascimento).toLocaleDateString("pt-BR"),
      sortable: true,
    },
    {
      name: "Ativo",
      selector: (row) => row.ativo,
      cell: (row) =>
        row.ativo ? (
          <span className="badge bg-success">Sim</span>
        ) : (
          <span className="badge bg-danger">Não</span>
        ),
      width: "100px",
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
      <input
        type="text"
        placeholder="Pesquisar por nome ou CPF"
        className="form-control w-50"
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
      <button className="btn btn-outline-secondary ms-2" onClick={fetchData}>
        <i className="bi bi-arrow-clockwise"></i>
      </button>
    </div>
  );

  return (
    <div className="container mt-3">
      {/* ✅ SubNavbar */}
      <SubNavbar />

      <div className="d-flex align-items-center mt-4 mb-2">
        <div className="icon-box icon-dark me-2">
          <i className="bi bi-house"></i>
        </div>
        <h5 className="mb-0 fw-bold text-secondary">Dashboard</h5>
      </div>

      <p className="text-muted small mb-3">
        Acompanhe o status de colaboradores e telefones cadastrados
      </p>

      {/* ✅ Cards de resumo */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="card-title">Colaboradores</h6>
              <h2 className="text-primary">120</h2>
              <i className="bi bi-people fs-3 text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="card-title">Telefones</h6>
              <h2 className="text-success">85</h2>
              <i className="bi bi-telephone fs-3 text-success"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="card-title">Com Telefone Corporativo</h6>
              <h2 className="text-info">60</h2>
              <i className="bi bi-headset fs-3 text-info"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body text-center">
              <h6 className="card-title">Sem Telefone</h6>
              <h2 className="text-danger">25</h2>
              <i className="bi bi-x-circle fs-3 text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Tabela */}
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
        noDataComponent="Nenhum registro encontrado"
      />
    </div>
  );
}

export default Home;
