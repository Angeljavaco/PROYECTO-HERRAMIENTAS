# Docker

## Que es Docker

Docker es una herramienta que permite empaquetar una aplicacion con sus dependencias para ejecutarla de forma consistente en diferentes entornos.

## Que es una Imagen

Una imagen es una plantilla inmutable con el sistema base, dependencias, configuracion y archivos necesarios para ejecutar una aplicacion.

## Que es un Contenedor

Un contenedor es una instancia en ejecucion de una imagen. En este proyecto existen contenedores para el backend Java y el frontend React.

## Que es Docker Compose

Docker Compose permite definir varios servicios en un archivo `docker-compose.yml` y levantarlos juntos con un solo comando.

## Como ejecutar el proyecto

Desde la raiz del repositorio:

```bash
docker compose up --build
```

Servicios disponibles:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080/OnlineStoreApp`
- Productos: `http://localhost:8080/OnlineStoreApp/ProductController`

## Como detener el proyecto

```bash
docker compose down
```

Para eliminar volumenes y recursos asociados:

```bash
docker compose down --volumes
```
