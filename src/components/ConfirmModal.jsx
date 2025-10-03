import React from "react";
import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ show, title, message, onConfirm, onCancel, tipo = "warning" }) {
  const getIcon = () => {
    switch (tipo) {
      case "danger":
        return <i className="bi bi-x-circle-fill text-danger fs-3 me-2"></i>;
      case "success":
        return <i className="bi bi-check-circle-fill text-success fs-3 me-2"></i>;
      case "warning":
      default:
        return <i className="bi bi-exclamation-triangle-fill text-warning fs-3 me-2"></i>;
    }
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirmação"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex align-items-center">
          {getIcon()}
          <span className="ms-1">{message}</span>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Confirmar
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmModal;
