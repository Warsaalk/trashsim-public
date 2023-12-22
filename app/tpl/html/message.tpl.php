<div ng-controller="MessageController" ng-init='messages = <?= json_encode($errors, JSON_HEX_APOS); ?>' class="popup-controller popup-container">
    <div class="popup-shadow" ng-click="close()"></div>
    <div class="popup-content">
        <div class="popup-close" ng-click="close()">x <?= $__('close'); ?></div>
        <ul class="messages">
            <li ng-repeat="message in messages" class="message">
                <div class="message-content message-type-{{message.type}}"><span>{{message.content}}</span></div>
            </li>
        </ul>
    </div>
</div>
