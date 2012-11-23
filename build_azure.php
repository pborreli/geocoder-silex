<?php
if (!file_exists("composer.phar")) {
    $url = 'https://getcomposer.org/composer.phar';
    file_put_contents("composer.phar", file_get_contents($url));
}

$_SERVER['argv'][1] = "update";
$_SERVER['argv'][2] = "--prefer-dist";
$_SERVER['argv'][3] = "-v";
require "composer.phar";