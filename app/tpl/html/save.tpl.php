<div ng-controller="SaveController" class="save-controller popup-container">
    <div class="popup-shadow" ng-click="close()"></div>
    <div class="popup-content">
        <div class="popup-close" ng-click="close()">x <?= $__('close'); ?></div>
        <div id="save-wrapper">
            <div id="save-list" ng-class="{'selected': selectedSave != null}" ng-if="tab == 0">
                <h2><?= $__('home.save.list.title'); ?></h2>
                <div ng-if="hasSaves()" id="save-select"><span>&#8624;</span> <?= $__('home.save.list.select'); ?></div>
                <ul>
                    <li class="clearfix" ng-repeat="(key, data) in saves">
                        <input type="radio" name="saved-data" ng-model="defaultSave" ng-value="key" ng-click="setDefault(key)">
                        <span class="clearfix" ng-click="select(key)" ng-class="{'selected': selectedSave == key}">{{key}}<div class="remove" ng-click="remove(key)">x</div></span>
                    </li>
                    <li ng-if="!hasSaves()"><?= $__('home.save.empty'); ?></li>
                </ul>
                <div ng-if="hasSaves()" id="save-default"><span>&#8625;</span> <?= $__('home.save.list.default'); ?> <div id="save-default-reset" ng-if="defaultSave" ng-click="clearDefault()" class="btn btn-light"><?= $__('home.save.list.reset'); ?></div></div>
                <div ng-if="hasSaves()" class="clearfix">
                    <div id="save-override" class="btn btn-light" ng-click="save()"><?= $__('home.save.save'); ?></div>
                    <div id="save-load" class="btn btn-light" ng-click="load()"><?= $__('home.save.list.load'); ?></div>
                </div>
                <div id="save-new-btn" class="btn btn-light" ng-click="selectTab(1)"><?= $__('home.save.list.new'); ?></div>
            </div>
            <div id="save-new-wrapper" ng-if="tab == 1 || tab == 2">
                <h2 ng-if="tab == 1"><?= $__('home.save.new.title'); ?></h2>
                <h2 ng-if="tab == 2"><?= $__('home.save.update.title'); ?></h2>
                <p><label><?= $__('home.save.new.name'); ?>: <input id="save-name" type="text" ng-model="new.label"></label></p>
                <div class="message message-small" ng-if="new.error"><div class="error message-content message-type-8 clearfix"><span><?= $__('home.save.new.error'); ?></span></div></div>
                <p ng-if="tab == 1"><label><input type="checkbox" id="save-default-new" ng-model="new.default" ng-true-value="true" ng-false-value="false"> <?= $__('home.save.new.default'); ?></label></p>
                <h3><?= $__('home.save.question'); ?></h3>
                <ul>
                    <li><label><input type="checkbox" ng-model="new.parts.attackers" ng-true-value="true" ng-false-value="false" /> <?= $__('home.save.question.attackers'); ?></label></li>
                    <li><label><input type="checkbox" ng-model="new.parts.defenders" ng-true-value="true" ng-false-value="false" /> <?= $__('home.save.question.defenders'); ?></label></li>
                    <li><label><input type="checkbox" ng-model="new.parts.settings" ng-true-value="true" ng-false-value="false" /> <?= $__('home.save.question.settings'); ?></label></li>
                </ul>
                <div id="save-new" class="btn btn-light" ng-class="{'active': newSaveValid()}" ng-click="newSave()"><?= $__('home.save.save'); ?></div>
                <div id="save-cancel" class="btn btn-light" ng-click="selectTab(0); resetNew();"><?= $__('home.cancel'); ?></div>
            </div>
        </div>
    </div>
</div>