
    publicContext['API'] = (function () {

        var listSimulationModules = function () {
            return Object.keys(c.SimulationModule);
        };

        var useSimulationModule = function (moduleName) {
            if (moduleName === null) {
                delete localStorage.trashsimSimulationModule;
                console.log("TrashSim: simulation module has been reset");
                return;
            }

            if (c.SimulationModule[moduleName] !== void 0) {
                localStorage.trashsimSimulationModule = moduleName;

                c.Home.setSimulationModule(c.SimulationModule[moduleName]);

                console.log("TrashSim: simulation module has been set to: " + moduleName);
            } else {
                throw "The module you're trying to use does not exist!";
            }
            c.Matomo.sendEvent('API', 'console', 'simulation set module');
        };

        var startSimulation = function () {
            c.Home.simulationHandle();
            c.Matomo.sendEvent('API', 'console', 'simulation start');
        };

        var stopSimulation = function () {
            c.Home.simulationCancel();
            c.Matomo.sendEvent('API', 'console', 'simulation stop');
        };

        return {
            Simulator: {
                listModules: listSimulationModules,
                useModule: useSimulationModule,
                start: startSimulation,
                stop: stopSimulation
            }
        };

    }());