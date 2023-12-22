
	c['Simulator'] = (function () {
	
		var attackersData = {}, defendersData = {}, settings = {};
		
		var load = function (data) {
			
			attackersData = {};
			defendersData = {};
			settings = {};
			
			for (var id in data) {
				
				var value = data[id], nameData = id.split('-');
				
				if (nameData[0] === 'simulate' && value.length > 0) {
					if (nameData[1] === 'setting') {
						settings[nameData[2]] = value|0;
					} else {
						var party = nameData[1], index = nameData[2], property = nameData[3], label = nameData[4];
						
						var playerArray = party == 'attackers' ? attackersData : defendersData;
						if (!playerArray[index]) {
							playerArray[index] = {};
						}
						
						if ("undefined" === typeof playerArray[index][property]) {
							playerArray[index][property] = {};
						}
						
						if (property == 'entity' && (label > 499 || value <= 0)) continue;
												
						playerArray[index][property][label] = value|0;
					}
				}
				
			}
			
			checkTechnologies(attackersData);
			checkTechnologies(defendersData);
						
		};
		
		var checkTechnologies = function (playerArray) {
						
			for (var index in playerArray) {
			
				var playerData = playerArray[index];
				if ("undefined" === typeof playerData.techs) {
					playerData.techs = {};
				}
				
				if ("undefined" === typeof playerData.techs.weapon || playerData.techs.weapon < 0) playerData.techs.weapon = 0;
				if ("undefined" === typeof playerData.techs.shield || playerData.techs.shield < 0) playerData.techs.shield = 0;
				if ("undefined" === typeof playerData.techs.armour || playerData.techs.armour < 0) playerData.techs.armour = 0;
			
			}
			
		};
		
		var getAttackersData = function () {
			
			return attackersData;
			
		};
		
		var getDefendersData = function () {
			
			return defendersData;
			
		};
		
		var getSettings = function () {
			
			return settings;
			
		};
		
		return {'load': load, 'getAttackersData': getAttackersData, 'getDefendersData': getDefendersData, 'getSettings': getSettings};
		
	}());
	