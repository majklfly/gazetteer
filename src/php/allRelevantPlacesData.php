<?php

$url = "https://api.opentripmap.com/0.1/en/places/radius?&kinds=cathedrals,castles,caves,stone_bridges,nature_reserves&lang=en&rate=3&limit=100000&radius=25000&lon=" . $_REQUEST['longitude'] . "&lat=" . $_REQUEST['latitude'] ."&apikey=5ae2e3f221c38a28845f05b66e6d503a4d5f5c581750b7d5b9b9469b";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);

$religion = array();
$palaces = array();
$natural = array();
$bridges = array();
$nature_reserves = array();

foreach($decode['features'] as $feature) {
    if(strpos($feature['properties']["kinds"], 'palaces') !== false) {
        array_push($palaces, $feature);
        continue;
    } else if (strpos($feature['properties']["kinds"], 'cathedrals') !== false) {
        array_push($religion, $feature);
        continue;
    } else if (strpos($feature['properties']["kinds"], 'caves') !== false) {
        array_push($natural, $feature);
        continue;
    }  else if (strpos($feature['properties']["kinds"], 'stone_bridges') !== false) {
        array_push($bridges, $feature);
        continue;
    }   else if (strpos($feature['properties']["kinds"], 'nature_reserves') !== false) {
        array_push($nature_reserves, $feature);
        continue;
    }
}


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "mission saved";
$output['religion'] = $religion;
$output['palaces'] = $palaces;
$output['natural'] = $natural;
$output['architecture'] = $bridges;
$output['nature_reserves'] = $nature_reserves;


header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 