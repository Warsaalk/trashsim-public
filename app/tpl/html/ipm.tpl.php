<div ng-controller="IpmController" class="ipm-controller popup-container">
    <div class="popup-shadow" ng-click="close()"></div>
    <div class="popup-content">
        <div class="popup-close" ng-click="close()">x <?= $__('close'); ?></div>
        <div id="ipm-wrapper">
            <h3><?= $__('home.ipm.title'); ?></h3>
            <div id="ipm-attacker">
                <h4><?= $__('home.ipm.attacker'); ?></h4>
                <div id="ipm-attacker-coordinates" class="clearfix">
                    <span><?= $__('home.player.coords'); ?></span>
                    <input type="number" min="1" ng-model="coordinates.galaxy" /> :
                    <input type="number" min="1" ng-model="coordinates.system" /> :
                    <input type="number" min="1" ng-model="coordinates.position" />
                </div>
                <div class="ipm-info clearfix"><?= $__('home.ipm.flighttime'); ?>: <span id="ipm-attacker-flight">{{flightTime ? (flightTime | formatDuration) + hourNotation : '&#8734;'}}</span></div>
                <div class="ipm-info clearfix"><?= $__('home.ipm.impulsedrive'); ?>: <span id="ipm-attacker-impulse">{{impulseDrive ? impulseDrive : '&#8734;'}}</span></div>
            </div>
            <div id="ipm-defender">
                <h4><?= $__('home.ipm.defence'); ?></h4>
                <ul>
                    <li ng-repeat="(type, count) in defence" class="clearfix">
                        <label class="clearfix">
                            {{$root.$__.entities[type]}}
                            <input ng-if="type == 407 || type == 408" ng-model="defence[type]" type="checkbox" class="entity-dome-checkbox entity-ipm" ng-true-value="1" ng-false-value="0" />
                            <input ng-if="type != 407 && type != 408" ng-model="defence[type]" min="0" type="number" class="entity-ipm" />
                            <span class="ipm-entity-losses" data-lost="0" data-remaining="0">{{defenceRemaining[type] | formatNumber:"/"}} &#8592; </span>
                        </label>
                        <label class="ipm-count clearfix">
                            <?= $__('home.ipm.abbreviation'); ?> (<?= $__('home.ipm.max'); ?>: <span class="ipm-max">{{IPMsMax[type] | formatNumber:"/"}}</span>)
                            <input min="0" type="number" ng-model="IPMs[type]" class="ipm-defence" />
                            <span class="arrow">&#8626;</span>
                        </label>
                    </li>
                </ul>
                <div class="ipm-info"><?= $__('home.ipm.total'); ?>: <span id="ipm-total">{{getTotal(IPMsMax) | formatNumber:"/"}}</span></div>
            </div>
            <div id="simulate-ipm-apply" class="btn btn-light" ng-click="applyDefence();"><?= $__('home.ipm.apply'); ?></div>
            <div class="ipm-result-table">
                <table>
                    <thead><tr><th colspan="2"><?= $__('home.ipm.defender.losses'); ?></th></tr></thead>
                    <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="ipm-result-defender-losses-metal">{{defenderLosses.metal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="ipm-result-defender-losses-crystal">{{defenderLosses.crystal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-deuterium"></div></td>
                            <td id="ipm-result-defender-losses-deuterium">{{defenderLosses.deuterium | formatNumber:"/"}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="ipm-result-defender-losses-total">{{defenderLosses.total | formatNumber:"/"}}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
            <div class="ipm-result-table">
                <table>
                    <thead><tr><th colspan="2"><?= $__('home.ipm.attacker.costs'); ?></th></tr></thead>
                    <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="ipm-result-attacker-costs-metal">{{attackerCosts.metal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="ipm-result-attacker-costs-crystal">{{attackerCosts.crystal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-deuterium"></div></td>
                            <td id="ipm-result-attacker-costs-deuterium">{{attackerCosts.deuterium | formatNumber:"/"}}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="ipm-result-attacker-costs-total">{{attackerCosts.total | formatNumber:"/"}}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    </div>
</div>