# Generátor — příprava GHCR a Portaineru

Stav k 21. 11. 2026: pouze příprava, bez migrace a nasazení.
origin už ukazuje na https://github.com/Hnuti-kruh/generator; lokální main a vzdálený
main měly při kontrole commit 717570205202336f1378a9893ef944e5ffb24c1a.

Nový build používá Dockerfile.ghcr: Node 24.22.3 sestaví Vite/Vue aplikaci,
runtime je Nginx 1.30.7 Alpine, non-root na 8080, read-only s tmpfs /tmp.
Původní Dockerfile a docker-compose.yml pro dosavadní nginx-proxy hosting zůstávají
nedotčené; nový deployment nepoužívejte jako jejich automatickou náhradu.
DEPLOYMENT.md v kořeni popisuje starý způsob. Nový stack je deployment/compose.yml.

```sh
docker build --pull --platform linux/amd64 -f Dockerfile.ghcr -t generator:ci .
bash deployment/smoke-test.sh generator:ci
```

CI před publikací testuje Nginx, skutečný Docker healthy stav, non-root, hlavní HTML,
favicon, reálný hashovaný asset, cache, gzip, SPA deep link /avatar a 404 pro chybějící
assety. Vue history cesty vracejí vstupní HTML; neexistující soubor nesmí dostat SPA HTML.
Statické /static/ build assety mají roční immutable cache; HTML a nehashované soubory no-cache.
Opravena favicon cesta: public/favicon.ico je na /favicon.ico, nikoli /static/favicon.ico.

Workflow publikuje pouze na main a až po úspěšných testech přesně testovanou image:
ghcr.io/hnuti-kruh/generator:latest a sha-<celý SHA>. Pro nasazení sha tag nebo digest.
Actions SHA byly převzaty z ověřeného workflow Nepřehlédni to. Žádný VPS build ani automatický redeploy.
Produkční secrets nejsou potřeba; env a privátní klíče se do build contextu nepřenášejí.
Případná budoucí veřejná Vite konfigurace je build-time a vyžaduje novou image.

Ověřen izolovaný Windows npm ci a Vite build na Node 24; vznikl dist/index.html,
favicon a hashované CSS/JS soubory. Docker daemon neběží, takže Linux image,
nginx -t a runtime smoke testy zatím musí ověřit první Actions.
Compose config, YAML workflow, Bash syntaxe a git diff --check prošly.

Po samostatném schválení commitu/push a po úspěšném CI lze později připravit stack
na vmi3079089: externí proxy, alias kruh-generator, proměnná GENERATOR_IMAGE,
loopback 127.0.0.1:18082 pro ověření před DNS. Bez backend a persistentních volumes.
Pro private image registry credentials v Portaineru; v Compose není žádný token.

Caddy fragment pro generator.hnutikruh.cz je pouze připravený. Před změnou záloha,
append do existující konfigurace při zachování inode, validate a při úspěchu reload
stávajícího caddy-caddy-1. Žádné recreate centrální proxy. DNS a dosavadní hosting
neměnit před funkční kontrolou obrázků, nahrávání, editace a exportu v prohlížeči.
Návrat aplikace = předchozí GENERATOR_IMAGE; návrat hostingu = původní DNS a starý stack.
Původní stack zatím zachovat. Nová příprava není automaticky otestovaná náhrada jeho běžící služby.
