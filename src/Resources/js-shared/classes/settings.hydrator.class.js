
    class SettingsHydrator
    {
        constructor(settings)
        {
            this.settings = settings;

            this.settingsMapping = {
                speed_fleet: "fleetSpeed",
                rapid_fire: "rapidFire",
                debris_factor: "fleetDebris",
                debris_factor_def: "defenceDebris",
                repair_factor: "defenceRepair",
                donut_galaxy: "donutGalaxy",
                donut_system: "donutSystem",
                galaxies: "galaxies",
                systems: "systems",
                global_deuterium_save_factor: "deuteriumSaveFactor",
                cargo_hyperspace_tech_multiplier: "cargoHyperspaceTechMultiplier",
                simulations: "simulations",
                plunder: "plunder",
                characterClassesEnabled: "characterClassesEnabled",
                minerBonusFasterTradingShips: "minerBonusFasterTradingShips",
                minerBonusIncreasedCargoCapacityForTradingShips: "minerBonusIncreasedCargoCapacityForTradingShips",
                warriorBonusFasterCombatShips: "warriorBonusFasterCombatShips",
                warriorBonusFasterRecyclers: "warriorBonusFasterRecyclers",
                warriorBonusRecyclerFuelConsumption: "warriorBonusRecyclerFuelConsumption",
                combatDebrisFieldLimit: "combatDebrisFieldLimit"
            };
        }

        hydrateFromAPI (data)
        {
            for (let property in data) {
                if (data.hasOwnProperty(property) && this.settingsMapping.hasOwnProperty(property)) {
                    let value = null;

                    switch (property) {
                        case "speed_fleet":
                        case "galaxies":
                        case "systems":
                        case "global_deuterium_save_factor":
                        case "cargo_hyperspace_tech_multiplier":
                        case "simulations":
                        case "plunder":
                            value = +data[property];
                            break;
                        case "rapid_fire":
                        case "donut_galaxy":
                        case "donut_system":
                        case "characterClassesEnabled":
                            value = +data[property] === 1;
                            break;
                        case "minerBonusFasterTradingShips":
                        case "minerBonusIncreasedCargoCapacityForTradingShips":
                        case "warriorBonusFasterCombatShips":
                        case "warriorBonusFasterRecyclers":
                        case "warriorBonusRecyclerFuelConsumption":
                        case "combatDebrisFieldLimit":
                        case "debris_factor":
                            value = data[property] * 100;
                            break;
                        case "debris_factor_def":
                            value = +data.def_to_tF === 1 ? data.debris_factor_def * 100 : 0;
                            break;
                        case "repair_factor":
                            value = !isNaN(+data.repair_factor) ? data.repair_factor * 100 : 70;
                            break;
                    }
                    
                    if (value !== null) {
                        this.settings[this.settingsMapping[property]] = value;
                    }
                }
            }
        }

        hydrateFromObject (data)
        {
            for (let property in data) {
                if (data.hasOwnProperty(property) && this.settings.hasOwnProperty(property)) {
                    this.settings[property] = data[property];
                }
            }
        }
    }