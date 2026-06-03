# Infrastructure - Docker & PostgreSQL Setup

Configuración Docker para levantar PostgreSQL 17 en desarrollo y Strapi en producción.

## Estructura

```
infra/
├── docker-compose.yml           # PostgreSQL dev (para desarrollo local)
├── docker-compose.prod.yml      # Strapi prod (con BD externa)
└── README.md                    # Este archivo
```

## Configuración de Variables de Entorno

**Todas las variables de entorno se configuran en: `cms/.env`**

Ver `cms/.env.example` para ejemplos de:
- **Desarrollo**: SQLite (sin dependencias externas)
- **Producción**: PostgreSQL (base de datos externa)

---

## Desarrollo Local

### 1. Instalar dependencias

```bash
cd cms
pnpm install
```

### 2. Crear base de datos SQLite

La BD SQLite se crea automáticamente al ejecutar Strapi:

```bash
cd cms
pnpm dev
```

Acceder: http://localhost:1337/admin

### 3. (Opcional) Usar PostgreSQL en desarrollo

Si prefieres usar PostgreSQL en desarrollo:

```bash
# Desde carpeta infra/
docker-compose up -d

# Configurar cms/.env
DATABASE_CLIENT=postgres
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi123

# Luego en cms/
pnpm dev
```

Acceder: http://localhost:1337/admin

---

## Producción

### 1. Configurar variables en `cms/.env`

```bash
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host.com
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=your-strong-password
DATABASE_SSL=true

# Security Keys (Generar nuevas claves!)
# node -e "console.log(require('crypto').randomBytes(16).toString('base64'))"
APP_KEYS=newkey1,newkey2,newkey3,newkey4
API_TOKEN_SALT=newkey
ADMIN_JWT_SECRET=newkey
TRANSFER_TOKEN_SALT=newkey
ENCRYPTION_KEY=newkey
JWT_SECRET=newkey
```

### 2. Levantar Strapi con PostgreSQL externa

```bash
# Desde carpeta infra/
docker-compose -f docker-compose.prod.yml up -d

# Ver logs
docker-compose -f docker-compose.prod.yml logs -f strapi
```

### 3. Configurar Reverse Proxy

En producción, **NO exponer Strapi puerto 1337 directamente**. Usar reverse proxy:

**Nginx:**
```nginx
upstream strapi {
    server localhost:1337;
}

server {
    listen 80;
    server_name api.example.com;
    client_max_body_size 100M;

    location / {
        proxy_pass http://strapi;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

**Caddy:**
```
api.example.com {
    reverse_proxy localhost:1337
}
```

---

## Comandos Útiles

### Desarrollo con SQLite (Recomendado)

```bash
cd cms
pnpm dev
```

### Desarrollo con PostgreSQL via Docker

```bash
# Terminal 1: Levantar PostgreSQL
cd infra
docker-compose up -d

# Terminal 2: Ejecutar Strapi
cd cms
pnpm dev
```

### Producción

```bash
# Terminal 1: Levantar Strapi con BD externa
cd infra
docker-compose -f docker-compose.prod.yml up -d

# Logs
docker-compose -f docker-compose.prod.yml logs -f strapi

# Detener
docker-compose -f docker-compose.prod.yml down
```

### Base de Datos PostgreSQL (si se usa en dev)

```bash
# Conectar a PostgreSQL
psql -h localhost -U strapi -d strapi

# Backup
docker-compose exec postgres pg_dump -U strapi strapi > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore
docker-compose exec -T postgres psql -U strapi strapi < backup.sql
```

### Limpiar

```bash
# Eliminar contenedores y volúmenes
docker-compose down -v --rmi all
```

---

## Troubleshooting

### Strapi no inicia en desarrollo

```bash
# Limpiar caché
rm -rf cms/.next cms/dist cms/node_modules/.cache

# Reinstalar dependencias
cd cms
pnpm install
pnpm dev
```

### PostgreSQL no conecta desde Strapi

```bash
# Verificar que PostgreSQL está saludable
docker-compose ps

# Ver logs de PostgreSQL
docker-compose logs postgres

# Probar conectividad desde Strapi
docker-compose exec strapi nc -zv postgres 5432
```

### Puertos en uso

```bash
# Linux/Mac: Liberar puerto 5432
lsof -i :5432
kill -9 <PID>

# Windows: Encontrar proceso usando puerto
netstat -ano | findstr :5432
taskkill /PID <PID> /F
```

---

## Seguridad Checklist (Producción)

- [ ] Cambiar todas las claves en `cms/.env`
- [ ] Usar contraseña fuerte para PostgreSQL
- [ ] Habilitar `DATABASE_SSL=true`
- [ ] Usar reverse proxy con SSL/TLS
- [ ] Configurar firewall (solo puertos necesarios)
- [ ] Monitorear logs y métricas
- [ ] Configurar backups automáticos de BD
- [ ] Actualizar regularmente imágenes Docker

---

## Documentación Oficial

- Strapi Env Config: https://docs.strapi.io/cms/configurations/environment
- Docker Compose: https://docs.docker.com/compose/
- PostgreSQL: https://www.postgresql.org/docs/
