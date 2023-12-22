<?php
/** @var $this \Plinth\Response\Response */
if ($this->Main()->hasMessages()) {
    foreach ($this->Main()->getMessages() as $i => $message) {
?>
    <div class="message">
        <div class="message-type-<?= $message->getType(); ?> message-content clearfix">
            <span><?= $message->getContent(); ?></span>
            <div class="close-message" onclick="this.parentNode.parentNode.style.height=0;this.parentNode.parentNode.style.margin=0;">x</div>
        </div>
    </div>
<?php } } ?>