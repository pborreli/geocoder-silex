<?php

require_once __DIR__.'/../vendor/autoload.php';

$app = new Silex\Application();

/** Silex Extensions */
use Silex\Provider\UrlGeneratorServiceProvider;
use Silex\Provider\TwigServiceProvider;

$app->register(new UrlGeneratorServiceProvider());

$app->register(new TwigServiceProvider(), array(
    'twig.path' => array(
        __DIR__.'/../src/Resources/views',
    )
));

if (!file_exists(__DIR__.'/config.php')) {
    throw new RuntimeException('You must create your own configuration file ("src/config.php"). See "src/config.php.dist" for an example config file.');
}

require_once __DIR__.'/config.php';

return $app;
