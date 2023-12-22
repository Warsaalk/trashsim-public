
	Vue.component("simulation-test", {
		mixins: [translationsController],
		props: {
			reportData: {type: Object, required: true},
			ogotchaApiKey: {type: String|null, required: true}
		},
		data ()
		{
			return {
				state: null,
				message: null,
				simulator: null,
				simulationsDone: 0,
				report: null,
				simulation: null,
				simulationResultTolerance: 10,
				simulationDamageTolerance: 5,
				simulationRoundsTolerance: 0,
				expanded: false
			}
		},
		computed:
		{
			simulationBoundaries()
			{
				if (this.simulation === null) return null;

				const
					upperBoundaryAttackers = this.simulation.results[this.simulation.cases.attackersWorst].losses.attackers.total,
					lowerBoundaryAttackers = this.simulation.results[this.simulation.cases.attackersBest].losses.attackers.total,
					upperBoundaryDefenders = this.simulation.results[this.simulation.cases.defendersWorst].losses.defenders.total,
					lowerBoundaryDefenders = this.simulation.results[this.simulation.cases.defendersBest].losses.defenders.total;

				return {
					absolute: {
						attackers: {
							upper: upperBoundaryAttackers,
							lower: lowerBoundaryAttackers
						},
						defenders: {
							upper: upperBoundaryDefenders,
							lower: lowerBoundaryDefenders
						}
					},
					tolerance: {
						attackers: {
							upper: Math.round(upperBoundaryAttackers * (1 + this.simulationDamageTolerance / 100)),
							lower: Math.round(lowerBoundaryAttackers * (1 - this.simulationDamageTolerance / 100))
						},
						defenders: {
							upper: Math.round(upperBoundaryDefenders * (1 + this.simulationDamageTolerance / 100)),
							lower: Math.round(lowerBoundaryDefenders * (1 - this.simulationDamageTolerance / 100))
						}
					}
				}
			},

			simulationRounds()
			{
				if (this.simulation === null) return null;

				let min = this.simulation.results[0].rounds, max = this.simulation.results[0].rounds;

				for (let i = 1, il=this.simulation.results.length; i < il; i++) {
					const v = this.simulation.results[i].rounds;
					min = (v < min) ? v : min;
					max = (v > max) ? v : max;
				}

				return {
					min: min - this.simulationRoundsTolerance,
					max: max + this.simulationRoundsTolerance
				}
			},

			simulationURL()
			{
				let data = {};

				if (this.simulation !== null)  {
					data = this.simulator.getSimulationData();
				}

				return `${document.head.querySelector("base").href}#prefill=${btoa(JSON.stringify(data))}`;
			},

			stateClass()
			{
				switch (this.state) {
					case "success": return "state-success";
					case "failed": return "state-failed";
				}

				return "";
			},

			resultReportV2 ()
			{
				return this.report.version > 1 ? this.report.originals[this.report.ogotcha.apiKeys.main] : null
			}
		},
		filters:
		{
			formatNumber (value, fallback)
			{
				if (isNaN(value)) return fallback;

				return Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			}
		},
		methods:
		{
			async start ()
			{
				this.state = "fetching";

				try {
					this.report = await c.ogotchaManager.fetchReport(this.reportData.ID, this.ogotchaApiKey);

					this.runSimulations();
				} catch (e) {
					this.state = "error";

					if (Array.isArray(e.errors) && e.errors[0].content === "not_found") {
						this.message = "tests_simulation_error_fetch_notfound";
					} else {
						this.message = "tests_simulation_error_fetch_unknown";
					}
				}

			},

			async runSimulations ()
			{
				this.state = "simulating";

				this.simulator = new Simulator(
					'assets/js/simulator.js',
					'assets/js/simulator-result.js'
				);

				if (this.report.version > 1) {
					this.simulator.hydrators.parties.hydrateFleetFromOGotchaAPIv2(this.report.originals[this.report.ogotcha.apiKeys.main]);
				} else {
					this.simulator.hydrators.parties.hydrateFleetFromOGotchaAPIv1(this.report.ogotcha.data);
				}
				//this.simulator.hydrators.settings.hydrateFleetFromOGotchaAPI(report);

				this.simulator.addSimulationListener(e => { this.simulationListener(e) });
				this.simulator.addSimulationResultListener(e => { this.simulationResultListener(e) });

				this.simulator.run();
			},

			async validateResult ()
			{
				this.state = "validating";
			},

			simulationsFinished (success)
			{
				if (this.simulator) {
					this.simulator.terminate();
				}

				this.state = success ? "success" : "failed";

				this.$emit("done", success);
			},

			stop ()
			{

			},

			simulationListener (message)
			{
				if (message.data.response === "simulation") {
					this.simulator.calculateResult(message.data.result.simulations);
				} else if (message.data.response === "progress") {
					this.simulationsDone = message.data.progress.simulation;
				}
			},

			simulationResultListener (message)
			{
				if (message.data.response === "result") {
					this.simulation = message.data;

					// Match the result outcomes
					if (
						(this.report.ogotcha.data.winner === "draw" && this.simulation.outcome.draw > this.simulationResultTolerance) ||
						(this.report.ogotcha.data.winner === "attacker" && this.simulation.outcome.attackers > this.simulationResultTolerance) ||
						(this.report.ogotcha.data.winner === "defender" && this.simulation.outcome.defenders > this.simulationResultTolerance)
					) {
						// Match the result damage ranges
						if (this.report.ogotcha.data.attackerMainLosses > this.simulationBoundaries.tolerance.attackers.upper || this.report.ogotcha.data.attackerMainLosses < this.simulationBoundaries.tolerance.attackers.lower) {
							this.message = "tests_simulation_error_result_damage_attackers";

							console.log("upper: " + this.simulationBoundaries.tolerance.attackers.upper);
							console.log("result: " + this.report.ogotcha.data.attackerMainLosses);
							console.log("lower: " + this.simulationBoundaries.tolerance.attackers.lower);
						} else if (this.report.ogotcha.data.defenderMainLosses > this.simulationBoundaries.tolerance.defenders.upper || this.report.ogotcha.data.defenderMainLosses < this.simulationBoundaries.tolerance.defenders.lower) {
							this.message = "tests_simulation_error_result_damage_defenders";

							console.log("upper: " + this.simulationBoundaries.tolerance.defenders.upper);
							console.log("result: " + this.report.ogotcha.data.defenderMainLosses);
							console.log("lower: " + this.simulationBoundaries.tolerance.defenders.lower);
						} else {
							if (this.resultReportV2 && (
								this.resultReportV2.generic.combat_rounds > this.simulationRounds.max ||
								this.resultReportV2.generic.combat_rounds < this.simulationRounds.min
							)) {
								this.message = "tests_simulation_error_result_rounds";

								console.log("min: " + this.simulationRounds.min);
								console.log("result: " + this.resultReportV2.generic.combat_rounds);
								console.log("max: " + this.simulationRounds.max);
							} else {
								return this.simulationsFinished(true);
							}
						}
					} else {
						this.message = "tests_simulation_error_result_outcome";
					}

					this.simulationsFinished(false);
				} else {
					this.state = "error";
					this.message = "tests_simulation_error_result_invalid";
				}
			},

			toggleDetails ()
			{
				this.expanded = !this.expanded;
			},

			reset ()
			{
				if (this.simulator) {
					this.simulator.terminate();
				}

				this.state = null;
				this.message = null;
				this.simulator = null;
				this.simulationsDone = 0;
				this.report = null;
				this.simulation = null;
			}
		},
		template: `<li class="simulation-test">
	<div class="simulation-test-info">{{reportData.label}} - <a :href="'https://ogotcha.universeview.be/en/report/' + reportData.ID" target="_blank">{{$__('tests_simulation_view_report')}}</a> - <a :href="simulationURL" target="_blank" v-if="simulation">{{$__('simulate')}}</a></div>
	<div class="simulation-test-message" v-if="message">{{$__(message)}}</div>
	<div class="simulation-test-state">
	  	<span v-if="state === null">{{$__('tests_simulation_state_initial')}}</span>
      	<span v-else-if="state === 'fetching'">{{$__('tests_simulation_state_fetching')}}</span>
      	<span v-else-if="state === 'simulating'">{{$__('tests_simulation_state_simulating')}} {{simulationsDone}}/{{simulator.settings.simulations}}</span>
      	<span v-else-if="state === 'success'">{{$__('tests_simulation_state_success')}} <i class="fas fa-check"></i></span>
      	<span v-else-if="state === 'failed'">{{$__('tests_simulation_state_failed')}} <i class="fas fa-times"></i></span>
      	<span v-else-if="state === 'error'">{{$__('tests_simulation_state_error')}} <i class="fas fa-exclamation"></i></span>
	</div>
	<div class="simulation-test-expand" @click="toggleDetails"><i v-if="expanded" class="fas fa-angle-up"></i><i v-else class="fas fa-angle-down"></i></div>
	<div class="simulation-test-summary" v-if="expanded">
	  	<div>{{$__('tests_simulation_report')}}: <span>{{reportData.ID}}</span></div>
	  	<div v-if="simulation !== null" class="simulation-test-summary-comparison">
			<table>
			  	<thead>
					<tr>
					  	<th>{{$__('tests_simulation_summary_party')}}</th>
					  	<th>{{$__('tests_simulation_summary_win')}}</th>
					  	<th>{{$__('tests_simulation_summary_boundary_lower')}}</th>
					  	<th>{{$__('tests_simulation_summary_report')}}</th>
					  	<th>{{$__('tests_simulation_summary_boundary_upper')}}</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<th>{{$__('tests_simulation_summary_attackers')}}</th>
						<td rowspan="2">{{simulation.outcome.attackers}}%</td>
						<td>{{simulationBoundaries.absolute.attackers.lower | formatNumber("/")}}</td>
						<td rowspan="2">{{report.ogotcha.data.attackerMainLosses | formatNumber("/")}}</td>
						<td>{{simulationBoundaries.absolute.attackers.upper | formatNumber("/")}}</td>
					</tr>
					<tr>
						<td>{{simulationDamageTolerance}}%</td>
						<td>{{simulationBoundaries.tolerance.attackers.lower | formatNumber("/")}}</td>
						<td>{{simulationBoundaries.tolerance.attackers.upper | formatNumber("/")}}</td>
					</tr>
					<tr>
						<th>{{$__('tests_simulation_summary_defenders')}}</th>
						<td rowspan="2">{{simulation.outcome.defenders}}%</td>
						<td>{{simulationBoundaries.absolute.defenders.lower | formatNumber("/")}}</td>
						<td rowspan="2">{{report.ogotcha.data.defenderMainLosses | formatNumber("/")}}</td>
						<td>{{simulationBoundaries.absolute.defenders.upper | formatNumber("/")}}</td>
					</tr>
					<tr>
						<td>{{simulationDamageTolerance}}%</td>
						<td>{{simulationBoundaries.tolerance.defenders.lower | formatNumber("/")}}</td>
						<td>{{simulationBoundaries.tolerance.defenders.upper | formatNumber("/")}}</td>
					</tr>
					<tr>
						<th>{{$__('tests_simulation_summary_draw')}}</th>
						<td>{{simulation.outcome.draw}}%</td>
						<td><i class="fas fa-angle-double-right"></i></td>
					  	<th :class="[stateClass]">{{report.ogotcha.data.winner}}</th>
					  	<td><i class="fas fa-angle-double-left"></i></td>
					</tr>	
					<tr v-if="report.version > 1">
						<th>{{$__('tests_simulation_summary_rounds')}}</th>
						<td></td>
						<td>{{this.simulationRounds.min}}</td>
						<td>{{this.resultReportV2.generic.combat_rounds}}</td>
						<td>{{this.simulationRounds.max}}</td>
					</tr>
				</tbody>
			</table>
		</div>
	</div>
</li>`
	});