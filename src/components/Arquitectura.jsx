import { useState } from "react";

const VISTAS = {
  conceptual: {
    archivo: "diagrama-simplificado.svg",
    etiqueta: "Conceptual",
    alt: "Diagrama conceptual: React envía la consulta a str-producer, que publica en Kafka; str-consumer la escucha y responde por el tópico de respuesta.",
    descripcion:
      "Cuatro piezas y un ciclo: la consulta entra por HTTP, viaja por Kafka, se responde en otro tópico y vuelve correlacionada al navegador.",
  },
  animado: {
    archivo: "diagrama-animado.svg",
    etiqueta: "Animado",
    alt: "La misma arquitectura conceptual con un paquete recorriendo el ciclo completo entre los cuatro componentes.",
    descripcion:
      "El paquete recorre el ciclo completo: ida por cliente-consulta, retorno por cliente-consulta-respuesta.",
  },
  detallado: {
    archivo: "diagrama-arquitectura.svg",
    etiqueta: "Detallado",
    alt: "Diagrama detallado de arquitectura con carriles por componente, tópicos, particiones, réplicas y los seis pasos del flujo de consulta.",
    descripcion:
      "Vista completa: carriles por componente, tópicos con particiones y réplicas, y los seis pasos del flujo de consulta.",
  },
};

const ORDEN = ["conceptual", "animado", "detallado"];

export default function Arquitectura() {
  const [vista, setVista] = useState("conceptual");
  const [imgError, setImgError] = useState(false);
  const [retryKey, setRetryKey] = useState(Date.now());

  const actual = VISTAS[vista];

  const cambiarVista = (nueva) => {
    if (nueva === vista) return;
    setVista(nueva);
    setImgError(false);
  };

  const handleRetry = () => {
    setImgError(false);
    setRetryKey(Date.now());
  };

  const imageSrc = `/${actual.archivo}?t=${retryKey}-${vista}`;

  return (
    <div className="arquitectura-container">
      <div className="arquitectura-header-bar">
        <div>
          <h2 className="arquitectura-subtitle">Diagrama de Arquitectura del Sistema</h2>
          <p className="arquitectura-desc">
            Visualización del flujo distribuido: Front-end (React), Productor Kafka (Spring
            Boot), clúster de mensajería (Apache Kafka) y Consumidor (Spring Boot con
            repositorio de clientes en memoria).
          </p>
        </div>
        <div className="arquitectura-actions">
          <a
            href={`/${actual.archivo}`}
            target="_blank"
            rel="noopener noreferrer"
            className="actividad-btn-secondary"
            title="Abrir el diagrama actual en tamaño completo en una nueva pestaña"
          >
            ↗ Abrir a tamaño completo
          </a>
        </div>
      </div>

      <div className="diagram-tabs" role="tablist" aria-label="Nivel de detalle del diagrama">
        {ORDEN.map((clave) => (
          <button
            key={clave}
            type="button"
            role="tab"
            aria-selected={vista === clave}
            className={`diagram-tab${vista === clave ? " active" : ""}`}
            onClick={() => cambiarVista(clave)}
          >
            {VISTAS[clave].etiqueta}
          </button>
        ))}
      </div>

      <p className="diagram-hint">{actual.descripcion}</p>

      <div className="arquitectura-viewer">
        {imgError ? (
          <div className="arquitectura-placeholder" role="alert">
            <div className="placeholder-icon" aria-hidden="true">🖼️</div>
            <h3 className="placeholder-title">Diagrama no disponible aún</h3>
            <p className="placeholder-text">
              No se pudo cargar el archivo <code>/{actual.archivo}</code> desde la carpeta{" "}
              <code>public/</code>. Es posible que el archivo esté en proceso de generación
              o aún no haya sido colocado.
            </p>
            <div className="placeholder-meta">
              <span>Ruta esperada: <code>public/{actual.archivo}</code></span>
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
              key={`${retryKey}-${vista}`}
              src={imageSrc}
              alt={actual.alt}
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
