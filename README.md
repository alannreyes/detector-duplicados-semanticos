# 🔍 Detector de Duplicados Semánticos

Sistema de detección de productos duplicados usando embeddings y validación con OpenAI.

## 🎯 Características

- ✅ Detección de duplicados por similitud coseno
- ✅ Validación opcional con OpenAI GPT-4
- ✅ Búsqueda por descripción, rango de IDs o categoría
- ✅ Interfaz limpia con diseño en blanco y verde
- ✅ Exportación a Excel y CSV
- ✅ Umbral de similitud totalmente configurable (0-1)
- ✅ Progreso en tiempo real para búsquedas por rango

## 📋 Requisitos

- Node.js 18+
- PostgreSQL con la tabla `productos_bip` existente
- API Key de OpenAI (opcional)
- Docker y Docker Compose (para deployment)

## 🚀 Instalación Local

### 1. Clonar el repositorio

```bash
git clone <tu-repositorio>
cd detector-duplicados
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en las carpetas `backend/` y `frontend/`:

**backend/.env**
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASSWORD=tu_password
OPENAI_API_KEY=sk-tu-api-key
BACKEND_PORT=3001
NODE_ENV=development
```

**frontend/.env**
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Instalar dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 4. Ejecutar en desarrollo

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Accede a http://localhost:3000

## 🐳 Deployment con Docker

### Opción 1: Docker Compose Local

```bash
# Configurar .env en la raíz
cp .env.example .env
# Editar .env con tus valores

# Construir y ejecutar
docker-compose up -d
```

### Opción 2: EasyPanel

1. En EasyPanel, crea una nueva aplicación
2. Usa "Docker Compose" como método de deployment
3. Pega el contenido de `docker-compose.easypanel.yml`
4. Configura las variables de entorno en EasyPanel:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_NAME`
   - `DB_USER`
   - `DB_PASSWORD`
   - `OPENAI_API_KEY`
5. Deploy!

## 📊 Estructura de la Base de Datos

El sistema espera una tabla `productos_bip` con estos campos:

```sql
- id (integer)
- codigo (varchar)
- descripcion (text)
- embedding (text) -- Array JSON de 1024 dimensiones
- marca (varchar)
- categoria (varchar)
- activo (boolean)
```

## 🎨 Personalización

### Colores

Los colores verdes están definidos en `frontend/tailwind.config.js`. Puedes modificar la paleta `primary` para cambiar el esquema de colores.

### Umbral por defecto

Edita `frontend/src/app/page.tsx` y cambia el valor inicial de `umbral` en el estado.

## 📝 API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/duplicados/buscar-individual` | Busca duplicados por descripción |
| POST | `/api/duplicados/buscar-rango` | Busca duplicados en rango (con SSE para progreso) |
| POST | `/api/duplicados/buscar-categoria` | Busca duplicados por categoría |
| GET | `/api/productos/stats` | Estadísticas de productos |

## 🔧 Troubleshooting

### Error de conexión a PostgreSQL

Verifica que:
- PostgreSQL esté corriendo
- Las credenciales en `.env` sean correctas
- La tabla `productos_bip` exista

### Error con OpenAI

- Verifica que tu API key sea válida
- Si no tienes API key, desactiva la validación con OpenAI en la interfaz

### Puerto en uso

Si el puerto 3000 o 3001 están en uso, puedes cambiarlos en:
- Backend: `backend/.env` → `BACKEND_PORT`
- Frontend: `frontend/package.json` → script `dev`

## 📄 Licencia

MIT