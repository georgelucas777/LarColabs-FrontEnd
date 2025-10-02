function SessionExpiredModal({ show, onConfirm }) {
  if (!show) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1050
      }}
    >
      <div className="bg-white rounded shadow p-4" style={{ maxWidth: "400px", width: "100%" }}>
        <h5 className="mb-3">Sessão expirada</h5>
        <p>Sua sessão expirou. Por favor, faça login novamente.</p>
        <button className="btn btn-dark w-100 mt-2" onClick={onConfirm}>
          Fazer Login
        </button>
      </div>
    </div>
  );
}

export default SessionExpiredModal;
