# Despliegue

Este documento describe opciones de despliegue. No se incluyen credenciales reales.

## Render

1. Crear una cuenta en Render.
2. Crear un Web Service para el backend usando la imagen Docker publicada.
3. Crear otro Web Service para el frontend usando la imagen Docker publicada.
4. Configurar variables de entorno como `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER` y `REACT_APP_API_BASE_URL`.
5. Guardar `RENDER_API_KEY` como GitHub Secret si se automatiza desde GitHub Actions.
6. Agregar los Service IDs como variables de GitHub Actions.

## Railway

1. Crear un proyecto en Railway.
2. Conectar el repositorio o usar imagenes Docker.
3. Configurar servicios separados para backend y frontend.
4. Configurar variables de entorno de Twilio y la URL publica del backend.
5. Guardar `RAILWAY_TOKEN` como GitHub Secret.
6. Ejecutar el despliegue desde Railway CLI o desde la API en el workflow de CD.

## Azure

1. Crear un Azure Container Registry o usar Docker Hub.
2. Crear Azure App Service for Containers para backend y frontend.
3. Configurar puertos, variables de entorno y dominios.
4. Configurar GitHub Actions con credenciales de Azure usando secretos.
5. Publicar nuevas imagenes y actualizar los servicios.

## AWS

1. Publicar imagenes en Amazon ECR o Docker Hub.
2. Crear servicios en ECS Fargate o Elastic Beanstalk con Docker.
3. Configurar variables de entorno y balanceador si se requiere.
4. Configurar secretos en GitHub Actions para autenticarse.
5. Automatizar build, push y actualizacion del servicio desde el workflow de CD.
