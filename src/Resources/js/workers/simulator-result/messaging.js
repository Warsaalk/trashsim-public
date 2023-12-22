
//importScripts('libs/entityInfo.js');

let entityInfo = {};

onmessage = e =>
{
	entityInfo = e.data[7];

	Calculator.calculate(
		e.data[0], // Simulations
		e.data[1], // Settings
		e.data[2], // Planet resources
		e.data[3], // Defender engineer
		e.data[4], // Flight data
		e.data[5], // Desired cases
		e.data[6], // Parties fleet info
	);
};