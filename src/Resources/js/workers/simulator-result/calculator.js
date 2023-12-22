
	class Calculator
	{
		static createSimulationResult (simulation, settings, resources, canPlunder, engineer, flightData, partiesFleetInfo)
		{
			return new Simulation(
				simulation.result,
				simulation.rounds,
				simulation.lost,
				simulation.remaining,
				settings,
				resources,
				canPlunder,
				engineer,
				flightData,
				partiesFleetInfo
			);
		}

		static getAverageSimulation (simulations)
		{
			// Define the object to hold the average values
			let average = {lost: {attackers: {}, defenders: {}}, remaining: {attackers: {}, defenders: {}}, result: {average: 1}, rounds: 0};

			// Function to make a sum of all the entities
			let add = function (target, source)
			{
				for (let player in source) {
					if (!target.hasOwnProperty(player)) target[player] = {};

					for (let type in source[player]) {
						if (!target[player].hasOwnProperty(type)) target[player][type] = 0;

						target[player][type] += source[player][type];
					}
				}
			};

			let simulationCount = simulations.length;

			// Loop the simulations and add up the entities
			for (let i=0; i<simulationCount; i++) {
				add(average.lost.attackers, simulations[i].lost.attackers);
				add(average.lost.defenders, simulations[i].lost.defenders);
				add(average.remaining.attackers, simulations[i].remaining.attackers);
				add(average.remaining.defenders, simulations[i].remaining.defenders);

				average.rounds += simulations[i].rounds;
			}

			// Function to make an average of all the entities add up to each other
			let calculateAverage = function (players, simulationCount)
			{
				for (let player in players) {
					for (let type in players[player]) {
						players[player][type] = Math.round(players[player][type] / simulationCount);
					}
				}
			};

			// Calculate the average values
			calculateAverage(average.lost.attackers, simulationCount);
			calculateAverage(average.lost.defenders, simulationCount);
			calculateAverage(average.remaining.attackers, simulationCount);
			calculateAverage(average.remaining.defenders, simulationCount);

			average.rounds = Math.round(average.rounds / simulationCount);

			return average;
		}

		static getDesiredCaseSimulation (desiredCase, results)
		{
			const get = (keys, obj) => keys.reduce((acc, curr) => (acc && acc[curr]) ? acc[curr] : null, obj);

			let bestMatchingIndex = 0, keys = desiredCase.key.split(".");

			for (let i=1, il=results.length; i<il; i++) {
				if (
					(desiredCase.type === 1 && get(keys, results[i]) > get(keys, results[bestMatchingIndex])) ||
					(desiredCase.type === 0 && get(keys, results[i]) < get(keys, results[bestMatchingIndex]))
				) {
					bestMatchingIndex = i;
				}
			}

			return bestMatchingIndex;
		}

		static calculate(simulations, settings, resources, engineer, flightData, desiredCases, partiesFleetInfo)
		{
			let results = [], outcome = {attackers: 0, defenders: 0, draw: 0};

			for (let i=0, il=simulations.length; i<il; i++) {
				let canPlunder = Object.keys(simulations[i].result)[0] === "attackers";
				results.push(Calculator.createSimulationResult(simulations[i], settings, resources, canPlunder, engineer, flightData, partiesFleetInfo));

				for (let outcomeKey in simulations[i].result) {
					outcome[outcomeKey]++;
				}
			}

			let cases = {};

			for (let desiredCase in desiredCases) {
				cases[desiredCase] = Calculator.getDesiredCaseSimulation(desiredCases[desiredCase], results);
			}

			results.push(Calculator.createSimulationResult(Calculator.getAverageSimulation(simulations), settings, resources, outcome.attackers > 0, engineer, flightData, partiesFleetInfo));

			cases.average = results.length - 1;

			for (let side in outcome) {
				outcome[side] = Math.round(outcome[side] / simulations.length * 10000) / 100;
			}

			postMessage({response: 'result', results: results, outcome: outcome, cases: cases});
		}
	}