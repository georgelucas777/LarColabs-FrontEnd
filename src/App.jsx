import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Colaboradores from "./pages/Colaboradores";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/colaboradores" element={<Colaboradores />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
