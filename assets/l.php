<?php

$id = $_GET['l'];

$string = file_get_contents("articles.json");
$json_a = json_decode($string, true);

$url = $json_a[$id]['url'];

header("Location: " . $json_a[$id]['url']);
die();