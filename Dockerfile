# Dockerfile para Frontend Angular

# Etapa 1: Build de la aplicación
FROM node:20-alpine AS build

# Variables de entorno como argumentos
ARG NODE_ENV=production
ARG BACKEND_URL=https://cats-api.freeloz.com/api
ENV NODE_ENV=${NODE_ENV}
ENV BACKEND_URL=${BACKEND_URL}

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (incluyendo devDependencies)
RUN npm ci --include=dev

# Copiar código fuente
COPY . .

# Build de la aplicación para producción usando npx con la ruta local
RUN npx ng build --configuration=production

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Copiar los archivos build desde la etapa anterior
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]