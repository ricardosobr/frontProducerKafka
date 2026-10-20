import { useState } from "react";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export default function ConsultaClientes() {
  const [filtro, setFiltro] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [consultado, setConsultado] = useState(false);

  const consultarClientes = async (e) => {
    if (e) e.preventDefault();
    if (cargando) return;

    setCargando(true);
    setError(null);
    setConsultado(true);

    try {
      const queryParam = encodeURIComponent(filtro.trim());
      const res = await fetch(`${API}/producer/clientes?filtro=${queryParam}`);

      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { error: text || `HTTP ${res.status}` };
        }
      }

      if (!res.ok) {
        if (res.status === 504) {
          const detalle = data?.error === "TIMEOUT"
            ? "Tiempo de espera agotado (504 TIMEOUT): El consumidor de Kafka no respondió dentro del plazo configurado."
            : (data?.message || data?.error || "Timeout de respuesta (504)");
          throw new Error(detalle);
        }
        throw new Error(data?.message || data?.error || `Error del servidor (HTTP ${res.status})`);
      }

      setResultado(data);
    } catch (err) {
      setError(err.message || "Error al conectar con el servicio Kafka.");
      setResultado(null);
    } finally {
      setCargando(false);
    }
  };

  const clientes = resultado?.clientes ?? [];
  const kafkaInfo = resultado?.kafka;

  return (
    <div className="consulta-container">
      {/* Formulario de búsqueda */}
      <form onSubmit={consultarClientes} className="consulta-search-box">
        <label htmlFor="filtro-input" className="visually-hidden">
          Filtro de búsqueda de clientes
        </label>
        <div className="search-input-group">
          <input
            id="filtro-input"
            type="text"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            placeholder="Buscar por nombre, email o ciudad (deja vacío para todos)..."
            disabled={cargando}
            className="search-input"
          />
          {filtro && (
            <button
              type="button"
              onClick={() => setFiltro("")}
              className="search-clear-btn"
              title="Limpiar búsqueda"
              disabled={cargando}
            >
              ✕
            </button>
          )}
          <button
            type="submit"
            disabled={cargando}
            className="consulta-submit-btn"
          >
            {cargando ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Consultando vía Kafka...</span>
              </>
            ) : (
              <>
                <span aria-hidden="true">🔎</span>
                <span>Consultar</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Estado de carga */}
      {cargando && (
        <div className="consulta-loading" role="status" aria-live="polite">
          <div className="loading-card">
            <span className="spinner-large" aria-hidden="true" />
            <p className="loading-text">
              Enviando mensaje al tópico de Kafka y esperando respuesta del consumidor...
            </p>
          </div>
        </div>
      )}

      {/* Estado de error */}
      {error && !cargando && (
        <div className="consulta-alert consulta-alert-error" role="alert">
          <div className="alert-icon" aria-hidden="true">⚠️</div>
          <div className="alert-content">
            <strong className="alert-title">Error en la consulta</strong>
            <p className="alert-message">{error}</p>
          </div>
        </div>
      )}

      {/* Estado inicial (sin consultas aún) */}
      {!consultado && !cargando && !error && (
        <div className="consulta-empty-prompt">
          <div className="prompt-icon" aria-hidden="true">📬</div>
          <h3>Listo para consultar</h3>
          <p>
            Ingresa un término de búsqueda o presiona <strong>Consultar</strong> para obtener los clientes procesados mediante eventos de Apache Kafka.
          </p>
        </div>
      )}

      {/* Resultados de la consulta */}
      {consultado && !cargando && !error && resultado && (
        <div className="consulta-results-wrapper">
          <div className="results-header">
            <h2 className="results-title">Resultados de la Consulta</h2>
            <span className="results-badge">
              {clientes.length === 1
                ? "1 cliente encontrado"
                : `${clientes.length} clientes encontrados`}
              {resultado.total !== undefined && resultado.total !== clientes.length && ` (total: ${resultado.total})`}
            </span>
          </div>

          {clientes.length === 0 ? (
            <div className="consulta-empty-results">
              <div className="empty-icon" aria-hidden="true">📭</div>
              <p>No se encontraron clientes que coincidan con el filtro <em>"{filtro}"</em>.</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="clientes-table">
                <thead>
                  <tr>
                    <th scope="col" style={{ width: "80px" }}>ID</th>
                    <th scope="col">Nombre</th>
                    <th scope="col">Ciudad</th>
                    <th scope="col">Email</th>
                    <th scope="col">Teléfono</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((c) => (
                    <tr key={c.id ?? `${c.email}-${c.nombre}`}>
                      <td className="cell-id"><code>{c.id}</code></td>
                      <td className="cell-nombre">{c.nombre}</td>
                      <td className="cell-ciudad">{c.ciudad || "—"}</td>
                      <td className="cell-email">
                        <a href={`mailto:${c.email}`}>{c.email}</a>
                      </td>
                      <td className="cell-telefono">{c.telefono ?? c.teléfono ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pie de evidencia Kafka */}
          <section className="kafka-evidence-card" aria-label="Evidencia de procesamiento Kafka">
            <div className="evidence-header">
              <span className="evidence-badge-tag">Kafka Evidence</span>
              <h3 className="evidence-title">Evidencia de Procesamiento Distribuido</h3>
            </div>
            <div className="evidence-grid">
              <div className="evidence-item">
                <span className="evidence-label">Tópico Solicitud</span>
                <span className="evidence-value code-value">
                  {kafkaInfo?.topicSolicitud ?? "cliente-consulta"}
                </span>
              </div>
              <div className="evidence-item">
                <span className="evidence-label">Tópico Respuesta</span>
                <span className="evidence-value code-value">
                  {kafkaInfo?.topicRespuesta ?? "cliente-consulta-respuesta"}
                </span>
              </div>
              <div className="evidence-item">
                <span className="evidence-label">Partición</span>
                <span className="evidence-value code-value">
                  {kafkaInfo?.partition !== undefined ? kafkaInfo.partition : "—"}
                </span>
              </div>
              <div className="evidence-item">
                <span className="evidence-label">Offset</span>
                <span className="evidence-value code-value">
                  {kafkaInfo?.offset !== undefined ? kafkaInfo.offset : "—"}
                </span>
              </div>
              <div className="evidence-item">
                <span className="evidence-label">Request ID</span>
                <span className="evidence-value code-value" title={resultado.requestId}>
                  {resultado.requestId ?? "—"}
                </span>
              </div>
              <div className="evidence-item">
                <span className="evidence-label">Latencia</span>
                <span className="evidence-value latency-badge">
                  {resultado.latenciaMs !== undefined ? `${resultado.latenciaMs} ms` : "—"}
                </span>
              </div>
              {resultado.procesadoEn && (
                <div className="evidence-item evidence-item-full">
                  <span className="evidence-label">Procesado en</span>
                  <span className="evidence-value code-value">
                    {resultado.procesadoEn}
                  </span>
                </div>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
