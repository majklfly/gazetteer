<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://api.ipgeolocation.io/ipgeo?apiKey=1916b969238f4383b66a16126e6dfb2e&ip=" .  $_REQUEST['ip']; 

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	
$output['data'] = $decode;

echo json_encode($output); 