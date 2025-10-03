import React from "react";

function DashboardCard({ title, total, icon, color, metrics = [] }) {
  return (
    <div className="col-md-3">
      <div className="card shadow-sm border-0">
        <div className="card-body dashboard-card text-center">
          <div className="d-flex justify-content-center align-items-center mb-2">
            <i className={`bi ${icon} fs-3 text-${color} me-2`}></i>
            <h6 className="card-title mb-0">{title}</h6>
          </div>

          <h2 className={`fw-bold text-${color} mb-1`}>
            {total} <span className="fs-6 text-muted">Total</span>
          </h2>

          {metrics.length > 0 && (
            <div className="d-flex justify-content-center gap-3 small flex-wrap">
              {metrics.map((m, idx) => (
                <span key={idx} className={`text-${m.color || "muted"}`}>
                  {m.label} {m.value}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardCard;
