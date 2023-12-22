    function asmPlayer(stdlib, foreign, buffer) {
		"use asm";
		
		var random = foreign.random;
		
		var entities = new stdlib.Float32Array(buffer);
		var enemyEntities = new stdlib.Float32Array(buffer);
		var entitiesCount = 0.0;
		var enemyEntitiesCount = 0.0;
		
		var entitiesLost = new stdlib.Float32Array(buffer);
		var enemyEntitiesLost = new stdlib.Float32Array(buffer);
		var entitiesCountLost = 0.0;
		var enemyEntitiesCountLost = 0.0;
		
		var attTechs = new stdlib.Float32Array(buffer);
		var defTechs = new stdlib.Float32Array(buffer);
		
		function setAttackerTechs (weapon, shield, armour) {
		    
		    weapon = +weapon;
		    shield = +shield;
		    armour = +armour;
		    
		    attTechs[0 >> 2] = weapon;
		    attTechs[1 >> 2] = shield;
		    attTechs[2 >> 2] = armour;
		    
		}
		
		function setDefenderTechs (weapon, shield, armour) {
		    
		    weapon = +weapon;
		    shield = +shield;
		    armour = +armour;
		    
		    defTechs[0 >> 2] = weapon;
		    defTechs[1 >> 2] = shield;
		    defTechs[2 >> 2] = armour;
		    
		}
		
		function loadAttackerEntities (type, amount, attack, shield, armour) {
		    
		    type = +type;
		    amount = +amount;
		    attack = +attack;
		    shield = +shield;
		    armour = +armour;
		    
		    var entityAttack = 0.0, entityShield = 0.0, entityHP = 0.0;
		    var i = 0, idxLen = 0;
		    var iType = 0, iStatus = 0, iAttack = 0, iShield = 0, iInitialShield = 0, iHP = 0, iMaxHP = 0;
		    
		    entityAttack = attack + (attack * 0.1 * attTechs[0]);
		    entityShield = shield + (shield * 0.1 * attTechs[1]);
		    entityHP = (armour + (armour * 0.1 * attTechs[2])) * 0.1;
		    
		    idxLen = ~~amount;
		    
		    entitiesCount = entitiesCount + amount;
		    
		    while ((i|0) < (idxLen|0)) {
		        
		    	iType = i;
		    	iStatus = (i+1)|0;
		    	iAttack = (i+2)|0;
		    	iShield = (i+3)|0;
		    	iInitialShield = (i+4)|0;
		    	iHP = (i+5)|0;
		    	iMaxHP = (i+6)|0;
		    	
		        entities[iType >> 2] = type;
		        entities[iStatus >> 2] = 1.0;
		        entities[iAttack >> 2] = attack;
		        entities[iShield >> 2] = shield;
		        entities[iInitialShield >> 2] = shield;
		        entities[iHP >> 2] = armour;
		        entities[iMaxHP >> 2] = armour;
		        
		        i = (i + 7)|0;
		        
		    }
		    
		}
		
		function loadDefenderEntities (type, amount, attack, shield, armour) {
		    
		    type = +type;
		    amount = +amount;
		    attack = +attack;
		    shield = +shield;
		    armour = +armour;
		    
		    var entityAttack = 0.0, entityShield = 0.0, entityHP = 0.0;
		    var i = 0, idxLen = 0;
		    var iType = 0, iStatus = 0, iAttack = 0, iShield = 0, iInitialShield = 0, iHP = 0, iMaxHP = 0;
		    
		    entityAttack = attack + (attack * 0.1 * defTechs[0]);
		    entityShield = shield + (shield * 0.1 * defTechs[1]);
		    entityHP = (armour + (armour * 0.1 * defTechs[2])) * 0.1;
		    
		    idxLen = ~~amount;
		    
		    enemyEntitiesCount = enemyEntitiesCount + amount;
		    
		    while ((i|0) < (idxLen|0)) {
		        
		    	iType = i;
		    	iStatus = (i+1)|0;
		    	iAttack = (i+2)|0;
		    	iShield = (i+3)|0;
		    	iInitialShield = (i+4)|0;
		    	iHP = (i+5)|0;
		    	iMaxHP = (i+6)|0;
		    	
		        enemyEntities[iType >> 2] = type;
		        enemyEntities[iStatus >> 2] = 1.0;
		        enemyEntities[iAttack >> 2] = attack;
		        enemyEntities[iShield >> 2] = shield;
		        enemyEntities[iInitialShield >> 2] = shield;
		        enemyEntities[iHP >> 2] = armour;
		        enemyEntities[iMaxHP >> 2] = armour;
		        
		        i = (i + 7)|0;
		        
		    }
		    
		}
		
		function shootToDefender () {
			
			var i = 0, iRapidFire = 0.0, eCount = 0, eeCount = 0, enemyIdx = 0, enemyHelp = 0.0, rest = 0.0;
			
			eCount = ~~entitiesCount;
			
			// Loop all entities
            while ((i|0) < (eCount|0)) {

                do {

                    enemyHelp = +(random()) * (enemyEntitiesCount / 7.0);
                    
                	// Select a random enemy target
                    enemyIdx = ~~enemyHelp;
    
                    // Make sure the enemy entity is still alive & our entity can attack
                    if (+(enemyEntities[enemyIdx+1 >> 2]) == 1.0) {
                        
                            if (+(entities[i+2 >> 2]) != 0.0) {
                            
                        	// Calculate damage on the shield
                    		rest = +(enemyEntities[enemyIdx+3 >> 2]) - +(entities[i+2 >> 2]);
      
                    		// If the rest is greater than 0 this will be the new shield value
                    		if (rest >= 0.0) enemyEntities[enemyIdx+3 >> 2] = rest;
                    		else {
                    		
                                enemyEntities[enemyIdx+3 >> 2] = 0.0; // Set enemy shield to 0 as the rest is lower than 0
                                enemyEntities[enemyIdx+4 >> 2] = +(enemyEntities[enemyIdx+4 >> 2]) + rest; // The rest is always negative in this case so it'll be subtracted from the HP
    
                                // If HP is below 0, I thinks it's exploded!
                                if (+(enemyEntities[enemyIdx+4 >> 2]) <= 0.0) enemyEntities[enemyIdx+1 >> 2] = 0.0;
                                // Otherwise calculate explosion probability
                                else {
                                    // Only if HP is below 70%
                                    if (+(enemyEntities[enemyIdx+4 >> 2]) <= +(enemyEntities[enemyIdx+5 >> 2] * 0.7)) {
                                        // Roll a dice on lost HP, if a ship is damaged for 35% there is a chance of 35% that it'll explode
                                        if (+(random()) >= +(enemyEntities[enemyIdx+4 >> 2] / enemyEntities[enemyIdx+5 >> 2])) {
                                            enemyEntities[enemyIdx+1 >> 2] = 0.0;
                                        }
                                    }
                                }
                                
                    		}
                    		
                        }

                    }

                    // Check if our entity has rapid fire against the enemy target
                    //iRapidFire = info[entity[0]].rapidfire_against[enemyEntity[0]];
                    
                    if (iRapidFire == 0.0) break; // No rapid fire present against the enemy target, so let our next entity fire 
                    
                } while (+(random()) > (1.0 / iRapidFire)); // The chance a entity has to repeat fire against another ship
                
                i = (i + 1)|0;
                
            }
			
		}
		
		function shootToAttacker () {
			
			var i = 0, iRapidFire = 0.0, eCount = 0, eeCount = 0, enemyIdx = 0, enemyHelp = 0.0, rest = 0.0;
			
			eCount = ~~enemyEntitiesCount;
			
			// Loop all entities
            while ((i|0) < (eCount|0)) {

                do {

                    enemyHelp = +(random()) * (entitiesCount / 7.0);
                    
                	// Select a random enemy target
                    enemyIdx = ~~enemyHelp;
    
                    // Make sure the enemy entity is still alive & our entity can attack
                    if (+(entities[enemyIdx+1 >> 2]) == 1.0) {
                        
                            if (+(enemyEntities[i+2 >> 2]) != 0.0) {
                            
                        	// Calculate damage on the shield
                    		rest = +(entities[enemyIdx+3 >> 2]) - +(enemyEntities[i+2 >> 2]);
      
                    		// If the rest is greater than 0 this will be the new shield value
                    		if (rest >= 0.0) entities[enemyIdx+3 >> 2] = rest;
                    		else {
                    		
                                entities[enemyIdx+3 >> 2] = 0.0; // Set enemy shield to 0 as the rest is lower than 0
                                entities[enemyIdx+4 >> 2] = +(entities[enemyIdx+4 >> 2]) + rest; // The rest is always negative in this case so it'll be subtracted from the HP
    
                                // If HP is below 0, I thinks it's exploded!
                                if (+(entities[enemyIdx+4 >> 2]) <= 0.0) entities[enemyIdx+1 >> 2] = 0.0;
                                // Otherwise calculate explosion probability
                                else {
                                    // Only if HP is below 70%
                                    if (+(entities[enemyIdx+4 >> 2]) <= +(entities[enemyIdx+5 >> 2] * 0.7)) {
                                        // Roll a dice on lost HP, if a ship is damaged for 35% there is a chance of 35% that it'll explode
                                        if (+(random()) >= +(entities[enemyIdx+4 >> 2] / entities[enemyIdx+5 >> 2])) {
                                            entities[enemyIdx+1 >> 2] = 0.0;
                                        }
                                    }
                                }
                                
                    		}
                    		
                        }

                    }

                    // Check if our entity has rapid fire against the enemy target
                    //iRapidFire = info[entity[0]].rapidfire_against[enemyEntity[0]];
                    
                    if (iRapidFire == 0.0) break; // No rapid fire present against the enemy target, so let our next entity fire 
                    
                } while (+(random()) > (1.0 / iRapidFire)); // The chance a entity has to repeat fire against another ship
                
                i = (i + 1)|0;
                
            }
			
		}
		
		function resetAttackerEntities () {
			
			
			
		}
		
		function resetDefenderEntities () {
			
			
			
		}
		
		return { setAttackerTechs: setAttackerTechs, setDefenderTechs: setDefenderTechs, loadAttackerEntities: loadAttackerEntities, loadDefenderEntities: loadDefenderEntities, shootToDefender: shootToDefender, shootToAttacker: shootToAttacker, resetAttackerEntities: resetAttackerEntities, resetDefenderEntities: resetDefenderEntities };
		
	}