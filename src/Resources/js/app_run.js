
    trashSimApp.run(["$rootScope", "storeManager", ($rootScope, storeManager) => {
        $rootScope.$__ = publicContext.translations;

        $rootScope.API = publicContext.API;

        $rootScope.URL = {
            srkey: (new URLSearchParams(window.location.search)).get("SR_KEY"),
            share: (new URLSearchParams(window.location.search)).get("SHARE"),
            prefill: null
        };

        let prefillMatch = /^#prefill=((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?)$/.exec(window.location.hash);
        if (prefillMatch && prefillMatch.length === 2) {
            $rootScope.URL.prefill = JSON.parse(window.atob(prefillMatch[1]));
        }

        storeManager.init('TrashSim');
    }]);