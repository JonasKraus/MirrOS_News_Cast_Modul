<?php

/**
 * Storing the currently displayed articles
 */
if (isset($_POST['data'])) {

    $data = $_POST;

    // Try to open file - must be copied with module to have the correct rights
    $fp = fopen('currentArticles.json', 'w') or die("can't open file");
    fwrite($fp, json_encode($data));
    fclose($fp);
    flush();
}