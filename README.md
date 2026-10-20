# Front Producer Kafka

Front-end React (Vite) de la actividad **Módulo 8 — Kafka en acción, del front al back**.

## Vistas

| Ruta | Componente | Contenido |
| --- | --- | --- |
| `/` | `Home` | Bienvenida |
| `/menus` | `Producer` | Flujo original: envía un mensaje al productor y muestra el menú sugerido |
| `/actividad` | `Actividad` | **Nuevo.** Pestañas *Consulta de Clientes* y *Arquitectura* |
| `/clientes` | `Clientes` | Marcador de posición del proyecto original |

### Pestaña Consulta

`src/components/ConsultaClientes.jsx` llama a `GET /producer/clientes?filtro=…` y muestra:

- estados de carga, error y resultado vacío;
- tabla con id, nombre, ciudad, email y teléfono;
- **panel de evidencia de Kafka** con tópico de solicitud y respuesta, partición, offset,
  `requestId`, latencia y timestamp. Es la prueba de que la consulta pasó por el broker.

### Pestaña Arquitectura

`src/components/Arquitectura.jsx` ofrece el mismo diagrama en tres niveles con un selector:

- **Conceptual** — `public/diagrama-simplificado.svg`: cuatro componentes y el ciclo completo.
- **Animado** — `public/diagrama-animado.svg`: el mismo esquema con un paquete recorriendo el ciclo.
- **Detallado** — `public/diagrama-arquitectura.svg`: carriles, tópicos con particiones y los seis pasos.

Se puede abrir la vista activa a tamaño completo y hay un aviso claro si la imagen no está disponible.

## Configuración del API

La URL base se toma de `VITE_API_URL` y por defecto es `http://localhost:8000`:

```bash
VITE_API_URL=http://localhost:8001 npm run dev
```

## Ejecución

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

El back-end debe permitir el origen `http://localhost:5173` (lo hace `CorsConfig` en
`str-producer`).

## Diagrama

Los tres SVG de `public/` son copias de `entregables/` y se generan con:

```bash
./entregables/generar-diagramas.py entregables/   # conceptual + animado
```

- `diagrama-simplificado.svg` — vista conceptual, sin animación.
- `diagrama-animado.svg` — misma vista con el paquete en movimiento (`offset-path`); respeta
  `prefers-reduced-motion`.
- `diagrama-arquitectura.svg` — vista detallada; el archivo editable es `diagrama-arquitectura.drawio`
  (draw.io / diagrams.net).
