# Multi-stage build pro Vue aplikaci
FROM node:18-alpine AS build-stage

# Instalace git (může být potřeba pro některé npm packages)
RUN apk add --no-cache git

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování package.json a package-lock.json
COPY package*.json ./

# Instalace závislostí
RUN npm ci

# Kopírování zdrojového kódu
COPY . .

# Build aplikace
RUN npm run build

# Production stage
FROM nginx:alpine AS production-stage

# Kopírování custom nginx konfigurace
COPY nginx.conf /etc/nginx/nginx.conf

# Kopírování build výstupu do nginx
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Spuštění nginx
CMD ["nginx", "-g", "daemon off;"]
