
<?php

/**
 * Saves all articles with the local id
 * - so after scanning the qr code the user can be redirected to the original url
 *
 */
if (isset($_POST['data'])) {

    $data = $_POST['data'];

    // Setting the temporarily local id
    for ($i = 0; $i < count($data); $i++) {

        $data[$i]["id"] = $i;
    }

    // Try to open the file - file must be copied with module to have the correct rights
    $fp = fopen('articles.json', 'w') or die("can't open file");
    fwrite($fp, json_encode($data));
    fclose($fp);
    flush();
}