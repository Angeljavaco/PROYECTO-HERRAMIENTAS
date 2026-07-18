# Flujo Git

## Ramas principales

- `main`: version estable y lista para produccion.
- `develop`: integracion de cambios antes de liberar.
- `feature/*`: nuevas funcionalidades.
- `release/*`: preparacion de una version.
- `hotfix/*`: correcciones urgentes sobre produccion.

## Crear una funcionalidad

```bash
git checkout develop
git pull origin develop
git checkout -b feature/documentacion-docker
git add .
git commit -m "docs: agregar documentacion de Docker"
git push origin feature/documentacion-docker
```

Luego se crea un Pull Request hacia `develop`.

## Preparar una version

```bash
git checkout develop
git pull origin develop
git checkout -b release/v1.0.0
git push origin release/v1.0.0
```

Cuando la version esta validada:

```bash
git checkout main
git merge release/v1.0.0
git tag v1.0.0
git push origin main --tags
```

## Correccion urgente

```bash
git checkout main
git pull origin main
git checkout -b hotfix/corregir-url-api
git add .
git commit -m "fix: corregir url base del backend"
git push origin hotfix/corregir-url-api
```

Despues del Pull Request, el cambio debe integrarse tambien en `develop`.
