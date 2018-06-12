<?php

// Make sure these strings are available in the translation files, since they're partly derived from variables at runtime.

_('yes');
_('no');

$defaults = new StdClass();
$defaults->showImages = true;
$defaults->showQrCodes = true;
$defaults->showSources = true;
$defaults->country = 'de';
$defaults->sortBy = 'latest';
$defaults->check = false;

$apiKey = getConfigValue('newsapi_apiKey');
$options = getConfigValue('newsapi_options');

if (empty($options)) {
    $options = $defaults;
} else {
    $options = json_decode($options);
}

if (empty($options->country)) {
    $options->country = $defaults->country;
}
if (empty($options->sortBy)) {
    $options->sortBy = $defaults->sortBy;
}


?>

<p><?php echo _('Enter the text you want to display, choose its font size and alignment.'); ?></p>

<form id="newsapi_form">
    <fieldset>

        <label for="newsapi_show_sources"><?php echo _('Choose if you want to display the source.'); ?></label>
        <input type="checkbox"
               name="newsapi_show_sources"
               id="newsapi_show_sources"
            <?php print $options->showSources == true ? 'checked' : ''; ?>
        />

        <br/>

        <label for="newsapi_show_images"><?php echo _('Choose if you want to display images.'); ?></label>
        <input  type="checkbox"
                name="newsapi_show_images"
                id="newsapi_show_images"
            <?php print $options->showImages == true ? 'checked' : ''; ?>
        />
        <br/>

        <label for="newsapi_show_qrCodes"><?php echo _('Choose if you want to display qr codes.'); ?></label>
        <input  type="checkbox"
                name="newsapi_show_qrCodes"
                id="newsapi_show_qrCodes"
        <?php print $options->showQrCodes == true ? 'checked' : ''; ?>
        />
        <br/>

        <label for="newsapi_country"><?php echo _('Choose the origin of the news.'); ?></label>
        <select name="newsapi_country" id="newsapi_country">
            <?php
            foreach (['de', 'gb'] as $option) {
                if ($option === $options->country) {
                    print("<option selected value=\"$option\">". _($option));
                } else {
                    print("<option value=\"$option\">". _($option));
                }
            }
            ?>
        </select>

        <label for="newsapi_sortBy"><?php echo _('Sorting of the articles.'); ?></label>
        <select name="newsapi_sortBy" id="newsapi_sortBy">
            <?php
            foreach (['top', 'latest', 'popular'] as $option) {
                if ($option === $options->sortBy) {
                    print("<option selected value=\"$option\">". _($option));
                } else {
                    print("<option value=\"$option\">". _($option));
                }
            }
            ?>
        </select>

        <label for="newsapi_apiKey"><?php echo _('Insert your ApiKey:<br>(To retrieve an ApiKey register <a href="https://newsapi.org/register" target="_blank">here</a>)') ?></label>
        <input id="newsapi_apiKey" type="text"  name="newsapi_apiKey" value="<?php echo $apiKey; ?>" placeholder="" />

    </fieldset>

</form>

<!-- Disclaimer for free use -->
<p><a href="https://newsapi.org" target="_blank">Powered by newsapi.org</a></p>

<div class="block__add" id="text_field__edit">
	<button class="text-field__edit--button" href="#">
		<span><?php echo _('save'); ?></span>
	</button>
</div>
