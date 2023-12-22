<?php 
use Plinth\Response\Response;
/* @var $self Response */
?> 
		<nav id="nav-bottom">
			<ul class="clearfix">
				<li><a href="<?= $self->Main()->getRouter()->getRoute('page_userprojects')->getPath(array('lang'=>$self->Main()->getLang())); ?>"><?= $__('footer.nav.userprojects'); ?></a></li>
				<li><a href="<?= $self->Main()->getRouter()->getRoute('page_contributors')->getPath(array('lang'=>$self->Main()->getLang())); ?>"><?= $__('footer.nav.contribute'); ?></a></li>
				<li><a href="https://board.en.ogame.gameforge.com/index.php?thread/771533-trashsim-ogame-combat-simulator/" class="help-feedback" target="_blank"><?= $__('footer.nav.support'); ?></a></li>
				<li><a href="https://board.en.ogame.gameforge.com/index.php?thread/771533-trashsim-ogame-combat-simulator/" class="help-translate" target="_blank"><?= $__('footer.nav.translate'); ?></a></li>
				<li><a href="https://www.facebook.com/trashsim" id="footer-facebook-page" target="_blank">Facebook</a></li>
                <li><a href="https://universeview.be/privacy" target="_blank">Privacy Policy</a></li>
                <li><a href="https://universeview.be/cookies" target="_blank">Cookie Policy</a></li>
			</ul>
		</nav>
		<div id="copy">
			&copy; 2015 - <a href="https://klaas.cc/" target="_blank">Klaas Van Parys</a> | <?= $__('footer.powered', 'UniverseView Apps'); ?> | <?= $__('footer.for', '<a href="http://en.ogame.gameforge.com/" target="_blank"><img src="'. $self->getAsset('img/ogame-logo.png') .'"></a>'); ?>
		</div>
		<div style="margin-top: 20px;">
			<form id="paypal-donate" action="https://www.paypal.com/cgi-bin/webscr" target="_blank" method="post" target="_top">
				<input type="hidden" name="cmd" value="_s-xclick">
				<input type="hidden" name="hosted_button_id" value="7RTZCMJ4Y2PK4">
                <input type="submit" value="Donate" class="btn btn-light btn-donate" />
			</form>
		</div>
		<?= $self->getScriptTag('js/app.js'); ?>
		<script>
			if (window[appContext].initiated === false && !/notsupported/.test(window.location.pathname)) {
                window.location.href = document.querySelector('html').getAttribute('lang') + '/notsupported';
            }
		</script>
		<script>
            if (void 0 !== window.UniverseViewApps &&
                "function" === typeof window.UniverseViewApps.getCookieConsent &&
                window.UniverseViewApps.getCookieConsent() !== null &&
                window.UniverseViewApps.getCookieConsent().accepted !== false) {
                /*let ads = document.querySelectorAll('.adsbygoogle');
                for (let i=0, il=ads.length; i<il; i++) {
                    (adsbygoogle = window.adsbygoogle || []).push({});
                }*/
            }
		</script>