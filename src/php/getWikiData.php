<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" .  $_REQUEST['cityName']  . "&limit=1&format=json";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	
$output['data'] = $decode;

echo json_encode($output); 