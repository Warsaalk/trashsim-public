<?php
/* @var $this \Plinth\Response\Response */

$request = $this->Main()->getRequest();
$validator = $this->Main()->getValidator();

if ($validator->isValid() && !$request->hasErrors() && isset($id)) {
	header(\Plinth\Response\Response::CODE_201);
?>
<div ng-controller="ShareController" ng-init='shareLink = "<?= __APP_URL . $this->Main()->getRouter()->getRoute("page_home")->getPath(); ?>?SHARE=<?= $id; ?>"' class="share-controller popup-container">
    <div class="popup-shadow" ng-click="close()"></div>
    <div class="popup-content">
        <div class="popup-close" ng-click="close()">x <?= $__('close'); ?></div>
        <h2><?= $__('share.title'); ?></h2>
        <div class="share-link">{{shareLink}}</div>
        <div class="share-actions">
            <div class="share-copy-state" ng-if="copyState == 1"><?= $__('share.copy.success'); ?></div>
            <div class="share-copy-state" ng-if="copyState == 2"><?= $__('share.copy.failed'); ?></div>
            <div class="share-copy-state" ng-if="copyState == 3"><?= $__('share.copy.notsupported'); ?></div>
            <div class="share-action-copy btn btn-light" ng-click="copyShareLink()"><?= $__('share.action.copy'); ?></div>
        </div>
        <div class="share-link-expiration"><?= $__('share.expiration'); ?></div>
    </div>
</div>
<?php
} else {
	print $this->getTemplate("html/message", ["errors" => $request->getErrors()]);
}