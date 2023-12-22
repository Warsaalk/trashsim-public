
	Vue.component("simulation-test-group", {
		mixins: [translationsController],
		props:
		{
			name: {type: String, required: true},
			reports: {type: Array, required: true},
			ogotchaApiKey: {type: String|null, required: true}
		},
		data ()
		{
			return {
				state: null,
				showSimulations: false,
				currentSimulation: 0,
				results: {
					success: 0,
					failed: 0
				}
			}
		},
		computed:
		{
			simulationsFinished()
			{
				return this.results.success + this.results.failed;
			}
		},
		methods:
		{
			async start ()
			{
				this.state = "running";

				if (this.$refs.simulations.length > 0) {
					this.$refs.simulations[this.currentSimulation].start();
				}
			},

			stop ()
			{

			},

			toggleSimulationsLog ()
			{
				this.showSimulations = !this.showSimulations;
			},

			simulationDone(result)
			{
				if (result === true) {
					this.results.success++;
				} else {
					this.results.failed++;
				}

				this.currentSimulation++;

				if (this.currentSimulation < this.$refs.simulations.length) {
					this.$refs.simulations[this.currentSimulation].start();
				} else {
					this.state = "done";
					this.$emit("done");
				}
			},

			reset ()
			{
				this.state = null;
				this.currentSimulation = 0;
				this.results.success = 0;
				this.results.failed = 0;

				for (const simulation of this.$refs.simulations) {
					simulation.reset();
				}
			}
		},
		template: `<li class="simulation-test-group" :class="{active: state === 'running', 'show-simulations': showSimulations}">
	<div class="simulation-test-group-header" @click="toggleSimulationsLog">
		<h4><i class="fas fa-angle-down"></i> {{$__('tests_group_' + name)}}</h4>
		<div class="state">
			<div v-if="state === null"><i>{{$__('tests_group_state_initial')}}</i></div>
          	<div v-else>
				<span v-if="state === 'running'"><i class="fas fa-spinner spinner"></i> {{$__('tests_group_state_running')}}</span>
              	<span v-else>{{$__('tests_group_state_done')}}</span>
			  	<span>{{simulationsFinished}}/{{reports.length}}</span>
			  	<span><i class="fas fa-check"></i> {{results.success}}</span>
              	<span><i class="fas fa-times"></i> {{results.failed}}</span>
			</div>
		</div>
	</div>
    <div class="simulation-test-group-simulations">
	  	<ul>
		  	<simulation-test v-for="reportData in reports" :report-data="reportData" :ogotcha-api-key="ogotchaApiKey" @done="simulationDone" ref="simulations"></simulation-test>
		</ul>
	</div>
		</li>`
	});