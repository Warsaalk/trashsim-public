<?php
use Plinth\Common\Message;
/* @var $this \Plinth\Response\Response */

	$ships = array(202,203,204,205,206,207,208,209,210,211,212,213,214,215);
	$defence = array(401,402,403,404,405,406,407,408,502);
	
	//$this->Main()->addMessage(new Message('The version is still in its beta phase and may still contain some bugs. Please double check your result on <a target="_blank" href="https://trashsim.universeview.be">the current version of TrashSim</a>. Report bugs here: <a href="https://bitbucket.org/Warsaalk/trashsim/issues" target="_blank">issue tracker</a>', Message::TYPE_WARNING));
    //$this->Main()->addMessage(new Message('This version supports OGame version 7.0.0, enable it via the "Version 7 (Player classes)" setting. Please report bugs here: <a href="https://board.en.ogame.gameforge.com/index.php?thread/771533-trashsim-ogame-combat-simulator/" target="_blank" style="color: #000;">OGame board</a>', Message::TYPE_INFO));
?>
<div ng-controller="SimulatorController as simulator" class="controller-simulator" ng-class="{aMostarisSpecial: aMostarisSpecial}">
	<form id="simulate-form" ng-cloak>
		<div id="parties" class="clearfix">
			<div ng-repeat="(title, party) in parties" class="party-column">
				<h3>{{$__[party.title]}}<span id="live-retreat-attacker" class="live-retreat" title="<?= $__('home.result.retreat'); ?>">{{globals.tacticalRetreat[title]}}</span></h3>
				<div class="party-selection top-content">
					<ul class="list clearfix">
                        <li ng-repeat="fleet in party.fleets" ng-class="{selected: party.activeFleet == fleet, invalid: fleet.hasMissingTechs() && simulationsTriggered > 0, warning: fleet.hasHighTechs()}" ng-click="party.selectFleet(fleet)">{{party.label + ($index + 1)}}</li><li class="add-player" ng-click="party.addFleet(); fireButtonClick('add player')">+</li>
                    </ul>
				</div>
				<div class="content" ng-if="party.activeFleet != null">
                    <div class="remove-player btn-close" ng-if="!party.activeFleet.defence && party.fleets.length > 1" ng-click="party.removeActiveFleet(); fireButtonClick('remove player')">x</div>
                    <div class="party-api-wrapper">
                        <label class="clearfix">API: <input type="text" ng-model="party.activeFleet.API" class="input-sr-key" /></label>
                        <div class="party-api-load btn btn-light" ng-click="loadPlayerDataViaAPI(party); fireButtonClick('load spy report ' + party.title + ' ' + party.getActiveFleetIndex())"><?= $__('home.player.api.load'); ?></div>
                    </div>
                    <div class="player-classes" ng-if="settings.characterClassesEnabled">
                        <h4><?= $__('home.player.class.title'); ?></h4>
                        <ul class="player-class-selection"><li class="player-class-none" ng-class="{selected: party.activeFleet.class == null}">
                                <label>
                                    <span><?= $__('home.player.class.none'); ?></span>
                                    <input type="radio" ng-model="party.activeFleet.class" ng-value="null" />
                                </label>
                            </li><li class="player-class-collector" ng-class="{selected: party.activeFleet.class == 'collector'}">
                                <label>
                                    <span><?= $__('home.player.class.collector'); ?></span>
                                    <input type="radio" ng-model="party.activeFleet.class" value="collector" />
                                </label>
                            </li><li class="player-class-general" ng-class="{selected: party.activeFleet.class == 'general'}">
                                <label>
                                    <span><?= $__('home.player.class.general'); ?></span>
                                    <input type="radio" ng-model="party.activeFleet.class" value="general" />
                                </label>
                            </li><li class="player-class-discoverer" ng-class="{selected: party.activeFleet.class == 'discoverer'}">
                                <label>
                                    <span><?= $__('home.player.class.discoverer'); ?></span>
                                    <input type="radio" ng-model="party.activeFleet.class" value="discoverer" />
                                </label>
                            </li></ul>
                    </div>
                    <div class="player-techs-wrapper">
                        <div class="player-techs">
                            <h4><?= $__('home.player.techs.combat'); ?></h4>
                            <ul class="simulate-values">
                                <li class="clearfix"><label><span class="label-text"><?= $__('home.player.techs.weapon'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.techs.weapon" ng-class="{invalid: party.activeFleet.techs.weapon === null && simulationsTriggered > 0, warning: party.activeFleet.techs.weapon >= 100}" min="0" /></label></li>
                                <li class="clearfix"><label><span class="label-text"><?= $__('home.player.techs.shield'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.techs.shield" ng-class="{invalid: party.activeFleet.techs.shield === null && simulationsTriggered > 0, warning: party.activeFleet.techs.shield >= 100}" min="0" /></label></li>
                                <li class="clearfix"><label><span class="label-text"><?= $__('home.player.techs.armour'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.techs.armour" ng-class="{invalid: party.activeFleet.techs.armour === null && simulationsTriggered > 0, warning: party.activeFleet.techs.armour >= 100}" min="0" /></label></li>
                            </ul>
                        </div>
                        <div class="player-techs" ng-show="!party.activeFleet.defence">
                            <h4><?= $__('home.player.techs.drives'); ?></h4>
                            <ul class="simulate-values">
                                <li class="clearfix"><label><span class="label-text"><?= $__('home.player.techs.combustion'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.techs.combustion" ng-class="{invalid: party.activeFleet.techs.combustion === null && simulationsTriggered > 0, warning: party.activeFleet.techs.combustion >= 100}" min="0" /></label></li>
                                <li class="clearfix"><label><span class="label-text"><?= $__('home.player.techs.impulse'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.techs.impulse" ng-class="{invalid: party.activeFleet.techs.impulse === null && simulationsTriggered > 0, warning: party.activeFleet.techs.impulse >= 100}" min="0" /></label></li>
                                <li class="clearfix"><label><span class="label-text"><?= $__('home.player.techs.hyperspace'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.techs.hyperspace" ng-class="{invalid: party.activeFleet.techs.hyperspace === null && simulationsTriggered > 0, warning: party.activeFleet.techs.hyperspace >= 100}" min="0" /></label></li>
                            </ul>
                        </div>
                        <div class="player-techs player-techs-hyper">
                            <ul class="simulate-values">
                                <li class="clearfix">
                                    <label><span class="label-text"><?= $__('home.player.techs.hyperspacetech'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.techs.hyperspacetech" ng-class="{invalid: party.activeFleet.techs.hyperspacetech === null && simulationsTriggered > 0, warning: party.activeFleet.techs.hyperspacetech >= 100}" min="0" /></label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <h4><?= $__('home.player.ships'); ?></h4>
                    <ul class="simulate-values">
                        <li ng-repeat="(type, count) in party.activeFleet.ships" class="clearfix">
                            <label ng-if="type != 212 && type != 217 && !(!settings.characterClassesEnabled && (type == 218 || type == 219))"><span class="label-text">{{$__.entities[type]}}</span>
                                <span ng-if="result != null && party.activeFleet.ships[type] > 0" ng-class="{'entity-remaining': true, 'custom-case': result.activeCase != 'average'}">{{ getRemainingEntitiesForPartyFleet(party, party.activeFleet, type) | formatNumber }} ← </span>
                                <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="party.activeFleet.ships[type]" min="0" />
                            </label>
                        </li>
                    </ul>
                    <div class="player-coordinates">
                        <h4 class="clearfix"><?= $__('home.player.coords'); ?>
                            <div>
                                <input type="number" ng-keyup="simulateOnEnter($event)" min="1" ng-model="party.activeFleet.coordinates.galaxy" /> :
                                <input type="number" ng-keyup="simulateOnEnter($event)" min="1" ng-model="party.activeFleet.coordinates.system" /> :
                                <input type="number" ng-keyup="simulateOnEnter($event)" min="1" ng-model="party.activeFleet.coordinates.position" />
                            </div>
                        </h4>
                        <h4 class="clearfix"><?= $__('home.player.speed'); ?>
                            <div ng-if="party.activeFleet.defence">
                                <select disabled="disabled"><option>-</option></select>
                            </div><div ng-if="!party.activeFleet.defence">
                            <select ng-model="party.activeFleet.speed">
                                <option ng-repeat="option in party.activeFleet.speedOptions" ng-value="option">{{option}}%</option>
                            </select>
                        </div></h4>
                        <div class="clearfix player-flight-data">
                            <?= $__('home.player.flighttime'); ?> <span ng-init="hourNotation = '<?= $__('home.player.flighttime.hours'); ?>'">{{globals.flightData[title].flightTime != false ? (globals.flightData[title].flightTime | formatDuration) + hourNotation : '-'}}</span>
                        </div>
                        <div class="clearfix player-flight-data">
                            <?= $__('home.player.consumption'); ?> <span>{{globals.flightData[title].fuelConsumption != false ? (globals.flightData[title].fuelConsumption | formatNumber) : '-'}}</span>
                        </div>
                        <div class="clearfix player-flight-data">
							<?= $__('home.player.cargocapacity'); ?> <span>{{party.activeFleet.getCargoCapacity(settings) | formatNumber:"-"}}</span>
                        </div>
                    </div>
                    <div class="player-bottom-actions">
                        <div class="clear-player btn btn-light" ng-click="party.clearActiveFleet(); fireButtonClick('clear player')"><?= $__('home.player.clear'); ?></div>
                        <div class="clear-player btn btn-light" ng-click="party.clearActiveFleetEntities(); fireButtonClick('clear player fleet')"><?= $__('home.player.clear.entities'); ?></div>
                    </div>
				</div>
			</div>
			<div id="planet-settings-column" class="party-column clearfix">
				<div class="top-content">
					<div id="simulate-button" class="btn btn-light" ng-click="simulate('top')"><?= $__('home.simulate'); ?></div>
                    <div id="share-button" class="btn btn-light btn-top" ng-click="share()"></div>
					<div id="save-button" class="btn btn-light btn-top" ng-click="save()"></div>
				</div>
				<div id="planet-column" class="inner-column" ng-if="parties.defenders">
					<div class="content">
						<div id="ipm-simulate" ng-click="ipm()"><div id="ipm-simulate-tooltip"><?= $__('home.ipm.tooltip'); ?></div></div>
						<h3><?= $__('home.planet.title'); ?></h3>
						<div id="defender-0-defence">
							<h4><?= $__('home.planet.resources'); ?></h4>
							<div class="clearfix">
								<div class="planet-resource">
									<label><span class="label-text"><?= $__('home.planet.resources.metal'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" min="0" ng-model="parties.defenders.fleets[0].resources.metal" /></label>
								</div>
								<div class="planet-resource">
									<label><span class="label-text"><?= $__('home.planet.resources.crystal'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" min="0" ng-model="parties.defenders.fleets[0].resources.crystal" /></label>
								</div>
								<div class="planet-resource">
									<label><span class="label-text"><?= $__('home.planet.resources.deuterium'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" min="0" ng-model="parties.defenders.fleets[0].resources.deuterium" /></label>
								</div>
							</div>
							<h4><?= $__('home.planet.defence'); ?></h4>
							<ul class="simulate-values">
                                <li class="clearfix" ng-repeat="(type, count) in parties.defenders.fleets[0].defence">
                                    <label><span class="label-text">{{$__.entities[type]}}</span>
                                        <span ng-if="result != null && parties.defenders.fleets[0].defence[type] > 0 && type != 502" ng-class="{'entity-remaining': true, 'custom-case': result.activeCase != 'average'}">{{ getRemainingEntitiesForPartyFleet(parties.defenders, parties.defenders.fleets[0], type) | formatNumber }} ← </span>
                                        <input ng-if="type == 407 || type == 408" ng-model="parties.defenders.fleets[0].defence[type]" type="checkbox" class="entity-dome-checkbox entity-ipm" ng-true-value="1" ng-false-value="0" />
                                        <input ng-if="type != 407 && type != 408" ng-model="parties.defenders.fleets[0].defence[type]" min="0" type="number" ng-keyup="simulateOnEnter($event)" class="entity-ipm" />
                                    </label>
                                </li>
                                <li class="clearfix">
                                    <label><span class="label-text">{{$__.entities[212]}}</span>
                                        <span ng-if="result != null && parties.defenders.fleets[0].ships[212] > 0" ng-class="{'entity-remaining': true, 'custom-case': result.activeCase != 'average'}">{{ getRemainingEntitiesForPartyFleet(parties.defenders, parties.defenders.fleets[0], 212) | formatNumber }} ← </span>
                                        <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="parties.defenders.fleets[0].ships[212]" min="0" />
                                    </label>
                                </li>
                                <li class="clearfix" ng-if="settings.characterClassesEnabled">
                                    <label><span class="label-text">{{$__.entities[217]}}</span>
                                        <span ng-if="result != null && parties.defenders.fleets[0].ships[217] > 0" ng-class="{'entity-remaining': true, 'custom-case': result.activeCase != 'average'}">{{ getRemainingEntitiesForPartyFleet(parties.defenders, parties.defenders.fleets[0], 217) | formatNumber }} ← </span>
                                        <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="parties.defenders.fleets[0].ships[217]" min="0" />
                                    </label>
                                </li>
								<li class="clearfix">
									<label><span class="label-text"><?= $__('home.planet.engineer'); ?></span>
										<input ng-model="parties.defenders.fleets[0].engineer" type="checkbox" />
									</label>
								</li>	
							</ul>
						</div>
					</div>
				</div>
				<div id="settings-column" class="inner-column">
					<div class="content">
						<h3 class="settings-title"><?= $__('home.settings.title'); ?> <span class="settings-expand btn btn-light" ng-if="settings.characterClassesEnabled" ng-click="toggleSettings()">{{expandSettings?"<?= $__('home.settings.collapse'); ?>":"<?= $__('home.settings.expand'); ?>"}}</span></h3>
						<ul class="simulate-values">
							<li class="clearfix"><label><span class="label-text"><?= $__('home.settings.simulations'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.simulations" min="0" /></label></li>
							<li class="clearfix"><label><span class="label-text"><?= $__('home.settings.plunder'); ?></span> <select ng-model="settings.plunder">
								<option ng-repeat="option in settings.plunderOptions" ng-value="option">{{option}}%</option>
							</select></label></li>
							<li class="clearfix"><label><span class="label-text"><?= $__('home.settings.fleetspeed'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.fleetSpeed" min="0"></label></li>
							<li class="clearfix" ng-if="expandSettings || !settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.rapidfire'); ?></span> <input type="checkbox" ng-model="settings.rapidFire"></label></li>
							<li class="clearfix"><label><span class="label-text"><?= $__('home.settings.fleetdebris'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.fleetDebris" min="0" max="100"></label></li>
							<li class="clearfix"><label><span class="label-text"><?= $__('home.settings.defencedebris'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.defenceDebris" min="0" max="100"></label></li>
							<li class="clearfix" ng-if="expandSettings || !settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.defencerepair'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.defenceRepair" min="0" max="100"></label></li>
							<li class="clearfix" ng-if="expandSettings || !settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.donutgalaxy'); ?></span> <input type="checkbox" ng-model="settings.donutGalaxy"></label></li>
							<li class="clearfix" ng-if="expandSettings || !settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.donutsystem'); ?></span> <input type="checkbox" ng-model="settings.donutSystem"></label></li>
							<li class="clearfix"><label><span class="label-text"><?= $__('home.settings.galaxy'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.galaxies" min="1"></label></li>
							<li class="clearfix" ng-if="expandSettings || !settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.system'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.systems" min="1"></label></li>
							<li class="clearfix"><label><span class="label-text"><?= $__('home.settings.deutsavefactor'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.deuteriumSaveFactor" min="0.1" step="0.1"></label></li>
                            <li class="clearfix"><label><span class="label-text"><?= $__('home.settings.cargohyperspacetechmultiplier'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.cargoHyperspaceTechMultiplier" min="0" step="1"></label></li>
                            <li class="clearfix"><label><span class="label-text"><?= $__('home.settings.playerclasses'); ?></span> <input type="checkbox" ng-model="settings.characterClassesEnabled"></label></li>
                            <li class="clearfix" ng-if="settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.minerfastertrading'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.minerBonusFasterTradingShips" min="0" max="100"></label></li>
                            <li class="clearfix" ng-if="settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.minerincreasedcargo'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.minerBonusIncreasedCargoCapacityForTradingShips" min="0" max="100"></label></li>
                            <li class="clearfix" ng-if="settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.warriorfastercombat'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.warriorBonusFasterCombatShips" min="0" max="100"></label></li>
                            <li class="clearfix" ng-if="settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.warriorfasterrecy'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.warriorBonusFasterRecyclers" min="0" max="100"></label></li>
                            <li class="clearfix" ng-if="settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.warriorrecsfuel'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.warriorBonusRecyclerFuelConsumption" min="0" max="100"></label></li>
                            <li class="clearfix" ng-if="settings.characterClassesEnabled"><label><span class="label-text"><?= $__('home.settings.combatdebrislimit'); ?></span> <input type="number" ng-keyup="simulateOnEnter($event)" ng-model="settings.combatDebrisFieldLimit" min="0" max="100"></label></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
        <div id="actions-bottom">
            <div id="simulate-button-bottom" class="btn btn-light" ng-click="simulate('bottom')"><?= $__('home.simulate'); ?></div>
            <div id="wave-buttons" ng-controller="WaveController" ng-if="simulationCount > 0">
                <div id="wave-previous" ng-click="prev()" class="btn btn-light btn-wave" ng-class="{active: currentWave > 0}">< <?= $__('home.wave.previous'); ?></div>
                <div id="wave-current" class="btn btn-light btn-wave active">{{currentWave + 1}}</div>
                <div id="wave-next" ng-click="next()" class="btn btn-light btn-wave" ng-class="{active: isNextAllowed()}"><?= $__('home.wave.next'); ?> ></div>
                <div id="wave-clear" class="btn btn-light btn-wave active" ng-click="clear();" ng-if="waves.length > 0">x <?= $__('home.waves.clear'); ?></div>
            </div>
        </div>
		<div id="results" ng-class="{active: result != null}">
            <div id="results-cases">
                <ul>
                    <li ng-repeat="key in ['average'].concat(getDesiredResultCasesKeys())" ng-click="result.selectCase(key); fireButtonClick('result case ' + key)" id="results-case-{{key}}" ng-class="{active: key == result.activeCase}">
                        <span></span>
                    </li>
                </ul>
            </div>
            <div class="results-tables" ng-class="{'custom-case': result != null && result.activeCase != 'average'}">
                <div id="simulation-result" class="result-table">
                    <table>
                        <thead><tr><th colspan="3"><?= $__('home.result.title'); ?></th></tr></thead>
                        <tbody>
                            <tr>
                                <td class="fixed" ng-class="{'case-winner': result != null && result.activeSimulation.outcome == 'attackers' }"><?= $__('home.result.win.attackers'); ?></td>
                                <td id="result-wins-attackers">{{result.outcome.attackers ? result.outcome.attackers + "%" : "/"}}</td>
                            </tr>
                            <tr>
                                <td class="fixed" ng-class="{'case-winner': result != null && result.activeSimulation.outcome == 'defenders' }"><?= $__('home.result.win.defenders'); ?></td>
                                <td id="result-wins-defenders">{{result.outcome.defenders ? result.outcome.defenders + "%" : "/"}}</td>
                            </tr>
                            <tr>
                                <td class="fixed" ng-class="{'case-winner': result != null && result.activeSimulation.outcome == 'draw' }"><?= $__('home.result.win.draw'); ?></td>
                                <td id="result-wins-draw">{{result.outcome.draw ? result.outcome.draw + "%" : "/"}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <th><?= $__('home.result.rounds'); ?></th>
                                <td id="result-rounds">{{result.activeSimulation.rounds ? "~" + result.activeSimulation.rounds : "/"}}</td>
                            </tr>
                            <tr>
                                <th class="fixed"><?= $__('home.result.retreat'); ?></th>
                                <td id="result-retreat"><span id="result-retreat-attacker">{{globals.tacticalRetreat.attackers}}</span> : <span id="result-retreat-defender">{{globals.tacticalRetreat.defenders}}</span></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table">
                    <div id="result-attackers-profit-content" class="tooltip-content"><?= $__('home.result.profit.attackers.tooltip'); ?></div>
                    <table class="resource-table">
                        <thead><tr><th colspan="4"><?= $__('home.result.attackers'); ?></th></tr><tr><th colspan="2"><?= $__('home.result.losses'); ?></th><th colspan="2" id="result-attackers-profit" class="tooltip-hover"><?= $__('home.result.profit'); ?> *</th></tr></thead>
                        <tbody>
                            <tr>
                                <td><div class="resource resource-metal"></div></td>
                                <td>{{result.activeSimulation.losses.attackers.metal | formatNumber:"/"}}</td>
                                <td><div class="resource resource-metal"></div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.attackers.metal > 0, loss: result.activeSimulation.profits.attackers.metal < 0}">{{result.activeSimulation.profits.attackers.metal | formatNumber:"/"}}</td>
                            </tr>
                            <tr>
                                <td><div class="resource resource-crystal"></div></td>
                                <td>{{result.activeSimulation.losses.attackers.crystal | formatNumber:"/"}}</td>
                                <td><div class="resource resource-crystal"></div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.attackers.crystal > 0, loss: result.activeSimulation.profits.attackers.crystal < 0}">{{result.activeSimulation.profits.attackers.crystal | formatNumber:"/"}}</td>
                            </tr>
                            <tr>
                                <td><div class="resource resource-deuterium"></div></td>
                                <td>{{result.activeSimulation.losses.attackers.deuterium | formatNumber:"/"}}</td>
                                <td><div class="resource resource-deuterium"></div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.attackers.deuterium > 0, loss: result.activeSimulation.profits.attackers.deuterium < 0}">{{result.activeSimulation.profits.attackers.deuterium | formatNumber:"/"}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="total">
                                <td><div class="fixed resource-total">=</div></td>
                                <td>{{result.activeSimulation.losses.attackers.total | formatNumber:"/"}}</td>
                                <td><div class="fixed resource-total">=</div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.attackers.total > 0, loss: result.activeSimulation.profits.attackers.total < 0}">{{result.activeSimulation.profits.attackers.total | formatNumber:"/"}}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table">
                    <div id="result-defenders-profit-content" class="tooltip-content"><?= $__('home.result.profit.defenders.tooltip'); ?></div>
                    <table class="resource-table">
                        <thead><tr><th colspan="4"><?= $__('home.result.defenders'); ?></th></tr><tr><th colspan="2"><?= $__('home.result.losses'); ?></th><th colspan="2" id="result-defenders-profit" class="tooltip-hover"><?= $__('home.result.profit'); ?> *</th></tr></thead>
                        <tbody>
                            <tr>
                                <td><div class="resource resource-metal"></div></td>
                                <td>{{result.activeSimulation.losses.defenders.metal | formatNumber:"/"}}</td>
                                <td><div class="resource resource-metal"></div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.defenders.metal > 0, loss: result.activeSimulation.profits.defenders.metal < 0}">{{result.activeSimulation.profits.defenders.metal | formatNumber:"/"}}</td>
                            </tr>
                            <tr>
                                <td><div class="resource resource-crystal"></div></td>
                                <td>{{result.activeSimulation.losses.defenders.crystal | formatNumber:"/"}}</td>
                                <td><div class="resource resource-crystal"></div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.defenders.crystal > 0, loss: result.activeSimulation.profits.defenders.crystal < 0}">{{result.activeSimulation.profits.defenders.crystal | formatNumber:"/"}}</td>
                            </tr>
                            <tr>
                                <td><div class="resource resource-deuterium"></div></td>
                                <td>{{result.activeSimulation.losses.defenders.deuterium | formatNumber:"/"}}</td>
                                <td><div class="resource resource-deuterium"></div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.defenders.deuterium > 0, loss: result.activeSimulation.profits.defenders.deuterium < 0}">{{result.activeSimulation.profits.defenders.deuterium | formatNumber:"/"}}</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="total">
                                <td><div class="fixed resource-total">=</div></td>
                                <td>{{result.activeSimulation.losses.defenders.total | formatNumber:"/"}}</td>
                                <td><div class="fixed resource-total">=</div></td>
                                <td ng-class="{profit: result.activeSimulation.profits.defenders.total > 0, loss: result.activeSimulation.profits.defenders.total < 0}">{{result.activeSimulation.profits.defenders.total | formatNumber:"/"}}</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table">
                    <table>
                        <thead><tr><th colspan="3"><?= $__('home.result.planet'); ?></th></tr><tr><th colspan="2"><?= $__('home.result.debris.remaining'); ?></th><th><?= $__('home.result.moonchance'); ?></th></tr></thead>
                        <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="result-debris-metal">{{result.activeSimulation.debris.remaining.metal | formatNumber:"/"}}</td>
                            <td rowspan="2" id="result-moonchance">{{result.activeSimulation.moonChance ? (result.activeSimulation.moonChance | formatNumber) + "%" : "/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="result-debris-crystal">{{result.activeSimulation.debris.remaining.crystal | formatNumber:"/"}}</td>
                        </tr>
                        <tr class="total">
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="result-debris-total">{{result.activeSimulation.debris.remaining.total | formatNumber:"/"}}</td>
                            <td class="result-recyclers-hst fixed">
                                <span ng-if="settings.cargoHyperspaceTechMultiplier > 0">&#8595; <?= $__('home.result.plunder.with.hyperspace', '{{parties.attackers.fleets[0].techs.hyperspacetech}}'); ?></span>
                            </td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colspan="2" id="result-recyclers">{{getNecessaryRecyclers(result.activeSimulation) | formatNumber:"/"}}</td>
                            <th class="fixed"><?= $__('home.result.recyclers'); ?></th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table-plunder result-table">
                    <table class="resource-table">
                        <thead><tr><th colspan="6"><?= $__('home.result.plunder'); ?></th></tr><tr><th colspan="2"><?= $__('home.result.plunder.captured'); ?></th><th colspan="2"><?= $__('home.result.plunder.possible'); ?></th><th colspan="2"><?= $__('home.result.plunder.cargos'); ?></th></tr></thead>
                        <tbody>
                            <tr>
                                <td><div class="resource resource-metal"></div></td>
                                <td id="result-attackers-plunder-metal">{{result.activeSimulation.plunder.metal | formatNumber:"/"}}</td>
                                <td><div class="resource resource-metal"></div></td>
                                <td id="result-possible-plunder-metal">{{getPossiblePlunder("metal") | formatNumber:"/"}}</td>
                                <td id="result-cargos-large">{{getNeededEntityCountForPlunder(203) | formatNumber:"/"}}</td>
                                <td><?= $__('type.203'); ?></td>
                            </tr>
                            <tr>
                                <td><div class="resource resource-crystal"></div></td>
                                <td id="result-attackers-plunder-crystal">{{result.activeSimulation.plunder.crystal | formatNumber:"/"}}</td>
                                <td><div class="resource resource-crystal"></div></td>
                                <td id="result-possible-plunder-crystal">{{getPossiblePlunder("crystal") | formatNumber:"/"}}</td>
                                <td id="result-cargos-small">{{getNeededEntityCountForPlunder(202) | formatNumber:"/"}}</td>
                                <td><?= $__('type.202'); ?></td>
                            </tr>
                            <tr>
                                <td><div class="resource resource-deuterium"></div></td>
                                <td id="result-attackers-plunder-deuterium">{{result.activeSimulation.plunder.deuterium | formatNumber:"/"}}</td>
                                <td><div class="resource resource-deuterium"></div></td>
                                <td id="result-possible-plunder-deuterium">{{getPossiblePlunder("deuterium") | formatNumber:"/"}}</td>
                                <td colspan="2" class="result-cargos-tech-indicator" ng-if="settings.cargoHyperspaceTechMultiplier > 0"><?= $__('home.result.plunder.with.hyperspace', '{{parties.attackers.fleets[0].techs.hyperspacetech}}'); ?></td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr class="total">
                                <td><div class="fixed resource-total">=</div></td>
                                <td id="result-attackers-plunder-total">{{result.activeSimulation.plunder.total | formatNumber:"/"}}</td>
                                <td><div class="fixed resource-total">=</div></td>
                                <td id="result-possible-plunder-total">{{getPossiblePlunder() | formatNumber:"/"}}</td>
                                <td id="result-plunder-captured">{{result && result.outcome.attackers >= 1 ? getCapturedPlunderPercentage(result.activeSimulation.plunder.total) + "%" : "/"}}</td>
                                <td><?= $__('home.result.plunder.captured'); ?></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table-debris result-table" ng-if="settings.characterClassesEnabled">
                    <table>
                        <thead><tr><th colspan="2"><?= $__('home.result.debris.overall'); ?></th><th colspan="2"><?= $__('home.result.debris.attackers'); ?></th><th colspan="2"><?= $__('home.result.debris.defenders'); ?></th></tr></thead>
                        <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="result-debris-metal">{{result.activeSimulation.debris.overall.metal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="result-debris-metal">{{result.activeSimulation.debris.reaper.attackers.metal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="result-debris-metal">{{result.activeSimulation.debris.reaper.defenders.metal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="result-debris-crystal">{{result.activeSimulation.debris.overall.crystal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="result-debris-crystal">{{result.activeSimulation.debris.reaper.attackers.crystal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="result-debris-crystal">{{result.activeSimulation.debris.reaper.defenders.crystal | formatNumber:"/"}}</td>
                        </tr>
                        <tr class="total">
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="result-debris-total">{{result.activeSimulation.debris.overall.total | formatNumber:"/"}}</td>
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="result-debris-total">{{result.activeSimulation.debris.reaper.attackers.total | formatNumber:"/"}}</td>
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="result-debris-total">{{result.activeSimulation.debris.reaper.defenders.total | formatNumber:"/"}}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr>
                            <td colspan="2" id="result-recyclers">{{getNecessaryRecyclers(result.activeSimulation, true) | formatNumber:"/"}}</td>
                            <th colspan="4" class="fixed align-left"><?= $__('home.result.recyclers'); ?></th>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
		</div>
        <div id="results-total" ng-controller="ResultsTotalController" ng-if="waves.length > 0">
            <div id="results-total-title">
                <h3><?= $__('home.resultstotal.title'); ?></h3>
            </div>
            <div class="results-tables" ng-class="{'custom-case': $simulator.result != null && $simulator.result.activeCase != 'average'}" ng-if="resultsTotal != null">
                <div class="result-table">
                    <div id="result-attackers-profit-content" class="tooltip-content"><?= $__('home.result.profit.attackers.tooltip'); ?></div>
                    <table class="resource-table">
                        <thead><tr><th colspan="4"><?= $__('home.result.attackers'); ?></th></tr><tr><th colspan="2"><?= $__('home.result.losses'); ?></th><th colspan="2" id="result-attackers-profit" class="tooltip-hover"><?= $__('home.result.profit'); ?> *</th></tr></thead>
                        <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td>{{resultsTotal.losses.attackers.metal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-metal"></div></td>
                            <td ng-class="{profit: resultsTotal.profits.attackers.metal > 0, loss: resultsTotal.profits.attackers.metal < 0}">{{resultsTotal.profits.attackers.metal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td>{{resultsTotal.losses.attackers.crystal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-crystal"></div></td>
                            <td ng-class="{profit: resultsTotal.profits.attackers.crystal > 0, loss: resultsTotal.profits.attackers.crystal < 0}">{{resultsTotal.profits.attackers.crystal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-deuterium"></div></td>
                            <td>{{resultsTotal.losses.attackers.deuterium | formatNumber:"/"}}</td>
                            <td><div class="resource resource-deuterium"></div></td>
                            <td ng-class="{profit: resultsTotal.profits.attackers.deuterium > 0, loss: resultsTotal.profits.attackers.deuterium < 0}">{{resultsTotal.profits.attackers.deuterium | formatNumber:"/"}}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr class="total">
                            <td><div class="fixed resource-total">=</div></td>
                            <td>{{resultsTotal.losses.attackers.total | formatNumber:"/"}}</td>
                            <td><div class="fixed resource-total">=</div></td>
                            <td ng-class="{profit: resultsTotal.profits.attackers.total > 0, loss: resultsTotal.profits.attackers.total < 0}">{{resultsTotal.profits.attackers.total | formatNumber:"/"}}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table">
                    <div id="result-defenders-profit-content" class="tooltip-content"><?= $__('home.result.profit.defenders.tooltip'); ?></div>
                    <table class="resource-table">
                        <thead><tr><th colspan="4"><?= $__('home.result.defenders'); ?></th></tr><tr><th colspan="2"><?= $__('home.result.losses'); ?></th><th colspan="2" id="result-defenders-profit" class="tooltip-hover"><?= $__('home.result.profit'); ?> *</th></tr></thead>
                        <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td>{{resultsTotal.losses.defenders.metal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-metal"></div></td>
                            <td ng-class="{profit: resultsTotal.profits.defenders.metal > 0, loss: resultsTotal.profits.defenders.metal < 0}">{{resultsTotal.profits.defenders.metal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td>{{resultsTotal.losses.defenders.crystal | formatNumber:"/"}}</td>
                            <td><div class="resource resource-crystal"></div></td>
                            <td ng-class="{profit: resultsTotal.profits.defenders.crystal > 0, loss: resultsTotal.profits.defenders.crystal < 0}">{{resultsTotal.profits.defenders.crystal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-deuterium"></div></td>
                            <td>{{resultsTotal.losses.defenders.deuterium | formatNumber:"/"}}</td>
                            <td><div class="resource resource-deuterium"></div></td>
                            <td ng-class="{profit: resultsTotal.profits.defenders.deuterium > 0, loss: resultsTotal.profits.defenders.deuterium < 0}">{{resultsTotal.profits.defenders.deuterium | formatNumber:"/"}}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr class="total">
                            <td><div class="fixed resource-total">=</div></td>
                            <td>{{resultsTotal.losses.defenders.total | formatNumber:"/"}}</td>
                            <td><div class="fixed resource-total">=</div></td>
                            <td ng-class="{profit: resultsTotal.profits.defenders.total > 0, loss: resultsTotal.profits.defenders.total < 0}">{{resultsTotal.profits.defenders.total | formatNumber:"/"}}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table">
                    <table>
                        <thead><tr><th colspan="3"><?= $__('home.result.planet'); ?></th></tr><tr><th colspan="2"><?= $__('home.result.debris'); ?></th><th><div class="fixed"><?= $__('home.result.recyclers'); ?></div></th></tr></thead>
                        <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="result-debris-metal">{{resultsTotal.debris.remaining.metal | formatNumber:"/"}}</td>
                            <td rowspan="2" id="result-moonchance">{{getNecessaryRecyclers(resultsTotal) | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="result-debris-crystal">{{resultsTotal.debris.remaining.crystal | formatNumber:"/"}}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr class="total">
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="result-debris-total">{{resultsTotal.debris.remaining.total | formatNumber:"/"}}</td>
                            <td class="result-recyclers-hst fixed">
                                <span ng-if="settings.cargoHyperspaceTechMultiplier > 0">&#8593; <?= $__('home.result.plunder.with.hyperspace', '{{parties.attackers.fleets[0].techs.hyperspacetech}}'); ?></span>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
                <div class="result-table-plunder result-table">
                    <table class="resource-table">
                        <thead><tr><th colspan="2"><?= $__('home.result.plunder'); ?> <?= $__('home.result.plunder.captured'); ?></th></tr></thead>
                        <tbody>
                        <tr>
                            <td><div class="resource resource-metal"></div></td>
                            <td id="result-attackers-plunder-metal">{{resultsTotal.plunder.metal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-crystal"></div></td>
                            <td id="result-attackers-plunder-crystal">{{resultsTotal.plunder.crystal | formatNumber:"/"}}</td>
                        </tr>
                        <tr>
                            <td><div class="resource resource-deuterium"></div></td>
                            <td id="result-attackers-plunder-deuterium">{{resultsTotal.plunder.deuterium | formatNumber:"/"}}</td>
                        </tr>
                        </tbody>
                        <tfoot>
                        <tr class="total">
                            <td><div class="fixed resource-total">=</div></td>
                            <td id="result-attackers-plunder-total">{{resultsTotal.plunder.total | formatNumber:"/"}}</td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
	</form>
	<div id="simulation-progress" class="simulation-background" ng-class="{working: simulationActive}">
		<div id="progress-content">
			<div id="progress-title" class="clearfix"><?= $__('home.simulation.title'); ?></div>
			<div id="simulations-progress"><span>{{simulationActive.simulation}}</span>/<span>{{settings.simulations}}</span></div>
			<div class="cssload-cube">
				<div class="cssload-plane-1">
					<div class="cssload-top-left"></div>
					<div class="cssload-top-middle"></div>
					<div class="cssload-top-right"></div>
					<div class="cssload-middle-left"></div>
					<div class="cssload-middle-middle"></div>
					<div class="cssload-middle-right"></div>
					<div class="cssload-bottom-left"></div>
					<div class="cssload-bottom-middle"></div>
					<div class="cssload-bottom-right"></div>
				</div>
				 <div class="cssload-plane-2">
					<div class="cssload-top-left"></div>
					<div class="cssload-top-middle"></div>
					<div class="cssload-top-right"></div>
					<div class="cssload-middle-left"></div>
					<div class="cssload-middle-middle"></div>
					<div class="cssload-middle-right"></div>
					<div class="cssload-bottom-left"></div>
					<div class="cssload-bottom-middle"></div>
					<div class="cssload-bottom-right"></div>
				</div>
				 <div class="cssload-plane-3">
					<div class="cssload-top-left"></div>
					<div class="cssload-top-middle"></div>
					<div class="cssload-top-right"></div>
					<div class="cssload-middle-left"></div>
					<div class="cssload-middle-middle"></div>
					<div class="cssload-middle-right"></div>
					<div class="cssload-bottom-left"></div>
					<div class="cssload-bottom-middle"></div>
					<div class="cssload-bottom-right"></div>
				</div>
			</div>
			<div>
				<div id="progress-bar"><div id="progress-status" style="width: {{simulationActive.progress}}%"></div></div>
			</div>
			<div class="clearfix">
				<div id="progress-rounds-wrapper"><?= $__('home.simulation.round'); ?>: <span>{{simulationActive.round}}</span></div>
				<div id="cancel-simulation" ng-click="cancelSimulation()"><?= $__('home.cancel'); ?></div>
			</div>
		</div>
	</div>
	<div id="home-bottom-ad">
		<div class="adsense-title"><span id="home-bottom-add-title" title="These ads are used to pay my hosting costs to give you a better user experience. Please do not block them :)">Ad - why?</span></div>
		<!-- TrashSim homepage ad -->
		<ins class="adsbygoogle"
			 style="display:block"
			 data-ad-client="ca-pub-1333463440710655"
			 data-ad-slot="8546081121"
			 data-ad-format="auto"></ins>
	</div>
    <div id="cr-howto">
    	<h3 class="subtitle"><?= $__("home.howto"); ?></h3>
    	<ol class="clearfix">
    		<li data-step="step-1">
                <div class="cr-howto-image cr-howto-image-step1"></div>
    			<div class="cr-howto-pin" id="step-1">1</div>
    			<div class="cr-howto-content">
    				<p><?= $__("home.step1.paragraph1"); ?></p>
    				<p><?= $__("home.step1.paragraph2"); ?></p>
    				<p><?= $__("home.step1.paragraph3"); ?></p>
    			</div>
    		</li>
    		<li data-step="step-2">
                <div class="cr-howto-image cr-howto-image-step2"></div>
    			<div class="cr-howto-pin" id="step-2">2</div>
    			<div class="cr-howto-content">
    				<p><?= $__("home.step2.paragraph1"); ?></p>
    				<p><?= $__("home.step2.paragraph2"); ?></p>
    				<p><?= $__("home.step2.paragraph3"); ?></p>
    			</div>
    		</li>
    		<li data-step="step-3">
                <div class="cr-howto-image cr-howto-image-step3"></div>
    			<div class="cr-howto-pin" id="step-3">3</div>
    			<div class="cr-howto-content">
    				<p><?= $__("home.step3.paragraph1"); ?></p>
    				<p><?= $__("home.step3.paragraph2"); ?></p>
    				<p><?= $__("home.step3.paragraph3"); ?></p>
    			</div>
    		</li>
    	</ol>
    </div>
    <div id="options">
        <h3 class="subtitle"><?= $__("home.options.title"); ?></h3>
        <div id="options-container">
            <ul>
                <li ng-class="{enabled: options.simulationModule == 'JavascriptMW'}">
                    <label ng-click="fireButtonClick('options javascriptmw')">
                        <input type="checkbox" ng-model="options.simulationModule" ng-true-value="'JavascriptMW'" ng-false-value="'Javascript'" />
                        <span><?= $__("home.options.feature.javascriptmw"); ?></span>
                    </label>
                    <div class="extra" ng-if="options.simulationModule == 'JavascriptMW'">
                        <label>
                            <span><?= $__("home.options.workercount"); ?></span>
                            <input type="number" ng-model="options.simulationWorkerCount" ng-disabled="options.simulationModule != 'JavascriptMW'" />
                        </label>
                    </div>
                </li>
                <li>
                    <label ng-click="fireButtonClick('options mostarisspecial')">
                        <input type="checkbox" ng-model="aMostarisSpecial" />
                        <span>Enable The Mostaris NAMS system</span>
                    </label>
                </li>
                <li>
                    <label>
                        <span>Custom entity info (JSON)</span>
                        <br/>
                        <textarea ng-keyup="setCustomEntityInfo(customEntityInfo)" ng-model="customEntityInfo" ng-init="setCustomEntityInfo(customEntityInfo = getCustomEntityInfo())"></textarea>
                    </label>
                </li>
            </ul>
        </div>
    </div>
    <div id="pnacl-listener"></div>
</div>
	<script type="text/javascript">
		window[appContext].progress = {
			'0': {
				'1': "<?= str_replace('"', '\"', $__('home.simulation.attacker.loading')); ?>",
				'2': "<?= str_replace('"', '\"', $__('home.simulation.attacker.shooting')); ?>",
				'3': "<?= str_replace('"', '\"', $__('home.simulation.attacker.regenerate')); ?>"
			},
			'1': {
				'1': "<?= $__('home.simulation.defender.loading'); ?>",
				'2': "<?= $__('home.simulation.defender.shooting'); ?>",
				'3': "<?= $__('home.simulation.defender.regenerate'); ?>"
			}
		};
		window[appContext].locale = {
			'storagesupport' : "<?= str_replace('"', '\"', $__('home.save.support')); ?>",
			'saveddata-empty' : "<?= str_replace('"', '\"', $__('home.save.empty')); ?>"
		};
	</script>