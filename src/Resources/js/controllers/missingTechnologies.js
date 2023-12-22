
    trashSimApp.controller('MissingTechsController', ['$rootScope', '$scope', ($rootScope, $scope) =>
    {
        $scope.$simulator = $scope.$parent.$parent;

        $scope.continueAndFix = () =>
        {
            for (let party in $scope.$simulator.parties) {
                $scope.$simulator.parties[party].fixFleetsMissingTechs();
            }

            $scope.$simulator.simulate("validationSkip");

            c.Matomo.sendEvent('button', 'click', 'missing techs reset');

            $scope.close();
        };

        $scope.stopAndComplete = () =>
        {
            c.Matomo.sendEvent('button', 'click', 'missing techs complete');

            $scope.close();
        };

        $scope.close = () =>
        {
            $scope.$destroy();
        };
    }]);