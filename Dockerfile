# Multi-stage build pro Vue aplikaci
FROM node:18-alpine AS build-stage

# Nastavení pracovního adresáře
WORKDIR /app

# Kopírování package.json a package-lock.json (pokud existuje)
COPY package*.json ./

# Instalace závislostí (včetně dev dependencies pro build)
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
