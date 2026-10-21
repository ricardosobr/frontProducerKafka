import { useState, useEffect, useRef } from "react";

export default function Arquitectura() {
  const [imgError, setImgError] = useState(false);
  const [retryKey, setRetryKey] = useState(Date.now());
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const dialogRef = useRef(null);

  const handleRetry = () => {
    setImgError(false);
    setRetryKey(Date.now());
  };

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isZoomOpen) {
      if (!dialog.open) {
        dialog.showModal();
      }
    } else {
      if (dialog.open) {
        dialog.close();
      }
    }

    return () => {
      if (dialog && dialog.open) {
        dialog.close();
      }
    };
  }, [isZoomOpen]);

  const svgSrc = `/Arquitectura-Kafka.svg?t=${retryKey}`;
  const pngSrc = "/Arquitectura-Kafka.png";

  return (
    <div className="arquitectura-container">
      <div className="arquitectura-header-bar">
        <div>
          <h2 className="arquitectura-subtitle">Diagrama de Arquitectura con Operaciones</h2>
          <p className="arquitectura-desc">
            Vista canónica completa de la arquitectura del sistema: flujo asíncrono de consulta
            de clientes con correlación por <code>requestId</code>, flujo de menús original,
            clases y métodos de Spring Boot, y particionado en Apache Kafka.
          </p>
        </div>
        <div className="arquitectura-actions">
          <button
            type="button"
            className="actividad-btn-secondary"
            onClick={() => setIsZoomOpen(true)}
            title="Abrir visor interactivo ampliado"
          >
            Ver ampliado
          </button>
          <a
            href="/Arquitectura-Kafka.svg"
            target="_blank"
            rel="noopener noreferrer"
            className="actividad-btn-secondary"
            title="Abrir imagen vectorial SVG en una nueva pestaña"
          >
            Abrir SVG
          </a>
          <a
            href={pngSrc}
            download="Arquitectura-Kafka.png"
            className="actividad-btn-primary"
            title="Descargar diagrama en formato PNG de alta resolución"
          >
            Descargar PNG
          </a>
        </div>
      </div>

      <div className="arquitectura-viewer">
        {imgError ? (
          <div className="arquitectura-placeholder" role="alert">
            <h3 className="placeholder-title">Diagrama no disponible aún</h3>
            <p className="placeholder-text">
              No se pudo cargar el archivo <code>public/Arquitectura-Kafka.svg</code>. Es
              posible que el archivo esté en proceso de generación o sincronización.
            </p>
            <div className="placeholder-meta">
              <span>Ruta esperada: <code>public/Arquitectura-Kafka.svg</code></span>
            </div>
            <div className="placeholder-actions">
              <button
                type="button"
                onClick={handleRetry}
                className="actividad-btn-primary"
              >
                Reintentar carga
              </button>
            </div>
          </div>
        ) : (
          <div
            className="arquitectura-image-card arquitectura-image-card-clickable"
            onClick={() => setIsZoomOpen(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setIsZoomOpen(true);
              }
            }}
            title="Haz clic para ver el diagrama a tamaño completo"
            aria-label="Diagrama de arquitectura con operaciones. Haz clic o presiona Enter para ampliar."
          >
            <img
              key={retryKey}
              src={svgSrc}
              alt="Diagrama de arquitectura del sistema con operaciones completas: Front-end React, Spring Boot Producer, Apache Kafka con 4 tópicos y Spring Boot Consumer"
              className="arquitectura-image"
              onError={() => setImgError(true)}
            />
            <div className="arquitectura-image-overlay-hint" aria-hidden="true">
              <span>Clic para ampliar diagrama</span>
            </div>
          </div>
        )}
      </div>

      {/* Modal / Lightbox de Zoom Ampliado */}
      <dialog
        ref={dialogRef}
        className="arquitectura-modal-dialog"
        onCancel={() => setIsZoomOpen(false)}
        onClose={() => setIsZoomOpen(false)}
        onClick={(e) => {
          if (e.target === dialogRef.current) {
            setIsZoomOpen(false);
          }
        }}
        aria-label="Diagrama de Arquitectura ampliado"
      >
        <div
          className="arquitectura-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="arquitectura-modal-header">
            <div>
              <h3 className="arquitectura-modal-title">Arquitectura del Sistema — Vista Ampliada</h3>
              <span className="arquitectura-modal-badge">Canónico: Arquitectura-Kafka.svg</span>
            </div>
            <div className="arquitectura-modal-actions">
              <a
                href="/Arquitectura-Kafka.svg"
                target="_blank"
                rel="noopener noreferrer"
                className="actividad-btn-secondary actividad-btn-sm"
              >
                Abrir en pestaña
              </a>
              <a
                href={pngSrc}
                download="Arquitectura-Kafka.png"
                className="actividad-btn-primary actividad-btn-sm"
              >
                Descargar PNG
              </a>
              <button
                type="button"
                className="arquitectura-modal-close"
                onClick={() => setIsZoomOpen(false)}
                aria-label="Cerrar vista ampliada"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="arquitectura-modal-body">
            <img
              src={svgSrc}
              alt="Vista ampliada del diagrama de arquitectura"
              className="arquitectura-modal-image"
            />
          </div>
        </div>
      </dialog>

      {/* Resumen de componentes según la rúbrica */}
      <div className="arquitectura-notes-card">
        <h3 className="notes-title">Componentes y Operaciones del Sistema Distribuido</h3>
        <div className="components-summary-grid">
          <div className="summary-card">
            <strong>1. Front-end SPA (React + Vite)</strong>
            <p>
              <code>Actividad.jsx</code> orquesta las pestañas de consulta y arquitectura.{" "}
              <code>ConsultaClientes.jsx</code> invoca <code>GET /producer/clientes?filtro=</code> y
              muestra los metadatos de Kafka. <code>Producer.jsx</code> gestiona el flujo original
              de menús (<code>GET /producer/menu?message=</code>). Ambos consumen <code>VITE_API_URL</code>.
            </p>
          </div>
          <div className="summary-card">
            <strong>2. Backend Productor (Spring Boot :8000 / :8001)</strong>
            <p>
              <code>ProducerController</code> atiende las peticiones HTTP y <code>CorsConfig</code> configura CORS.{" "}
              <code>ClienteQueryPublisher</code> genera el <code>requestId</code>, registra un{" "}
              <code>CompletableFuture</code> y publica en <code>cliente-consulta</code>.{" "}
              <code>ClienteQueryResponseListener</code> escucha la respuesta y resuelve el future.{" "}
              <code>StringProducerService</code> atiende el flujo de menús.
            </p>
          </div>
          <div className="summary-card">
            <strong>3. Apache Kafka Broker (:9092)</strong>
            <p>
              Bus de eventos distribuido con 4 tópicos: <code>cliente-consulta</code> (3 particiones, factor 1),{" "}
              <code>cliente-consulta-respuesta</code> (3 particiones, factor 1), <code>str-topic</code> (2 part.) y{" "}
              <code>str-topic-response</code> (2 part.). <code>KafkaAdminConfig</code> declara explícitamente los tópicos.
            </p>
          </div>
          <div className="summary-card">
            <strong>4. Backend Consumidor (Spring Boot :8100)</strong>
            <p>
              <code>ClienteQueryListener</code> consume desde <code>cliente-consulta</code> con el grupo{" "}
              <code>cliente-query-group</code>, invoca <code>ClienteQueryService</code> y{" "}
              <code>ClienteRepository</code> para filtrar clientes en memoria, y publica el resultado en{" "}
              <code>cliente-consulta-respuesta</code>. <code>StrConsumerListener</code> atiende pedidos de menús.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
