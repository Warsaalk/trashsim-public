<?php
	use Plinth\Response\Response;
use Plinth\Common\Language;
	/* @var $self Response */;
	$route = $self->Main()->getRouter()->hasRoute() ? $self->Main()->getRouter()->getRoute() : false;
	$homeUrl = __APP_URL . $self->Main()->getRouter()->getRoute('page_home')->getPath(array('lang' => $self->Main()->getLang()));
	$keywords = array('ogame','gameforge','universeview','warsaalk','ogotcha','trashsim','combat simulator','simulator','websim','origin','websim','speedsim','ogame origin','osimulate','galaxy','battle simulator','combat simulator ogame','simulator','ogame simulator','ogame battle simulator','ogame combat simulator');

	$asseturl = parse_url($self->Main()->getSetting('assetpath'));
?>
		<base href="<?= __BASE_URL ?>" />
		<meta charset="UTF-8">
		<meta http-equiv="Content-type" content="text/html;charset=UTF-8">
		<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		<meta name="keywords" content="<?= implode(', ', $keywords); ?>">
		<meta name="description" content="<?= $__('page.description'); ?>">
		<meta name="theme-color" content="#1E2B39">

		<?php if (isset($asseturl['scheme']) && isset($asseturl['host'])) { ?>
			<link rel="preconnect" href="<?= $asseturl['scheme'] . '://' . $asseturl['host']; ?>">
		<?php } ?>
				
		<meta name="twitter:card" content="summary_large_image">
		<meta name="twitter:site" content="@universeviewapp">
		<meta name="twitter:creator" content="@universeviewapp">
		<meta name="twitter:title" content="<?= isset($shareTitle) ? $shareTitle : $__('social.title'); ?>">
		<meta name="twitter:description" content="<?= $__('social.description'); ?>">
		<meta name="twitter:image" content="<?= isset($shareImage) ? $self->getAsset($shareImage) : $self->getAsset('img/trashsim-social.jpg'); ?>">
		
		<meta property="og:title" content="<?= isset($shareTitle) ? $shareTitle : $__('social.title'); ?>" />
		<meta property="og:site_name" content="<?= $__("page.title") ?>"/>
		<meta property="og:url" content="<?= isset($sharePath) ? $sharePath : $homeUrl; ?>" />
		<meta property="og:description" content="<?= $__('social.description'); ?>" />
		<meta property="og:image" content="<?= isset($shareImage) ? $self->getAsset($shareImage) : $self->getAsset('img/trashsim-social.jpg'); ?>" />
		<meta property="fb:admins" content="1673447002" />
    	<meta property="fb:app_id" content="509284312564909" /> 
		
		<link rel="canonical" href="<?= $homeUrl; ?>">
		<link href='https://fonts.googleapis.com/css?family=Rajdhani:300,400&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
		<link href='https://fonts.googleapis.com/css?family=Yantramanav:400,300,100&subset=latin,latin-ext' rel='stylesheet' type='text/css'>
		<link rel="shortcut icon" type="image/png" href="<?= $self->getAsset('img/icon.png'); ?>" />
		
		<link rel="alternate" hreflang="x-default" href="<?= __BASE_URL ?>" />
		<?php foreach (Language::getLanguages() as $code) { 
			if ($route !== false && $route->getPathData('lang') === true) {
				$data = $route->getData();
				$data['lang'] = $code;
			?>
			<link rel="alternate" hreflang="<?= $code; ?>" href="<?= __BASE_URL . $route->getPath($data); ?>" />
			<?php } else { ?>
			<link rel="alternate" hreflang="<?= $code; ?>" href="<?= __BASE_URL . $code ?>" />
		<?php } } ?>
		
		<?= $self->getScriptTag('https://cdn.universeview.be/apps/apps-bar.js'); ?>
        <?= $self->getScriptTag('js/libs/entityInfo.js'); ?>
        <?= $self->getScriptTag('js/app-ag.js'); ?>
		<script async src="//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>

		<title><?= $__("page.title") . (isset($pageTitle) ? $pageTitle : ''); ?></title>
		<?= $self->getCssTag('css/app.css'); ?>

		<script type="text/javascript">
			//Define app context
			window.appContext = "trashsim";
			window[appContext] = {
			    initiated: false,
			    translations: <?= json_encode($__('javascript')); ?>,
                assetsBase: "<?= $self->getAsset('{path}'); ?>",
                API: {
                    player: "<?= $this->Main()->getRouter()->getRoute('api_player')->getPath(); ?>",
                    share: "<?= $this->Main()->getRouter()->getRoute('api_share')->getPath(); ?>",
                    shareData: "<?= $this->Main()->getRouter()->getRoute('api_share_data')->getPath(); ?>",
                    save: "<?= $this->Main()->getRouter()->getRoute('html_save')->getPath(); ?>",
                    missingTechnologies: "<?= $this->Main()->getRouter()->getRoute('html_missing_technologies')->getPath(); ?>",
                    ipm: "<?= $this->Main()->getRouter()->getRoute('html_ipm')->getPath(); ?>"
                },
                matomo: {
                    url: "<?= $self->Main()->config->get("matomo:url"); ?>",
                    siteID: 3
                }
			};
			window[appContext].ielegacy = false;
		</script>
		<!--[if IE]>
			<script type="text/javascript">
				window[appContext].ielegacy = true;
			</script>
		<![endif]-->