
    trashSimApp.controller('SaveController', ['$rootScope', '$scope', 'storeManager', ($rootScope, $scope, storeManager) =>
    {
        $scope.tab = 0;

        $scope.saves = storeManager.get('saved_data', true) || {};
        $scope.defaultSave = storeManager.get('saved_default');

        $scope.selectedSave = $scope.defaultSave !== null && $scope.defaultSave.length > 0 ? $scope.defaultSave : null;

        // Why 2x $parent? The pop-up is compiled with a newly isolated scope based on the SimulatorController scope
        // $scope is the own scope of the SaveController which is compiled within the popup scope ($scope.$parent).
        // And that scope descents from the SimulatorController scope ($scope.$parent.$parent)
        $scope.$simulator = $scope.$parent.$parent;

        $scope.hasSaves = () =>
        {
            return Object.keys($scope.saves).length > 0;
        };

        $scope.save = () =>
        {
            if ($scope.selectedSave) {
                $scope.new.label = $scope.selectedSave;
                $scope.new.parts.attackers = $scope.saves[$scope.selectedSave][0] !== void 0;
                $scope.new.parts.defenders = $scope.saves[$scope.selectedSave][1] !== void 0;
                $scope.new.parts.settings = $scope.saves[$scope.selectedSave].settings !== void 0;

                $scope.selectTab(2);

                c.Matomo.sendEvent('button', 'click', 'save override data');
            }
        };

        $scope.load = () =>
        {
            if ($scope.selectedSave) {
                $scope.$simulator.loadSimulationDataViaObject($scope.saves[$scope.selectedSave]);

                c.Matomo.sendEvent('button', 'click', 'save load data');
            }
        };

        $scope.select = key =>
        {
            $scope.selectedSave = key;
        };

        $scope.remove = key =>
        {
            if ($scope.saves[key] !== void 0) {
                if ($scope.defaultSave === key) $scope.defaultSave = "";
                if ($scope.selectedSave === key) $scope.selectedSave = null;

                delete $scope.saves[key];
                sync();

                c.Matomo.sendEvent('button', 'click', 'save remove data');
            }
        };

        $scope.setDefault = key =>
        {
            $scope.defaultSave = key;
            sync();

            c.Matomo.sendEvent('button', 'click', 'save make default');
        };

        $scope.clearDefault = () =>
        {
            $scope.defaultSave = "";
            sync();

            c.Matomo.sendEvent('button', 'click', 'save reset default');
        };

        function sync () {
            storeManager.set('saved_default', $scope.defaultSave);
            storeManager.set('saved_data', $scope.saves, true);
        }

        $scope.selectTab = tabID =>
        {
            $scope.tab = tabID;
        };

        // Tab 1 - Create a new save
        $scope.new = null;
        $scope.resetNew = () =>
        {
            $scope.new = {label: null, default: false, error: false, parts: {attackers: false, defenders: false, settings: false}};
        };
        $scope.resetNew();

        $scope.newSave = () =>
        {
            $scope.new.error = false;
            if ($scope.newSaveValid()) {
                $scope.saves[$scope.new.label] = $scope.$simulator.getSimulationData($scope.new.parts.attackers, $scope.new.parts.defenders, $scope.new.parts.settings, false, false, true);

                if ($scope.new.default === true) {
                    $scope.defaultSave = $scope.new.label;
                }

                $scope.selectTab(0);
                sync();

                $scope.resetNew();

                c.Matomo.sendEvent('button', 'click', 'save new data');
            } else {
                $scope.new.error = true;
            }
        };

        $scope.newSaveValid = () =>
        {
            return $scope.new.label !== null && $scope.new.label.length > 2 && ($scope.new.parts.attackers !== false || $scope.new.parts.defenders !== false || $scope.new.parts.settings !== false);
        };

        $scope.close = () =>
        {
            $scope.$destroy();
        };
    }]);