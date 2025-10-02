import { useEffect, useState } from "react";
import api from "../services/api";

function Colaboradores() {
  const [colaboradores, setColaboradores] = useState([]);

  useEffect(() => {
    api.get("/colaboradores")
      .then(res => setColaboradores(res.data))
      .catch(() => console.log("Erro ao carregar colaboradores"));
  }, []);

  return (
    <div>
      <h2>Colaboradores</h2>
      <ul className="list-group">
        {colaboradores.map(c => (
          <li key={c.id} className="list-group-item">
            {c.nomeCompleto} - {c.cpf}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Colaboradores;
