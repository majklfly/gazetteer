<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://free.currconv.com/api/v7/currencies?apiKey=786adf7939bbf2bc8453";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	
$output['data'] = $decode["results"];

echo json_encode($output); 