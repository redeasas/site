<?php
// Requests are served by rede_asas_static_router() in functions.php.
status_header(404);
include get_template_directory() . '/site/404.html';

