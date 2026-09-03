#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-https://redeasas.org.br}"
pages=(index.html quem-somos.html projetos.html impacto.html historias.html noticias.html novo-predio.html 1000-asas.html apoie.html empresas.html voluntariado.html apoiador.html confiar.html privacidade.html transparencia.html relatorios.html governanca.html integridade.html visita.html sitemap.xml robots.txt)

for page in "${pages[@]}"; do
  code="$(curl --silent --show-error --location --connect-timeout 10 --max-time 20 --output /dev/null --write-out '%{http_code}' "$base_url/$page")"
  if [[ "$code" != "200" ]]; then
    echo "$page returned HTTP $code"
    exit 1
  fi
done

echo "Site health check passed"
