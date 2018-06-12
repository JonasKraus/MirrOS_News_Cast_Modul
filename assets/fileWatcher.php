<?php

watch();


function watch() {

    $hash = hash_file("md5", "currentArticles.json");
    echo $hash;
    while ($hash == hash_file("md5", "currentArticles.json")) {

        $hash = hash_file("md5", "currentArticles.json");
    }
    header("Refresh:0");
}
