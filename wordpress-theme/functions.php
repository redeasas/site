<?php
/**
 * Runtime for the static Rede ASAS website inside WordPress.
 * WordPress administration and authentication routes remain untouched.
 */

if (!defined('ABSPATH')) {
    exit;
}

function rede_asas_static_content_type(string $path): string {
    $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
    $types = [
        'css' => 'text/css; charset=UTF-8',
        'js' => 'application/javascript; charset=UTF-8',
        'html' => 'text/html; charset=UTF-8',
        'txt' => 'text/plain; charset=UTF-8',
        'xml' => 'application/xml; charset=UTF-8',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'webp' => 'image/webp',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'pdf' => 'application/pdf',
    ];

    return $types[$extension] ?? 'application/octet-stream';
}

function rede_asas_static_router(): void {
    if (is_admin()) {
        return;
    }

    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $requestPath = rawurldecode($requestPath);

    if (
        str_starts_with($requestPath, '/wp-admin') ||
        str_starts_with($requestPath, '/wp-login.php') ||
        str_starts_with($requestPath, '/wp-json') ||
        str_starts_with($requestPath, '/wp-cron.php')
    ) {
        return;
    }

    $routes = [
        '/' => 'index.html',
        '/quem-somos' => 'quem-somos.html',
        '/projetos' => 'projetos.html',
        '/impacto' => 'impacto.html',
        '/historias' => 'historias.html',
        '/noticias' => 'noticias.html',
        '/novo-predio' => 'novo-predio.html',
        '/apoie' => 'apoie.html',
        '/voluntariado' => 'voluntariado.html',
        '/empresas' => 'empresas.html',
        '/apoiador' => 'apoiador.html',
        '/confiar' => 'confiar.html',
        '/privacidade' => 'privacidade.html',
    ];

    $normalized = rtrim($requestPath, '/');
    if ($normalized === '') {
        $normalized = '/';
    }

    if (isset($routes[$normalized])) {
        $relativePath = $routes[$normalized];
    } elseif (preg_match('#^/([a-z0-9-]+)\.html$#', $requestPath, $match)) {
        $relativePath = $match[1] . '.html';
    } elseif (preg_match('#^(assets/.+|styles\.css|script\.js|site-config\.js|assistant\.css|stock\.css|building\.css|architecture\.css|pix\.css|robots\.txt|sitemap\.xml)$#', ltrim($requestPath, '/'), $match)) {
        $relativePath = $match[1];
    } else {
        return;
    }

    $siteRoot = get_template_directory() . '/site';
    $candidate = realpath($siteRoot . '/' . $relativePath);
    $realRoot = realpath($siteRoot);

    if (!$candidate || !$realRoot || !str_starts_with($candidate, $realRoot . DIRECTORY_SEPARATOR) || !is_file($candidate)) {
        status_header(404);
        $candidate = $siteRoot . '/404.html';
    }

    status_header(200);
    $extension = strtolower(pathinfo($candidate, PATHINFO_EXTENSION));
    header('X-Content-Type-Options: nosniff');
    if ($extension === 'html') {
        header('Content-Type: text/html; charset=UTF-8');
        header('Cache-Control: no-cache, must-revalidate');
        $html = file_get_contents($candidate);
        $assetBase = trailingslashit(get_template_directory_uri()) . 'site/';
        $html = str_replace(
            [
                'href="styles.css"',
                'src="script.js"',
                'src="site-config.js"',
                'href="assets/',
                'src="assets/',
            ],
            [
                'href="' . esc_url($assetBase . 'styles.css') . '"',
                'src="' . esc_url($assetBase . 'script.js') . '"',
                'src="' . esc_url($assetBase . 'site-config.js') . '"',
                'href="' . esc_url($assetBase . 'assets/') ,
                'src="' . esc_url($assetBase . 'assets/') ,
            ],
            $html
        );
        echo $html;
    } else {
        header('Content-Type: ' . rede_asas_static_content_type($candidate));
        header('Cache-Control: public, max-age=86400');
        readfile($candidate);
    }

    exit;
}
add_action('template_redirect', 'rede_asas_static_router', 0);
