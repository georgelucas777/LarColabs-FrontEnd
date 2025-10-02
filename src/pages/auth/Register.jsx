import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { formatCpf, isValidCpf } from "../../utils/cpf.utils";
import AlertaPopup from "../../components/AlertaPopup";

function Register() {
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { register } = useAuth();
  const [alerta, setAlerta] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!nome.trim()) {
      newErrors.nome = "O nome completo é obrigatório";
    }

    if (!cpf) {
      newErrors.cpf = "O CPF é obrigatório";
    } else if (!isValidCpf(cpf)) {
      newErrors.cpf = "Digite um CPF válido";
    }

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
    } else if (password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "As senhas não coincidem";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;
    setIsLoading(true);

    try {
      const resultado = await register(nome, cpf, email, password);

      if (resultado === true) {
        navigate("/login", {
          state: { alerta: "Registro realizado com sucesso!" },
        });
      } else {
        setAlerta({ mensagem: resultado, tipo: "erro" });
      }
    } catch (err) {
      setAlerta({ mensagem: "Erro inesperado no registro.", tipo: "erro" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "450px" }}>
      <h2 className="mb-4">Registrar-se</h2>

      {alerta && (
        <AlertaPopup
          mensagem={alerta.mensagem}
          tipo={alerta.tipo}
          aoFechar={() => setAlerta(null)}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Nome completo</label>
          <input
            type="text"
            className={`form-control ${errors.nome ? "is-invalid" : ""}`}
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
        </div>

        <div className="mb-3">
          <label>CPF</label>
          <input
            type="text"
            className={`form-control ${errors.cpf ? "is-invalid" : ""}`}
            value={cpf}
            onChange={(e) => setCpf(formatCpf(e.target.value))}
            placeholder="000.000.000-00"
            maxLength="14"
          />
          {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
        </div>

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

        <div className="mb-3">
          <label>Confirmar Senha</label>
          <input
            type="password"
            className={`form-control ${
              errors.confirmPassword ? "is-invalid" : ""
            }`}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {errors.confirmPassword && (
            <div className="invalid-feedback">{errors.confirmPassword}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-success w-100"
          disabled={isLoading}
        >
          {isLoading ? "Registrando..." : "Registrar"}
        </button>
      </form>
    </div>
  );
}

export default Register;
