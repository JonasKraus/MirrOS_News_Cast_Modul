<?php

if (isset($_POST['data'])) {

    $data = $_POST['data'];

    for ($i = 0; $i < count($data); $i++) {

        $data[$i]["id"] = $i;
    }

    // Try to open the file - file must be copied with module to have the correct rights
    $fp = fopen('articles.json', 'w') or die("can't open file");
    fwrite($fp, json_encode($data));
    fclose($fp);

    header("Content-Type: text/html; charset=utf-8");

    echo json_encode($data);
} // TODO exception handling


