<?php 
use Plinth\Response\Response;
/* @var $self Response */
?>
    <div id="trashsim-title-wrapper">
        <h1 id="trashsim-title" class="title">
            <a href="<?= $self->Main()->getRouter()->getRoute('page_home')->getPath(array('lang'=>$self->Main()->getLang())); ?>">
                <?= $__("home.title"); ?>
            </a>
        </h1>
        <div id="trashsim-menu" class="clearfix">
            <ul>
                <li><a target="_blank" id="help-feedback" class="help-feedback" href="https://board.en.ogame.gameforge.com/index.php?thread/771533-trashsim-ogame-combat-simulator/">&#8627; <?= $__('help.feedback'); ?></a></li>
                <li><a target="_blank" id="help-translate" class="help-translate" href="https://board.en.ogame.gameforge.com/index.php?thread/771533-trashsim-ogame-combat-simulator/">&#182; <?= $__('help.translator'); ?></a></li>
                <li><a id="menu-ogotcha" href="https://ogotcha.universeview.be/" target="blank">&#9878; OGotcha</a></li>
            </ul>
        </div>
        <div id="trashsim-top-ad">
			<a class="ai-collective" href="https://aicollective.art" target="_blank"></a>
			<!--
            <div class="adsense-title"><span id="home-bottom-add-title" title="These ads are used to pay my hosting costs to give you a better user experience. Please do not block them :)">Ad - why?</span></div>
            <ins class="adsbygoogle"
                 style="display:block"
                 data-ad-client="ca-pub-1333463440710655"
                 data-ad-slot="1735658890"
                 data-ad-format="horizontal"
                 data-full-width-responsive="true"></ins>
                 -->
        </div>
    </div>