<?php

$executionStartTime = microtime(true);

$url = "https://gazetteer-travel.herokuapp.com/src/php/countries.geojson";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$border = null;

foreach($decode['features'] as $feature) {
    if ($feature['properties']["ISO_A3"] == $_REQUEST['countryCode3']) {
        $border = $feature;
    break;
    }
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $border;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 