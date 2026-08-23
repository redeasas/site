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
        'mp4' => 'video/mp4',
    ];

    return $types[$extension] ?? 'application/octet-stream';
}

/**
 * Serve the discovery files before WordPress or SEO plugins can redirect them.
 */
function rede_asas_serve_discovery_files(): void {
    if (is_admin()) {
        return;
    }

    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH) ?: '/';
    $files = [
        '/robots.txt' => ['robots.txt', 'text/plain; charset=UTF-8'],
        '/sitemap.xml' => ['sitemap.xml', 'application/xml; charset=UTF-8'],
    ];

    if (!isset($files[$requestPath])) {
        return;
    }

    [$relativePath, $contentType] = $files[$requestPath];
    $candidate = get_template_directory() . '/site/' . $relativePath;
    if (!is_file($candidate)) {
        return;
    }

    status_header(200);
    header('Content-Type: ' . $contentType);
    header('Cache-Control: no-cache, must-revalidate');
    header('X-Content-Type-Options: nosniff');
    readfile($candidate);
    exit;
}
add_action('init', 'rede_asas_serve_discovery_files', -999);

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
        '/investimento-social' => 'empresas.html',
        '/apoiador' => 'apoiador.html',
        '/confiar' => 'confiar.html',
        '/privacidade' => 'privacidade.html',
        '/transparencia' => 'transparencia.html',
        '/relatorios' => 'relatorios.html',
        '/governanca' => 'governanca.html',
        '/integridade' => 'integridade.html',
        '/visita' => 'visita.html',
    ];

    $normalized = rtrim($requestPath, '/');
    if ($normalized === '') {
        $normalized = '/';
    }

    if (isset($routes[$normalized])) {
        $relativePath = $routes[$normalized];
    } elseif (preg_match('#^/projetos/([a-z0-9-]+)/?$#', $requestPath)) {
        $relativePath = 'projeto.html';
    } elseif (preg_match('#^/([a-z0-9-]+)\.html$#', $requestPath, $match)) {
        $relativePath = $match[1] . '.html';
    } elseif (preg_match('#^(assets/.+|styles\.css|script\.js|project-data\.js|obra-data\.js|site-config\.js|assistant\.css|stock\.css|building\.css|architecture\.css|pix\.css|robots\.txt|sitemap\.xml)$#', ltrim($requestPath, '/'), $match)) {
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
    } else {
        status_header(200);
    }
    $extension = strtolower(pathinfo($candidate, PATHINFO_EXTENSION));
    header('X-Content-Type-Options: nosniff');
    if ($extension === 'html') {
        header('Content-Type: text/html; charset=UTF-8');
        header('Cache-Control: no-cache, must-revalidate');
        $html = file_get_contents($candidate);
        $verificationMeta = '<meta name="google-site-verification" content="QudVoDaeibsi7dxUy8qIQ1zZvFz30BoqXCZ_RZFLCM8" />';
        $html = preg_replace(
            '/<meta\s+name=["\']google-site-verification["\']\s+content=["\'][^"\']+["\']\s*\/?\s*>/i',
            $verificationMeta,
            $html,
            1
        );
        if (stripos($html, 'name="google-site-verification"') === false) {
            $html = str_ireplace('</head>', '  ' . $verificationMeta . "\n</head>", $html);
        }
        $assetBase = trailingslashit(get_template_directory_uri()) . 'site/';
        $stylesVersion = (string) filemtime($siteRoot . '/styles.css');
        $scriptVersion = (string) filemtime($siteRoot . '/script.js');
        $configVersion = (string) filemtime($siteRoot . '/site-config.js');
        $html = str_replace(
            [
                'src="assets/videos/',
                'href="styles.css"',
                'src="script.js"',
                'src="site-config.js"',
                'src="project-data.js"',
                'src="obra-data.js"',
                'href="assets/',
                'src="assets/',
            ],
            [
                'src="https://redeasas.github.io/site/assets/videos/',
                'href="' . esc_url($assetBase . 'styles.css?v=' . $stylesVersion) . '"',
                'src="' . esc_url($assetBase . 'script.js?v=' . $scriptVersion) . '"',
                'src="' . esc_url($assetBase . 'site-config.js?v=' . $configVersion) . '"',
                'src="' . esc_url($assetBase . 'project-data.js?v=' . (string) filemtime($siteRoot . '/project-data.js')) . '"',
                'src="' . esc_url($assetBase . 'obra-data.js?v=' . (string) filemtime($siteRoot . '/obra-data.js')) . '"',
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
