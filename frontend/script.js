// Global vars
var newscast_apiKey,
    newscast_options,
    url,
    articles = null,
    dataPointer,
    ip;

/**
 * On Ready
 */
$(document).ready(function () {

    includeQrCodeApi();

    newscast_apiKey = "<?php echo getConfigValue('newscast_apiKey'); ?>";
    newscast_options = JSON.parse('<?php echo getConfigValue("newscast_options"); ?>');

    if (newscast_options.country == null) {

        newscast_options.country = "de";
    }

    if (newscast_options.showImages == null) {

        newscast_options.showImages = "inline";
    }

    if (newscast_options.showQrCodes == null) {

        newscast_options.showQrCodes = "inline";
    }

    if (newscast_options.showSources == null) {

        newscast_options.showSources = "inline";
    }

    if (newscast_options.sortBy == null) {

        newscast_options.sortBy = "latest";
    }

    url = "https://newsapi.org/v2/top-headlines?country=" + newscast_options.country  + "&apiKey=" + newscast_apiKey + "&sortBy=" + newscast_options.sortBy;

    reloadNewscast();
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
function reloadNewscast() {

    requestNewscast();

    $(document).ready(function() {

        window.setTimeout(function() {

            reloadNewscast(); // looping
        }, newscast_options.displayTime * 1000); // Multiply by 1000 to get milliseconds
    });


    /**
     * Sending the actual api request or get the next chunk
     * then creating the view
     */
    function requestNewscast() {

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

        for (var i = 0; i < newscast_options.numDataToDisplay; i++) {

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

        // Removing old rows from table
        $('tr.newscast_tr').remove();

        for(var i = 0; i <= data.length; i++) {

            // the current table row where data gets added
            var tr = $('<tr class="newscast_tr"/>').hide();

            if (data[i] !== undefined) {

                // Building the QR Code
                if (newscast_options.showQrCodes && data[i].url !== undefined) {

                    var tdQrCode = $("<td class='newscast_td'/>");
                    var div = $("<div class='newscast_round_border_qr'/>");

                    var ip = "<?php echo getConfigValue('ip'); ?>";

                    div.qrcode(
                        {
                            width: 75,
                            height: 75,
                            text: "http://" + ip + "/modules/newscast/assets/l.php?l=" + data[i].id + "",
                            correctLevel: 1,
                        });

                    tdQrCode.append(div);
                    tr.append(tdQrCode);
                }

                // Adding the Image or placeholder
                if (newscast_options.showImages) {

                    // check if an image url is set
                    if (data[i].urlToImage !== undefined && data[i].urlToImage !== null) {

                        tr.append("<td class='newscast_td'><div class='newscast_round_border'><img class='newscast_image' src='" + data[i].urlToImage + "'/></div></td>");
                    } else {

                        tr.append("<td class='newscast_td'><div class='newscast_round_border'><img class='newscast_image' src='/modules/newscast/assets/placeholder_white.svg'/></div></td>");
                    }
                }

                // Adding placeholder icon if no image or qr code is visible
                if (!newscast_options.showQrCodes && !newscast_options.showImages) {

                    tr.append("<td class='newscast_td_icon'><img class='newscast_image_icon' src='/modules/newscast/assets/rss.svg'/></td>");
                }

                var appendix = "";
                // Appending the source name
                if (newscast_options.showSources && data[i].source.name !== undefined) {

                    appendix = "<br/>"  + data[i].source.name + "";
                }

                tr.append("<td>" + data[i].title + appendix + "</td>");

                // Appending the row to the table
                $('.newscast_table').append(tr);

                $(tr).show('slow');
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
        url: "/modules/newscast/assets/storeArticles.php",
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
        url: "/modules/newscast/assets/notifyServer.php",
        data: {
                data: data,
                timestamp: timestamp,
                displayTime: (newscast_options.displayTime * 1000)
            },
        success: function (response) {

            // do something
        },
        error: function (error) {

            console.error(error);
        },
    });

}


