
    trashSimApp.controller('IpmController', ['$rootScope', '$scope', 'storeManager', ($rootScope, $scope, storeManager) =>
    {
        $scope.$simulator = $scope.$parent.$parent;

        $scope.coordinates = {
            galaxy: $scope.$simulator.parties.attackers.fleets[0].coordinates.galaxy,
            system: $scope.$simulator.parties.attackers.fleets[0].coordinates.system,
            position: $scope.$simulator.parties.attackers.fleets[0].coordinates.position,
        };

        $scope.defence = {};
        $scope.defenceRemaining = {};
        $scope.IPMs = {};
        $scope.IPMsMax = {};
        $scope.flightTime = null;
        $scope.impulseDrive = null;

        $scope.defenderLosses = {metal: 0, crystal: 0, deuterium: 0, total: 0};
        $scope.attackerCosts = {metal: 0, crystal: 0, deuterium: 0, total: 0};

        for (const type in $scope.$simulator.parties.defenders.fleets[0].defence) {
            $scope.defence[type] = $scope.$simulator.parties.defenders.fleets[0].defence[type];
            $scope.IPMs[type] = $scope.IPMsMax[type] = $scope.defenceRemaining[type] = 0;
        }

        $scope.getTotal = (object, keys) =>
        {
            return (keys || Object.keys(object)).reduce((accumulator, currentValue) => { return accumulator + object[currentValue]; }, 0);
        };

        const getSystemDistance = (system1, system2, systems, donutsystem) =>
        {
            let systemDistance = Math.abs(system2 - system1), systemcutoff = systems / 2;
            if (systemDistance > systemcutoff && donutsystem) systemDistance = systemcutoff - (systemDistance - systemcutoff);

            return systemDistance;
        };

        $scope.$watch('coordinates', coordinates => {
            if ($scope.$simulator.parties.defenders.fleets[0].coordinates.galaxy !== null &&
                $scope.$simulator.parties.defenders.fleets[0].coordinates.galaxy === coordinates.galaxy &&
                coordinates.system &&
                $scope.$simulator.parties.defenders.fleets[0].coordinates.system) {

                const distance = getSystemDistance(
                    coordinates.system,
                    $scope.$simulator.parties.defenders.fleets[0].coordinates.system,
                    $scope.$simulator.settings.systems,
                    $scope.$simulator.settings.donutSystem
                );

                $scope.flightTime = (30 + 60 * distance) / $scope.$simulator.settings.fleetSpeed;
                $scope.impulseDrive = Math.ceil((distance + 1) / 5);

                return;
            }

            $scope.flightTime = $scope.impulseDrive = null;
        }, true);

        const updateInfo = () =>
        {
            const
                damage = entityInfo[503].weapon + (entityInfo[503].weapon * 0.1 * ($scope.$simulator.parties.attackers.fleets[0].techs.weapon || 0)),
                defenderArmour = $scope.$simulator.parties.defenders.fleets[0].techs.armour || 0;

            for (const type in $scope.defence) {
                let entitiesRemaining = $scope.defence[type], ipmsMax = entitiesRemaining;
                if (entitiesRemaining > 0) {
                    if (type === "502") {
                        entitiesRemaining -= $scope.IPMs[type];
                    } else {
                        const HP = (entityInfo[type].armour + (entityInfo[type].armour * 0.1 * defenderArmour)) * 0.1;

                        entitiesRemaining = ((HP * $scope.defence[type]) - (damage * $scope.IPMs[type])) / HP;
                        ipmsMax = (HP * $scope.defence[type]) / damage;
                    }

                    if (entitiesRemaining < 0) entitiesRemaining = 0;

                    $scope.IPMsMax[type] = Math.ceil(ipmsMax);
                    $scope.defenceRemaining[type] = Math.ceil(entitiesRemaining);
                }
            }

            $scope.defenderLosses = {metal: 0, crystal: 0, deuterium: 0, total: 0};

            for (const type in $scope.defenceRemaining) {
                const lost = $scope.defence[type] - $scope.defenceRemaining[type];

                $scope.defenderLosses.metal += lost * entityInfo[type].resources.metal;
                $scope.defenderLosses.crystal += lost * entityInfo[type].resources.crystal;
                $scope.defenderLosses.deuterium += lost * entityInfo[type].resources.deuterium;
            }

            $scope.defenderLosses.total = $scope.getTotal($scope.defenderLosses, ["metal", "crystal", "deuterium"]);

            const ipmTotal = $scope.getTotal($scope.IPMs);

            $scope.attackerCosts.metal = Math.round(ipmTotal * entityInfo[503].resources.metal);
            $scope.attackerCosts.crystal = Math.round(ipmTotal * entityInfo[503].resources.crystal);
            $scope.attackerCosts.deuterium = Math.round(ipmTotal * entityInfo[503].resources.deuterium);

            $scope.attackerCosts.total = $scope.getTotal($scope.attackerCosts, ["metal", "crystal", "deuterium"]);
        };

        $scope.$watch("defence", updateInfo, true);
        $scope.$watch("IPMs", updateInfo, true);

        $scope.applyDefence = () =>
        {
            c.Matomo.sendEvent('button', 'click', 'apply ipm simulator');

            $scope.$simulator.parties.defenders.fleets[0].defence = $scope.defenceRemaining;
            $scope.close();
        };

        $scope.close = () =>
        {
            $scope.$destroy();
        };
    }]);