#!/usr/bin/env bash
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
build_dir="${TMPDIR:-/tmp}/rede-asas-wordpress-theme"
theme_dir="$build_dir/rede-asas-brasil"
archive_path="${TMPDIR:-/tmp}/rede-asas-brasil-wordpress-theme.zip"

rm -rf "$build_dir"
mkdir -p "$theme_dir/site/assets"

cp "$repo_dir/wordpress-theme/functions.php" "$theme_dir/functions.php"
cp "$repo_dir/wordpress-theme/index.php" "$theme_dir/index.php"
cp "$repo_dir/wordpress-theme/style.css" "$theme_dir/style.css"

cp "$repo_dir"/*.html "$theme_dir/site/"
cp "$repo_dir"/*.css "$theme_dir/site/"
cp "$repo_dir"/*.js "$theme_dir/site/"
cp "$repo_dir/robots.txt" "$theme_dir/site/robots.txt"
cp "$repo_dir/sitemap.xml" "$theme_dir/site/sitemap.xml"
cp -R "$repo_dir/assets/." "$theme_dir/site/assets/"
# The authorized testimonial videos are served by GitHub Pages to keep the
# WordPress upload package below the hosting provider's request-size limit.
rm -rf "$theme_dir/site/assets/videos"

rm -f "$archive_path"
(cd "$build_dir" && zip -qr "$archive_path" "rede-asas-brasil")

printf '%s\n' "$archive_path"
