// Global vars
var newsapi_apiKey,
    newsapi_options,
    url,
    articles = null,
    dataPointer;

/**
 * On Ready
 */
$(document).ready(function () {

    includeQrCodeApi();

    newsapi_apiKey = "<?php echo getConfigValue('newsapi_apiKey'); ?>";
    newsapi_options = JSON.parse('<?php echo getConfigValue("newsapi_options"); ?>');

    if (newsapi_options.country == null) {

        newsapi_options.country = "de";
    }

    if (newsapi_options.showImages == null) {

        newsapi_options.showImages = "inline";
    }

    if (newsapi_options.showQrCodes == null) {

        newsapi_options.showQrCodes = "inline";
    }

    if (newsapi_options.showSources == null) {

        newsapi_options.showSources = "inline";
    }

    if (newsapi_options.sortBy == null) {

        newsapi_options.sortBy = "latest";
    }

    url = "https://newsapi.org/v2/top-headlines?country=" + newsapi_options.country  + "&apiKey=" + newsapi_apiKey + "&sortBy=" + newsapi_options.sortBy;

    reloadNewsapi();
});

/**
 * Adds a script tag  to the current document to include the QR-Code API
 *
 */
function includeQrCodeApi() {

    var script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js';
    script.type = 'text/javascript';

    document.getElementsByTagName('head')[0].appendChild(script);
}


/**
 * Reloading every X seconds
 */
function reloadNewsapi() {

    requestNewsapi();

    $(document).ready(function() {

        window.setTimeout(function() {

            reloadNewsapi(); // looping
        }, newsapi_options.displayTime * 1000); // Multiply by 1000 to get milliseconds
    });


    /**
     * Sending the actual api request or get the next chunk
     * then creating the view
     */
    function requestNewsapi() {

        if (articles != null && dataPointer < articles.length) {

            createView(limitData());
        } else {

            dataPointer = 0; // Resetting Pointer

            articles = null; // Resetting data array

            $.getJSON(url, function(data) {

                //console.info("##########request api##############");

                articles = addId(data.articles);

                sendArticlesToServer(articles, function() {createView(limitData());});
            });
        }

    }

    /**
     * Adding id Attribute to reference each article
     *
     * @param articles
     */
    function addId(articles) {

        for (var i = 0; i < articles.length; i++) {

            articles[i].id = i + "";
        }

        return articles;

    }

    /**
     * Sets the chunk to display
     *
     * @returns {any[]}
     */
    function limitData() {

        var dataToDisplay = new Array();

        for (var i = 0; i < newsapi_options.numDataToDisplay; i++) {

            dataToDisplay[i] = articles[dataPointer];
            dataPointer++;
        }

        notifyServer(dataToDisplay);

        return dataToDisplay;
    }

    /**
     * Creating the view depending on options and received data
     *
     * @param data
     */
    function createView(data) {

        //console.info("***********refresh newsapi************");

        var tr; // the current table row where data gets added

        $('tr.newsapi_tr').remove(); // remove old view from table row

        for(var i = 0; i <= data.length; i++) {

            tr = $('<tr class="newsapi_tr"/>');

            if (data[i] !== undefined) {

                // Building the QR Code
                if (newsapi_options.showQrCodes && data[i].url !== undefined) {

                    var tdQrCode = $("<td/>");
                    var div = $("<div class='newsapi_round_border_qr'/>");

                    var ip = "<?php echo $_SERVER['SERVER_ADDR']; ?>";

                    div.qrcode(
                        {
                            width: 75,
                            height: 75,
                            text: ip + "/modules/newsapi/assets/l.php?l=" + data[i].id + "",
                            correctLevel: 1,
                        });

                    tdQrCode.append(div);
                    tr.append(tdQrCode);
                }

                // Adding the Image or placeholder
                if (newsapi_options.showImages) {

                    // check if an image url is set
                    if (data[i].urlToImage !== undefined && data[i].urlToImage !== null) {

                        tr.append("<td><div class='newsapi_round_border'><img class='newsapi_image' src='" + data[i].urlToImage + "'/></div></td>");
                    } else {

                        tr.append("<td><div class='newsapi_round_border'><img class='newsapi_image' src='/modules/newsapi/assets/placeholder_white.svg'/></div></td>");
                    }
                }

                // Adding placeholder icon if no image or qr code is visible
                if (!newsapi_options.showQrCodes && !newsapi_options.showImages) {

                    tr.append("<td><div ><img class='newsapi_image_icon' src='/modules/newsapi/assets/rss.svg'/></div></td>");

                }


                var appendix = "";
                // Appending the source name
                if (newsapi_options.showSources && data[i].source.name !== undefined) {

                    appendix = "<br><i class='newsapi_source' style='font-family: Serif'>"  + data[i].source.name + "</i>";
                }

                tr.append("<td>" + data[i].title + appendix + "</td>");

                // Appending the row to the table
                $('.newsapi_table').append(tr);
            }
        }
    }


}

/**
 * Sends the currently loaded articles to the server
 * So the server knows those data and can redirect to it
 * if the user scanned the qr-code
 *
 * @param data
 * @param callback
 */
function sendArticlesToServer(data, callback) {

    $.ajax({
        type: "POST",
        url: "/modules/newsapi/assets/storeArticles.php",
        data: {data: data},
        success: function (response) {

            // After the current articles are saved at the backend the view can be created
            callback();
        },
        error: function (error) {

            console.error(error);
        },
    });
}

/**
 * Notifies the server of the currently displayed data
 * Copies them temporarily
 *
 * @param data
 */
function notifyServer(data) {

    var timestamp = Date.now();

    $.ajax({
        type: "POST",
        url: "/modules/newsapi/assets/notifyServer.php",
        data: {
                data: data,
                timestamp: timestamp,
                displayTime: (newsapi_options.displayTime * 1000)
            },
        success: function (response) {

            // do something
        },
        error: function (error) {

            console.error(error);
        },
    });

}


