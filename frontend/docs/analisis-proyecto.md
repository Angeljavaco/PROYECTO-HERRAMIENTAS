# Analisis del proyecto Tiendita Don Pepe

## Arquitectura detectada

El proyecto esta dividido en dos partes:

- `frontend`: aplicacion React creada con Create React App.
- `OnlineStoreApp`: backend Java Servlet empaquetado como WAR.

El frontend consume `ProductController` con `fetch` y usa `localStorage` para datos que normalmente deberian vivir en base de datos: usuario, carrito, pedidos y productos creados desde admin.

## Tecnologias utilizadas

- React 19
- React Router DOM 7
- CSS global en `src/index.css`
- Java Servlet API 4
- Maven
- WAR para despliegue en servidor Java
- Twilio por API HTTP para SMS
- LocalStorage como almacenamiento temporal de frontend

## Modulos detectados

- Catalogo: `Home.js`, `ProductController.java`
- Detalle de producto: `ProductDetail.js`
- Login cliente: `Login.js`
- Login admin: `AdminLogin.js`
- Panel admin: `AdminDashboard.js`
- Carrito: `Cart.js` y seccion de carrito en `Home.js`
- Checkout: `Checkout.js`
- Pedidos: `Orders.js`
- Detalle de pedido: `OrderDetail.js`
- Navegacion: `Navbar.js`
- Utilidades de producto: `utils/products.js`
- Integracion API: `utils/api.js`
- SMS: `SmsReminderController`, `TwilioSmsService`, `SmsLogRepository`, `SmsReminder`

## Funcionalidades existentes

- Listado de productos desde backend.
- Busqueda y filtro por categoria/precio.
- Descuentos visuales en algunos productos.
- Agregar productos al carrito.
- Checkout con Yape, PayPal simulado y tarjeta.
- Historial de pedidos por usuario local.
- Detalle de pedido.
- Login de cliente con usuarios fijos.
- Login administrativo con correo corporativo.
- Panel admin para agregar, editar y eliminar productos localmente.
- Responsive design con media queries.

## Funcionalidades faltantes

- Registro real de usuarios.
- Autenticacion segura en backend.
- Base de datos persistente.
- APIs para crear pedidos.
- Validacion backend de checkout.
- Pago real.
- Gestion real de stock.
- Roles y permisos.
- Tests completos.
- Deploy documentado con variables de entorno.
- Seguridad de CORS restringida por dominio.

## Funcionalidad nueva implementada

Se agregaron recordatorios SMS automaticos al confirmar checkout. El numero sale del perfil guardado al iniciar sesion y tambien puede editarse en checkout. El frontend valida formato internacional, llama al backend y muestra el estado.

## Decisiones tecnicas

- Se centralizo la URL del backend en `src/utils/api.js` para evitar repetir rutas.
- Se guardo `userProfile` porque antes solo existia el nombre del usuario y no habia telefono.
- Se mantuvo el pedido en `localStorage` porque el proyecto aun no tiene API de pedidos ni base de datos.
- Se uso Twilio via HTTP para no depender de librerias externas en el WAR.
- Se agrego repositorio en memoria para registrar estados SMS sin inventar una base de datos que aun no existe.
- Se documento SQL para que la migracion a base de datos sea directa.
- Se corrigio `Cart.js` porque tenia codigo fuera del componente y navegacion rota.

## Flujo del sistema

1. React carga productos desde Java Servlet.
2. El usuario filtra productos y agrega al carrito.
3. El carrito se guarda en `localStorage`.
4. El usuario inicia sesion y se guarda `userProfile`.
5. Checkout toma carrito y perfil.
6. Al confirmar, se crea el pedido local.
7. React llama a `SmsReminderController`.
8. Java valida y envia a Twilio.
9. Java guarda el estado del SMS.
10. React muestra resultado al usuario.

## Explicacion universitaria

La tienda online tiene una arquitectura cliente-servidor. El cliente es React, que muestra las pantallas y permite comprar. El servidor es Java Servlet, que entrega productos y ahora recibe solicitudes para enviar SMS. La mejora de SMS permite que, cuando un usuario confirma una compra, el sistema use el telefono registrado para avisarle automaticamente por mensaje de texto.

Trello se usa como tablero Kanban para organizar el trabajo. Cada funcionalidad se convierte en una tarjeta con responsable, prioridad y estado. Asi frontend y backend pueden coordinarse: frontend sabe que endpoint necesita, backend sabe que datos debe recibir, QA sabe que probar y el lider puede revisar avances con Pull Requests en GitHub.

## Mejoras futuras recomendadas

- Implementar base de datos con JDBC.
- Crear endpoints REST para usuarios, productos, carrito, pedidos y admin.
- Reemplazar credenciales locales por autenticacion segura.
- Agregar pruebas unitarias y de integracion.
- Persistir estados SMS y reintentar fallos.
- Crear pipeline de deploy para frontend y WAR backend.
- Normalizar textos con acentos UTF-8.
