

	class SimulationModuleJavascriptMW
	{
		constructor (updateListener, simulatorPath, customWorkerCount)
		{
			// As this represents the number of logical processors, this takes into account hyper threading
			// So if this number is higher than 6 we could assume the used processor has hyper threading enabled
			// To prevent the processor from being overused we'll divide this number by 2 to represent the "actual amount" of cores present
			// On computers with actually more than 6 cores this will still give a speed advantage of 4.
			let workers = window.navigator.hardwareConcurrency || 1;
			if (workers > 6) {
				workers = Math.ceil(workers / 2);
			}

			customWorkerCount = parseInt(customWorkerCount);
			if (!isNaN(customWorkerCount) && customWorkerCount >= 1) {
				workers = customWorkerCount;
			}

			this.simulators = [];
			this.workers = workers;
			this.active = 0;
			this.data = [];
			this.progress = [];

			this.updateListener = updateListener;

			this.timing = false;

			const self = this;

			for (let i=0; i<this.workers; i++) {
				this.simulators[i] = new Worker(simulatorPath);
				this.simulators[i].onmessage = e => {
					self.update(e);
				};
			}
		}

		update (e)
		{
			if (e.data.response === "simulation") {
				this.active--;

				if (this.active === 0) {
					console.timeEnd("Simulation Module - Javascript");
					this.timing = false;

					e.data.result.simulations = e.data.result.simulations.concat(this.data);

					this.updateListener.call(this, e);
				} else {
					this.data = this.data.concat(e.data.result.simulations);
				}
			} else if (e.data.response === "progress") {
				this.progress[e.data.ID] = e.data.progress.simulation;

				e.data.progress.simulation = this.progress.reduce((sum, element) => sum + element);
				e.data.progress.round = "x";

				this.updateListener.call(this, e);
			}
		}

		start (simulations, attackersData, defendersData, rapidFire, entityInfo)
		{
			this.active = 0;
			this.data = [];
			this.progress = [];

			console.time("Simulation Module - Javascript");
			this.timing = true;

			let workerSimulations = 1, rest = 0;
			if (simulations > this.workers) {
				this.active = this.workers;

				workerSimulations = Math.floor(simulations / this.workers);
				rest = simulations % this.workers;
			} else {
				this.active = simulations;
			}

			for (let i=0; i<this.active; i++) {
				this.progress[i] = 0;
				this.simulators[i].postMessage([
					i === this.active - 1 ? workerSimulations + rest : workerSimulations,
					attackersData,
					defendersData,
					rapidFire,
					i,
					entityInfo
				]);
			}
		}

		reset ()
		{
			for (let i=0, il=this.simulators.length; i<il; i++) {
				this.simulators[i].terminate();
			}

			if (this.timing === true) {
				console.timeEnd("Simulation Module - Javascript");
				this.timing = false;
			}
		}
	}