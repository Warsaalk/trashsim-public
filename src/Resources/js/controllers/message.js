
    trashSimApp.controller('MessageController', ['$scope', $scope =>
    {
        $scope.messages = [];

        $scope.close = () =>
        {
            $scope.$destroy();
        };
    }]);