# Trello Kanban para Tiendita Don Pepe

Este proyecto tiene un frontend React y un backend Java Servlet. Trello se eligio porque es una herramienta colaborativa visual tipo Kanban: permite ver trabajo pendiente, trabajo en curso, bloqueos y tareas terminadas sin depender de reuniones largas.

## Por que Trello ayuda

- Ordena tareas reales del proyecto por listas y estados.
- Evita duplicar trabajo entre frontend y backend.
- Hace visible quien esta a cargo de cada tarjeta.
- Reduce errores de comunicacion porque cada tarjeta tiene prioridad, etiquetas, checklist y Pull Request relacionado.
- Permite separar bugs, testing, documentacion y deploy sin perderlos dentro del codigo.

## Listas reales del tablero

1. Pendiente
2. En progreso
3. Frontend
4. Backend
5. Base de datos
6. Testing
7. Bugs
8. Documentacion
9. Finalizado

## Etiquetas recomendadas

- Prioridad Alta
- Prioridad Media
- Prioridad Baja
- Frontend
- Backend
- Base de datos
- Bug
- Testing
- Seguridad
- Documentacion
- Deploy
- SMS
- Mejora futura

## Responsables sugeridos

- Frontend: desarrollador React encargado de `src/pages`, `src/components` y estilos.
- Backend: desarrollador Java encargado de servlets, servicios y endpoints.
- Base de datos: responsable de tablas `users`, `orders`, `sms_notifications`.
- QA/Testing: responsable de pruebas manuales y automatizadas.
- Lider tecnico: revisa Pull Requests, prioridades y bloqueos.

## Tarjetas reales basadas en el proyecto

| Lista | Tarjeta | Prioridad | Etiquetas | Responsable | Checklist |
| --- | --- | --- | --- | --- | --- |
| Pendiente | Crear registro de usuarios | Alta | Frontend, Backend, Seguridad | Frontend + Backend | Formulario, endpoint, validaciones, guardado de telefono |
| En progreso | Recordatorios automaticos por SMS al confirmar checkout | Alta | Backend, SMS, Seguridad | Backend | Validar telefono, llamar Twilio, guardar estado, exponer endpoint |
| Frontend | Conectar checkout con endpoint `/SmsReminderController` | Alta | Frontend, SMS | Frontend | Leer telefono registrado, validar E.164, mostrar estado de envio |
| Frontend | Arreglar pagina `Cart.js` | Alta | Frontend, Bug | Frontend | Importar `useNavigate`, eliminar codigo suelto, usar estilos del sistema |
| Frontend | Mejorar responsive design del carrito y admin | Media | Frontend, Testing | Frontend | Probar 375px, 768px, desktop |
| Backend | Exponer catalogo desde base de datos en vez de JSON fijo | Alta | Backend, Base de datos | Backend | Crear DAO, configurar JDBC, reemplazar JSON hardcodeado |
| Backend | Crear autenticacion real para login | Alta | Backend, Seguridad | Backend | Hash de contrasena, sesiones/token, errores claros |
| Base de datos | Crear tabla `sms_notifications` | Alta | Base de datos, SMS | BD | Campos status, provider_id, error_message, timestamps |
| Base de datos | Agregar telefono a usuarios | Alta | Base de datos, Seguridad | BD | Campo `phone`, formato E.164, indice por usuario |
| Testing | Pruebas de checkout con SMS exitoso y fallido | Alta | Testing, SMS | QA | Mock Twilio, validar modal, validar errores |
| Testing | Pruebas de login y sesion local | Media | Testing, Frontend | QA | Credenciales correctas, incorrectas, logout |
| Bugs | Corregir caracteres mal codificados en textos | Media | Bug, Frontend | Frontend | Revisar acentos, reemplazar mojibake, probar UI |
| Bugs | Evitar checkout sin usuario autenticado | Media | Bug, Seguridad | Frontend + Backend | Redirigir a login, validar backend |
| Documentacion | Documentar arquitectura frontend/backend | Media | Documentacion | Lider tecnico | Modulos, tecnologias, flujo, endpoints |
| Documentacion | Documentar configuracion Twilio | Alta | Documentacion, SMS | Backend | Variables de entorno, prueba local, errores |
| Finalizado | Catalogo inicial desde `ProductController` | Baja | Backend | Backend | Ya devuelve productos por JSON |
| Finalizado | Panel admin local para productos | Media | Frontend | Frontend | Alta, edicion, eliminacion en localStorage |
| Deploy | Preparar WAR backend y build React | Media | Deploy | Lider tecnico | `mvn package`, `npm run build`, variables Twilio |
| Pendiente | Integrar GitHub con Trello | Media | GitHub, Documentacion | Lider tecnico | Vincular PR, rama por tarjeta, cierre automatico |

## Como trabajarian frontend y backend

El frontend tomaria una tarjeta como "Conectar checkout con endpoint SMS" y esperaria un contrato claro del backend: URL, metodo, JSON requerido y posibles respuestas. El backend trabajaria la tarjeta "Crear endpoint SMS" y publicaria el contrato en la tarjeta. Cuando ambos terminan, QA mueve la tarjeta a Testing y valida el flujo completo.

## Integracion con GitHub y Pull Requests

- Cada tarjeta usa una rama: `feature/sms-reminders`, `bugfix/cart-page`, `docs/trello-kanban`.
- Cada Pull Request enlaza la tarjeta Trello.
- La descripcion del PR incluye: problema, solucion, pruebas y capturas si aplica.
- El PR se revisa antes de mover la tarjeta a Finalizado.
- Git mantiene el historial de cambios y permite volver a versiones anteriores si algo falla.

## Seguimiento de tareas

Una tarjeta pasa por Pendiente, En progreso, Frontend/Backend/Base de datos segun el area, Testing, Bugs si falla, Documentacion si requiere explicacion, y Finalizado solo cuando el PR esta aprobado y probado.
