// src/pages/Home.jsx
import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../services/api";
import SubNavbar from "../components/SubNavbar";

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const [totalColabs, setTotalColabs] = useState(0);
  const [totalTelefones, setTotalTelefones] = useState(0);
  const [totalCorporativos, setTotalCorporativos] = useState(0);
  const [totalSemTelefone, setTotalSemTelefone] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 📌 Colaboradores + Telefones vinculados
      const colabResponse = await api.get("/Colaborador/ListaTelefones");
      const colaboradores = colabResponse.data;
      setData(colaboradores.sort((a, b) => b.id - a.id));

      setTotalColabs(colaboradores.length);

      let qtdCorporativos = 0;
      let qtdSemTelefone = 0;

      colaboradores.forEach((c) => {
        if (c.telefones && c.telefones.length > 0) {
          qtdCorporativos += c.telefones.filter(
            (t) => t.patrimonio === "corporativo"
          ).length;
        } else {
          qtdSemTelefone++;
        }
      });

      setTotalCorporativos(qtdCorporativos);
      setTotalSemTelefone(qtdSemTelefone);

      const telResponse = await api.get("/Telefone");
      setTotalTelefones(telResponse.data.length);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      name: "Colaborador",
      selector: (row) => row.nomeCompleto,
      sortable: true,
      width: "400px",
    },
    {
      name: "CPF",
      selector: (row) => row.cpf,
      sortable: true,
      width: "160px",
    },
    {
      name: "Telefones",
      selector: (row) => row.telefones,
      cell: (row) =>
        row.telefones && row.telefones.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {row.telefones.map((t) => (
              <div
                key={t.id}
                className="d-flex align-items-center px-2 py-1 border rounded-pill bg-light"
                style={{ fontSize: "0.8rem" }}
              >
                <span className="me-2 text-muted">
                  ({t.ddd}) {t.numero}
                </span>

                {/* Tipo */}
                {t.tipo === "movel" ? (
                  <i
                    className="bi bi-phone-fill text-primary me-1"
                    title="Telefone Móvel"
                  ></i>
                ) : (
                  <i
                    className="bi bi-telephone-fill text-secondary me-1"
                    title="Telefone Fixo"
                  ></i>
                )}

                {/* Patrimônio */}
                {t.patrimonio === "corporativo" ? (
                  <i
                    className="bi bi-building text-info me-1"
                    title="Corporativo"
                  ></i>
                ) : (
                  <i
                    className="bi bi-person-badge text-warning me-1"
                    title="Pessoal"
                  ></i>
                )}

                {/* Status */}
                {t.status === "ativo" ? (
                  <i
                    className="bi bi-check-circle-fill text-success"
                    title="Ativo"
                  ></i>
                ) : t.status === "manutencao" ? (
                  <i className="bi bi-tools text-danger" title="Manutenção"></i>
                ) : (
                  <i
                    className="bi bi-x-circle-fill text-secondary"
                    title="Desativado"
                  ></i>
                )}
              </div>
            ))}
          </div>
        ) : (
          <span className="text-muted small">Nenhum telefone</span>
        ),
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
        paddingTop: "10px",
        paddingBottom: "10px",
      },
    },
  };

  const TableHeader = (
    <div className="d-flex justify-content-end align-items-center w-100">
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

      {/* Título */}
      <div className="d-flex align-items-center mt-4 mb-2">
        <div className="icon-box icon-dark me-2">
          <i className="bi bi-house"></i>
        </div>
        <h5 className="mb-0 fw-bold text-secondary">Dashboard</h5>
      </div>

      <p className="text-muted small mb-3">
        Acompanhe o status de colaboradores e telefones cadastrados
      </p>

      {/* 🔹 Cards Dinâmicos */}
      <div className="row mb-4">
        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body dashboard-card text-center">
              <h6 className="card-title">Colaboradores</h6>
              <h2 className="text-primary">{totalColabs}</h2>
              <i className="bi bi-people fs-3 text-primary"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body dashboard-card text-center">
              <h6 className="card-title">Telefones</h6>
              <h2 className="text-success">{totalTelefones}</h2>
              <i className="bi bi-telephone fs-3 text-success"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body dashboard-card text-center">
              <h6 className="card-title">Com Telefone Corporativo</h6>
              <h2 className="text-info">{totalCorporativos}</h2>
              <i className="bi bi-building fs-3 text-info"></i>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow-sm border-0">
            <div className="card-body dashboard-card text-center">
              <h6 className="card-title">Sem Telefone</h6>
              <h2 className="text-danger">{totalSemTelefone}</h2>
              <i className="bi bi-x-circle fs-3 text-danger"></i>
            </div>
          </div>
        </div>
      </div>

      {/* 🔹 Tabela */}
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
          noDataComponent="Nenhum colaborador encontrado"
        />
      </div>
    </div>
  );
}

export default Home;
