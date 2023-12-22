
    trashSimApp.controller('ResultsTotalController', ['$rootScope', '$scope', 'storeManager', ($rootScope, $scope, storeManager) =>
    {
        $scope.$simulator = $scope.$parent.$parent;

        $scope.resultsTotal = null;

        function getSimulationForCase (result)
        {
            return result.simulations[result.cases[result.activeCase]];
        }

        function addUpResults (a, b)
        {
            for (let prop in a) {
                if (a.hasOwnProperty(prop) && b.hasOwnProperty(prop)) {
                    if (typeof a[prop] === 'object' && a[prop] !== null && a[prop].toString() === "[object Object]") {
                        addUpResults(a[prop], b[prop]);
                    } else {
                        if (typeof b[prop] !== "undefined") {
                            a[prop] += b[prop];
                        }
                    }
                }
            }
        }

        $scope.calculateWavesResultSum = () =>
        {
            if ($scope.$simulator.waves.length > 0) {
                let i = 0;

                let total = null;

                const newResult = $scope.$simulator.result !== null && $scope.$simulator.waves.findIndex(wave => wave.ID === $scope.$simulator.simulationID) === -1;

                // Only add the result if it is new and not already part of the waves
                if (newResult) {
                    total = getSimulationForCase(JSON.parse(JSON.stringify($scope.$simulator.result)));
                } else {
                    total = getSimulationForCase(JSON.parse($scope.$simulator.waves[i++].data).result);
                }

                for (let il = $scope.$simulator.waves.length; (newResult && i < $scope.$simulator.currentWave) || (!newResult && i < il); i++) {
                    addUpResults(total, getSimulationForCase(JSON.parse($scope.$simulator.waves[i].data).result));
                }

                $scope.resultsTotal = total;
            }
        };

        $scope.$watchGroup(['$simulator.waves', '$simulator.result', '$simulator.result.activeCase'], () => {
            $scope.calculateWavesResultSum();
        });
    }]);