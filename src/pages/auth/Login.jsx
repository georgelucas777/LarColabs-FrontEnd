import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import AlertaPopup from "../../components/AlertaPopup";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLogged, setKeepLogged] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation();
  const [alerta, setAlerta] = useState(null);

  useEffect(() => {
    if (location.state?.alerta) {
      setAlerta({ mensagem: location.state.alerta, tipo: "sucesso" });
      window.history.replaceState({}, document.title); // remove state da URL
    }
  }, [location]);

  const validate = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "O e-mail é obrigatório";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        newErrors.email = "Digite um e-mail válido";
      }
    }

    if (!password) {
      newErrors.password = "A senha é obrigatória";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await login(email, password, keepLogged);

    if (result.success) {
      navigate("/");
    } else {
      setErrors({ general: result.message || "Credenciais inválidas" });
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Login</h2>

      {alerta && (
        <AlertaPopup
          mensagem={alerta.mensagem}
          tipo={alerta.tipo}
          aoFechar={() => setAlerta(null)}
        />
      )}

      {errors.general && (
        <div className="alert alert-danger">{errors.general}</div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email}</div>
          )}
        </div>

        <div className="mb-3">
          <label>Senha</label>
          <input
            type="password"
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <div className="invalid-feedback">{errors.password}</div>
          )}
        </div>

        <div className="form-check mb-3">
          <input
            type="checkbox"
            id="keepLogged"
            className="form-check-input"
            checked={keepLogged}
            onChange={() => setKeepLogged(!keepLogged)}
          />
          <label htmlFor="keepLogged" className="form-check-label">
            Manter logado
          </label>
        </div>

        <button type="submit" className="btn btn-dark w-100">
          Entrar
        </button>

        <button
          type="button"
          className="btn btn-link mt-2"
          onClick={() => navigate("/register")}
        >
          Não tem conta? Registrar-se
        </button>
      </form>
    </div>
  );
}

export default Login;
