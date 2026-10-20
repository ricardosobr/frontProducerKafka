import { useState } from "react";

export default function Arquitectura() {
  const [imgError, setImgError] = useState(false);
  const [retryKey, setRetryKey] = useState(Date.now());

  const handleRetry = () => {
    setImgError(false);
    setRetryKey(Date.now());
  };

  const imageSrc = `/diagrama-arquitectura.svg?t=${retryKey}`;

  return (
    <div className="arquitectura-container">
      <div className="arquitectura-header-bar">
        <div>
          <h2 className="arquitectura-subtitle">Diagrama de Arquitectura del Sistema</h2>
          <p className="arquitectura-desc">
            Visualización del flujo distribuido: Front-end (React), Productor Kafka (Spring Boot), clúster de mensajería (Apache Kafka) y Consumidor (Spring Boot con repositorio de clientes en memoria).
          </p>
        </div>
        <div className="arquitectura-actions">
          <a
            href="/diagrama-arquitectura.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="actividad-btn-secondary"
            title="Abrir diagrama SVG en tamaño completo en una nueva pestaña"
          >
            ↗ Abrir a tamaño completo
          </a>
        </div>
      </div>

      <div className="arquitectura-viewer">
        {imgError ? (
          <div className="arquitectura-placeholder" role="alert">
            <div className="placeholder-icon" aria-hidden="true">🖼️</div>
            <h3 className="placeholder-title">Diagrama de arquitectura no disponible aún</h3>
            <p className="placeholder-text">
              No se pudo cargar el archivo <code>/diagrama-arquitectura.svg</code> desde la carpeta <code>public/</code>.
              Es posible que el archivo esté en proceso de generación o aún no haya sido colocado.
            </p>
            <div className="placeholder-meta">
              <span>Ruta esperada: <code>public/diagrama-arquitectura.svg</code></span>
            </div>
            <div className="placeholder-actions">
              <button
                type="button"
                onClick={handleRetry}
                className="actividad-btn-primary"
              >
                🔄 Reintentar carga
              </button>
            </div>
          </div>
        ) : (
          <div className="arquitectura-image-card">
            <img
              key={retryKey}
              src={imageSrc}
              alt="Diagrama de arquitectura del sistema de mensajería distribuida con Apache Kafka: componentes React, producer, topics, consumer y nuevo listener de consulta"
              className="arquitectura-image"
              onError={() => setImgError(true)}
            />
          </div>
        )}
      </div>

      <div className="arquitectura-notes-card">
        <h3 className="notes-title">Componentes Principales del Flujo</h3>
        <div className="components-summary-grid">
          <div className="summary-card">
            <strong>1. Front-end (React)</strong>
            <p>Envía la solicitud de consulta vía HTTP GET al microservicio Productor.</p>
          </div>
          <div className="summary-card">
            <strong>2. Kafka Producer (Spring Boot)</strong>
            <p>Publica un evento en el tópico <code>cliente-consulta</code> con un identificador único (requestId).</p>
          </div>
          <div className="summary-card">
            <strong>3. Apache Kafka</strong>
            <p>Bus de eventos distribuido que distribuye los mensajes entre particiones de manera desacoplada.</p>
          </div>
          <div className="summary-card">
            <strong>4. Kafka Consumer (Spring Boot)</strong>
            <p>Escucha las consultas, busca en el repositorio de clientes y publica la respuesta en <code>cliente-consulta-respuesta</code>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
