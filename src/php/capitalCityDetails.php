<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://api.weatherbit.io/v2.0/current?city=" . $_REQUEST['capitalCity'] . "&country=" . $_REQUEST['countryCode'] . "&key=" . $_REQUEST['apiKey'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	
$output['data'] = $decode['data'][0];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output); 