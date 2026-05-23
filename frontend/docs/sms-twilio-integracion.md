# Recordatorios SMS con Twilio

## Estado real del proyecto

El backend actual es Java Servlet y no tiene base de datos persistente configurada. `ProductController` devuelve productos hardcodeados. El frontend React guarda usuario, carrito y pedidos en `localStorage`.

La mejora implementada conecta el checkout con un endpoint backend real:

- Frontend: `src/pages/Checkout.js`
- URL centralizada: `src/utils/api.js`
- Backend: `OnlineStoreApp/src/main/java/controller/SmsReminderController.java`
- Servicio Twilio: `OnlineStoreApp/src/main/java/service/TwilioSmsService.java`
- Registro temporal: `OnlineStoreApp/src/main/java/repository/SmsLogRepository.java`

## Flujo de funcionamiento

1. El usuario inicia sesion en `Login.js`.
2. El sistema guarda `userProfile` en `localStorage` con nombre, correo y telefono.
3. El usuario agrega productos al carrito.
4. En checkout se precargan nombre y telefono.
5. El frontend valida que el telefono tenga formato E.164, por ejemplo `+51987654321`.
6. Al confirmar compra, se guarda el pedido localmente y se llama al backend.
7. `SmsReminderController` valida datos obligatorios y formato del telefono.
8. `TwilioSmsService` envia el SMS usando la API HTTP de Twilio.
9. El backend registra estado `SENT`, `FAILED` o `CONFIGURATION_PENDING`.
10. El frontend muestra si el SMS fue aceptado o si fallo.

## Endpoint implementado

`POST /OnlineStoreApp/SmsReminderController`

Request:

```json
{
  "orderId": "1710000000000",
  "customerName": "Angel",
  "phone": "+51987654321",
  "total": 3580,
  "message": "Hola Angel, tu pedido #1710000000000 fue registrado por S/. 3580.00."
}
```

Respuestas:

- `202 Accepted`: SMS enviado o configuracion pendiente registrada.
- `400 Bad Request`: faltan campos o telefono invalido.
- `502 Bad Gateway`: Twilio rechazo el envio o hubo error externo.

## Variables de entorno Twilio

```bash
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+15005550006
```

Si faltan estas variables, el backend no rompe la compra: registra estado `CONFIGURATION_PENDING` para indicar que la integracion esta lista pero falta configurar credenciales.

## Cambios de base de datos recomendados

El proyecto no tiene JDBC ni tablas reales todavia. Para persistir el SMS se propone:

```sql
ALTER TABLE users
ADD phone VARCHAR(20) NOT NULL;

CREATE TABLE sms_notifications (
  id VARCHAR(36) PRIMARY KEY,
  order_id VARCHAR(36) NOT NULL,
  user_phone VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  status VARCHAR(30) NOT NULL,
  provider VARCHAR(30) NOT NULL DEFAULT 'TWILIO',
  provider_id VARCHAR(80),
  error_message TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  sent_at TIMESTAMP NULL
);
```

## Manejo de errores

- Telefono invalido: se rechaza antes de llamar a Twilio.
- Credenciales Twilio faltantes: se registra `CONFIGURATION_PENDING`.
- Twilio falla: se registra `FAILED` con el cuerpo de error.
- Compra local: se mantiene aunque el SMS falle, porque el SMS es una notificacion secundaria.

## Mejoras futuras

- Reemplazar `SmsLogRepository` en memoria por un DAO JDBC.
- Mover pedidos desde `localStorage` a una tabla `orders`.
- Enviar SMS de cambio de estado: preparado, enviado, entregado.
- Crear reintentos automaticos para SMS fallidos.
- Agregar opt-in de comunicaciones para cumplir buenas practicas de privacidad.
