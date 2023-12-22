
	var Simulator = new function () {
				
		var calculateValue = function (player) {

			var metal = 0, crystal = 0, deuterium = 0;
			
			for (var entity in player) {
				metal += player[entity] * entityInfo[entity].resources.metal;
				crystal += player[entity] * entityInfo[entity].resources.crystal;
				deuterium += player[entity] * entityInfo[entity].resources.deuterium;
			}
			
			return {'metal': metal, 'crystal': crystal, 'deuterium': deuterium};
			
		};
		
		var simulate = function (speed, ipm, target, abm, defence, attackerWeapon, defenderArmour, attackerCoords, defenderCoords) {
				
			console.time('Simulate IPM attack');
			
			var length = 0;
			
			for (var type in defence) {
				length += defence[type]|0;
			}
			
			var entities = new Uint32Array(length * 2), damage = entityInfo[503] + (entityInfo[503] * 0.1 * attackerWeapon), x = 0;
			
			if (target !== false && "undefined" !== typeof defence[target]) {
				var number = defence[target]|0, HP = (entityInfo[target] + (entityInfo[target] * 0.1 * defenderArmour)) * 0.1;
				for (var i = number; i--;) {
					
					entities[i] = target|0;
					entities[i+1] = HP|0;
					
					x += 2;
				}
				delete defence[target];
			}
			
			for (var type in defence) {
				var number = defence[type]|0, HP = (entityInfo[type] + (entityInfo[type] * 0.1 * defenderArmour)) * 0.1;
				for (var i = number; i--;) {
					
					entities[i] = type|0;
					entities[i+1] = HP|0;
					
					x += 2;
				}
			}
			
			for (var i = ipm; i--;) {
				
			}
				
			var lost = {}, losses = {};
			
			self.postMessage({
				'lost': lost,
				'losses': losses,
				'time': getTime(speed, attackerCoords, defenderCoords)
			});
			
		};
		
		var getTime = function (speed, attackerCoords, defenderCoords) {
							
				if (attackerCoords.galaxy != defenderCoords.galaxy) return false;
				
				return (30 + 60 * Math.abs(attackerCoords.system - defenderCoords.system)) / speed; 
			
		};
		
		return {'simulate': simulate};
		
	}