
    trashSimApp.controller('ShareController', ['$rootScope', '$scope', ($rootScope, $scope) =>
    {
        $scope.copyState = 0;
        $scope.copyShareLink = () =>
        {
            if (navigator.clipboard !== void 0) {
                navigator.clipboard.writeText($scope.shareLink).then(() => {
                    $scope.copyState = 1;
                }, () => {
                    $scope.copyState = 2;
                }).finally(() => {
                    $scope.$apply();
                });
            } else {
                $scope.copyState = 3;
            }

            c.Matomo.sendEvent('button', 'click', 'share copy link');
        };

        $scope.close = () =>
        {
            $scope.$destroy();
        };
    }]);