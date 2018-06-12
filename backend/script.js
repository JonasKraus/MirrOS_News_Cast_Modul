/**
 * Backend UI logic for the newsapi/logo modal.
 */
// Uoload new logo images & handle preview.
$('#text_field__edit').click(function() {

    $.post('setConfigValueAjax.php', {'key' : 'newsapi_apiKey', 'value' : $('#newsapi_apiKey').val()});

    let showImages = $('#newsapi_show_images').val();
    let showQrCodes = $('#newsapi_show_qrCodes').val();
    let showSources = $('#newsapi_show_sources').val();
    let country = $('#newsapi_country').val();

    let options = {
        showImages: showImages,
        showQrCodes: showQrCodes,
        showSources: showSources,
        country: country
    }

    $.post('setConfigValueAjax.php', {'key': 'newsapi_options', 'value': JSON.stringify(options)});


    $('#ok').show(30, function() {
        $(this).hide('slow');
    })
});
