
	var Simulator = new function () {
		
		var attackersData = {}, defendersData = {}, defenderBase = false, settings = {};
		
		var init = function (attData, defData, sett) {
			
			attackersData = attData;
			defendersData = defData;
			settings = sett;
			defenderBase = getCoordinates(defData[0]);
			
		};
		
		var getCoordinates = function (player) {
			
			if ("undefined" !== typeof player.coords) {
				if ("undefined" !== typeof player.coords.galaxy && "undefined" !== typeof player.coords.system && "undefined" !== typeof player.coords.position) {
					if (player.coords.galaxy > 0 && player.coords.system > 0 && player.coords.position > 0)
						return player.coords;
				}
			}
			
			return false;
			
		};
		
		var calculateAverage = function (simulationResults) {
			
			var setAverageBaseline = function (attackers, defenders) {
				
				var loopParty = function (party, lost, remaining) {
					
					for (var i in party) {
						if ("undefined" === typeof lost[i] || "undefined" === typeof remaining[i]) {
							lost[i] = {};
							remaining[i] = {};
						}
						for (var type in party[i].entity) {
							lost[i][type] = 0;
							remaining[i][type] = 0;
						}
					}
					
				};
				
				var averageBase = {
					'debris': {
						'attackers' : {'metal': 0, 'crystal': 0},
						'defenders' : {'metal': 0, 'crystal': 0}
					},
					'losses': {
						'attackers' : {'metal': 0, 'crystal': 0, 'deuterium': 0},
						'defenders' : {'metal': 0, 'crystal': 0, 'deuterium': 0}
					},
					'lost': {
						'attackers': {},
						'defenders': {}
					},
					'remaining': {
						'attackers': {},
						'defenders': {}
					},
					'plunder' : {'metal': 0, 'crystal': 0, 'deuterium': 0},
					'result' : {'attackers': 0, 'defenders': 0, 'draw': 0},
					'rounds' : 0
				};
				
				loopParty(attackers, averageBase.lost.attackers, averageBase.remaining.attackers);
				loopParty(defenders, averageBase.lost.defenders, averageBase.remaining.defenders);
				
				return averageBase;
				
			};
			
			var addUpPartiesEntities = function (parties, average) {
				
				for (var party in parties) {
					for (var i in party) {
						var entities = parties[party][i];
						for (var entity in entities) {
							average[party][i][entity] += entities[entity];
						}
					}
				}
				
			};
			
			var dividePartiesEntities = function (parties, simulations) {
				
				for (var party in parties) {
					for (var i in party) {
						var entities = parties[party][i];
						for (var entity in entities) {
							parties[party][i][entity] = Math.round(entities[entity] / simulations);
						}
					}
				}
				
			};
			
			var average = setAverageBaseline(attackersData, defendersData), simulations = simulationResults.length;
				
			/* Add up everything */
			for (var i=0, il=simulations; i<il; i++) {
				addUpPartiesEntities(simulationResults[i].remaining, average.remaining);
				addUpPartiesEntities(simulationResults[i].lost, average.lost);
				
				average.debris.attackers.metal += simulationResults[i].debris.attackers.metal;
				average.debris.attackers.crystal += simulationResults[i].debris.attackers.crystal;
				average.debris.defenders.metal += simulationResults[i].debris.defenders.metal;
				average.debris.defenders.crystal += simulationResults[i].debris.defenders.crystal;
				
				average.losses.attackers.metal += simulationResults[i].losses.attackers.metal;
				average.losses.attackers.crystal += simulationResults[i].losses.attackers.crystal;
				average.losses.attackers.deuterium += simulationResults[i].losses.attackers.deuterium;
				average.losses.defenders.metal += simulationResults[i].losses.defenders.metal;
				average.losses.defenders.crystal += simulationResults[i].losses.defenders.crystal;
				average.losses.defenders.deuterium += simulationResults[i].losses.defenders.deuterium;
				
				average.plunder.metal += simulationResults[i].plunder.metal;
				average.plunder.crystal += simulationResults[i].plunder.crystal;
				average.plunder.deuterium += simulationResults[i].plunder.deuterium;
				
				for (var resultProp in simulationResults[i].result) {
					average.result[resultProp] += simulationResults[i].result[resultProp];
				}
				
				average.rounds += simulationResults[i].rounds;
			}
			
			/* Divide everything */
			dividePartiesEntities(average.remaining, simulations);
			dividePartiesEntities(average.lost, simulations);
			
			average.debris.attackers.metal = Math.round(average.debris.attackers.metal / simulations);
			average.debris.attackers.crystal = Math.round(average.debris.attackers.crystal / simulations);
			average.debris.defenders.metal = Math.round(average.debris.defenders.metal / simulations);
			average.debris.defenders.crystal = Math.round(average.debris.defenders.crystal / simulations);
			
			average.losses.attackers.metal = Math.round(average.losses.attackers.metal / simulations);
			average.losses.attackers.crystal = Math.round(average.losses.attackers.crystal / simulations);
			average.losses.attackers.deuterium = Math.round(average.losses.attackers.deuterium / simulations);
			average.losses.defenders.metal = Math.round(average.losses.defenders.metal / simulations);
			average.losses.defenders.crystal = Math.round(average.losses.defenders.crystal / simulations);
			average.losses.defenders.deuterium = Math.round(average.losses.defenders.deuterium / simulations);

			average.plunder.metal = Math.round(average.plunder.metal / simulations);
			average.plunder.crystal = Math.round(average.plunder.crystal / simulations);
			average.plunder.deuterium = Math.round(average.plunder.deuterium / simulations);

			for (var resultProp in average.result) {
				average.result[resultProp] = Math.round(average.result[resultProp] / simulations * 100);
			}
			
			average.rounds = Math.round(average.rounds / simulations);
			
			return average;
			
		};
		
		var calculateDebris = function (players, toDebrisFleet, toDebrisDefence, defenceRepairFactor, defenderHasEngineer) {
			
			var metal = 0, crystal = 0;
			
			toDebrisFleet /= 100;
			toDebrisDefence /= 100;
			defenceRepairFactor /= 100;
			defenceRepairFactor = 1 - defenceRepairFactor;

			if (defenderHasEngineer) defenceRepairFactor /= 2; // Half the losses, which results in less df

			for (var i in players) {
				for (var entity in players[i]) {
					var toDebris = entity >= 400 ? toDebrisDefence * defenceRepairFactor : toDebrisFleet;
					metal += (players[i][entity] * entityInfo[entity].resources.metal) * toDebris;
					crystal += (players[i][entity] * entityInfo[entity].resources.crystal) * toDebris;
				}
			}
			
			return {'metal': metal, 'crystal': crystal};
			
		};
		
		var calculateValue = function (players) {

			var metal = 0, crystal = 0, deuterium = 0;
			
			for (var i in players) {
				for (var entity in players[i]) {
					metal += players[i][entity] * entityInfo[entity].resources.metal;
					crystal += players[i][entity] * entityInfo[entity].resources.crystal;
					deuterium += players[i][entity] * entityInfo[entity].resources.deuterium;
				}
			}
			
			return {'metal': metal, 'crystal': crystal, 'deuterium': deuterium};
			
		};
		
		var calculatePlunder = function (players, resources, plunderPercentage) {
			
			var capacity = 0, canBePlundered = resources;
			
			var metal = 0, crystal = 0, deuterium = 0;
			
			for (var resource in canBePlundered) {
				canBePlundered[resource] *= plunderPercentage / 100;
			}
			
			for (var i in players) {
				for (var entity in players[i]) {
					capacity += entityInfo[entity].cargo_capacity * players[i][entity];
				}
			}
			
			var oneThird = Math.round(capacity / 3), half = Math.round(capacity / 2);
			
			// Step 1. Load metal
			if (canBePlundered.metal <= oneThird) {
				metal = canBePlundered.metal;
				canBePlundered.metal = 0;
				capacity -= metal;
			} else {
				metal = oneThird;
				canBePlundered.metal -= oneThird;
				capacity -= oneThird;
			} 
			// Step 2. Load crystal
			if (canBePlundered.crystal <= half) {
				crystal = canBePlundered.crystal;
				canBePlundered.crystal = 0;
				capacity -= crystal;
			} else {
				crystal = half;
				canBePlundered.crystal -= half;
				capacity -= half;
			} 
			// Step 3. Load deuterium
			if (canBePlundered.deuterium > capacity) {
				deuterium = capacity;
				capacity = 0;
			} else {
				deuterium = canBePlundered.deuterium;
				canBePlundered.deuterium = 0;
				capacity -= deuterium;
			}
			
			if (capacity > 0) {
				half = Math.round(capacity / 2);
				// Step 4. Load remaining metal
				if (canBePlundered.metal <= half) {
					metal += canBePlundered.metal;
					canBePlundered.metal = 0;
					capacity -= canBePlundered.metal;
				} else {
					metal += half;
					canBePlundered.metal -= half;
					capacity -= half;
				} 
				// Step 5. Load deuterium
				if (canBePlundered.crystal > capacity) {
					crystal += capacity;
					capacity = 0;
				} else {
					crystal += canBePlundered.crystal;
					canBePlundered.crystal = 0;
				}			
			}
						
			return {'metal': metal, 'crystal': crystal, 'deuterium': deuterium};
			
		};
		
		var getResult = function (simulationData, resources, plunder, toDebrisFleet, toDebrisDefence, defenceRepairFactor, defenderHasEngineer) {
								
			var simulations = simulationData.length;
			
			for (var s=0; s<simulations; s++) {
			
				var resourcesToPlunder = {'metal': resources.metal, 'crystal': resources.crystal, 'deuterium': resources.deuterium};
						
				simulationData[s]['debris'] = {
					'attackers' : calculateDebris(simulationData[s]['lost']['attackers'], toDebrisFleet, toDebrisDefence, defenceRepairFactor, defenderHasEngineer),
					'defenders' : calculateDebris(simulationData[s]['lost']['defenders'], toDebrisFleet, toDebrisDefence, defenceRepairFactor, defenderHasEngineer)
				};
				simulationData[s]['losses'] = {
					'attackers' : calculateValue(simulationData[s]['lost']['attackers']),
					'defenders' : calculateValue(simulationData[s]['lost']['defenders'])
				};
				simulationData[s]['plunder'] = calculatePlunder(simulationData[s]['remaining']['attackers'], resourcesToPlunder, plunder);
				
			}
			
			var attackersFlightData = getFlightData(attackersData), defendersFlightData = getFlightData(defendersData);
			
			self.postMessage({'response': 'result', 'result': {
				'retreat': {
					'attackers': getRetreatCosts(attackersData),
					'defenders': getRetreatCosts(defendersData)
				},
				'fuel': {
					'attackers': attackersFlightData.fuel,
					'defenders': defendersFlightData.fuel
				},
				'time': {
					'attackers': attackersFlightData.time,
					'defenders': defendersFlightData.time
				},
				'simulations': calculateAverage(simulationData)
			}});
						
		};
		
		var getDistance = function (coords1, coords2) {
									
			var galaxyDistance = Math.abs(coords2.galaxy - coords1.galaxy), galaxycutoff = settings.galaxy / 2;
			if (galaxyDistance > galaxycutoff && settings.donutgalaxy === 1) galaxyDistance = galaxycutoff - (galaxyDistance - galaxycutoff);
			if (galaxyDistance !== 0) return 20000 * galaxyDistance;
			
			var systemDistance = Math.abs(coords2.system - coords1.system), systemcutoff = settings.system / 2;
			if (systemDistance > systemcutoff && settings.donutsystem === 1) systemDistance = systemcutoff - (systemDistance - systemcutoff);
			if (systemDistance !== 0) return 2700 + 95 * systemDistance;

			if ((coords2.position - coords1.position) !== 0) return 1000 + 5 * Math.abs(coords2.position - coords1.position);
			
			return 5; //Distance between planet / moon / debris
									
		};
		
		var getRetreatCosts = function (data) {
			
			var total = 0;
			
			for (var i in data) {
				for (var type in data[i].entity) {
					if (type > 200 && type < 400) {
						if (type != 210 && type != 212) {
							var division = type == 202 || type == 203 || type == 208 || type == 209 ? 4 : 1;
							total += Math.round(((entityInfo[type].resources.metal + entityInfo[type].resources.crystal + entityInfo[type].resources.deuterium) * data[i].entity[type]) / division);
						}
					}
				}
			}
			
			return total;
			
		};
		
		var getDriveFactor = function (entity, techs) {
			
			var factor = 0.1;
			
			switch (entity) {
			case 202:
				if (techs.impulse >= 5) factor = 0.2; 
				break;
			case 209:
				if (techs.impulse >= 17) factor = 0.2;
				if (techs.hyperspace >= 15) factor = 0.3;
				break;
			case 211:
				factor = 0.2;
				if (techs.hyperspace >= 8) factor = 0.3;
				break;
			case 205:
			case 206:
			case 208:
				factor = 0.2;
				break;
			case 207:
			case 213:
			case 214:
			case 215:
				factor = 0.3;
			}
			
			if (factor === 0.3) return techs.hyperspace * factor;
			if (factor === 0.2) return techs.impulse * factor
				
			return techs.combustion * factor
			
		};
		
		var getSpeeds = function (entities, techs) {
			
			var speeds = {};
			
			for (var i in entities) {
				if (i < 400) {
					if (entities[i] > 0) {
						var speed = entityInfo[i].speed;
						if (i == 202 && techs.impulse >= 5) speed *= 2;
						if (i == 209) {
							if (techs.hyperspace >= 15) speed *= 3;
							else if (techs.impulse >= 17) speed *= 2;
						}
						if (i == 211 && techs.hyperspace >= 8) speed *= 1.25;

						speeds[i] = Math.round(speed * (1 + getDriveFactor(i|0, techs)));
					}
				}
			}
			
			return speeds;
			
		};
		
		var getFlightData = function (data) {
			
			var flightData = {
				'fuel': {},
				'time': {}
			};
			
			for (var i in data) {
								
				var coords = getCoordinates(data[i]);
				
				if (!data[i].techs.combustion) data[i].techs.combustion = 0;
				if (!data[i].techs.impulse) data[i].techs.impulse = 0;
				if (!data[i].techs.hyperspace) data[i].techs.hyperspace = 0;
				
				if (defenderBase !== false && coords !== false && "undefined" !== typeof data[i].fleet && "undefined" !== typeof data[i].entity && "undefined" !== typeof data[i].techs) {
					
					var distance = getDistance(coords, defenderBase), speeds = getSpeeds(data[i].entity, data[i].techs), slowest = false, consumption = 0;
					
					for (var s in speeds) {
						if (speeds[s] < slowest || slowest === false) slowest = speeds[s];
					}
					
					var duration = Math.round((35000 / (data[i].fleet.speed / 10)) * Math.sqrt((distance * 10) / slowest) + 10);
					
					for (var e in data[i].entity) {
						
						//if (e < 400) consumption += (1 + Math.round(((entityInfo[e]['fuel_usage'] * distance) / 35000) * Math.pow(data[i].fleet.speed / 100 + 1, 2))) * data[i].entity[e];
						//TODO Check
						if (data[i].entity[e] > 0) {
							var speed = Number(((35000 / (duration - 10)) * Math.sqrt((distance * 10) / speeds[e])).toFixed(2)),
								fuel = entityInfo[e]['fuel_usage'];

							if (e == 202 && data[i].techs.impulse >= 5) fuel *= 2;
							if (e == 209) {
								if (data[i].techs.hyperspace >= 15) fuel *= 3;
								else if (data[i].techs.impulse >= 17) fuel *= 2;
							}

							consumption += ((fuel * data[i].entity[e] * distance) / 35000) * Math.pow(speed / 10 + 1, 2);
						}
						
					}
					
					flightData['fuel'][i] = Math.ceil(consumption);
					flightData['time'][i] = duration / settings.fleetspeed;
										
				} else {
					flightData['fuel'][i] = flightData['time'][i] = false;
				}
				
			}
			
			return flightData;
			
		};
		
		return {'init': init, 'getResult': getResult};
		
	}