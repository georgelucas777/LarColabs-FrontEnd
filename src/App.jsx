import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Colaboradores from "./pages/Colaboradores";
import Telefones from "./pages/Telefones";   // ✅ importar Telefones
// import Usuarios from "./pages/Usuarios";     // ✅ importar Usuarios
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="container mt-4">
          <Routes>
            {/* Rotas públicas */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Rotas privadas */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/colaboradores"
              element={
                <PrivateRoute>
                  <Colaboradores />
                </PrivateRoute>
              }
            />
            <Route
              path="/telefones"
              element={
                <PrivateRoute>
                  <Telefones />
                </PrivateRoute>
              }
            />
            
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
