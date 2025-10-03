import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import api from "../services/api";
import SubNavbar from "../components/SubNavbar";
import DashboardCard from "../components/DashboardCard";
import { formatCpf } from "../utils/cpf.utils";

function Home() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState("");

  const [totalColabs, setTotalColabs] = useState(0);
  const [ativosColab, setAtivosColab] = useState(0);
  const [desativadosColab, setDesativadosColab] = useState(0);

  const [totalTelefones, setTotalTelefones] = useState(0);
  const [ativosTel, setAtivosTel] = useState(0);
  const [manutencaoTel, setManutencaoTel] = useState(0);
  const [desativadosTel, setDesativadosTel] = useState(0);

  const [totalColabsComTel, setTotalColabsComTel] = useState(0);
  const [totalSemTelefone, setTotalSemTelefone] = useState(0);
  const [totalPessoais, setTotalPessoais] = useState(0);
  const [totalCorporativos, setTotalCorporativos] = useState(0);

  const [totalSemAtribuicoes, setTotalSemAtribuicoes] = useState(0);
  const [totalColabsSemTel, setTotalColabsSemTel] = useState(0);
  const [totalTelSemColab, setTotalTelSemColab] = useState(0);

  const [cpfVisible, setCpfVisible] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const colabResponse = await api.get("/Colaborador/ListaTelefones");
      const colaboradores = colabResponse.data;
      setData(colaboradores.sort((a, b) => b.id - a.id));

      setTotalColabs(colaboradores.length);
      setAtivosColab(colaboradores.filter((c) => c.ativo).length);
      setDesativadosColab(colaboradores.filter((c) => !c.ativo).length);

      const colabsComTel = colaboradores.filter(
        (c) => c.telefones && c.telefones.length > 0
      );
      setTotalColabsComTel(colabsComTel.length);
      setTotalSemTelefone(colaboradores.length - colabsComTel.length);

      setTotalPessoais(
        colabsComTel.filter((c) =>
          c.telefones.some((t) => t.patrimonio === "pessoal")
        ).length
      );
      setTotalCorporativos(
        colabsComTel.filter((c) =>
          c.telefones.some((t) => t.patrimonio === "corporativo")
        ).length
      );

      const telResponse = await api.get("/Telefone");
      const telefones = telResponse.data;

      setTotalTelefones(telefones.length);
      setAtivosTel(telefones.filter((t) => t.status === "Ativo").length);
      setManutencaoTel(
        telefones.filter((t) => t.status === "Manutencao").length
      );
      setDesativadosTel(
        telefones.filter((t) => t.status === "Desativado").length
      );

      const colabsSemTel = colaboradores.filter(
        (c) => !c.telefones || c.telefones.length === 0
      ).length;
      setTotalColabsSemTel(colabsSemTel);

      const telefonesVinculadosIds = new Set(
        colaboradores.flatMap((c) => c.telefones?.map((t) => t.id) || [])
      );

      const telSemColab = telefones.filter(
        (t) => !telefonesVinculadosIds.has(t.id)
      ).length;
      setTotalTelSemColab(telSemColab);

      setTotalSemAtribuicoes(colabsSemTel + telSemColab);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  const maskCpf = (cpf) => {
    const formatted = formatCpf(cpf);
    return formatted.replace(
      /^(\d{3})\.(\d{3})\.(\d{3})-(\d{2})$/,
      "$1.***.***-$4"
    );
  };

  const toggleCpfVisibility = (id) => {
    setCpfVisible((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

      <div className="d-flex align-items-center mt-4 mb-2">
        <div className="icon-box icon-dark me-2">
          <i className="bi bi-house"></i>
        </div>
        <h5 className="mb-0 fw-bold text-secondary">Dashboard</h5>
      </div>

      <p className="text-muted small mb-3">
        Acompanhe o status de colaboradores e telefones cadastrados
      </p>

      <div className="row mb-4">
        <DashboardCard
          title="Colaboradores"
          total={totalColabs}
          icon="bi-people"
          color="primary"
          metrics={[
            { label: "Ativos", value: ativosColab, color: "success" },
            {
              label: "Desativados",
              value: desativadosColab,
              color: "secondary",
            },
          ]}
        />

        <DashboardCard
          title="Telefones"
          total={totalTelefones}
          icon="bi-telephone"
          color="success"
          metrics={[
            { label: "Ativos", value: ativosTel, color: "success" },
            { label: "Manutenção", value: manutencaoTel, color: "danger" },
            { label: "Desativados", value: desativadosTel, color: "secondary" },
          ]}
        />

        <DashboardCard
          title="Colaboradores com Telefone"
          total={totalColabsComTel}
          icon="bi-headset"
          color="info"
          metrics={[
            { label: "Pessoais", value: totalPessoais, color: "warning" },
            {
              label: "Corporativos",
              value: totalCorporativos,
              color: "primary",
            },
          ]}
        />

        <DashboardCard
          title="Sem Atribuições"
          total={totalSemAtribuicoes}
          icon="bi-exclamation-triangle"
          color="danger"
          metrics={[
            {
              label: "Colaboradores",
              value: totalSemTelefone,
              color: "secondary",
            },
            { label: "Telefones", value: totalTelSemColab, color: "secondary" },
          ]}
        />
      </div>

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
