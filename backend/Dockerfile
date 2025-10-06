FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig*.json ./
COPY nest-cli.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY src ./src

# Construir aplicación
RUN npm run build

# Etapa de producción
FROM node:18-alpine

WORKDIR /app

# Copiar archivos necesarios
COPY package*.json ./
RUN npm ci --only=production

# Copiar aplicación construida
COPY --from=builder /app/dist ./dist

EXPOSE 3001

CMD ["node", "dist/main"]