
//importScripts('libs/entityInfo.js');

let entityInfo = {};

const chromium = /chrome/i.test(navigator.userAgent);

onmessage = e =>
{
	entityInfo = e.data[5];

    //console.profile("TrashSim");
	Simulator.simulate(
		e.data[0], // Number of simulations
		e.data[1], // Attacker data
		e.data[2], // Defender data
		e.data[3], // Use rapidfire
		e.data[4]  // Worker ID
	);
    //console.profileEnd("TrashSim");
};