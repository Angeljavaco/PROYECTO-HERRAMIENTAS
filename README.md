# Tienda Online - ShopPro

# Descripcion

TiendaOnline es un proyecto universitario de comercio electronico. Incluye frontend en React, backend Java con Servlets, carrito de compras, checkout, historial de pedidos, login de usuario, panel administrativo y recordatorios SMS mediante Twilio.

# Tecnologias utilizadas

- Java 11 y Java Servlets
- Maven
- Apache Tomcat 9
- React con Create React App
- React Router
- Docker y Docker Compose
- GitHub Actions
- Twilio para envio de SMS

# Arquitectura del proyecto

```text
TiendaOnline/
|-- OnlineStoreApp/        # Backend Java empaquetado como WAR
|-- frontend/              # Aplicacion React
|-- docs/                  # Documentacion del curso
|-- .github/workflows/     # CI/CD con GitHub Actions
|-- docker-compose.yml     # Orquestacion local de backend y frontend
`-- README.md
```

El frontend consume el backend usando `REACT_APP_API_BASE_URL`. Por defecto apunta a `http://localhost:8080/OnlineStoreApp`.

# Requisitos

- Git
- Java 17 o superior para compilar en CI localmente compatible con codigo fuente Java 11
- Maven 3.9 o superior
- Node.js 20
- npm
- Docker Desktop con Docker Compose

# Instalacion

Clonar el repositorio:

```bash
git clone <url-del-repositorio>
cd TiendaOnline
```

Instalar dependencias del frontend:

```bash
cd frontend
npm ci
```

Compilar backend:

```bash
cd ../OnlineStoreApp
mvn clean package -DskipTests
```

# Ejecucion local

Backend:

```bash
cd OnlineStoreApp
mvn clean package -DskipTests
```

Desplegar el WAR generado en Tomcat 9 o usar Docker Compose.

Frontend:

```bash
cd frontend
npm start
```

URLs principales:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/OnlineStoreApp`
- Productos: `http://localhost:8080/OnlineStoreApp/ProductController`

# Ejecucion con Docker

Opcionalmente crear `.env` desde `.env.example` y configurar valores locales:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
REACT_APP_API_BASE_URL=http://localhost:8080/OnlineStoreApp
```

Levantar todo el proyecto:

```bash
docker compose up --build
```

Detener los contenedores:

```bash
docker compose down
```

# Flujo Git

El flujo recomendado usa:

- `main`: version estable.
- `develop`: integracion previa a produccion.
- `feature/*`: nuevas funcionalidades.
- `release/*`: preparacion de versiones.
- `hotfix/*`: correcciones urgentes.

Mas detalle en `docs/git-workflow.md`.

# Integracion Continua

El workflow `.github/workflows/ci.yml` se ejecuta en cada push y pull request. Compila:

- Backend con Maven.
- Frontend con npm y React.

Si alguna compilacion falla, GitHub Actions mostrara el error en el job correspondiente.

# Entrega Continua

El workflow `.github/workflows/cd.yml` esta preparado para:

- Construir imagenes Docker del backend y frontend.
- Publicar imagenes en Docker Hub.
- Dejar pasos preparados para despliegue en Render o Railway.

Los secretos deben configurarse en GitHub Actions:

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`
- `RENDER_API_KEY`
- `RAILWAY_TOKEN`

# Despliegue

La documentacion de despliegue esta en `docs/deployment.md` e incluye Render, Railway, Azure y AWS. No se incluyen credenciales reales.

# Capturas

Pendiente agregar capturas:

- `[Captura Home]`
- `[Captura Detalle de producto]`
- `[Captura Carrito]`
- `[Captura Checkout]`
- `[Captura Panel administrativo]`

## Autor

Angel Javaco
