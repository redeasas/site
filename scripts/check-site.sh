#!/usr/bin/env bash
set -euo pipefail

base_url="${1:-https://redeasas.org.br}"
pages=(index.html quem-somos.html projetos.html impacto.html historias.html noticias.html novo-predio.html apoie.html empresas.html voluntariado.html apoiador.html confiar.html privacidade.html sitemap.xml robots.txt)

for page in "${pages[@]}"; do
  code="$(curl --silent --show-error --location --output /dev/null --write-out '%{http_code}' "$base_url/$page")"
  if [[ "$code" != "200" ]]; then
    echo "$page returned HTTP $code"
    exit 1
  fi
done

if curl --silent --show-error --location "$base_url/" | grep -q 'transparencia.html'; then
  echo "Transparency draft is linked publicly"
  exit 1
fi

echo "Site health check passed"
