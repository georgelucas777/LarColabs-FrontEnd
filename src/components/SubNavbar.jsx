import { Link, useLocation } from "react-router-dom";

function SubNavbar() {
  const location = useLocation();

  const links = [
    { to: "/", label: "Dashboard", icon: "bi-house", color: "btn-dark" },
    { to: "/colaboradores", label: "Colaboradores", icon: "bi-people", color: "btn-primary" },
    { to: "/telefones", label: "Telefones", icon: "bi-telephone", color: "btn-success" },
  ];

  return (
    <div className="subnavbar d-flex justify-content-between align-items-center p-3 bg-light shadow-sm rounded mb-4">
      <div>
        <h2 className="fw-bold mb-0">LarColabs</h2>
        <small className="text-muted">Gerenciar colaboradores</small>
      </div>

      <div className="d-flex gap-2">
        {links.map(link => (
          <Link
            key={link.to}
            to={link.to}
            className={`btn ${link.color} px-3 rounded-pill d-flex align-items-center gap-2 ${
              location.pathname === link.to ? "active" : ""
            }`}
          >
            <i className={`bi ${link.icon}`}></i>
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SubNavbar;
