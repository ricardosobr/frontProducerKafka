# Front Producer Kafka

Front-end React (Vite) de la actividad **Módulo 8 — Kafka en acción, del front al back**.

## Repositorios del Proyecto

- **Front-end**: [ricardosobr/frontProducerKafka](https://github.com/ricardosobr/frontProducerKafka)  
  *(Fork del upstream: [franciscogomez2722/frontProducerKafka](https://github.com/franciscogomez2722/frontProducerKafka))*
- **Back-end**: [ricardosobr/kafkaExample](https://github.com/ricardosobr/kafkaExample)  
  *(Fork del upstream: [franciscogomez2722/kafkaExample](https://github.com/franciscogomez2722/kafkaExample))*

---

## Vistas y Rutas

| Ruta | Componente | Rol en el Sistema |
| --- | --- | --- |
| `/` | `Home` | Bienvenida general de la aplicación |
| `/menus` | `Producer` | Flujo original de menús: envía mensajes vía `GET /producer/menu?message=...` |
| `/actividad` | `Actividad` | Orquestador principal con 2 pestañas: **Consulta de Clientes** y **Arquitectura** |
| `/clientes` | `Clientes` | Marcador de posición del proyecto base |

### Pestaña 1: Consulta de Clientes

Implementada en `src/components/ConsultaClientes.jsx`:
- Consume el endpoint REST `GET /producer/clientes?filtro=...` del productor.
- Gestiona estados de la interfaz: inicial, cargando (spinner), alerta de error y consulta sin coincidencias.
- Despliega la tabla reactiva de resultados (ID, Nombre, Email, Ciudad, Teléfono).
- **Panel de Evidencia Kafka**: Muestra en tiempo real los metadatos inmutables del broker que comprueban el tránsito por Kafka:
  - Tópico de solicitud (`cliente-consulta`) y tópico de respuesta (`cliente-consulta-respuesta`).
  - Partición y offset del mensaje de solicitud.
  - Identificador único de correlación (`requestId`).
  - Latencia medida por el publicador hasta recibir la respuesta (no incluye la red del navegador) y marca temporal de procesamiento.

### Pestaña 2: Arquitectura del Sistema

Implementada en `src/components/Arquitectura.jsx`:
- Presenta el **diagrama canónico unificado de arquitectura con operaciones**, consolidando en una única vista las capas Front-end, Productor Spring Boot, Clúster Apache Kafka (4 tópicos) y Consumidor Spring Boot.
- **Visor interactivo ampliado (Zoom / Lightbox)**: Accesible al hacer clic sobre el diagrama o mediante el botón *Ver ampliado* (permite cierre con tecla `Escape` y navegación por teclado).
- **Acciones y descargas**:
  - `Abrir SVG`: Enlace directo a la fuente vectorial (`public/Arquitectura-Kafka.svg`) en una nueva pestaña.
  - `Descargar PNG`: Descarga directa del diagrama rasterizado en alta resolución (`public/Arquitectura-Kafka.png`).
- Resumen técnico con el detalle de clases, controladores, servicios, oyentes y tópicos que intervienen en ambos flujos.

---

## Requisitos de Entorno y Configuración (JDK 17)

- **Node.js**: Versión 18 o superior.
- **Docker y Docker Compose**: Para el clúster local de Kafka (Zookeeper, Broker, Kafdrop).
- **JDK 17**: Versión usada para compilar y ejecutar esta práctica.
  Ruta estándar en Arch Linux: `/usr/lib/jvm/java-17-openjdk`.

```bash
# Configuración del entorno Java 17
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
export PATH=$JAVA_HOME/bin:$PATH
```

---

## Ejecución del Back-end con Override a Puerto 8001

Si el puerto 8000 se encuentra reservado u ocupado por otros servicios del sistema, se debe levantar `str-producer` en el puerto alternativo **8001**:

Ejecutar cada bloque en una terminal independiente, empezando en la carpeta `frontProducerKafka`.

### 1. Levantar Clúster de Mensajería (Docker)

```bash
cd ../kafkaExample
docker compose up -d
# Kafdrop disponible en http://localhost:19000
```

### 2. Ejecutar Productor en Puerto 8001

```bash
cd ../kafkaExample/str-producer
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
./mvnw spring-boot:run -Dspring-boot.run.arguments="--server.port=8001"

# O si se compila previamente el paquete ejecutable:
# ./mvnw clean package -DskipTests
# java -jar target/str-producer-0.0.1-SNAPSHOT.jar --server.port=8001
```

### 3. Ejecutar Consumidor en Puerto 8100

```bash
cd ../kafkaExample/str-consumer
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
./mvnw spring-boot:run
```

---

## Configuración y Ejecución del Front-end

Tanto `ConsultaClientes.jsx` como `Producer.jsx` adoptan uniformemente la variable de entorno `VITE_API_URL` con fallback por defecto a `http://localhost:8000`:

```javascript
const API = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
```

### Comandos de Ejecución

```bash
# Desde la carpeta frontProducerKafka

# Instalación de dependencias
npm install

# Ejecución vinculada al Productor en puerto 8001
VITE_API_URL=http://localhost:8001 npm run dev -- --host 127.0.0.1 --port 5173 --strictPort

# La aplicación queda disponible en: http://localhost:5173
```

> **Nota de CORS**: `CorsConfig.java` en `str-producer` tiene configurado el origen permitido `http://localhost:5173` para todos los métodos HTTP requeridos (`GET`, `POST`, `OPTIONS`).

---

## Activos Canónicos del Diagrama

Los recursos canónicos servidos estáticamente por la SPA se encuentran en `public/`:

- `public/Arquitectura-Kafka.svg` — Diagrama vectorial canónico unificado con operaciones y trazado de ambos flujos.
- `public/Arquitectura-Kafka.png` — Renderizado rasterizado de alta fidelidad para descargas y visualizadores externos.

*(Nota: los archivos SVG históricos `diagrama-simplificado.svg`, `diagrama-animado.svg` y `diagrama-arquitectura.svg` se conservan únicamente como referencia histórica en el repositorio, habiendo sido desvinculados de la interfaz activa).*

---

## Guía de Comprobación del Sistema

### 1. Verificación de Infraestructura Kafka
Inspeccionar en Kafdrop (`http://localhost:19000`) la creación y particionado de los 4 tópicos:
- `cliente-consulta`: 3 particiones, factor de réplica 1.
- `cliente-consulta-respuesta`: 3 particiones, factor de réplica 1.
- `str-topic`: 2 particiones, factor de réplica 1.
- `str-topic-response`: 2 particiones, factor de réplica 1.

### 2. Comprobación de Endpoints HTTP (Puerto 8001)

```bash
# Flujo de consulta con correlación (filtro por ciudad o término)
curl -s "http://localhost:8001/producer/clientes?filtro=Medellin"

# Flujo de menús original
curl -s "http://localhost:8001/producer/menu?message=veganmenu"
```

### 3. Comprobación en Navegador
1. Abrir `http://localhost:5173/actividad`.
2. En la pestaña **Consulta de Clientes**, ingresar `Medellin` y presionar *Consultar*.
   - Comprobar que aparecen dos clientes: Maria Lopez y Camila Torres.
   - Verificar la tarjeta de evidencia: tópico `cliente-consulta`, respuesta `cliente-consulta-respuesta`, número de partición, offset y latencia en milisegundos.
3. Cambiar a la pestaña **Arquitectura**.
   - Validar que el diagrama canónico `Arquitectura-Kafka.svg` se despliega correctamente con ambas zonas (Consulta de Clientes y Flujo de Menús).
   - Probar el botón *Ver ampliado* o hacer clic en la imagen para abrir el lightbox modal interactivo.
   - Probar los enlaces *Abrir SVG* y *Descargar PNG*.
4. Navegar a `/menus` para comprobar el flujo original del productor.
