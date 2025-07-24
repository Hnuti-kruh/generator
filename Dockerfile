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

# Production stage - použijeme Node.js serve místo nginx
FROM node:18-alpine AS production-stage

# Instalace serve pro statické soubory
RUN npm install -g serve

# Vytvoření non-root uživatele
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Kopírování build výstupu
COPY --from=build-stage /app/dist /app
WORKDIR /app

# Změna vlastnictví souborů
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port 3000 (serve default port)
EXPOSE 3000

# Spuštění serve s SPA supportem
CMD ["serve", "-s", ".", "-l", "3000"]
