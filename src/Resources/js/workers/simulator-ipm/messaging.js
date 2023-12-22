
importScripts('libs/entityInfo.js');

self.onmessage = function (e) {
		
	Simulator.simulate(
		e.data[0],
		e.data[1],
		e.data[2],
		e.data[3],
		e.data[4],
		e.data[5],
		e.data[6],
		e.data[7],
		e.data[8]
	);
	
};