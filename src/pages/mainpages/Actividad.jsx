import { useState } from "react";
import ConsultaClientes from "../../components/ConsultaClientes";
import Arquitectura from "../../components/Arquitectura";
import "./Actividad.css";

export default function Actividad() {
  const [activeTab, setActiveTab] = useState("consulta");

  const handleTabKeyDown = (e, currentTab) => {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const nextTab = currentTab === "consulta" ? "arquitectura" : "consulta";
      setActiveTab(nextTab);
      const nextTabEl = document.getElementById(`tab-${nextTab}`);
      if (nextTabEl) nextTabEl.focus();
    }
  };

  return (
    <div className="actividad-container">
      <header className="actividad-header">
        <h1 className="actividad-title">Actividad Kafka</h1>
        <p className="actividad-subtitle">
          Sistema de mensajería distribuida con Apache Kafka — Consulta de clientes y arquitectura
        </p>
      </header>

      {/* Barra de pestañas con roles ARIA */}
      <div
        className="actividad-tablist"
        role="tablist"
        aria-label="Pestañas de la actividad"
      >
        <button
          type="button"
          role="tab"
          id="tab-consulta"
          aria-selected={activeTab === "consulta"}
          aria-controls="panel-consulta"
          tabIndex={activeTab === "consulta" ? 0 : -1}
          className={`actividad-tab ${activeTab === "consulta" ? "active" : ""}`}
          onClick={() => setActiveTab("consulta")}
          onKeyDown={(e) => handleTabKeyDown(e, "consulta")}
        >
          <span className="tab-icon" aria-hidden="true">📋</span>
          <span>Consulta de Clientes</span>
        </button>

        <button
          type="button"
          role="tab"
          id="tab-arquitectura"
          aria-selected={activeTab === "arquitectura"}
          aria-controls="panel-arquitectura"
          tabIndex={activeTab === "arquitectura" ? 0 : -1}
          className={`actividad-tab ${activeTab === "arquitectura" ? "active" : ""}`}
          onClick={() => setActiveTab("arquitectura")}
          onKeyDown={(e) => handleTabKeyDown(e, "arquitectura")}
        >
          <span className="tab-icon" aria-hidden="true">🏗️</span>
          <span>Arquitectura</span>
        </button>
      </div>

      {/* Contenedores de paneles */}
      <div className="actividad-tabpanels">
        <div
          role="tabpanel"
          id="panel-consulta"
          aria-labelledby="tab-consulta"
          tabIndex={0}
          hidden={activeTab !== "consulta"}
          className="actividad-tabpanel"
        >
          <ConsultaClientes />
        </div>

        <div
          role="tabpanel"
          id="panel-arquitectura"
          aria-labelledby="tab-arquitectura"
          tabIndex={0}
          hidden={activeTab !== "arquitectura"}
          className="actividad-tabpanel"
        >
          <Arquitectura />
        </div>
      </div>
    </div>
  );
}
