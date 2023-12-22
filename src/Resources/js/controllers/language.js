
    trashSimApp.controller('LanguageController', ['$rootScope', '$scope', ($rootScope, $scope) =>
    {
        $scope.switch = languageCode =>
        {
            window.location.href = document.querySelector('link[hreflang="'+ languageCode +'"').href + window.location.search + window.location.hash;

            c.Matomo.sendEvent('button', 'click', 'switch language ' + languageCode);
        };
    }]);