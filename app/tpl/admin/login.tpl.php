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
	<div class="page-element">
		<div class="login admin-box">
			<div class="login-form">
				<h3>Login</h3>
				<form action="<?= $self->Main()->getRouter()->getRoute('admin_page')->getPath(); ?>" method="post">
					<div class="info-wrapper"><?= $self->getTemplate('info'); ?></div>
					<input type="hidden" name="token" value="<?= $self->Main()->getToken('adminlogin'); ?>" />
					<div><label><span>E-mailadres</span> <input type="text" name="email" /></label></div>
					<div><label><span>Paswoord</span> <input type="password" name="password" /></label></div>
					<div><input type="submit" class="btn btn-light" value="Login" /></div>
				</form>
			</div>
		</div>
	</div>
</main>
<footer>
	<?= $self->getTemplate('footer'); ?>
</footer>
</body>
</html>