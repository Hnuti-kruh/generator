# Deployment příručka pro Portainer

## Předpoklady
- Portainer nainstalovaný a spuštěný
- Přístup k privátnímu Git repository
- Docker registry (volitelně)

## Možnosti pro privátní repository

### Možnost 1: SSH klíč (doporučeno)
1. V Portaineru jděte do `Settings` → `Authentication`
2. Přidejte SSH klíč pro přístup k privátnímu repository
3. Při vytváření stacku použijte SSH URL: `git@github.com:username/repository.git`

### Možnost 2: Personal Access Token (GitHub/GitLab)
1. Vytvořte Personal Access Token ve vašem Git provideru
2. URL použijte ve formátu: `https://token@github.com/username/repository.git`
3. Nebo použijte username:token formát

### Možnost 3: Deploy Key (GitHub)
1. Vygenerujte SSH klíč pár
2. Přidejte veřejný klíč jako Deploy Key do repository
3. Použijte privátní klíč v Portainer Authentication

## Kroky pro deployment v Portainer

### 1. Příprava repository
- Commitněte a pushněte všechny vytvořené Docker soubory
- Ujistěte se, že `docker-compose.yml` je v root adresáři

### 2. Vytvoření stacku v Portainer
1. Jděte do `Stacks` → `Add stack`
2. Vyberte `Repository` jako build method
3. Vyplňte:
   - **Name**: `graphics-generator`
   - **Repository URL**: vaše Git URL (s autentizací)
   - **Repository reference**: `refs/heads/main` (nebo jiná branch)
   - **Compose path**: `docker-compose.yml`

### 3. Konfigurace environment proměnných
V Portainer stacku můžete nastavit:
```
NODE_ENV=production
VITE_API_URL=https://your-api.com  # pokud používáte API
```

### 4. Nastavení sítě a proxy
Aplikace je nakonfigurována pro použití s existujícím nginx-proxy:
- Používá `nginx-proxy` external network
- VIRTUAL_HOST: `generator.hnutikruh.cz`
- Let's Encrypt SSL certifikát bude automaticky vygenerován
- Žádné manuální mapování portů není potřeba

### 5. SSL certifikát
Let's Encrypt companion automaticky:
- Vygeneruje SSL certifikát pro `generator.hnutikruh.cz`
- Bude obnoven automaticky
- Email pro notifikace: `mtk@hnutikruh.cz`

## Testování
Po deployu:
1. Zkontrolujte logy: `Containers` → `graphics-generator-app` → `Logs`
2. Otestujte health check: `http://generator.hnutikruh.cz/health`
3. Aplikace bude dostupná na: `https://generator.hnutikruh.cz` (HTTPS automaticky díky Let's Encrypt)

## Troubleshooting

### Build selhává
- Zkontrolujte, že všechny závislosti jsou v `package.json`
- Ujistěte se, že `npm run build` funguje lokálně

### Container se nespustí
- Zkontrolujte logy kontejneru v Portainer
- Ověřte, že port není obsazený

### Routing nefunguje
- Vue Router vyžaduje správnou nginx konfiguraci (už zahrnuto)
- Zkontrolujte, že `try_files` direktiva je správně nastavená

### Přístup k privátnímu repo
- Ověřte SSH klíč nebo token
- Zkontrolujte repository URL formát
- Test klonu repository ručně na serveru

## Aktualizace aplikace
1. Pushněte změny do repository
2. V Portainer: `Stacks` → `graphics-generator` → `Update the stack`
3. Zaškrtněte `Pull and redeploy`
4. Klikněte `Update`

## Bezpečnostní poznámky
- Nikdy neukládejte credentials do git repository
- Používejte environment proměnné pro citlivé údaje
- Pravidelně aktualizujte base image (node:18-alpine)
- Nastavte firewall pravidla pro omezení přístupu
