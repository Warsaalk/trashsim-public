
    trashSimApp.controller('SimulatorController', ['$rootScope', '$scope', '$http', '$compile', 'popupManager', 'storeManager', ($rootScope, $scope, $http, $compile, popupManager, storeManager) =>
    {
            $scope.simulator = new Simulator(
                c.Application.getAssetVersion('assets/js/simulator.js'),
                c.Application.getAssetVersion('assets/js/simulator-result.js')
            );

            $scope.settings = $scope.simulator.settings;
            $scope.options = $scope.simulator.options;
            $scope.parties = $scope.simulator.parties;

            $scope.hydrators = $scope.simulator.hydrators;

            $scope.hydrators.parties.reset("attackers");
            $scope.hydrators.parties.reset("defenders");

            $scope.API = {
                regex: {
                    spy: /sr-[a-z]{2}-\d{1,3}-\w{40}/,
                    own: /(?:coords;\d:\d{1,3}:\d{1,2})?(?:\|?characterClassId;\d+)?(?:\|?\d{1,3};\d+)*/g,
                }
            };

            $scope.expandSettings = false;
            $scope.toggleSettings = () =>
            {
                $scope.expandSettings = !$scope.expandSettings;
            };

            $scope.result = null;

            $scope.waves = [];
            $scope.currentWave = 0;

            $scope.simulationID = null;
            $scope.simulationCount = 0;
            $scope.simulationActive = false;
            $scope.simulationsTriggered = 0;
            $scope.simulate = trigger =>
            {
                $scope.simulationsTriggered++;

                if (trigger === "validationSkip" || validateFleetTechnologies()) {
                    $scope.simulationActive = {simulation: 0, round: 0};

                    $scope.simulator.run();

                    c.Matomo.sendEvent('button', 'click', 'simulate ' + trigger);
                }
            };

            $scope.simulateOnEnter = (e) =>
            {
                let key = e.key || e.which || e.keyCode;
                if (key === "Enter" || key === 13) {
                    $scope.simulate('enter');
                }
            };

            $scope.simulator.addSimulationListener(e => {
                if (e.data.response === "simulation") {
                    $scope.simulator.calculateResult(e.data.result.simulations);

                    $scope.simulationActive = false;
                    $scope.simulationCount++;
                    $scope.simulationID = uuidv4();
                } else if (e.data.response === "progress") {
                    $scope.simulationActive = {
                        simulation: e.data.progress.simulation,
                        progress: Math.round(e.data.progress.simulation / $scope.settings.simulations * 100),
                        round: e.data.progress.round,
                    };
                }

                $scope.$apply(); // This is a callback so we need to apply the changes manually
            });

            $scope.simulator.addSimulationResultListener(e => {
                if (e.data.response === "result") {
                    $scope.result = ResultHydrator.hydrateFromObject({
                        outcome: e.data.outcome,
                        simulations: e.data.results,
                        cases: e.data.cases
                    });
                }

                $scope.$apply(); // This is a callback so we need to apply the changes manually
            });

            $scope.cancelSimulation = () =>
            {
                $scope.simulator.resetSimulationModule();
                $scope.simulator.resetResultModule();

                $scope.simulationActive = false;

                c.Matomo.sendEvent('button', 'click', 'cancel simulation');
            };

            // Helper functions
            $scope.getRemainingEntitiesForPartyFleet = (party, fleet, type) =>
            {
                if ($scope.result !== null && (fleet.ships[type] > 0 || fleet.defence[type] > 0)) {
                    let activeFleetIndex = party.getFleetIndexByID(fleet.ID);

                    if ($scope.result.activeSimulation.entitiesRemaining[party.title].hasOwnProperty(activeFleetIndex)) {
                        if ($scope.result.activeSimulation.entitiesRemaining[party.title][activeFleetIndex].hasOwnProperty(type))
                            return $scope.result.activeSimulation.entitiesRemaining[party.title][activeFleetIndex][type].toString();

                        if ($scope.result.activeSimulation.entitiesLost[party.title][activeFleetIndex].hasOwnProperty(type)) {
                            if ((type < 400 && $scope.result.activeSimulation.entitiesLost[party.title][activeFleetIndex][type] === fleet.ships[type]) ||
                                (type >= 400 && $scope.result.activeSimulation.entitiesLost[party.title][activeFleetIndex][type] === fleet.defence[type])) {
                                return 0;
                            }
                        }
                    }
                }

                return "-";
            };

            $scope.getSimulationData = (attackers, defenders, settings, result, ID, includeFleetAPI) =>
            {
                let data = {version: 2};

                const includeAPI = includeFleetAPI === true;

                if (attackers) data[0] = $scope.parties.attackers.getSimulationData({includeAPI, includeABM: true});
                if (defenders) data[1] = $scope.parties.defenders.getSimulationData({includeAPI, includeABM: true});
                if (settings) data.settings = $scope.settings;
                if (result) data.result = $scope.result === null ? null : $scope.result.getData();
                if (ID) data.ID = $scope.simulationID;

                return data;
            };

            $scope.loadPlayerDataViaAPI = party =>
            {
                if (party.activeFleet.API !== null && party.activeFleet.API.length > 0) {
                    party.clearActiveFleet(true);

                    if ($scope.API.regex.spy.test(party.activeFleet.API)) {
                        $http({
                            method: "POST",
                            url: $rootScope.API.player,
                            data: {key: party.activeFleet.API, party: party.title, fleet: party.activeFleet.ID}
                        }).then(function (response) {
                            if (response.data.data !== void 0) {
                                $scope.hydrators.parties.hydrateFleetFromAPI(response.data.party, response.data.fleet, response.data.data.defender);

                                $scope.settings.plunder = response.data.data.loot_percentage;

                                if (response.data.server !== void 0) {
                                    $scope.hydrators.settings.hydrateFromAPI(response.data.server);
                                }
                            }
                        });
                    } else if ($scope.API.regex.own.test(party.activeFleet.API)) {
                        $scope.hydrators.parties.hydrateFleetFromString(party.title, party.activeFleet.ID, party.activeFleet.API);
                    }
                }
            };

            $scope.loadSimulationDataViaObject = data =>
            {
                let version = data.version !== void 0 ? +data.version : 1;

                for (let key in data) {
                    if (data.hasOwnProperty(key)) {
                        if (key === "settings") {
                            $scope.settings.reset();
                            if (version === 2) {
                                $scope.hydrators.settings.hydrateFromObject(data[key]);
                            } else {
                                $scope.hydrators.settings.hydrateFromAPI(data[key]);
                            }
                        } else if (key === "ID") {
                            $scope.simulationID = data[key];
                        } else if (key === "result") {
                            $scope.result = ResultHydrator.hydrateFromObject(data[key]);
                        } else if (key === "0" || key === "1") {
                            let party = "attackers";
                            if (key === "1") {
                                party = "defenders";
                            }

                            $scope.hydrators.parties.reset(party);

                            if (version === 2) {
                                for (let index in data[key]) {
                                    if (+index > 0) {
                                        $scope.parties[party].addFleet();
                                    }

                                    $scope.hydrators.parties.hydrateFleetFromObject(party, $scope.parties[party].activeFleet.ID, data[key][index]);
                                }
                            } else {
                                if (Array.isArray(data[key])) {
                                    for (let i = 0, il = data[key].length; i < il; i++) {
                                        if (i > 0) {
                                            $scope.parties[party].addFleet();
                                        }

                                        $scope.hydrators.parties.hydrateFleetFromAPI(party, $scope.parties[party].activeFleet.ID, data[key][i]);
                                    }
                                }
                            }
                        }
                    }
                }
            };

            $scope.getCargoCapacityForEntity = entity =>
            {
                let cargoCapacity = entityInfo[entity].cargo_capacity;

                if ($scope.settings.cargoHyperspaceTechMultiplier > 0) {
                    cargoCapacity += entityInfo[entity].cargo_capacity * ($scope.settings.cargoHyperspaceTechMultiplier / 100) * $scope.parties.attackers.fleets[0].techs.hyperspacetech
                }

                if ($scope.settings.characterClassesEnabled && $scope.parties.attackers.fleets[0].class === "collector" && [202, 203].indexOf(entity) >= 0) {
                    cargoCapacity += entityInfo[entity].cargo_capacity * ($scope.settings.minerBonusIncreasedCargoCapacityForTradingShips / 100);
                }

                return cargoCapacity;
            };

            $scope.applyCurrentResultCase = () =>
            {
                if ($scope.result !== null) {
                    let partyRemaining = $scope.result.activeSimulation.entitiesRemaining;

                    const defendersABM = $scope.parties.defenders.fleets[0].defence[502];

                    // Copy the remaining entities to the fleets & defences
                    for (let partyLabel in partyRemaining) {
                        $scope.parties[partyLabel].resetFleetEntities();

                        let remainingParty = $scope.result.activeSimulation.entitiesRemaining[partyLabel];
                        for (let fleetIndex in remainingParty) {
                            for (let type in remainingParty[fleetIndex]) {
                                if (type < 400)
                                    $scope.parties[partyLabel].fleets[fleetIndex].ships[type] = remainingParty[fleetIndex][type];
                                else {
                                    $scope.parties[partyLabel].fleets[fleetIndex].defence[type] = remainingParty[fleetIndex][type];
                                }
                            }
                        }
                    }

                    let partyLost = $scope.result.activeSimulation.entitiesLost;

                    let defenceRepair = $scope.settings.defenceRepair / 100;

                    if ($scope.parties.defenders.fleets[0].engineer) defenceRepair += (1 - defenceRepair) / 2; // Half the losses

                    // Add the repaired defences
                    for (let type in partyLost.defenders[0]) {
                        if (type >= 400) {
                            $scope.parties.defenders.fleets[0].defence[type] += Math.round(partyLost.defenders[0][type] * defenceRepair);
                        }
                    }

                    // Copy the ABM
                    if (defendersABM) {
                        $scope.parties.defenders.fleets[0].defence[502] = defendersABM;
                    }

                    $scope.parties.defenders.fleets[0].resources.metal -= $scope.result.activeSimulation.plunder.metal;
                    $scope.parties.defenders.fleets[0].resources.crystal -= $scope.result.activeSimulation.plunder.crystal;
                    $scope.parties.defenders.fleets[0].resources.deuterium -= $scope.result.activeSimulation.plunder.deuterium;

                    $scope.result = null;
                    $scope.simulationID = null;
                }
            };

            // Possible plunder calculations
            $scope.getNeededEntityCountForPlunder = entity =>
            {
                return Math.ceil((
                    $scope.parties.defenders.fleets[0].resources.metal +
                    $scope.parties.defenders.fleets[0].resources.crystal +
                    $scope.parties.defenders.fleets[0].resources.deuterium
                ) * ($scope.settings.plunder / 100) / $scope.getCargoCapacityForEntity(entity));
            };

            $scope.getPossiblePlunder = resource =>
            {
                if ($scope.parties.defenders.fleets[0].resources.hasOwnProperty(resource)) {
                    return Math.floor($scope.parties.defenders.fleets[0].resources[resource] * ($scope.settings.plunder / 100));
                }

                let total = 0;
                for (let resource in $scope.parties.defenders.fleets[0].resources) {
                    total += $scope.parties.defenders.fleets[0].resources[resource];
                }

                return Math.floor(total * ($scope.settings.plunder / 100));
            };

            $scope.getCapturedPlunderPercentage = actualPlunder =>
            {
                let plunderPercentage = (actualPlunder / $scope.getPossiblePlunder()) * 100;
                return isNaN(plunderPercentage) || plunderPercentage > 100 ? 100 : Math.round(plunderPercentage);
            };

            $scope.getNecessaryRecyclers = (simulation, overall) =>
            {
                if (simulation) {
                    return Math.ceil(("undefined" !== typeof overall && overall === true ? simulation.debris.overall.total : simulation.debris.remaining.total) / $scope.getCargoCapacityForEntity(209));
                }

                return null;
            };

            // Share
            $scope.share = () =>
            {
                $http({
                    method: "POST",
                    url: $rootScope.API.share,
                    data: $scope.getSimulationData(true, true, true, false, false, true),
                    responseType: "document"
                }).then(function (response) {
                    popupManager.open(response.data.body.firstChild, $scope);

                    c.Matomo.sendEvent('button', 'click', 'share');
                });
            };

            // Save
            $scope.save = () =>
            {
                $http({
                    method: "GET",
                    url: $rootScope.API.save,
                    responseType: "document"
                }).then(function (response) {
                    popupManager.open(response.data.body.firstChild, $scope);
                });

                c.Matomo.sendEvent('button', 'click', 'save');
            };

            // IPM
            $scope.ipm = () =>
            {
                $http({
                    method: "GET",
                    url: $rootScope.API.ipm,
                    responseType: "document"
                }).then(function (response) {
                    popupManager.open(response.data.body.firstChild, $scope);
                });

                c.Matomo.sendEvent('button', 'click', 'open ipm simulator');
            };

            // Calculators
            let getTacticalRetreat = parties =>
            {
                let attackers = parties.attackers.getTacticalRetreatCosts(),
                    defenders = parties.defenders.getTacticalRetreatCosts();

                if (attackers > 0 && defenders > 0) {
                    let strongAttack = attackers >= defenders,
                        ratio = Math.round((strongAttack ? attackers / defenders : defenders / attackers) * 100) / 100;

                    return {
                        attackers: strongAttack ? ratio : 1,
                        defenders: strongAttack ? 1 : ratio
                    };
                }

                return {attackers: '-', defenders: '-'};
            };

            // Simulation validation
            $scope.invalidFleetTechnologies = [];
            const validateFleetTechnologies = () =>
            {
                let valid = true;

                $scope.invalidFleetTechnologies = [];

                for (const party in $scope.parties) {
                    for (let i=0, il=$scope.parties[party].fleets.length; i<il; i++) {
                        if ($scope.parties[party].fleets[i].hasMissingTechs()) {
                            $scope.invalidFleetTechnologies.push($scope.parties[party].label + (i + 1));
                            valid = false;
                        }
                    }
                }

                if (!valid) {
                    $http({
                        method: "GET",
                        url: $rootScope.API.missingTechnologies,
                        responseType: "document"
                    }).then(function (response) {
                        popupManager.open(response.data.body.firstChild, $scope);
                    });
                }

                return valid;
            };

            // Watchers
            $scope.globals = {
                tacticalRetreat: getTacticalRetreat($scope.parties),
                flightData: {
                    attackers: Simulator.getFlightData($scope.parties.attackers.activeFleet, $scope.parties.defenders.fleets[0], $scope.settings),
                    defenders: Simulator.getFlightData($scope.parties.defenders.activeFleet, $scope.parties.defenders.fleets[0], $scope.settings)
                }
            };

            $scope.$watch('parties', parties => {
                $scope.globals.tacticalRetreat = getTacticalRetreat(parties);
                $scope.globals.flightData.attackers = Simulator.getFlightData(parties.attackers.activeFleet, parties.defenders.fleets[0], $scope.settings);
                $scope.globals.flightData.defenders = Simulator.getFlightData(parties.defenders.activeFleet, parties.defenders.fleets[0], $scope.settings);
            }, true);

            $scope.$watch('settings', (settings, oldSettings) => {
                if (settings.characterClassesEnabled !== oldSettings.characterClassesEnabled) {
                    c.Application.updateEntityInfo(settings.characterClassesEnabled);
                }

                if (oldSettings.characterClassesEnabled === true && settings.characterClassesEnabled === false) {
                    $scope.parties.attackers.resetClassData();
                    $scope.parties.defenders.resetClassData();
                }

                $scope.globals.flightData.attackers = Simulator.getFlightData($scope.parties.attackers.activeFleet, $scope.parties.defenders.fleets[0], settings);
                $scope.globals.flightData.defenders = Simulator.getFlightData($scope.parties.defenders.activeFleet, $scope.parties.defenders.fleets[0], settings);
            }, true);

            $scope.documentTitle = document.title;
            $scope.$watch('parties.defenders.fleets[0].coordinates', coordinates => {
                if (coordinates.galaxy !== null && coordinates.system !== null && coordinates.position !== null) {
                    document.title = 'TS - [' + Object.values(coordinates).join(':') + ']';
                } else {
                    document.title = $scope.documentTitle;
                }
            }, true);

            // Check for save data
            let defaultSavedData = storeManager.get('saved_default');
            if (defaultSavedData) {
                let data = storeManager.get('saved_data', true);
                if (data[defaultSavedData]) {
                    $scope.loadSimulationDataViaObject(data[defaultSavedData]);
                }
            }

            // Check for Prefill data
            if ($rootScope.URL.prefill !== null) {
                $scope.loadSimulationDataViaObject($rootScope.URL.prefill);

                c.Matomo.sendEvent('button', 'click', 'load spy data automatically');
            }

            // Check for API key
            if ($rootScope.URL.srkey !== null) {
                $scope.parties.defenders.fleets[0].API = $rootScope.URL.srkey;
                $scope.parties.defenders.selectFleet($scope.parties.defenders.fleets[0]);
                $scope.loadPlayerDataViaAPI($scope.parties.defenders);

                c.Matomo.sendEvent('button', 'click', 'load spy report automatically');
            }

            if ($rootScope.URL.share !== null) {
                $http({
                    method: "GET",
                    url: $rootScope.API.shareData.replace("{uuid}", $rootScope.URL.share)
                }).then(function (response) {
                    if (response.data !== void 0 && response.data.shareData !== void 0) {
                        $scope.loadSimulationDataViaObject(response.data.shareData);

                        c.Matomo.sendEvent('button', 'click', 'load share automatically');
                    } else {
                        // TODO handle error messages
                    }
                });
            }

            // Result cases
            $scope.getDesiredResultCasesKeys = () =>
            {
                return Object.keys(Simulator.getDesiredResultCases());
            };

            // Event Helpers
            $scope.fireButtonClick = event =>
            {
                c.Matomo.sendEvent('button', 'click', event);
            };

            // TODO: Handle IPM simulator (use dialog)

            // Experimental features
            $scope.hydrators.options.hydrateFromObject(storeManager.get("options", true));

            $scope.$watchCollection('options', () => {
                storeManager.set('options', $scope.options, true);
            });

            $scope.$watchGroup(['options.simulationModule', 'options.simulationWorkerCount', 'options.customEntityInfo'], () => {
                $scope.simulator.resetSimulationModule();
            }, true);

            $scope.customEntityInfo = null;
            $scope.setCustomEntityInfo = function (data)
            {
                if (data) {
                    $scope.options.customEntityInfo = JSON.parse(data);

                    entityInfo = $scope.options.customEntityInfo;
                } else {
                    $scope.options.customEntityInfo = null;

                    entityInfo = c.entityInfo;
                }
            };

            $scope.getCustomEntityInfo = function ()
            {
                return $scope.options.customEntityInfo ? JSON.stringify($scope.options.customEntityInfo) : $scope.options.customEntityInfo;
            };

            $scope.aMostarisSpecial = false;

            // Set entity info on initial load
            c.Application.updateEntityInfo($scope.settings.characterClassesEnabled);
        }
    ]);