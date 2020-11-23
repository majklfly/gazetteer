<?php

ini_set('display_errors', 'On');
error_reporting(E_ALL)

$executionStartTime = microtime(true);

$url = "https://gazetteer-php-server.herokuapp.com/src/countries.geo.json";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL, $url);

$result=curl_exec($ch);

curl_close($ch);

$countryBorders = json_decode($result,true);

$border = null;

foreach($countryBorders['features'] as $feature) {
    if ($feature['properties']["ISO_A3"] == $_REQUEST['countryCode3']) {
        $border = $feature;
    break;
    }
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $border;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 