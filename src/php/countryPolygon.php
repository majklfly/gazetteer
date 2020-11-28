<?php

ini_set('memory_limit', '-1');

$executionStartTime = microtime(true);

$countryBorders = json_decode(file_get_contents("../data/countries.geo.json"), true);

$border = null;

    foreach($countryBorders['features'] as $feature) {
        if ($feature['properties']["ISO_A3"] == @$_REQUEST['countryCode3']) {
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