<?php
	use Plinth\Response\Response;
	use Plinth\Routing\Route;
	/* @var $self Response */
	
	$language = $self->Main()->getRouter()->getRoute()->get(Route::DATA_LANG);
?>
<!doctype html>
<html lang="<?= $self->Main()->getLang(); ?>" prefix="og: http://ogp.me/ns#" ng-app="trashSimApp">
    <head>
        <?= $self->getTemplate('head'); ?>
		<?= $self->getCssTag('css/app-admin.css'); ?>
		<?= $self->getScriptTag('js/vue.js'); ?>
        <script>let adminApp = {};</script>
    </head>
	<body <?= $language === false ? 'class="default-language"' : ''; ?> data-version="<?= $self->Main()->config->get('assets:version'); ?>" id="admin">
		<section id="popup"></section>
	   	<header>
	    	<?= $self->getTemplate('header'); ?>
	   	</header>
	   	<main>
			<section id="info">       
		    	<?= $self->getTemplate('info'); ?>
		   	</section>
	      	<div id="admin-app" class="page-element">
            	<?= $self->content; ?>
          	</div>
       	</main>
        <footer>
			<?= $self->getTemplate('footer'); ?>
			<?= $self->getScriptTag('js/app-admin.js'); ?>
            <script>
				const entityInfo = entityInfoV7;

				adminApp.init({
                    locale: "en-US",
					assets: "<?= $self->Main()->settings->getSetting("assetpath"); ?>",
					version: "<?= $self->Main()->config->get('assets:version'); ?>",
                    ogotcha: "<?= $self->Main()->config->get('ogotcha:api'); ?>"
				});
            </script>
		</footer>		
    </body>
</html>
