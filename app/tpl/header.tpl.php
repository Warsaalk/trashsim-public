<?php
use Plinth\Common\Language;	
use Plinth\Response\Response;
/* @var $self Response */

	$socialShareUrl = __APP_URL . (isset($sharePath) ? $sharePath : $self->Main()->getRouter()->getRoute('page_home')->getPath(array('lang' => $self->Main()->getLang())));
?>
	<div id="header-links" class="clearfix">
		<div id="header-lang" class="clearfix" ng-controller="LanguageController">
			<!-- <?= $__('language'); ?> -->
            <div data-code="<?= $self->Main()->getLang(); ?>"></div>
			<ul><?php foreach (Language::getLanguages() as $code) { ?><li class="switch-lang<?= $self->Main()->getLang() == $code ? ' selected' : ''; ?>" ng-click="switch('<?= $code; ?>')" data-code="<?= $code; ?>">
			<span><?= $__('lang.' . $code); ?></span>
			</li><?php } ?></ul>	
		</div><div id="header-share" class="header-box">
			<ul class="clearfix">
				<li class="header-share-image"></li>
				<li>
					<a class="social-share fb btn-social-share" id="social-share-fb" target="_blank" href="https://www.facebook.com/dialog/share?app_id=509284312564909&display=popup&href=<?= urlencode($socialShareUrl); ?>&redirect_uri=<?= urlencode($socialShareUrl); ?>">&nbsp;</a>
				</li>
				<li>
					<a class="social-share tw btn-social-share" id="social-share-tw" target="_blank" href="https://twitter.com/intent/tweet?url=<?= urlencode($socialShareUrl); ?>">&nbsp;</a>
				</li>
			</ul>
		</div>
	</div>