
    trashSimApp.controller('WaveController', ['$rootScope', '$scope', 'storeManager', ($rootScope, $scope, storeManager) =>
    {
        $scope.$simulator = $scope.$parent.$parent;

        function loadSimulationDataFromWave (waveIndex)
        {
            $scope.$simulator.loadSimulationDataViaObject(JSON.parse($scope.$simulator.waves[waveIndex].data));
        }

        function saveSimulationDataForWave (waveIndex)
        {
            const data = $scope.$simulator.getSimulationData(true, true, true, true, true);

            $scope.$simulator.waves.splice(waveIndex, $scope.$simulator.waves.length - waveIndex, {ID: data.ID, activeCase: data.result.activeCase, data: JSON.stringify(data)});
        }

        function updateSimulationDataForWave (ID, newCase)
        {
            const waveIndex = $scope.$simulator.waves.findIndex(wave => wave.ID === ID);

            if (waveIndex >= 0 && $scope.$simulator.waves[waveIndex].activeCase !== newCase) {
                const data = $scope.$simulator.getSimulationData(true, true, true, true, true);

                $scope.$simulator.waves[waveIndex] = {ID: data.ID, activeCase: data.result.activeCase, data: JSON.stringify(data)};
            }
        }

        $scope.prev = () =>
        {
            if ($scope.$simulator.currentWave > 0) {
                // If the currentWave is a new one and it has a simulation, save it
                if (
                    ($scope.$simulator.currentWave === $scope.$simulator.waves.length && $scope.isNextAllowed()) ||
                    ($scope.$simulator.currentWave < $scope.$simulator.waves.length && $scope.$simulator.simulationID !== $scope.$simulator.waves[$scope.$simulator.currentWave].ID)
                    ) {
                    saveSimulationDataForWave($scope.$simulator.currentWave);
                }

                $scope.$simulator.currentWave--;

                loadSimulationDataFromWave($scope.$simulator.currentWave);
            }

            c.Matomo.sendEvent('button', 'click', 'wave previous');
        };

        $scope.next = () =>
        {
            if ($scope.isNextAllowed()) {
                const newSimulation = $scope.$simulator.currentWave === $scope.$simulator.waves.length || $scope.$simulator.waves[$scope.$simulator.currentWave].ID !== $scope.$simulator.simulationID;

                if (newSimulation) {
                    saveSimulationDataForWave($scope.$simulator.currentWave);

                    $scope.$simulator.applyCurrentResultCase();
                }

                $scope.$simulator.currentWave++;

                if (!newSimulation) {
                    if ($scope.$simulator.currentWave === $scope.$simulator.waves.length) {
                        $scope.$simulator.applyCurrentResultCase();
                    } else {
                        loadSimulationDataFromWave($scope.$simulator.currentWave);
                    }
                }
            }

            c.Matomo.sendEvent('button', 'click', 'wave next');
        };

        $scope.clear = () =>
        {
            if ($scope.$simulator.waves.length > 0) {
                loadSimulationDataFromWave(0);

                $scope.$simulator.currentWave = 0;
                $scope.$simulator.waves = [];
            }

            c.Matomo.sendEvent('button', 'click', 'waves clear');
        };

        $scope.isNextAllowed = () => $scope.$simulator.simulationID !== null;

        $scope.$watch('$simulator.result.activeCase', (newValue, oldValue) => {
            if (newValue !== void 0 && oldValue !== void 0) {
                updateSimulationDataForWave($scope.$simulator.simulationID, newValue);
            }
        });
    }]);