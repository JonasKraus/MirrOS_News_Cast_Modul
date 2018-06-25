/**
 * Backend UI logic for the newsapi/logo modal.
 */
// Uoload new logo images & handle preview.
$('#newscast__edit').click(function() {

    $.post('setConfigValueAjax.php', {'key' : 'newscast_apiKey', 'value' : $('#newscast_apiKey').val()});

    let showImages = $('#newscast_show_images').is(':checked');
    let showQrCodes = $('#newscast_show_qrCodes').is(':checked');
    let showSources = $('#newscast_show_sources').is(':checked');
    let country = $('#newscast_country').val();
    let sortBy = $('#newscast_sortBy').val();
    let numDataToDisplay = $('#newscast_num_articles').val();
    let displayTime = $('#newscast_display_time').val();

    let options = {
        showImages: showImages,
        showQrCodes: showQrCodes,
        showSources: showSources,
        country: country,
        sortBy: sortBy,
        numDataToDisplay: numDataToDisplay,
        displayTime: displayTime
    };

    $.post('setConfigValueAjax.php', {'key': 'newscast_options', 'value': JSON.stringify(options)});

    $('#ok').show(30, function() {

        $(this).hide('slow');
    })
});
