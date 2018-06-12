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
$defaults->numDataToDisplay = 3;
$defaults->displayTime = 10;

$sortByOptions = ['top', 'latest', 'popular'];
$countries = ['ar', 'au', 'at', 'be', 'br', 'bg', 'ca', 'cn', 'co', 'cu', 'cz', 'eg', 'fr', 'de', 'gr', 'hk', 'hu', 'in', 'id', 'ie', 'il', 'it', 'jp', 'lv', 'lt', 'my', 'mx', 'ma', 'nl', 'nz', 'ng', 'no', 'ph', 'pl', 'ro', 'ru', 'sa', 'rs', 'sg', 'sk', 'si', 'za', 'kr', 'se', 'ch', 'tw', 'th', 'tr', 'ae', 'us', 'gb', 'us', 've'];
sort($countries, SORT_STRING);

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
if (empty($options->numDataToDisplay)) {
    $options->numDataToDisplay = $defaults->numDataToDisplay;
}
if (empty($options->displayTime)) {
    $options->displayTime = $defaults->displayTime;
}


?>

<p><?php echo _('Enter the text you want to display, choose its font size and alignment.'); ?></p>

<form id="newsapi_form">

    <fieldset>
        <label for="newsapi_apiKey"><?php echo _('Insert your ApiKey:<br>(To generate an ApiKey register <a href="https://newsapi.org/register" target="_blank">here</a>)') ?></label>
        <input id="newsapi_apiKey" type="text"  name="newsapi_apiKey" value="<?php echo $apiKey; ?>" placeholder="" />

        <label for="newsapi_show_sources"><?php echo _('Show sources'); ?></label>
        <input type="checkbox"
               name="newsapi_show_sources"
               id="newsapi_show_sources"
            <?php print $options->showSources == true ? 'checked' : ''; ?>
        />

        <br/>

        <label for="newsapi_show_images"><?php echo _('Show images'); ?></label>
        <input  type="checkbox"
                name="newsapi_show_images"
                id="newsapi_show_images"
            <?php print $options->showImages == true ? 'checked' : ''; ?>
        />
        <br/>

        <label for="newsapi_show_qrCodes"><?php echo _('Show Qr-Codes'); ?></label>
        <input  type="checkbox"
                name="newsapi_show_qrCodes"
                id="newsapi_show_qrCodes"
        <?php print $options->showQrCodes == true ? 'checked' : ''; ?>
        />
        <br/>

        <label for="newsapi_country"><?php echo _('Origin of the news'); ?></label>
        <select name="newsapi_country" id="newsapi_country">
            <?php
            foreach ($countries as $option) {
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
            foreach ($sortByOptions as $option) {
                if ($option === $options->sortBy) {
                    print("<option selected value=\"$option\">". _($option));
                } else {
                    print("<option value=\"$option\">". _($option));
                }
            }
            ?>
        </select>

        <label for="newsapi_num_articles"><?php echo _('Set the number of displayed articles.'); ?></label>
        <input type="number"
               name="newsapi_num_articles"
               id="newsapi_num_articles"
               step="1"
               min="1"
               max="20"
               value="<?php print $options->numDataToDisplay; ?>"
        />

        <label for="newsapi_display_time"><?php echo _('Set how many seconds the articles will be displayed.'); ?></label>
        <input type="number"
               name="newsapi_display_time"
               id="newsapi_display_time"
               step="1"
               min="1"
               max="3600"
               value="<?php print $options->displayTime; ?>"
        />


    </fieldset>

</form>

<!-- Disclaimer for free use -->
<p><a href="https://newsapi.org" target="_blank">Powered by newsapi.org</a></p>

<div class="block__add" id="newsapi__edit">
	<button class="newsapi__edit--button" href="#">
		<span><?php echo _('save'); ?></span>
	</button>
</div>
