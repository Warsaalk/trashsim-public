
	class Simulator
	{
		constructor(simulatorPath, resultSimulatorPath)
		{
			this.simulatorPath = simulatorPath;
			this.resultSimulatorPath = resultSimulatorPath;

			this.settings = new Settings();
			this.options = new Options();
			this.parties = {};

			this.hydrators = {
				parties: new PartyHydrator(this.parties),
				settings: new SettingsHydrator(this.settings),
				options: new OptionsHydrator(this.options)
			};

			this.simulationModule = null;
			this.simulationListenersID = 0;
			this.simulationListeners = {};

			this.simulationResultModule = null;
			this.simulationResultListenersID = 0;
			this.simulationResultListeners = {};

			this.resetSimulationModule();
			this.resetResultModule();

		}

		run ()
		{
			this.simulationModule.start(
				this.settings.simulations,
				this.parties.attackers.getSimulationData({warriorBonusCombatTechs: this.settings.warriorBonusCombatTechs}),
				this.parties.defenders.getSimulationData({warriorBonusCombatTechs: this.settings.warriorBonusCombatTechs}),
				this.settings.rapidFire,
				entityInfo
			)
		}

		addSimulationListener(callback)
		{
			if ("function" === typeof callback) {
				const listenerID = this.simulationListenersID++;

				this.simulationListeners[listenerID] = callback;

				return listenerID;
			} else {
				throw "Callback needs to be of type function.";
			}
		}

		removeSimulationListener(ID)
		{
			delete this.simulationListeners[ID];
		}

		simulationCallback(event)
		{
			for (const simulationListenerID in this.simulationListeners) {
				this.simulationListeners[simulationListenerID].call(this, event);
			}
		}

		resetSimulationModule()
		{
			if (this.simulationModule) {
				this.simulationModule.reset();
			}

			if (this.options.simulationModule === "JavascriptMW") {
				this.simulationModule = new SimulationModuleJavascriptMW(e => { this.simulationCallback(e) }, this.simulatorPath, this.options.simulationWorkerCount);
			} else {
				this.simulationModule = new SimulationModuleJavascript(e => { this.simulationCallback(e) }, this.simulatorPath);
			}
		}

		calculateResult(simulationResults)
		{
			this.simulationResultModule.postMessage([
				simulationResults,
				this.settings,
				this.parties.defenders.fleets[0].resources,
				this.parties.defenders.fleets[0].engineer,
				Simulator.getAllFlightData(this.parties, this.settings),
				Simulator.getDesiredResultCases(),
				{
					attackers: this.parties.attackers.getInfoPerFleetIndex(),
					defenders: this.parties.defenders.getInfoPerFleetIndex()
				},
				entityInfo
			]);
		}

		addSimulationResultListener(callback)
		{
			if ("function" === typeof callback) {
				const listenerID = this.simulationResultListenersID++;

				this.simulationResultListeners[listenerID] = callback;

				return listenerID;
			} else {
				throw "Callback needs to be of type function.";
			}
		}

		removeSimulationResultListener(ID)
		{
			delete this.simulationResultListeners[ID];
		}

		simulationResultCallback(event)
		{
			for (const simulationResultListenerID in this.simulationResultListeners) {
				this.simulationResultListeners[simulationResultListenerID].call(this, event);
			}
		}

		resetResultModule()
		{
			if (this.simulationResultModule) {
				this.simulationResultModule.terminate();
			}

			this.simulationResultModule = new Worker(this.resultSimulatorPath);
			this.simulationResultModule.onmessage = e => { this.simulationResultCallback(e) };
		}

		getSimulationData ()
		{
			return {
				version: 2,
				settings: this.settings,
				0: this.parties.attackers.getSimulationData({}),
				1: this.parties.defenders.getSimulationData({})
			};
		}

		terminate ()
		{
			this.simulationModule.reset();
			this.simulationResultModule.terminate();
		}

		/**
		 * @param parties
		 * @param settings
		 * @returns {{defenders: [], attackers: []}}
		 */
		static getAllFlightData (parties, settings)
		{
			let flightData = {attackers: [], defenders: []}, keys = ["attackers", "defenders"];

			for (let i=0, il=keys.length; i<il; i++) {
				let partyKey = keys[i];
				for (let fleetKey in parties[partyKey].fleets) {
					flightData[partyKey].push(Simulator.getFlightData(parties[partyKey].fleets[fleetKey], parties.defenders.fleets[0], settings));
				}
			}

			return flightData;
		}

		/**
		 * @param FleetFlying fleet
		 * @param Defender defender
		 * @param Settings settings
		 * @returns {{flightTime: boolean, fuelConsumption: boolean}|{flightTime: number, fuelConsumption: number}}
		 */
		static getFlightData (fleet, defender, settings)
		{
			if (fleet.hasCoordinates() && fleet.defence === void 0 && defender.hasCoordinates() ) {
				let distance = defender.getDistance(fleet, settings),
					speeds = fleet.getSpeeds(settings),
					slowest = false,
					consumption = 0;

				for (let s in speeds) {
					if (speeds[s] < slowest || slowest === false) slowest = speeds[s];
				}

				if (slowest !== false) {
					let duration = Math.round((35000 / (fleet.speed / 10)) * Math.sqrt((distance * 10) / slowest) + 10);

					for (let e in fleet.ships) {
						if (fleet.ships[e] > 0) {
							let speed = Number((35000 / (duration - 10)) * Math.sqrt((distance * 10) / speeds[e])),
								fuel = entityInfo[e].fuel_usage;

							if (e === "202" && fleet.techs.impulse >= 5) fuel *= 2;
							if (e === "209") {
								if (fleet.techs.hyperspace >= 15) fuel *= 3;
								else if (fleet.techs.impulse >= 17) fuel *= 2;

								if (settings.characterClassesEnabled && fleet.class === "general") {
									fuel *= 1 - (settings.warriorBonusRecyclerFuelConsumption / 100);
								}
							}

							consumption += 1 + Math.round(((fuel * fleet.ships[e] * distance) / 35000) * Math.pow(speed / 10 + 1, 2));
						}
					}

					return {flightTime: duration / settings.fleetSpeed, fuelConsumption: Math.round(consumption * settings.deuteriumSaveFactor)};
				}
			}

			return {flightTime: false, fuelConsumption: false};
		}

		static getDesiredResultCases ()
		{
			return {
				attackersBest: {type: 1, key: "profits.attackers.total"},
				attackersWorst: {type: 0, key: "profits.attackers.total"},
				defendersBest: {type: 1, key: "profits.defenders.total"},
				defendersWorst: {type: 0, key: "profits.defenders.total"},
				recyclersHighest: {type: 1, key: "debris.remaining.total"}
			};
		}
	}