<?php

$executionStartTime = microtime(true);

$countryBorders = json_decode(file_get_contents("countries.geo.json"), true);

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

echo json_encode($output); 