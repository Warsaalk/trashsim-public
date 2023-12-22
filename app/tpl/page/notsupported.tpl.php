<?php
use Plinth\Common\Message;
use Plinth\Response\Response;
/* @var $self Response */

$this->Main()->addMessage(new Message('Welcome to TrashSim version 2.0, please report bugs here: <a href="https://board.en.ogame.gameforge.com/index.php?thread/771533-trashsim-ogame-combat-simulator/" target="_blank" style="color: #000;">OGame Origin</a>, the old version is still available here for a limited time only: <a href="https://v1.trashsim.universeview.be/" target="_blank" style="color: #000;">TrashSim v1</a>', Message::TYPE_WARNING));

?> 
	<div id="notsupported">
	    <h3><?= $__('notsupported.title'); ?></h3>
    </div>