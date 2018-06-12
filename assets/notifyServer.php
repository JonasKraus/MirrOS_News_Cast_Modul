<?php

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');

$data = $_POST;

if (isset($_POST['data'])) {

    // Try to open file - must be copied with module to have the correct rights
    $fp = fopen('currentArticles.json', 'w') or die("can't open file");
    fwrite($fp, json_encode($data));
    fclose($fp);

} else {

    $fp = fopen("currentArticles.json", "r") or die("Unable to open file!");
    $data = fread($fp,filesize("currentArticles.json"));
    fclose($fp);

}

$data = json_decode($data, true);
$timestamp = $data['timestamp'];
$data = $data['data'][0];

echo 'data: ' . json_encode($data['id']) . "\n";
echo 'data: ' . json_encode($data['source']) . "\n";
echo 'data: ' . json_encode($timestamp) . "\n\n";
flush();