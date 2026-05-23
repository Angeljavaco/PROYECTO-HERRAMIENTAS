# Configuracion Twilio para Tomcat, NetBeans y Windows

## Por que salia CONFIGURATION_PENDING

`System.getenv()` lee las variables del proceso Java que ejecuta Tomcat. Si defines variables en PowerShell despues de abrir NetBeans o despues de arrancar Tomcat, ese proceso no las hereda. Por eso el servlet podia funcionar, pero Twilio aparecia como no configurado.

## Solucion implementada

El backend ahora carga credenciales en este orden:

1. Variables de entorno del proceso Tomcat: `System.getenv()`.
2. Propiedades Java: `-DTWILIO_ACCOUNT_SID=...`.
3. Archivo indicado por `-DTIENDAONLINE_CONFIG=C:\ruta\config.properties`.
4. `.env` o `config.properties` en el directorio de ejecucion.
5. `tiendaonline.env`, `tiendaonline.properties` o `config.properties` dentro de `%CATALINA_BASE%\conf`.
6. `src/main/resources/config.properties`, que se empaqueta como `WEB-INF/classes/config.properties`.

## Opcion recomendada para NetBeans

Edita o crea:

`OnlineStoreApp/src/main/resources/config.properties`

Coloca:

```properties
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

Luego:

1. Deten Tomcat desde NetBeans.
2. Limpia y construye el proyecto backend.
3. Ejecuta/deploya de nuevo `OnlineStoreApp`.
4. Haz una compra desde React.
5. Revisa la consola de Tomcat. Debe aparecer:

```text
[TwilioConfig] Twilio inicializado: true
[TwilioSmsService] Twilio inicializado correctamente. Enviando SMS a ...
[TwilioSmsService] HTTP Twilio status: 201
```

## Opcion con PowerShell

Usa variables persistentes de usuario y reinicia NetBeans:

```powershell
[Environment]::SetEnvironmentVariable("TWILIO_ACCOUNT_SID", "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "User")
[Environment]::SetEnvironmentVariable("TWILIO_AUTH_TOKEN", "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx", "User")
[Environment]::SetEnvironmentVariable("TWILIO_PHONE_NUMBER", "+1XXXXXXXXXX", "User")
```

Despues cierra NetBeans, abre NetBeans otra vez y reinicia Tomcat.

## Opcion con Tomcat conf

Crea este archivo:

`%CATALINA_BASE%\conf\tiendaonline.properties`

Contenido:

```properties
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_PHONE_NUMBER=+1XXXXXXXXXX
```

Reinicia Tomcat.

## Errores que ahora se muestran

- `CONFIGURATION_ERROR`: faltan credenciales.
- `UNAUTHORIZED`: Twilio devolvio 401, credenciales invalidas.
- `INVALID_CREDENTIALS`: SID o token incorrectos.
- `UNVERIFIED_NUMBER`: numero destino no verificado en cuenta Trial.
- `INVALID_TO_NUMBER`: numero destino invalido.
- `INVALID_FROM_NUMBER`: numero emisor Twilio invalido.
- `TIMEOUT`: Twilio no respondio a tiempo.
- `CONNECTION_ERROR`: fallo HTTPS/red.
