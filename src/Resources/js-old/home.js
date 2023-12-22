
	c['Home'] = (function(){
				
		//TODO:: Fix resources when going to previous waves
	
		var attackerIndex = 0, defenderIndex = 0, simulatorresult, ipmsimulator, progress = c.DOM.get('#simulation-progress'), prefillCache = {}, waves = [], currentWave = 0;
		
		var simulationModule;
		
		var progressCurrent = c.DOM.get('#simulation-current'),
			progressTotal = c.DOM.get('#simulation-total'),
			progressRounds = c.DOM.get('#progress-rounds'),
			progressStatus = c.DOM.get('#progress-status'),
			progressMessage = c.DOM.get('#progress-message');
		
		var waveNext = c.DOM.get('#wave-next'), wavePrevious = c.DOM.get('#wave-previous');
			
		var handleSimulation = function () {
			
			simulationReset();

			if (simulationCheckPlayerTechnologies() === false) return; // Player will fill in the technologies themselves or will get the option to set them to 0

			c.DOM.get('#simulation-progress').classList.add('working');
			
			var t = setTimeout(function () {
				
				c.DOM.clear('#parties .party-column ul li span');
				
				var formdata = c.DOM.get('#simulate-form'), data = {};
				for (var i=0,il=formdata.length; i<il; i++) {
					if (formdata[i].value < 0) formdata[i].value = 0;
					if (formdata[i].type == "checkbox") {
						data[formdata[i].id] = formdata[i].checked ? '1' : '0';
					} else {
						data[formdata[i].id] = formdata[i].value;
					}
				}

				c.Simulator.load(data);
				
				simulationModule.start(
					c.DOM.get('#simulations').value,
					c.Simulator.getAttackersData(),
					c.Simulator.getDefendersData(),
					c.DOM.get('#simulate-setting-rapidfire').checked	
				);
				
			}, 50);
		};
		
		var init = function() {
			
			var loadid;

			if (localStorage.trashsimSimulationModule) {
				simulationModule = c.SimulationModule[localStorage.trashsimSimulationModule];
			} else {
				if (navigator.mimeTypes['application/x-pnacl'] !== undefined) {
					simulationModule = c.SimulationModule.Pnacl;
				} else {
					simulationModule = c.SimulationModule.Javascript;
				}
			}
			//simulationModule = c.SimulationModule.ServerCPP;
			//simulationModule = c.SimulationModule.ServerPHPExt;
			simulationModule.init();

			simulatorresult = new Worker(c.Application.getAssetVersion('assets/js/simulator-result.js'));
			simulatorresult.onmessage = simulationResultMessage;
			
			c.DOM.getOne('#cancel-simulation', progress).addEventListener('click', simulationCancel);
						
			c.DOM.get('#simulate-button-bottom').addEventListener('click', function () {
				handleSimulation();
				c.Matomo.sendEvent('button', 'click', 'simulate bottom');
			});
			
			c.DOM.get('#simulate-button').addEventListener('click', function () {
				handleSimulation();
				c.Matomo.sendEvent('button', 'click', 'simulate top');
			});
			
			var apiLoaders = c.DOM.getAll('.party-api-load');
			for (var i=0,il=apiLoaders.length; i<il; i++) {
				apiLoaders[i].addEventListener('click', loadPartyFromReport);
			}
			
			var clearPlayers = c.DOM.getAll('.clear-player');
			for (var i=0,il=clearPlayers.length; i<il; i++) {
				clearPlayers[i].addEventListener('click', clearPlayer);
			}
			
			var domes = c.DOM.get('.entity-dome-checkbox');
			for (var i=0,il=domes.length; i<il; i++) {
				domes[i].addEventListener('click', function () {
					this.previousElementSibling.value = this.checked ? 1 : 0;
				});
			}
			
			var addPlayerBtn = c.DOM.getAll('.party-selection .add-player');
			for (var i=0,il=addPlayerBtn.length; i<il; i++) {
				addPlayerBtn[i].addEventListener('click', addAdditionalPlayer);
			}
			
			var selectPlayerBtn = c.DOM.getAll('.party-selection .selected');
			for (var i=0,il=selectPlayerBtn.length; i<il; i++) {
				selectPlayerBtn[i].addEventListener('click', selectPlayer);
			}
			
			var fleetNumbers = c.DOM.getAll('#attacker-column .entity-number, #defender-column .entity-number');
			for (var i=0,il=fleetNumbers.length; i<il; i++) {
				fleetNumbers[i].addEventListener('keyup', trackTacticalRetreat);
				fleetNumbers[i].addEventListener('change', trackTacticalRetreat);
			}
			
			c.DOM.get('#save-button').addEventListener('click', function () {
				handleSave();
				c.Matomo.sendEvent('button', 'click', 'save');
			});
			
			enableIPMSimulator();
			enableSimulateOnEnter('.party-column');
			
			var defaultSavedData = c.Store.get('saved_default');			
			if (defaultSavedData) {
				var data = JSON.parse(c.Store.get('saved_data'));
				if (data[defaultSavedData]) {
					loadSimulationData(data[defaultSavedData]);
				}
			}
				
			//Automatic CR generation
			if (/prefill=/.test(window.location.hash)) {
				prefill(window.location.hash);
				c.Matomo.sendEvent('button', 'click', 'load spy data automatically');
			}
			
			if (/\?SR_KEY\=sr\-[a-z]{2}\-\d{1,3}\-[0-9a-z]{40}/i.test(window.location.search)) {
				clearPlayer.call(c.DOM.getOne('#defender-0 .clear-player'));
				loadPartyFromReport.call(c.DOM.getOne('#defender-0 .party-api-load'));
				c.Matomo.sendEvent('button', 'click', 'load spy report automatically');
			}
			
			waveNext.addEventListener('click', function (e) {
				loadNextWave.call(this,e);
				c.Matomo.sendEvent('button', 'click', 'wave next');
			});
			wavePrevious.addEventListener('click', function (e) {
				loadPreviousWave.call(this,e);
				c.Matomo.sendEvent('button', 'click', 'wave previous');
			});
			
			enableHowToSelection();					
			
			c.Tooltip.create('#result-attackers-profit', '#result-attackers-profit-content', {position : "top"});
			c.Tooltip.create('#result-defenders-profit', '#result-defenders-profit-content', {position : "top"});
			c.Tooltip.create('#ipm-simulate', '#ipm-simulate-tooltip', {position : "left"});
			c.Tooltip.create('#live-retreat-attacker', {position : "top"});
			c.Tooltip.create('#live-retreat-defender', {position : "top"});
			c.Tooltip.create('#home-bottom-add-title', {position : "top"});
			
		};
		
		var enableSimulateOnEnter = function (parentSelector) {
			
			var numberFields = c.DOM.getAll(parentSelector + ' input[type="number"]');
			
			for (var i=0,il=numberFields.length; i<il; i++) {
				numberFields[i].addEventListener('keyup', function (e) {
					var key = e.which || e.keyCode;
				    if (key === 13) {
				    	handleSimulation();
				    	c.Matomo.sendEvent('button', 'click', 'simulate enter');
				    }
				});
			}
			
		};
		
		var simulationFallback = function () {
			
			simulationModule = c.SimulationModule.Javascript;
			simulationModule.init();
			
			handleSimulation();
			
		};
		
		var simulationMessage = function (e) {
				
			var data = e.data;
			
			if (data.response == 'simulation') {		
				
				var plunder = c.DOM.get('#simulate-setting-plunder');
				
				simulatorresult.postMessage([
					c.Simulator.getAttackersData(),
					c.Simulator.getDefendersData(),
					c.Simulator.getSettings(),
					data.result.simulations,
					{metal: c.DOM.get('#planet-metal').value || 0, crystal: c.DOM.get('#planet-crystal').value || 0, deuterium: c.DOM.get('#planet-deuterium').value || 0},
					plunder[plunder.selectedIndex].value,
					c.DOM.get('#simulate-setting-fleetdebris').value, 
					c.DOM.get('#simulate-setting-defencedebris').value,
					c.DOM.get('#simulate-setting-defencerepair').value,
					c.DOM.get('#defenders-engineer-checkbox').checked
				]);
				
			} else if (data.response == 'progress') {
				
				 progressCurrent.textContent = data.progress.simulation.current;
				 progressTotal.textContent = data.progress.simulation.total;
				 
				 progressRounds.textContent = data.progress.round;
				 progressStatus.style.width = Math.round((((data.progress.simulation.current - 1) / data.progress.simulation.total) + (data.progress.round / 6 / data.progress.simulation.total))  * 100) + '%';
					
				 
				 if ("undefined" !== typeof data.progress.player) {
					 if (data.progress.player) {
						 progressMessage.textContent = publicContext.progress[data.progress.party][data.progress.step].replace('{x}', data.progress.player); 
					 } else {
						 progressMessage.textContent = publicContext.progress[data.progress.party][data.progress.step];
					 }
				 }
				 
			}
			
		};
		
		var simulationCancel = function () {
			
			simulationModule.reset();
			
			simulatorresult.terminate();
			simulatorresult = new Worker(c.Application.getAssetVersion('assets/js/simulator-result.js'));
			simulatorresult.onmessage = simulationResultMessage;
			
			progress.classList.remove('working');
			
		};
		
		var simulationReset = function () {
			
			progressCurrent.textContent = 0;
			progressTotal.textContent = c.DOM.get('#simulations').value;
			progressRounds.textContent = "-";
			progressStatus.style.width = '0%';
			progressMessage.textContent = ""; 
			
		};
		
		var simulationResultMessage = function (e) {
			
			var data = e.data;
			
			if (data.response == 'result') {		
				
				setTacticalRetreat(data.result.retreat, '#result-retreat-attacker', '#result-retreat-defender');
				setResultData(data.result.simulations, data.result.fuel);
				setRemainingEntities(data.result.simulations.remaining);
				setFlightData(data.result.time, data.result.fuel);
				
				c.DOM.get('#results').style.display = "block";
				c.DOM.get('#wave-buttons').style.display = "block";
				
				window.location.hash = 'results';
				resetNextWaves();
				waveNext.classList.add('active');
				progress.classList.remove('working');
				
			}
			
		};

		var updateSelectionHeaderInvalidPlayer = function () {
			var parties = c.DOM.getAll('.party-player');
			for (var i=0,il=parties.length; i<il; i++) {
				// If there's a least one invalid field add the invalid class to the player selection header
				var invalid = c.DOM.getOne('input.invalid', parties[i]), playerHeader = c.DOM.get('#' + parties[i].id + '-label');
				if (invalid)	playerHeader.classList.add('invalid');
				else 			playerHeader.classList.remove('invalid');
			}
		};

		var simulationCheckPlayerTechnologies = function () {

			var checkIfFieldIsInvalid = function () {
				if (this.value.length > 0) {
					this.classList.remove('invalid');
					this.removeEventListener('keyup', checkIfFieldIsInvalid);
					this.removeEventListener('change', checkIfFieldIsInvalid);
					updateSelectionHeaderInvalidPlayer();
				}
			};

			var technologyFields = c.DOM.getAll('.player-techs input, .player-techs-main input'), hasInvalids = false;

			for (var i=0, il=technologyFields.length; i<il; i++) {
				var field = technologyFields[i];
				if (field.value.length === 0) {
					field.classList.add('invalid');
					field.addEventListener('keyup', checkIfFieldIsInvalid);
					field.addEventListener('change', checkIfFieldIsInvalid);
					hasInvalids = true;
				} else {
					field.classList.remove('invalid');
				}
			}

			updateSelectionHeaderInvalidPlayer();

			var invalidPlayers = [], invalidPlayerHeaders = c.DOM.getAll('.party-selection li.invalid');
			for (var i=0, il=invalidPlayerHeaders.length; i<il; i++) {
				invalidPlayers.push(
					invalidPlayerHeaders[i].parentNode.getAttribute('data-char') +
					(parseInt(invalidPlayerHeaders[i].getAttribute('data-index')) + 1)
				);
			}

			if (hasInvalids === true) {
				c.Template.get(c.Application.getLanguage() + '/missingtechnologies', function (html) {
					var popupMissingTechs = c.Popup.open(html, false, 400);
                    location.hash = 'popup';
					c.DOM.get('#missingtech-complete-btn').addEventListener('click', function () {
						c.Popup.close(popupMissingTechs);
						c.Matomo.sendEvent('button', 'click', 'missing techs complete');
					});
					c.DOM.get('#missingtech-reset-btn').addEventListener('click', function () {
						var invalidTechnologyFields = c.DOM.getAll('.player-techs input.invalid, .player-techs-main input.invalid');
						for (var i=0, il=invalidTechnologyFields.length; i<il; i++) {
							invalidTechnologyFields[i].value = 0;
							invalidTechnologyFields[i].classList.remove('invalid');
						}
						c.Popup.close(popupMissingTechs);
						c.Matomo.sendEvent('button', 'click', 'missing techs reset');
						handleSimulation();
					});
				}, {'players': invalidPlayers.join(', ')});
			}

			return !hasInvalids;

		};
		
		var addAdditionalPlayer = function () {
		
			var item = c.DOM.create('li'), list = this.parentNode, label = list.getAttribute('data-char');
			var index = label == 'A' ? ++attackerIndex : ++defenderIndex, party = label == 'A' ? 0 : 1;
			
			label += index + 1;
			
			item.id = (party == 1 ? 'defender' : 'attacker') + '-' + index + '-label';
			item.setAttribute('data-party', party);
			item.setAttribute('data-index', index);
			item.addEventListener('click', selectPlayer);
			item.appendChild(c.DOM.text(label));
			list.insertBefore(item, list.lastChild);
			
			addPlayer(party, index, item);
			
		};
		
		var addPlayer = function (party, index, playerLabel) {
			
			var partyLabel = party == 1 ? 'defender' : 'attacker', list = c.DOM.getOne('#' + partyLabel + '-column .party-values');
			
			var path = c.Application.getLanguage() + '/' + party + '/' + index, loadid = c.Loader.create('body');
			c.Template.get(path + '/player', function (player) {
				c.DOM.getOne('.party-api-load', player).addEventListener('click', loadPartyFromReport);
				c.DOM.getOne('.clear-player', player).addEventListener('click', clearPlayer);
				var removeBtn = c.DOM.getOne('.remove-player', player);
				removeBtn.addEventListener('click', removePlayer);
				list.appendChild(player);
				selectPlayer.call(playerLabel);
				
				var party = removeBtn.getAttribute('data-party'), index = removeBtn.getAttribute('data-index');
				
				if ("undefined" !== typeof prefillCache[party] && "undefined" !== typeof prefillCache[party][index]) {
					loadPlayer(index, party|0, prefillCache[party][index]);
				}
				
				enableSimulateOnEnter('#' + (party == 1 ? 'defender' : 'attacker') + '-' + index);
				
				c.Loader.remove(loadid);
				c.Matomo.sendEvent('button', 'click', 'add player');
			}, {});
			
		};
		
		var removePlayer = function () {
			
			var id = this.parentNode.id, previousPlayerId = this.parentNode.previousElementSibling.id;
			
			c.DOM.remove('#' + id);
			c.DOM.remove('#' + id + '-label');
			
			selectPlayer.call(c.DOM.get('#' + previousPlayerId + '-label'));
			
		};
		
		var selectPlayer = function () {
			
			var party = this.getAttribute('data-party')|0, index = this.getAttribute('data-index')|0;
			
			var partyLabel = party == 1 ? 'defender' : 'attacker', selection = c.DOM.getOne('#' + partyLabel + '-column .party-selection .selected'), values = c.DOM.getOne('#' + partyLabel + '-column .party-values .selected');
			
			if (selection && values) {
				selection.classList.remove('selected');
				values.classList.remove('selected');
			}
			
			var player = c.DOM.get('#' + partyLabel + '-' + index), playerLabel = c.DOM.getOne('#' + partyLabel + '-' + index + '-label');
			if (player && playerLabel) {
				player.classList.add('selected');
				playerLabel.classList.add('selected');
			}
			
		};
		
		var clearPlayer = function () {
			
			var prefix = this.getAttribute('data-base'), values = c.DOM.getAll('input[id^="' + prefix + '"]');
			
			for (var i=0, il=values.length; i<il; i++) {
				values[i].value = "";
				if (values[i].classList.contains('entity-number')) {
					values[i].setAttribute('data-lost', 0);
					values[i].setAttribute('data-remaining', 0);
					c.DOM.get('#' + values[i].id + '-lost').textContent = "";
				}
				if (values[i].classList.contains('entity-dome')) {
					values[i].nextElementSibling.checked = false;
				}
			}
			
			c.DOM.get('#' + prefix + '-consumption').textContent = "-";
			c.DOM.get('#' + prefix + '-flighttime').textContent = "-";
			
			if (prefix == 'simulate-defenders-0') {
				c.DOM.get('#planet-metal').value = 0;
				c.DOM.get('#planet-crystal').value = 0;
				c.DOM.get('#planet-deuterium').value = 0;
				c.DOM.get('#planet-metal').setAttribute('data-captured', 0);
				c.DOM.get('#planet-crystal').setAttribute('data-captured', 0);
				c.DOM.get('#planet-deuterium').setAttribute('data-captured', 0);
			} else {
				c.DOM.get('#' + prefix + '-fleet-speed').selectedIndex = 0;
			}
			
		};
		
		var trackTacticalRetreat = function () {
					
			var getRetreatCosts = function (elements) {
				
				var total = 0;
				
				for (var i=0,il=elements.length; i<il; i++) {
					var type = elements[i].getAttribute('data-type'), value = elements[i].value;
					if (type > 200 && type < 400) {
						if (type != 210 && type != 212) {
							var division = type == 202 || type == 203 || type == 208 || type == 209 ? 4 : 1;
							total += Math.round(((c.entityInfo[type].resources.metal + c.entityInfo[type].resources.crystal + c.entityInfo[type].resources.deuterium) * value) / division);
						}
					}
				}
				
				return total;
				
			};
			
			setTacticalRetreat({
				'attackers': getRetreatCosts(c.DOM.getAll('#attacker-column .entity-number')),
				'defenders': getRetreatCosts(c.DOM.getAll('#defender-column .entity-number'))
			}, '#live-retreat-attacker', '#live-retreat-defender');
			
		};
		
		var setTacticalRetreat = function (retreat, selectorAtt, selectorDef) {
			
			var ratio = Math.round((retreat.attackers < retreat.defenders ? retreat.defenders / retreat.attackers : retreat.attackers / retreat.defenders) * 100) / 100;
			
			if (isFinite(ratio)) {
				c.DOM.get(selectorAtt).textContent = retreat.attackers > retreat.defenders ? ratio : 1;
				c.DOM.get(selectorDef).textContent = retreat.defenders > retreat.attackers ? ratio : 1;
			} else {
				c.DOM.get(selectorAtt).textContent = '-';
				c.DOM.get(selectorDef).textContent = '-';
			}
			
		};
		
		var setResultData = function (result, fuel) {
			
			var debrisMetal = result.debris.attackers.metal + result.debris.defenders.metal, 
				debrisCrystal = result.debris.attackers.crystal + result.debris.defenders.crystal;
			
			for (var party in result.losses) {
				c.DOM.get('#result-' + party + '-losses-metal').textContent = c.Utils.formatNumber(result.losses[party].metal);
				c.DOM.get('#result-' + party + '-losses-crystal').textContent = c.Utils.formatNumber(result.losses[party].crystal);
				c.DOM.get('#result-' + party + '-losses-deuterium').textContent = c.Utils.formatNumber(result.losses[party].deuterium);
				c.DOM.get('#result-' + party + '-losses-total').textContent = c.Utils.formatNumber(result.losses[party].metal + result.losses[party].crystal + result.losses[party].deuterium);
				
				var profitMetal = -result.losses[party].metal + debrisMetal, profitCrystal = -result.losses[party].crystal + debrisCrystal, profitDeuterium = -result.losses[party].deuterium;
				
				if (party == 'attackers' && result.result.attackers > 0) {
					profitMetal += result.plunder.metal;
					profitCrystal += result.plunder.crystal;
					profitDeuterium += result.plunder.deuterium;
				}
				
				for (var idx in fuel[party]) {
					if (fuel[party][idx] !== false) {
						profitDeuterium -= fuel[party][idx];
					}
				}
				
				c.DOM.get('#result-' + party + '-profit-metal').textContent = c.Utils.formatNumber(profitMetal);
				c.DOM.get('#result-' + party + '-profit-metal').classList.remove('loss','profit');
				c.DOM.get('#result-' + party + '-profit-metal').classList.add(profitMetal < 0 ? 'loss' : 'profit');
				c.DOM.get('#result-' + party + '-profit-crystal').textContent = c.Utils.formatNumber(profitCrystal);
				c.DOM.get('#result-' + party + '-profit-crystal').classList.remove('loss','profit');
				c.DOM.get('#result-' + party + '-profit-crystal').classList.add(profitCrystal < 0 ? 'loss' : 'profit');
				c.DOM.get('#result-' + party + '-profit-deuterium').textContent = c.Utils.formatNumber(profitDeuterium);
				c.DOM.get('#result-' + party + '-profit-deuterium').classList.remove('loss','profit');
				c.DOM.get('#result-' + party + '-profit-deuterium').classList.add(profitDeuterium < 0 ? 'loss' : 'profit');
				c.DOM.get('#result-' + party + '-profit-total').textContent = c.Utils.formatNumber(profitMetal + profitCrystal + profitDeuterium);
				c.DOM.get('#result-' + party + '-profit-total').classList.remove('loss','profit');
				c.DOM.get('#result-' + party + '-profit-total').classList.add((profitMetal + profitCrystal + profitDeuterium) < 0 ? 'loss' : 'profit');
			}
			
			c.DOM.get('#result-debris-metal').textContent = c.Utils.formatNumber(debrisMetal);
			c.DOM.get('#result-debris-crystal').textContent = c.Utils.formatNumber(debrisCrystal);
			c.DOM.get('#result-debris-total').textContent = c.Utils.formatNumber(debrisMetal + debrisCrystal);		
			
			if (result.result.attackers > 0) {
				c.DOM.get('#result-attackers-plunder-metal').textContent = c.Utils.formatNumber(result.plunder.metal);
				c.DOM.get('#result-attackers-plunder-crystal').textContent = c.Utils.formatNumber(result.plunder.crystal);
				c.DOM.get('#result-attackers-plunder-deuterium').textContent = c.Utils.formatNumber(result.plunder.deuterium);
				c.DOM.get('#result-attackers-plunder-total').textContent = c.Utils.formatNumber(result.plunder.metal + result.plunder.crystal + result.plunder.deuterium);
				c.DOM.get('#planet-metal').setAttribute('data-captured', result.plunder.metal);
				c.DOM.get('#planet-crystal').setAttribute('data-captured', result.plunder.crystal);
				c.DOM.get('#planet-deuterium').setAttribute('data-captured', result.plunder.deuterium);
			} else {
				c.DOM.get('#result-attackers-plunder-metal').textContent = 0;
				c.DOM.get('#result-attackers-plunder-crystal').textContent = 0;
				c.DOM.get('#result-attackers-plunder-deuterium').textContent = 0;
				c.DOM.get('#result-attackers-plunder-total').textContent = 0;
				c.DOM.get('#planet-metal').setAttribute('data-captured', 0);
				c.DOM.get('#planet-crystal').setAttribute('data-captured', 0);
				c.DOM.get('#planet-deuterium').setAttribute('data-captured', 0);
			}
			
			var plunder = c.DOM.get('#simulate-setting-plunder'),
				plunderPercentage = plunder[plunder.selectedIndex].value / 100, 
				metal = Math.round((c.DOM.get('#planet-metal').value || 0) * plunderPercentage), 
				crystal = Math.round((c.DOM.get('#planet-crystal').value || 0) * plunderPercentage), 
				deuterium = Math.round((c.DOM.get('#planet-deuterium').value || 0) * plunderPercentage),
				plunderTotal = metal + crystal + deuterium;
			
			c.DOM.get('#result-possible-plunder-metal').textContent = c.Utils.formatNumber(metal);
			c.DOM.get('#result-possible-plunder-crystal').textContent = c.Utils.formatNumber(crystal);
			c.DOM.get('#result-possible-plunder-deuterium').textContent = c.Utils.formatNumber(deuterium);
			c.DOM.get('#result-possible-plunder-total').textContent = c.Utils.formatNumber(plunderTotal);
			
			c.DOM.get('#result-cargos-large').textContent = c.Utils.formatNumber(Math.round(plunderTotal / 25000));
			c.DOM.get('#result-cargos-small').textContent = c.Utils.formatNumber(Math.round(plunderTotal / 5000));
			if (result.result.attackers > 0 && plunderTotal > 0) {
				c.DOM.get('#result-plunder-captured').textContent = c.Utils.formatNumber(Math.round(((result.plunder.metal + result.plunder.crystal + result.plunder.deuterium) / plunderTotal) * 100)) + '%';
			} else {
				c.DOM.get('#result-plunder-captured').textContent = '0%';
			}
			
			var debrisTotal = debrisMetal + debrisCrystal,
				moonchance = Math.floor((debrisTotal) / 100000),
				recyclers = Math.ceil(debrisTotal / 20000);
			
			c.DOM.get('#result-moonchance').textContent = (moonchance > 20 ? 20 : moonchance) + '%';
			c.DOM.get('#result-recyclers').textContent = c.Utils.formatNumber(recyclers);
			
			c.DOM.get('#result-wins-attackers').textContent = result.result.attackers + '%';
			c.DOM.get('#result-wins-defenders').textContent = result.result.defenders + '%';
			c.DOM.get('#result-wins-draw').textContent = result.result.draw + '%';
			c.DOM.get('#result-rounds').textContent = '~ ' + result.rounds;
			
		};
		
		var setRemainingEntities = function (resultLosses) {
			
			for (var party in resultLosses) {
				var prefix = 'simulate-' + party + '-';
				for (var i in party) {
					var entities = resultLosses[party][i], entityPrefix = prefix + i + '-entity-';
					for (var entity in entities) {
						var field = c.DOM.get('#' + entityPrefix + entity);
						field.setAttribute('data-lost', field.value - entities[entity]);
						field.setAttribute('data-remaining', entities[entity]);
						c.DOM.get('#' + entityPrefix + entity + '-lost').textContent = c.Utils.formatNumber(entities[entity]) + ' ← ';
					}
				}
			}
			
		};
		
		var setFlightData = function (time, fuel) {

			var deutSaveFactor = parseFloat(c.DOM.get('#simulate-setting-deutsavefactor').value || 1);

			for (var party in time) {
				var prefix = 'simulate-' + party + '-';
				for (var i in time[party]) {
					var hoursNotation = c.DOM.get('#' + prefix + i + '-flighttime').getAttribute('data-hours'), finalConsumption = parseInt(fuel[party][i] * deutSaveFactor);
					c.DOM.get('#' + prefix + i + '-flighttime').textContent = time[party][i] !== false ? c.Utils.formatDuration(time[party][i]) + ' ' + hoursNotation : '-';
					c.DOM.get('#' + prefix + i + '-consumption').textContent = fuel[party][i] !== false ? c.Utils.formatNumber(finalConsumption) : '-';
				}
			}
			
		};
		
		var handleSave = function () {
			
			var askSaveQuestion = function (name, callback) {
				
				c.Template.get(c.Application.getLanguage() + '/savequestion', function (t) {
					var pwrapper = c.Popup.open(t, function(){}, 320), boxes = c.DOM.getAll('input[type="checkbox"]', pwrapper);
					
					for (var i=0,il=boxes.length; i<il; i++) {
						boxes[i].addEventListener('change', function () {
							if (c.DOM.getAll('input[type="checkbox"]:checked', pwrapper).length > 0)
								c.DOM.get('#save-data-btn').classList.add('active');
							else
								c.DOM.get('#save-data-btn').classList.remove('active');
						});
					}
					
					if (c.DOM.getAll('input[type="checkbox"]:checked', pwrapper).length > 0) {
						c.DOM.get('#save-data-btn').classList.add('active');
					}					
					
					c.DOM.get('#save-data-btn').addEventListener('click', function () {
						if (c.DOM.getAll('input[type="checkbox"]:checked', pwrapper).length > 0) { 
							var data = getSimulationData(), options = c.DOM.getAll('input[type="checkbox"]', pwrapper);
							for (var i=0,il=options.length; i<il; i++) {
								if (options[i].checked === false) {
									delete data[options[i].value];
								}
							}	
							
							saveDataToStorage(name, data);
							
							c.Popup.close(pwrapper);
							
							if ("function" === typeof callback) {
								callback.call(null);
							}
						}
					});
				}, {"name": name});
				
			};
			
			var createItem = function (list, name, savedDefault) {
				
				var item = c.DOM.create('li'), radio = c.DOM.create('input'), span = c.DOM.create('span'), remove = c.DOM.create('div');
						
				radio.type = "radio";
				radio.name = "saved-data";
				radio.setAttribute('data-name', name);
				radio.addEventListener('click', function () {
					c.Store.set('saved_default', this.getAttribute('data-name'));
					c.DOM.get('#save-list').classList.add('default');
					c.Matomo.sendEvent('button', 'click', 'save make default');
				});
				if (name == savedDefault) {
					radio.checked = true;
					c.DOM.get('#save-list').classList.add('default');
				}
				
				remove.classList.add('remove');
				remove.appendChild(c.DOM.text('x'));
				remove.addEventListener('click', function () {
					var removeName = this.parentNode.getAttribute('data-name');
					if (removeName == c.Store.get('saved_default')) {
						c.Store.del('saved_default'); 
					}
					removeDataToStorage(removeName);
					loadSavedData('#save-list ul');
					c.Matomo.sendEvent('button', 'click', 'save remove data');
				});
				
				span.appendChild(c.DOM.text(name));
				span.appendChild(remove);
				span.classList.add('clearfix');
				span.setAttribute('data-name', name);
				span.addEventListener('click', function () {
					if (c.DOM.getOne('#save-list span.selected'))
						c.DOM.getOne('#save-list span.selected').classList.remove('selected');
					this.classList.add('selected');
					c.DOM.get('#save-list').classList.add('selected');
				});
				
				item.appendChild(radio);
				item.appendChild(span);
				item.classList.add('clearfix');
				
				list.appendChild(item);
				
			};
			
			var loadSavedData = function (listSelector) {
				
				c.DOM.clear(listSelector);
				
				var savedData = c.Store.get('saved_data'), savedDefault = c.Store.get('saved_default'), list = c.DOM.getOne(listSelector);
				if (savedData) {
					
					var data = JSON.parse(savedData);
					for (var name in data) {
						createItem(list, name, savedDefault);
					}
					
				} else {
					var empty = c.DOM.create('li');
					
					empty.appendChild(c.DOM.text(publicContext.locale['saveddata-empty']));
					empty.classList.add('empty');
					
					list.appendChild(empty);
				}
				
			};
			
			var saveDataToStorage = function (name, data) {
				
				var originalData = JSON.parse(c.Store.get('saved_data'));
				
				if (originalData == null)
					originalData = {};
				originalData[name] = data;
				
				c.Store.set('saved_data', originalData, true);
				
			};
			
			var removeDataToStorage = function (name) {
				
				var originalData = JSON.parse(c.Store.get('saved_data'));
				
				if (originalData[name]) delete originalData[name];
				if (c.Utils.countProperties(originalData) < 1) {
					c.Store.del('saved_data');
				} else {
					c.Store.set('saved_data', originalData, true);
				}
				
			};
			
			var saveNewData = function () {
				
				var newName = c.DOM.get('#save-name');
				if (newName.value.length > 2) {
					c.DOM.getOne('#save-new-wrapper .info').style.display = "none";
					if (c.DOM.get('#save-default-new').checked) {
						c.Store.set('saved_default', newName.value);
					}
					
					askSaveQuestion(newName.value, function () {
						newName.value = "";
						loadSavedData('#save-list ul');
						c.DOM.get('#save-list').style.display = "block";
						c.DOM.get('#save-new-wrapper').style.display = "none";
					});					
				} else {
					c.DOM.getOne('#save-new-wrapper .info').style.display = "block";
				}
				
				c.Matomo.sendEvent('button', 'click', 'save new data');
				
			};
			
			var saveData = function (newName) {
				
				var selectedSave = c.DOM.getOne('#save-list span.selected');
				
				if (selectedSave || "string" === typeof newName) {
					
					var name = "string" === typeof newName ? newName : selectedSave.getAttribute('data-name');
					
					askSaveQuestion(name);
					
					c.Matomo.sendEvent('button', 'click', 'save override data');
					
				}
				
			};
			
			var loadData = function () {
				
				var selectedSave = c.DOM.getOne('#save-list span.selected');
				
				if (selectedSave) {
					
					var data = JSON.parse(c.Store.get('saved_data'));
					
					loadSimulationData(data[selectedSave.getAttribute('data-name')]);
				
					c.Matomo.sendEvent('button', 'click', 'save load data');
					
				}
				
			};
			
			var resetDefault = function () {
				
				if (c.DOM.getOne('#save-list input:checked')) {
					c.DOM.getOne('#save-list input:checked').checked = false;
				}
				c.DOM.get('#save-list').classList.remove('default');
				c.Store.del('saved_default');
				c.Matomo.sendEvent('button', 'click', 'save reset default');
				
			};
			
			if (c.Store.test()) {
				c.Template.get(c.Application.getLanguage() + '/save', function (t) {
					c.Popup.open(t, function(){}, 320);
					
					loadSavedData('#save-list ul');
					c.DOM.get('#save-new').addEventListener('click', saveNewData);
					c.DOM.get('#save-cancel').addEventListener('click', function () {
						c.DOM.get('#save-name').value="";
						c.DOM.get('#save-list').style.display = "block";
						c.DOM.get('#save-new-wrapper').style.display = "none";
					});
					c.DOM.get('#save-new-btn').addEventListener('click', function () {
						c.DOM.get('#save-list').style.display = "none";
						c.DOM.get('#save-new-wrapper').style.display = "block";
					});
					c.DOM.get('#save-override').addEventListener('click', saveData);
					c.DOM.get('#save-load').addEventListener('click', loadData);
					c.DOM.get('#save-default-reset').addEventListener('click', resetDefault);
				});
			} else {
				c.Popup.open('<h1>'+publicContext.locale.storagesupport+'</h1>');
			}
			
		};
		
		var prefill = function (hash) {
			
			var match = /^#prefill=((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/.exec(hash);
			
			if (match.length === 2) {
			
				loadSimulationData(JSON.parse(window.atob(match[1])));
		
			}
			
		};
		
		var getSimulationData = function () {
			
			var fields = c.DOM.getAll('#attacker-column input[type="number"], #defender-column input[type="number"], #planet-column input[type="number"]'), data = {"0":[],"1":[],"settings":{}};
			
			for (var i=0,il=fields.length; i<il; i++) {
				
				var value = fields[i].value, nameData = fields[i].id.split('-');
				
				if (nameData[0] === 'simulate' && value.length > 0 && value != 0) {
					var party = nameData[1], index = nameData[2], property = nameData[3], label = nameData[4], type = fields[i].getAttribute('data-type')|0;
					
					var playerArray = party == 'attackers' ? data[0] : data[1];
					if (!playerArray[index]) {
						playerArray[index] = {};
					}
					
					if (property == "coords") {
						if ("undefined" === typeof playerArray[index]['planet']) {
							playerArray[index]['planet'] = {};
						}
						playerArray[index]['planet'][label] = value|0;							
					} else if (type >= 100 && type < 200) {
						if ("undefined" === typeof playerArray[index]['research']) {
							playerArray[index]['research'] = {};
						}
						playerArray[index]['research'][type] = {"level": value|0};
					} else if (type >= 200 && type < 300) {
						if ("undefined" === typeof playerArray[index]['ships']) {
							playerArray[index]['ships'] = {};
						}
						playerArray[index]['ships'][type] = {"count": value|0};
					} else if (type >= 400 && type <= 503) {
						if ("undefined" === typeof playerArray[index]['defence']) {
							playerArray[index]['defence'] = {};
						}
						playerArray[index]['defence'][type] = {"count": value|0};
					}
				}
			}
			
			if (data[1][0]) {
				data[1][0]['resources'] = {
					"metal": c.DOM.get('#planet-metal').value|0,
					"crystal": c.DOM.get('#planet-crystal').value|0,
					"deuterium": c.DOM.get('#planet-deuterium').value|0
				};
			}
			
			data['settings'] = getServerData();
			
			data[0] = data[0].filter(function (item) { return "undefined" !== typeof item; });
			data[1] = data[1].filter(function (item) { return "undefined" !== typeof item; });
			
			return data;
						
		};
		
		var loadSimulationData = function (data) {
			
			var attackerAddLabel = c.DOM.getOne('#attacker-column .party-selection .add-player'), defenderAddLabel = c.DOM.getOne('#defender-column .party-selection .add-player');
			
			var currentAdditionalPlayers = c.DOM.getAll('.party-player .remove-player');
			for (var i=0,il=currentAdditionalPlayers.length; i<il; i++) {
				removePlayer.call(currentAdditionalPlayers[i]);
			}
			
			attackerIndex = 0;
			defenderIndex = 0;
			
			var clearPlayerButtons = c.DOM.getAll('.party-player .clear-player');
			for (var i=0,il=clearPlayerButtons.length; i<il; i++) {
				clearPlayer.call(clearPlayerButtons[i]);
			}
			
			prefillCache = data;
						
			for (var party in data) {
				if (Array.isArray(data[party]) && (party == 0 || party == 1)) {
					for (var i=0,il=data[party].length; i<il; i++) {
						//Loading will be done via addAdditionalPlayer
						if (i > 0) 	addAdditionalPlayer.call(party == 0 ? attackerAddLabel : defenderAddLabel);
						else 		loadPlayer(i, party|0, data[party][i]);
					}
				} else if (party === 'settings') {
					loadServerData(data.settings);
				}
			}
			
		};
		
		var loadPlayer = function (index, partyIndex, data) {
			
			var party = partyIndex == 1 ? 'defenders' : 'attackers';
			
			var setSimulateInputValue = function (party, index, property, label, value) {
					var idData = ['simulate', party, index, property, label],
						input = c.DOM.get('#' + idData.join('-'));
					
					if (input) {
						input.value = value;
					
						if ((label == 407 || label == 408) && value == 1) {
							input.nextElementSibling.checked = true;
						}
					}
			};
			
			if (data.planet) {
			
				setSimulateInputValue(party, index, 'coords', 'galaxy', data.planet.galaxy);
				setSimulateInputValue(party, index, 'coords', 'system', data.planet.system);
				setSimulateInputValue(party, index, 'coords', 'position', data.planet.position);
			
			}
			
			if (data.speed) {
				var option = c.DOM.getOne('#' + ['simulate', party, index, 'fleet', 'speed'].join('-') + ' option[value="' + data.speed + '"]');
				if (option) option.selected = true;
			}
			
			if (data.ships) {
				for (var i in data.ships) {
					// simulate-defender-0-entity-204
					if (i == 212) {
						if ((partyIndex === 1 && index !== 0) || (partyIndex !== 1)) continue;
					}
					setSimulateInputValue(party, index, 'entity', i, data.ships[i].count);
				}
			}
			
			if (data.research) {
				if ("undefined" !== typeof data.research['109']) {
					setSimulateInputValue(party, index, 'techs', 'weapon', data.research['109'].level);
				}
				if ("undefined" !== typeof data.research['110']) {
					setSimulateInputValue(party, index, 'techs', 'shield', data.research['110'].level);
				}
				if ("undefined" !== typeof data.research['111']) {
					setSimulateInputValue(party, index, 'techs', 'armour', data.research['111'].level);
				}
				if ("undefined" !== typeof data.research['115']) {
					setSimulateInputValue(party, index, 'techs', 'combustion', data.research['115'].level);
				}
				if ("undefined" !== typeof data.research['117']) {
					setSimulateInputValue(party, index, 'techs', 'impulse', data.research['117'].level);
				}
				if ("undefined" !== typeof data.research['118']) {
					setSimulateInputValue(party, index, 'techs', 'hyperspace', data.research['118'].level);
				}
			}
			
			if (partyIndex == 1 && index == 0) {
				if (data.defence) {
					for (var i in data.defence) {
						setSimulateInputValue(party, index, 'entity', i, data.defence[i].count);
					}
				}
				if (data.resources) {
					c.DOM.get('#planet-metal').value = data.resources.metal;
					c.DOM.get('#planet-crystal').value = data.resources.crystal;
					c.DOM.get('#planet-deuterium').value = data.resources.deuterium;
				}
			}
			
		};
		
		var loadServerData = function (server) {
			
			c.DOM.get('#simulate-setting-fleetspeed').value = server.speed_fleet;
			c.DOM.get('#simulate-setting-rapidfire').checked = server.rapid_fire == 1;
			c.DOM.get('#simulate-setting-fleetdebris').value = server.debris_factor * 100;
			c.DOM.get('#simulate-setting-defencedebris').value = server.def_to_tF == 1 ? server.debris_factor_def * 100 : 0;
			c.DOM.get('#simulate-setting-defencerepair').value = server.repair_factor ? server.repair_factor * 100 : 70;
			c.DOM.get('#simulate-setting-donutgalaxy').checked = server.donut_galaxy == 1;
			c.DOM.get('#simulate-setting-donutsystem').checked = server.donut_system == 1;
			c.DOM.get('#simulate-setting-galaxy').value = server.galaxies;
			c.DOM.get('#simulate-setting-system').value = server.systems;
            c.DOM.get('#simulate-setting-deutsavefactor').value = server.global_deuterium_save_factor;
			
			if ("undefined" !== typeof server.plunder) {
				var option = c.DOM.getOne('#simulate-setting-plunder option[value="' + server.plunder + '"]'); 
				if (option) option.selected = true;
			}
			
			if ("undefined" !== typeof server.simulations) {
				c.DOM.get('#simulations').value = server.simulations;
			}
			
		};
		
		var getServerData = function () {
			
			var plunder = c.DOM.get('#simulate-setting-plunder'), defDebris = c.DOM.get('#simulate-setting-defencedebris'),			
				data = {
				'speed_fleet': c.DOM.get('#simulate-setting-fleetspeed').value,
				'rapid_fire': c.DOM.get('#simulate-setting-rapidfire').checked ? 1 : 0,
				'repair_factor': c.DOM.get('#simulate-setting-defencerepair').value / 100,
				'donut_galaxy': c.DOM.get('#simulate-setting-donutgalaxy').checked ? 1 : 0,
				'donut_system': c.DOM.get('#simulate-setting-donutsystem').checked ? 1 : 0,
				'galaxies': c.DOM.get('#simulate-setting-galaxy').value,
				'systems': c.DOM.get('#simulate-setting-system').value,
				'plunder': plunder[plunder.selectedIndex].value,
				'simulations': c.DOM.get('#simulations').value,
                'global_deuterium_save_factor': c.DOM.get('#simulate-setting-deutsavefactor').value
			};
			
			if (defDebris.value > 0) {
				data['def_to_tF'] = 1;
				data['debris_factor'] = defDebris.value / 100;
			} else {
				data['def_to_tF'] = 0;
				data['debris_factor'] = c.DOM.get('#simulate-setting-fleetdebris').value / 100;
			}
			
			return data;
			
		};
		
		var loadPartyFromReport = function () {
			var input = c.DOM.getOne('.input-sr-key', this.parentNode), value = input.value.trim(), regex = new RegExp('^'+input.getAttribute('pattern')+'$');
			if (value.length > 0 && regex.test(value)) {
				var data = {
					'player': value,
					'party': input.getAttribute('data-party'),
					'index': input.getAttribute('data-index')
				};
				
				var selector = '#' + (data.party == 1 ? 'defender' : 'attacker') + '-' + data.index;
				if (data.index == 0 && data.party == 1) {
					selector = selector + ' input[type="number"], ' + selector + '-defence input[type="number"]';
					c.DOM.get('#simulate-defenders-0-entity-407-checkbox').checked = false;
					c.DOM.get('#simulate-defenders-0-entity-408-checkbox').checked = false;
				} else {
					selector += ' input[type="number"]';
				}
				var partyInputs = c.DOM.getAll(selector);
				for (var i=0, il=partyInputs.length; i<il; i++) {
					partyInputs[i].value = "";
				}
				
				var loadid2 = c.Loader.create('body');
				c.REST.post('player', data, function (response) {
					if ("undefined" !== typeof response.data) {
						loadPlayer(response.index, response.party, response.data.defender);
						if ("undefined" !== typeof response.server) {
							loadServerData(response.server);
						}					
						if (response.index == 0 && response.party == 1) {
							c.DOM.get('#simulate-setting-plunder').selectedIndex = response.data.loot_percentage / 25 - 2;
						}
					}
					
					if ("undefined" !== typeof response.errors) {
						for (var i in response.errors) {
							c.Info.show(response.errors[i]);
						}
					}
					c.Matomo.sendEvent('button', 'click', 'load spy report ' + data.party + ' ' + data.index);
					c.Loader.remove(loadid2);
				});
			} else if (/(?:coords;\d:\d{1,3}:\d{1,2})?(?:\|?\d{1,3};\d+)*/g.test(value)) {
				//coords;1:21:6|109;12|110;12|111;13|115;14|117;9|118;6|214;3|401;1250|402;1000|403;250|404;30|406;12|407;1|408;1|502;20|
				var player = {'planet': {}, 'research': {}, 'ships': {}, 'defence': {}};
				var data = value.split('|');
				for (var i in data) {
					var props = data[i].split(';');
					if (props.length === 2) {
						if (props[0] == 'coords') {
							var coords = props[1].split(':');
							if (coords.length === 3) {
								player.planet.galaxy = coords[0];
								player.planet.system = coords[1];
								player.planet.position = coords[2];
							}
						} else if (props[0] >= 100 && props[0] <= 199) {
							player.research[props[0]] = {'level': props[1]};
						} else {
							if ("undefined" !== typeof c.entityInfo[props[0]]) {
								if (props[0] < 400) {
									player.ships[props[0]] = {'count': props[1]};
								} else {
									player.defence[props[0]] = {'count': props[1]};
								}
							}
						}
					}
				}
				loadPlayer(input.getAttribute('data-index'), input.getAttribute('data-party'), player);
				
			}
		};
		
		var enableIPMSimulator = function () {

			var damage = 0, defenderArmour = 0, defenderCoords = {'galaxy': 0, 'system': 0, 'position': 0};
			
			var closeIpmSimulator = function () {
				
				c.DOM.get('#simulation-ipm').classList.remove('active');
				
			};
			
			var updateDefenceLosses = function () {
				
				var lostEntities = c.DOM.get('.ipm-entity-losses'), losses = {'metal': 0, 'crystal': 0, 'deuterium': 0}, ipmTotal = 0, maxTotal = 0;
				for (var i=0,il=lostEntities.length; i<il; i++) {
					var lost = lostEntities[i].getAttribute('data-lost')|0, type = lostEntities[i].getAttribute('data-type'), ipms = c.DOM.get('#simulate_ipm-entity-' + type + '-ipm').value || 0, max = c.DOM.get('#simulate_ipm-entity-' + type + '-max').getAttribute('data-max') || 0;
					
					losses.metal += lost * c.entityInfo[type].resources.metal;
					losses.crystal += lost * c.entityInfo[type].resources.crystal;
					losses.deuterium += lost * c.entityInfo[type].resources.deuterium;
					
					ipmTotal += ipms|0;
					maxTotal += max|0;
				}
				
				c.DOM.get('#ipm-result-defender-losses-metal').textContent = c.Utils.formatNumber(Math.round(losses.metal));
				c.DOM.get('#ipm-result-defender-losses-crystal').textContent = c.Utils.formatNumber(Math.round(losses.crystal));
				c.DOM.get('#ipm-result-defender-losses-deuterium').textContent = c.Utils.formatNumber(Math.round(losses.deuterium));
				c.DOM.get('#ipm-result-defender-losses-total').textContent = c.Utils.formatNumber(Math.round(losses.metal + losses.crystal + losses.deuterium));
				
				c.DOM.get('#ipm-result-attacker-costs-metal').textContent = c.Utils.formatNumber(Math.round(c.entityInfo[503].resources.metal * ipmTotal));
				c.DOM.get('#ipm-result-attacker-costs-crystal').textContent = c.Utils.formatNumber(Math.round(c.entityInfo[503].resources.crystal * ipmTotal));
				c.DOM.get('#ipm-result-attacker-costs-deuterium').textContent = c.Utils.formatNumber(Math.round(c.entityInfo[503].resources.deuterium * ipmTotal));
				c.DOM.get('#ipm-result-attacker-costs-total').textContent = c.Utils.formatNumber(Math.round((c.entityInfo[503].resources.metal + c.entityInfo[503].resources.crystal + c.entityInfo[503].resources.deuterium) * ipmTotal));
				
				c.DOM.get('#ipm-total').textContent = c.Utils.formatNumber(maxTotal);
				
			};
			
			var updateIPMOnEntity = function () {
				
				var type = this.getAttribute('data-type'), selector = 'simulate_ipm-entity-' + type, entity = c.DOM.get('#' + selector), ipms = c.DOM.get('#' + selector + '-ipm').value || 0;
				
				var entitiesRemaining = entity.value, ipmsMax = entity.value;
					
				if (entity.value > 0) {
					
					if (type == 502) {
						
						entitiesRemaining -= ipms;
						
					} else {
					
						var HP = (c.entityInfo[type].armour + (c.entityInfo[type].armour * 0.1 * defenderArmour)) * 0.1;
						
						entitiesRemaining = ((HP * entity.value) - (damage * ipms)) / HP;
						ipmsMax = (HP * entity.value) / damage;
					
					}
					
					if (entitiesRemaining < 0) entitiesRemaining = 0;
					
					ipmsMax = Math.ceil(ipmsMax);
					entitiesRemaining = Math.ceil(entitiesRemaining);
					
				}
				
				var span = c.DOM.get('#' + selector + '-lost'), max = c.DOM.get('#' + selector + '-max');
				span.textContent = c.Utils.formatNumber(entitiesRemaining) + ' ← ';
				span.setAttribute('data-lost', entity.value - entitiesRemaining);
				span.setAttribute('data-remaining', entitiesRemaining);
				max.textContent = c.Utils.formatNumber(ipmsMax);
				max.setAttribute('data-max', ipmsMax);
				
				updateDefenceLosses();
				
			};
			
			var updateAttackerInfo = function () {
				
				if (defenderCoords.galaxy.length > 0 && defenderCoords.galaxy == (c.DOM.get('#ipm-attacker-coords-galaxy').value || 0)) {

					var attackerSystem = c.DOM.get('#ipm-attacker-coords-system').value || 0, fleetSpeed = c.DOM.get('#simulate-setting-fleetspeed').value || false, distance = false;
					if (attackerSystem != 0 && defenderCoords.system != 0) {
						distance = getSystemDistance(attackerSystem, defenderCoords.system, c.DOM.get('#simulate-setting-system').value || 499, c.DOM.get('#simulate-setting-donutsystem').checked ? 1 : 0);
					}
					
					c.DOM.get('#ipm-attacker-flight').textContent = fleetSpeed !== false && distance !== false ? c.Utils.formatDuration((30 + 60 * distance) / fleetSpeed) : "\u221E";
					c.DOM.get('#ipm-attacker-impulse').textContent = distance !== false ? Math.ceil((distance + 1) / 5) : "\u221E";
				} else {
					c.DOM.get('#ipm-attacker-flight').textContent = "\u221E";
					c.DOM.get('#ipm-attacker-impulse').textContent = "\u221E";
				}
				
			};
			
			var openIPMSimulator = function () {
				
				var inputs = c.DOM.getAll('#defender-0-defence .simulate-values input.entity-ipm'),
					attackerWeapon = c.DOM.get('#simulate-attackers-0-techs-weapon').value || 0;
				
				for (var i=0,il=inputs.length; i<il; i++) {
					var input = inputs[i], type = input.getAttribute('data-type');
					if (input.type == 'checkbox') {
						c.DOM.get('#simulate_ipm-entity-' + type + '-checkbox').checked = input.checked;
					} else {
						c.DOM.get('#simulate_ipm-entity-' + type).value = input.value;
						c.DOM.get('#simulate_ipm-entity-' + type + '-lost').setAttribute('data-remaining', input.value);
					}
				}
				
				c.DOM.get('#ipm-result-defender-losses-metal').textContent = 0;
				c.DOM.get('#ipm-result-defender-losses-crystal').textContent = 0;
				c.DOM.get('#ipm-result-defender-losses-deuterium').textContent = 0;
				c.DOM.get('#ipm-result-defender-losses-total').textContent = 0;
				
				c.DOM.get('#ipm-result-attacker-costs-metal').textContent = 0;
				c.DOM.get('#ipm-result-attacker-costs-crystal').textContent = 0;
				c.DOM.get('#ipm-result-attacker-costs-deuterium').textContent = 0;
				c.DOM.get('#ipm-result-attacker-costs-total').textContent = 0;
				
				c.DOM.get('#ipm-attacker-coords-galaxy').value = c.DOM.get('#simulate-attackers-0-coords-galaxy').value;
				c.DOM.get('#ipm-attacker-coords-system').value = c.DOM.get('#simulate-attackers-0-coords-system').value;
				c.DOM.get('#ipm-attacker-coords-position').value = c.DOM.get('#simulate-attackers-0-coords-position').value;
				
				var selectedTarget = c.DOM.getOne('.ipm-target-primary:checked');
				if (selectedTarget) selectedTarget.checked = false;
				
				damage = c.entityInfo[503].weapon + (c.entityInfo[503].weapon * 0.1 * attackerWeapon);
				defenderArmour = c.DOM.get('#simulate-defenders-0-techs-armour').value;
				
				var ipms = c.DOM.getAll('#simulation-ipm .ipm-defence');
			
				for (var i=0,il=ipms.length; i<il; i++) {
					ipms[i].value = 0;
					updateIPMOnEntity.call(ipms[i]);
				}
				
				defenderCoords.galaxy = c.DOM.get('#simulate-defenders-0-coords-galaxy').value || 0;
				defenderCoords.system = c.DOM.get('#simulate-defenders-0-coords-system').value || 0;
				
				updateAttackerInfo();
				
			};
			
			var applyDefence = function () {
				
				var remainingEntities = c.DOM.getAll('#ipm-defender .ipm-entity-losses');
				for (var i=0,il=remainingEntities.length; i<il; i++) {
					var type = remainingEntities[i].getAttribute('data-type'), remaining = remainingEntities[i].getAttribute('data-remaining');
					if (type == 407 || type == 408) {
						c.DOM.get('#simulate-defenders-0-entity-'+ type +'-checkbox').checked = remaining != 0;
					}
					c.DOM.get('#simulate-defenders-0-entity-' + type).value = remaining;
				}
				
				closeIpmSimulator();
				
			};
			
			c.DOM.get('#ipm-simulate').addEventListener('click', function () {
				openIPMSimulator();
				c.DOM.get('#simulation-ipm').classList.add('active');
				c.Matomo.sendEvent('button', 'click', 'open ipm simulator');
			});
			
			c.DOM.get('#simulate-ipm-apply').addEventListener('click', function () {
				applyDefence();
				c.Matomo.sendEvent('button', 'click', 'apply ipm simulator');
			});
			
			c.DOM.get('#simulation-ipm-close').addEventListener('click', closeIpmSimulator);
			
			var fields = c.DOM.getAll('#simulation-ipm .ipm-defence, #simulation-ipm .entity-number');
			
			for (var i=0,il=fields.length; i<il; i++) {
				fields[i].addEventListener('change', updateIPMOnEntity);
				fields[i].addEventListener('keyup', updateIPMOnEntity);
			}
			
			var coords = c.DOM.getAll('#ipm-attacker-coords-system, #ipm-attacker-coords-galaxy');
		
			for (var i=0,il=coords.length; i<il; i++) {
				coords[i].addEventListener('change', updateAttackerInfo);
				coords[i].addEventListener('keyup', updateAttackerInfo);
			}
						
		};
		
		var resetNextWaves = function () {
			//TODO:: test
			if (currentWave < waves.length) {
				for (var i = waves.length; i > currentWave; i--) {
					waves.pop();
				}
			}
			
		};
		
		var loadWave = function () {
			
			var wave = waves[currentWave];
				
			for (var prop in wave) {
				if (prop == 'resources') {
					c.DOM.get('#planet-metal').value = wave[prop].metal; 
					c.DOM.get('#planet-crystal').value = wave[prop].crystal;
					c.DOM.get('#planet-deuterium').value = wave[prop].deuterium;
				} else {
					var party = wave[prop];
					for (var index in party) {
						var prefix = '#simulate-' + prop + 's-' + index + '-entity-';
						for (var type in party[index]) {
							c.DOM.get(prefix + type).value = party[index][type];
							if ((type == 407 || type == 408) && party[index][type] > 0) {
								c.DOM.get(prefix + type + '-checkbox').checked = true;
							}
						}
					}
				}
			}
			
		};
		
		var resetWaveData = function () {
			
			var entities = c.DOM.getAll('#parties .entity-number');
			for (var e=0,el=entities.length; e<el; e++) {
				var type = entities[e].getAttribute('data-type')|0;
				if (entities[e].value.length > 0 && type != 502) {
					entities[e].setAttribute('data-remaining', 0);
					entities[e].setAttribute('data-lost', 0);
					c.DOM.getOne('.entity-remaining' , entities[e].parentNode).textContent = '';
					if (type == 407 || type == 408) {
						c.DOM.getOne('.entity-dome-checkbox', entities[e].parentNode).checked = false;
					}
				}
			}
						
			c.DOM.get('#planet-metal').setAttribute('data-captured', 0);
			c.DOM.get('#planet-crystal').setAttribute('data-captured', 0);
			c.DOM.get('#planet-deuterium').setAttribute('data-captured', 0);

		};
		
		var loadNextWave = function () {
			
			if (this.classList.contains('active')) { 
			
				if (currentWave === waves.length) {
				
					var players = c.DOM.getAll('.party-values .party-player'), data = {'resources': {'metal': 0, 'crystal': 0, 'deuterium': 0}}, repair = (c.DOM.get('#simulate-setting-defencerepair').value|0) / 100;
					for (var i=0,il=players.length; i<il; i++) {
						var playerData = players[i].id.split('-'), player = playerData[0], index = playerData[1], selector = '#' + players[i].id + ' .entity-number';
						if ("undefined" === typeof data[player]) {
							data[player] = {};
						}
						data[player][index] = {};
						if (player == "defender" && index == 0) {
							selector += ', #' + players[i].id + '-defence .entity-number';
						}
						var entities = c.DOM.getAll(selector);
						for (var e=0,el=entities.length; e<el; e++) {
							var type = entities[e].getAttribute('data-type')|0;
							if (entities[e].value.length > 0 && type != 502) {
								data[player][index][type] = entities[e].value;
								if (type >= 400) {
									entities[e].value = Math.floor((entities[e].getAttribute('data-remaining')|0) + ((entities[e].getAttribute('data-lost')|0) * repair));
									if ((type == 407 || type == 408) && (entities[e].getAttribute('data-remaining')|0) < 1) {
										c.DOM.getOne('.entity-dome-checkbox' , entities[e].parentNode).checked = false;
									}
								} else {
									entities[e].value = entities[e].getAttribute('data-remaining');
								}
							}
						}
					}
					
					var planetMetal = c.DOM.get('#planet-metal'), planetCrystal = c.DOM.get('#planet-crystal'), planetDeuterium = c.DOM.get('#planet-deuterium');
					
					data.resources.metal = planetMetal.value;
					data.resources.crystal = planetCrystal.value;
					data.resources.deuterium = planetDeuterium.value;
					
					planetMetal.value -= planetMetal.getAttribute('data-captured');
					planetCrystal.value -= planetCrystal.getAttribute('data-captured');
					planetDeuterium.value -= planetDeuterium.getAttribute('data-captured');
					
					resetWaveData();
					
					waves[currentWave++] = data;
				
					this.classList.remove('active');
					wavePrevious.classList.add('active');
					
				} else {
					
					currentWave++;
					
					if (currentWave === waves.length - 1) {
						waveNext.classList.remove('active');
					}
					wavePrevious.classList.add('active');
					
					resetWaveData();
					loadWave();
					
				}
				
				c.Matomo.sendEvent('button', 'click', 'wave next');
				
			}
			
		};
		
		var loadPreviousWave = function () {
			
			if (currentWave > 0) {
				currentWave--;
			
				if (currentWave === 0) {
					wavePrevious.classList.remove('active');
				}
				
				if (currentWave === waves.length - 1) {
					waveNext.classList.remove('active');
				} else {
					waveNext.classList.add('active');
				}
				
				resetWaveData();
				loadWave();
				
				c.Matomo.sendEvent('button', 'click', 'wave previous');
				
			}
			
		};
		
		var enableHowToSelection = function () {
			
			var steps = c.DOM.getAll('#cr-howto ol li');
			
			for (var i=0,il=steps.length; i<il; i++) {
				var step = steps[i];
				step.addEventListener('click', function (e) {
					var selected = this.classList.contains('selected');
					c.Utils.removeSelected(steps, 'selected');
					if (!selected) {
						this.classList.add('selected');
						window.location.hash = this.getAttribute('data-step');
					}
				});
			}
			
		};
		
		var getSystemDistance = function (system1, system2, systems, donutsystem) {
			
			var systemDistance = Math.abs(system2 - system1), systemcutoff = systems / 2;
			if (systemDistance > systemcutoff && donutsystem === 1) systemDistance = systemcutoff - (systemDistance - systemcutoff);
			
			return systemDistance;
									
		};

		var setSimulationModule = function (module) {
			simulationModule = module;
			simulationModule.init();
		};
		
		return {'init': init, 'simulationMessage': simulationMessage, 'simulationFallback': simulationFallback, setSimulationModule: setSimulationModule, simulationCancel: simulationCancel, simulationHandle: handleSimulation};
		
	}());
		