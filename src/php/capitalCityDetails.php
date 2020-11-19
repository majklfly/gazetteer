<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://www.metaweather.com/api/location/search/?query=" . $_REQUEST['capitalCity'];

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	
$output['data'] = $decode[0];
echo json_encode($output); 