<?php

$app = require_once __DIR__ . '/bootstrap.php';

use Symfony\Component\HttpFoundation\JsonResponse;

/**
 * Homepage, lists recent projects
 */
$app->get('/', function() use ($app) {
    return $app['twig']->render('homepage.html.twig', array(
        'ip' => $_SERVER['REMOTE_ADDR']
    ));
})->bind('homepage');

$app->post('/', function () use ($app) {
    $message = $app['request']->get('q');
    $result = array();

    $adapter = new \Geocoder\HttpAdapter\CurlHttpAdapter();

    if ($message === long2ip(ip2long($message))
        || 1 === preg_match('/([0-9.-]+).+?([0-9.-]+)/', $message)
    ) {
        $providers = array(
            new \Geocoder\Provider\FreeGeoIpProvider($adapter),
            new \Geocoder\Provider\HostIpProvider($adapter),
            new \Geocoder\Provider\IpInfoDbProvider($adapter, $app['IPINFODB_API_KEY']),
            new \Geocoder\Provider\YahooProvider($adapter, $app['YAHOO_API_KEY'])
        );
    } else {
        $providers = array(
            new \Geocoder\Provider\BingMapsProvider($adapter, $app['BINGMAPS_API_KEY']),
            new \Geocoder\Provider\CloudMadeProvider($adapter, $app['CLOUDMADE_API_KEY']),
            new \Geocoder\Provider\GoogleMapsProvider($adapter),
            new \Geocoder\Provider\OpenStreetMapsProvider($adapter),
            new \Geocoder\Provider\YahooProvider($adapter, $app['YAHOO_API_KEY'])
        );
    }

    $geocoder = new \Geocoder\Geocoder();
    $geocoder->registerProviders($providers);

    foreach (array_keys($geocoder->getProviders()) as $provider) {
        $geocoder->using($provider);
        $result[$provider] = $geocoder->geocode($message)->toArray();
    }

    return new JsonResponse($result);
});

return $app;
