<?php

$executionStartTime = microtime(true) / 1000;

$url = "https://free.currconv.com/api/v7/convert?apiKey=786adf7939bbf2bc8453&q=". $_REQUEST['base'] . "_" . $_REQUEST['symbols'] . "&compact=ultra&date=" . $_REQUEST['start'] . "&endDate=" . $_REQUEST['end'];

https://free.currconv.com/api/v7/convert?apiKey=786adf7939bbf2bc8453&q=GBP_CZK&compact=ultra&date=2020-08-21&endDate=2020-08-26

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_URL,$url);

$result=curl_exec($ch);

curl_close($ch);

$decode = json_decode($result,true);	
$output['data'] = $decode;

echo json_encode($output); 