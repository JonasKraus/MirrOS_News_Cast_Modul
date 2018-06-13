/**
 * Backend UI logic for the newsapi/logo modal.
 */
// Uoload new logo images & handle preview.
$('#newsapi__edit').click(function() {

    $.post('setConfigValueAjax.php', {'key' : 'newsapi_apiKey', 'value' : $('#newsapi_apiKey').val()});

    let showImages = $('#newsapi_show_images').is(':checked');
    let showQrCodes = $('#newsapi_show_qrCodes').is(':checked');
    let showSources = $('#newsapi_show_sources').is(':checked');
    let country = $('#newsapi_country').val();
    let sortBy = $('#newsapi_sortBy').val();
    let numDataToDisplay = $('#newsapi_num_articles').val();
    let displayTime = $('#newsapi_display_time').val();
    let ip = $('#newsapi_local_ip').val();

    let options = {
        showImages: showImages,
        showQrCodes: showQrCodes,
        showSources: showSources,
        country: country,
        sortBy: sortBy,
        numDataToDisplay: numDataToDisplay,
        displayTime: displayTime,
        ip: ip
    };

    $.post('setConfigValueAjax.php', {'key': 'newsapi_options', 'value': JSON.stringify(options)});

    $('#ok').show(30, function() {

        $(this).hide('slow');
    })
});
