<?php 
use Plinth\Response\Response;
/* @var $self Response */

$self->addData('pageTitle', ' - ' . $__('contributors.title'));
?> 
	<div id="contributors">
	    <h2><?= $__('contributors.title'); ?></h2>
        <div class="contributors-block">
            <h3><?= $__('contributors.specialthanks'); ?></h3>
            <ul>
                <li>Parsec</li>
                <li>NoMoreAngel</li>
            </ul>
        </div>
        <div class="contributors-block">
            <h3><?= $__('contributors.testers'); ?></h3>
            <ul>
                <li>Mostaris</li>
                <li>dboxer</li>
                <li>BlackBEERd</li>
                <li>BrokenJade</li>
                <li>DrKill20ften</li>
            </ul>
        </div>
	    <div class="contributors-block">
		    <h3><?= $__('contributors.translators'); ?></h3>
		    <ul>
		    	<li><img src="<?= $self->getAsset('img/flags/en.png'); ?>"> Warsaalk</li>
		    	<li><img src="<?= $self->getAsset('img/flags/nl.png'); ?>"> Warsaalk</li>
		    	<li><img src="<?= $self->getAsset('img/flags/de.png'); ?>"> NoMoreAngel, swizzor</li>
		    	<li><img src="<?= $self->getAsset('img/flags/es.png'); ?>"> Kang, Minion</li>
		    	<li><img src="<?= $self->getAsset('img/flags/hr.png'); ?>"> APW</li>
		    	<li><img src="<?= $self->getAsset('img/flags/it.png'); ?>"> BlackStorm</li>
		    	<li><img src="<?= $self->getAsset('img/flags/hu.png'); ?>"> Boostocska, Peti</li>
		    	<li><img src="<?= $self->getAsset('img/flags/pt.png'); ?>"> Elcap</li>
		    	<li><img src="<?= $self->getAsset('img/flags/sv.png'); ?>"> Henke</li>
		    	<li><img src="<?= $self->getAsset('img/flags/tr.png'); ?>"> HyperX, GameMaster, Snowbros</li>
		    	<li><img src="<?= $self->getAsset('img/flags/ko.png'); ?>"> Antis</li>
		    	<li><img src="<?= $self->getAsset('img/flags/pt-BR.png'); ?>"> RamonXD</li>
		    	<li><img src="<?= $self->getAsset('img/flags/da.png'); ?>"> ErikFyr</li>
		    	<li><img src="<?= $self->getAsset('img/flags/pl.png'); ?>"> joniewim</li>
		    	<li><img src="<?= $self->getAsset('img/flags/cs.png'); ?>"> EscaperCZ</li>
				<li><img src="<?= $self->getAsset('img/flags/fr.png'); ?>"> gogo</li>
				<li><img src="<?= $self->getAsset('img/flags/ro.png'); ?>"> Virian</li>
				<li><img src="<?= $self->getAsset('img/flags/ru.png'); ?>"> VL[AD], Tzachitx, Cycluk</li>
				<li><img src="<?= $self->getAsset('img/flags/el.png'); ?>"> Johanna, Mumra</li>
		    </ul>
	    </div>
    </div>