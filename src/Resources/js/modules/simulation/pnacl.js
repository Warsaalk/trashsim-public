/*
	c['SimulationModule']['Pnacl'] = new function () {
		
		var simulator, listener, loaded = false, simulationCount = 1;
		
		var init = function () {
			
			listener = c.DOM.get('#pnacl-listener');
	        listener.addEventListener('load', handleLoad, true);
	        listener.addEventListener('message', handleMessage, true);
		    listener.addEventListener('error', handleFail, true);
		    listener.addEventListener('crash', handleFail, true);
			
			var pnaclModule = c.DOM.create('embed');
		    pnaclModule.setAttribute('name', 'nacl_module');
		    pnaclModule.setAttribute('width', 0);
		    pnaclModule.setAttribute('height', 0);
		    pnaclModule.setAttribute('path', 'assets/pnacl');
		    pnaclModule.setAttribute('src', c.Application.getAssetVersion('assets/pnacl/trashsim.nmf'));
		    pnaclModule.setAttribute('type', 'application/x-pnacl');
		    
		    listener.appendChild(pnaclModule);
		    
		    simulator = pnaclModule;
			
		};
		
		var start = function (simulations, attackersData, defendersData, rapidFire) {
			
			console.time("Module Pnacl");
			
			simulationCount = parseInt(simulations);
			
			simulator.postMessage({
				'simulations': simulationCount,
				'attackers': attackersData,
				'defenders': defendersData,
				'rapidfire': rapidFire
			});
			
		};
		
		var reset = function () {
			
			simulator.parentNode.removeChild(simulator);
			simulator = null;
			loaded = false;
			
			init();
			
		};
		
		var handleLoad = function () {
			
			loaded = true;
			
		};
		
		var handleMessage = function (e) {
			
			if ("undefined" !== typeof e.data.simulations) {
				
				console.timeEnd("Module Pnacl");
				
				c.Home.simulationMessage({
					'data' : {
						'result': {'simulations': e.data.simulations},
						'response': 'simulation'
					}
				});
				
			} else if ("undefined" !== typeof e.data.progress) {
				
				c.Home.simulationMessage({
					'data' : {
						'progress': {
							'simulation': {
								'current': e.data.progress + 1,
								'total': simulationCount
							},
							'round': e.data.round
						},
						'response': 'progress'
					}
				});
				
			}
			
		};
		
		var handleFail = function () {
			
			c.Home.simulationFallback();
			
		};
		
		return {'init': init, 'start': start, 'reset': reset};
		
	};
	*/