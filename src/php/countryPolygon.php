<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://gazetteer-travel.herokuapp.com/src/php/countries.geo.json";

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

$output['data'] = $border;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 