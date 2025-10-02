import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        {/* Marca */}
        <Link className="navbar-brand" to="/">LarColabs</Link>

        {/* Menu quando logado */}
        {user && (
          <div>
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">Início</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/colaboradores">Colaboradores</Link>
              </li>
            </ul>
          </div>
        )}

        {/* Área da direita */}
        <div className="d-flex align-items-center">
          {!user ? (
            <>
              {isLoginPage && (
                <Link className="btn btn-outline-light" to="/register">
                  Registrar
                </Link>
              )}
              {isRegisterPage && (
                <Link className="btn btn-outline-light" to="/login">
                  Login
                </Link>
              )}
            </>
          ) : (
            <div className="dropdown d-flex align-items-center">
              <span className="text-white me-2">
                Bem-vindo, <strong>{user.nome}</strong>
              </span>

              <button
                className="btn ms-1"
                id="userMenuButton"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ color: "white", padding: "2px 6px" }}
              >
                <i className="bi bi-caret-down-fill"></i>
              </button>

              <ul
                className="dropdown-menu dropdown-menu-end"
                aria-labelledby="userMenuButton"
              >
                <li>
                  <Link className="dropdown-item" to="/conta">
                    Conta
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={logout}>
                    Sair
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
