
	class Simulator
	{
		/**
		 *
		 * @param data
		 * @returns {Party|PartyLegacy}
		 */
        static loadPartyForSimulation (data)
		{
			let length = 0;
			
			for (let index in data) {
				for (let entity in data[index].entities) {
					length += data[index].entities[entity]|0;
				}
			}

            let party = chromium ? new Party(length) : new PartyLegacy(length);
			
			for (let index in data) {
                let playerData = data[index];
				party.loadPlayerEntities(index, playerData.techs.weapon, playerData.techs.shield, playerData.techs.armour, playerData.entities);
			}
			
			return party;
		}

        static handleSimulations (simulations, attackersData, defendersData, useRapidFire, ID)
		{
			let simulationResults = [simulations];

			let attackers = null, defenders = null;

			for (let s=0; s<simulations; s++) {
                attackers = Simulator.loadPartyForSimulation(attackersData);
                defenders = Simulator.loadPartyForSimulation(defendersData);

				let round = 0;

				//console.log("Simulation: " + (s+1));

				do {
					round++;

                    Simulator.sendProgress(s, round, ID);
					
					//Attacking party shoots
					attackers.shootTo(defenders, useRapidFire);
					
					//Defending party shoots
					defenders.shootTo(attackers, useRapidFire);
					
					//Reset attacking party
					attackers.resetEntities();

					//Reset defending party
					defenders.resetEntities();

					//console.log("Round: " + round);
					//console.log("Lost entities attackers:", JSON.parse(JSON.stringify(attackers.lostEntities)));
					//console.log("Lost entities defenders:", JSON.parse(JSON.stringify(defenders.lostEntities)));
				} while (round < 6 && attackers.remaining > 0 && defenders.remaining > 0);
								
				let result = {'draw': 1};
				
				if (attackers.remaining === 0)		result = {'defenders': 1};
				else if (defenders.remaining === 0)	result = {'attackers': 1};

				simulationResults[s] = {
					'lost' : {
						'attackers' : attackers.getLostEntities(),
						'defenders' : defenders.getLostEntities()
					},
					'remaining' : {
						'attackers' : attackers.getRemainingEntities(),
						'defenders' : defenders.getRemainingEntities()
					},
					'result' : result,
					'rounds' : round
				};
			}

			if (attackers) attackers.clear();
			if (defenders) defenders.clear();
			
			return simulationResults;
		}
		
		static simulate (simulations, attackersData, defendersData, useRapidFire, ID)
		{
            postMessage({response: 'simulation', ID: ID, result: {
				simulations: Simulator.handleSimulations(simulations, attackersData, defendersData, useRapidFire, ID)
			}});
		}

		static sendProgress (simulation, round, ID)
		{
			postMessage({response: 'progress', ID: ID, progress: {
				simulation: simulation + 1,
				round: round
			}});
		}
	}