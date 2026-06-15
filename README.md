# Tienda Online - ShopPro

## Tecnologias

- React con Create React App en `frontend`
- Java Servlet empaquetado como WAR en `OnlineStoreApp`
- Maven para compilacion del backend
- Docker Compose para despliegue local

## Funcionalidades

- Login de usuario
- Carrito de compras
- Checkout con metodos de pago
- Historial de pedidos
- Recordatorio SMS con Twilio
- Animaciones UI

## Docker

La configuracion Docker levanta dos servicios:

- `frontend`: compila React en modo produccion y sirve el contenido estatico en `http://localhost:3000`.
- `backend`: compila el WAR con Maven y lo despliega en Tomcat 9 en `http://localhost:8080/OnlineStoreApp`.

### Variables de entorno

Para SMS con Twilio, define estas variables en el entorno antes de levantar Docker o copia `.env.example` como `.env` en la raiz del proyecto:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

Opcionalmente puedes cambiar la URL publica del backend usada por React:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/OnlineStoreApp
```

### Levantar el proyecto

Desde la raiz del proyecto:

```bash
docker compose up --build
```

Luego abre:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/OnlineStoreApp/ProductController`

### Detener el proyecto

```bash
docker compose down
```

## Notas de despliegue

Esta es una base preparada para desarrollo local y una futura salida productiva. Para produccion conviene agregar un reverse proxy como Nginx o Traefik, HTTPS, healthchecks, perfiles por ambiente, CI/CD, versionado de imagenes y gestion segura de secretos.

## Autor

Angel Javaco
