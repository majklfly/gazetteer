<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://localhost/gazetteer/src/" ;

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	
$output['data'] = $decode['features'];
echo json_encode($output); 

// https://localhost/gazetteer/src/

// http://gazetteer-travel.herokuapp.com/src/