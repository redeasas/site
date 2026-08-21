#!/usr/bin/env bash
set -euo pipefail

project_dir="$(cd "$(dirname "$0")/.." && pwd)"
archive_path="${1:-$project_dir/rede-asas-hostinger.zip}"
stage_dir="$(mktemp -d)"
trap 'rm -rf "$stage_dir"' EXIT

cp "$project_dir"/*.html "$stage_dir/"
cp "$project_dir"/*.css "$stage_dir/"
cp "$project_dir"/*.js "$stage_dir/"
cp "$project_dir/robots.txt" "$project_dir/sitemap.xml" "$project_dir/.htaccess" "$stage_dir/"
cp -R "$project_dir/assets" "$stage_dir/assets"

(cd "$stage_dir" && zip -qr "$archive_path" .)
echo "Pacote público criado em: $archive_path"

