import { createContext, useState, useContext, useEffect } from "react";
import api from "../services/api";
import SessionExpiredModal from "../components/SessionExpiredModal";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const storedUser =
      localStorage.getItem("user") || sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [sessionExpired, setSessionExpired] = useState(false);

  const login = async (email, password, keepLogged = false) => {
    try {
      const response = await api.post("/Usuario/login", {
        email,
        senha: password,
      });

      const { usuario, token } = response.data;
      const userData = { ...usuario, token };

      setUser(userData);

      if (keepLogged) {
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      return true;
    } catch (error) {
      console.error("Erro de login:", error.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    sessionStorage.removeItem("user");
  };

  const register = async (nome, cpf, email, password) => {
    try {
      await api.post("/Usuario/registrar", {
        nome,
        cpf: cpf.replace(/\D/g, ""),
        email,
        senha: password,
      });
      return true;
    } catch (error) {
      const mensagemErro = error.response?.data?.error || "Erro ao registrar.";
      console.error("Erro ao registrar:", mensagemErro);
      return mensagemErro;
    }
  };

  useEffect(() => {
    const handler = () => {
      setSessionExpired(true);
      logout();
    };
    document.addEventListener("sessionExpired", handler);
    return () => document.removeEventListener("sessionExpired", handler);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, register }}>
      {children}

      <SessionExpiredModal
        show={sessionExpired}
        onConfirm={() => {
          setSessionExpired(false);
          window.location.href = "/login";
        }}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
