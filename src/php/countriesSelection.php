<?php

$url = "https://restcountries.eu/rest/v2/all";

$ch = curl_init("https://restcountries.eu/rest/v2/all");
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$result=curl_exec($ch);

curl_close($ch);

echo json_encode($result); 