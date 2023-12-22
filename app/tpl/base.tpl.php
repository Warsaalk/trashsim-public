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
    </head>
	<body <?= $language === false ? 'class="default-language"' : ''; ?> data-version="<?= $self->Main()->config->get('assets:version'); ?>">
        <img src="<?= $self->Main()->config->get("matomo:url"); ?>?idsite=3&amp;rec=1" style="border:0;position:absolute;z-index:0;top:0;left:0;" alt="" />
		<section id="popup"></section>
	   	<header>
	    	<?= $self->getTemplate('header'); ?>	
	   	</header>
	   	<main>
			<section id="info">       
		    	<?= $self->getTemplate('info'); ?>
		   	</section>
	      	<div id="<?= str_replace('/', '-', $self->Main()->getRouter()->getRoute()->getTemplate()); ?>" class="page-element">
	      		<?= $self->getTemplate('title'); ?>
            	<?= $self->content; ?>
          	</div>
       	</main>
        <footer>
			<?= $self->getTemplate('footer'); ?>
		</footer>		
    </body>
</html>
