

	class SimulationModuleJavascript
	{
		constructor (updateListener, simulatorPath)
		{
			this.timing = false;
			this.simulator = new Worker(simulatorPath);
			this.simulator.onmessage = e => {
				if (e.data.response === "simulation") {
					console.timeEnd("Simulation Module - Javascript");
					this.timing = false;
				}

				updateListener.call(this, e);
			};
		}

		start (simulations, attackersData, defendersData, rapidFire, entityInfo)
		{
			console.time("Simulation Module - Javascript");
			this.timing = true;

			this.simulator.postMessage([
				simulations,
				attackersData,
				defendersData,
				rapidFire,
				0,
				entityInfo
			]);
		}

		reset ()
		{
			this.simulator.terminate();

			if (this.timing === true) {
				console.timeEnd("Simulation Module - Javascript");
				this.timing = false;
			}
		}
	}