import { useEffect } from "react";

function AlertaPopup({ mensagem, tipo = "sucesso", aoFechar }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      aoFechar();
    }, 5000);
    return () => clearTimeout(timer);
  }, [aoFechar]);

  const getClass = () => {
    switch (tipo) {
      case "sucesso":
        return "bg-success text-white";
      case "erro":
        return "bg-danger text-white";
      case "aviso":
        return "bg-warning text-dark";
      default:
        return "bg-secondary text-white";
    }
  };

  return (
    <div
      className="toast show position-fixed"
      style={{
        bottom: "20px", // se quiser no canto inferior
        left: "20px", // canto inferior esquerdo
        zIndex: 9999, // 🔹 sempre acima do modal
        minWidth: "280px",
      }}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
    >
      <div className={`toast-header ${getClass()}`}>
        <strong className="me-auto">Notificação</strong>
        <button
          type="button"
          className="btn-close btn-close-white ms-2 mb-1"
          aria-label="Close"
          onClick={aoFechar}
        ></button>
      </div>
      <div className="toast-body">{mensagem}</div>
    </div>
  );
}

export default AlertaPopup;
