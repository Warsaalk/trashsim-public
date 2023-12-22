<div ng-controller="MissingTechsController" class="missingtechs-controller popup-container">
    <div class="popup-shadow" ng-click="close()"></div>
    <div class="popup-content">
        <div class="popup-close" ng-click="close()">x <?= $__('close'); ?></div>
        <div id="missingtech-wrapper">
            <div id="missingtech-question">
                <h3><?= $__('home.missingtech.question.info', '{{$simulator.invalidFleetTechnologies.join(", ")}}'); ?></h3>
                <h3><?= $__('home.missingtech.question.title'); ?></h3>
                <div id="missingtech-complete-btn" class="btn btn-light" ng-click="stopAndComplete();"><?= $__('home.missingtech.question.complete'); ?></div>
                <div id="missingtech-reset-btn" class="btn btn-light" ng-click="continueAndFix();"><?= $__('home.missingtech.question.reset'); ?></div>
            </div>
        </div>
    </div>
</div>