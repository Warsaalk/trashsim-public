
    const
        FLEET_CLASS_NONE = null,
        FLEET_CLASS_COLLECTOR = "collector",
        FLEET_CLASS_GENERAL = "general",
        FLEET_CLASS_DISCOVERER = "discoverer";

    class Fleet
    {
        constructor ()
        {
            this.ID = IDGenerator.next().value;

            this.ships = Fleet.getDefaultShipsList();

            this.techs = {weapon: null, shield: null, armour: null, hyperspacetech: null};

            this.API = null;

            this.coordinates = {galaxy: null, system: null, position: null};

            this.class = null;
        }

        static getDefaultShipsList ()
        {
            return {202: null, 203: null, 204: null, 205: null, 206: null, 207: null, 208: null, 209: null, 210: null, 211: null, 213: null, 214: null, 215: null, 219: null, 218: null};
        }

        hasCoordinates ()
        {
            return this.coordinates.galaxy !== null && this.coordinates.system !== null && this.coordinates.position !== null;
        }

        getTacticalRetreatCosts ()
        {
            let total = 0;

            for (let type in this.ships) {
                if (this.ships.hasOwnProperty(type) && this.ships[type] !== null && type !== "210" && type !== "212" && type !== "217") {
                    let division = type === "202" || type === "203" || type === "208" || type === "209" ? 4 : 1;
                    total += Math.round(((entityInfo[type].resources.metal + entityInfo[type].resources.crystal + entityInfo[type].resources.deuterium) * this.ships[type]) / division);
                }
            }

            return total;
        }

        getSimulationData (options)
        {
            let data = {techs: Object.assign({}, this.techs), coordinates: Object.assign({}, this.coordinates), class: this.class, entities: {}};

            for (let type in this.ships) {
                if (this.ships[type] !== null && this.ships[type] > 0) {
                    data.entities[type] = this.ships[type];
                }
            }

            if (options.includeAPI === true) {
                data.API = this.API;
            }

            /*if (options.warriorBonusCombatTechs !== void 0 && this.class === FLEET_CLASS_GENERAL) {
                data.techs.weapon += options.warriorBonusCombatTechs;
                data.techs.shield += options.warriorBonusCombatTechs;
                data.techs.armour += options.warriorBonusCombatTechs;
            }*/

            return data;
        }

        getDistance (fleet, settings)
        {
            let galaxyDistance = Math.abs(this.coordinates.galaxy - fleet.coordinates.galaxy), galaxycutoff = settings.galaxies / 2;
            if (galaxyDistance > galaxycutoff && settings.donutGalaxy) galaxyDistance = galaxycutoff - (galaxyDistance - galaxycutoff);
            if (galaxyDistance !== 0) return 20000 * galaxyDistance;

            let systemDistance = Math.abs(this.coordinates.system - fleet.coordinates.system), systemcutoff = settings.systems / 2;
            if (systemDistance > systemcutoff && settings.donutSystem) systemDistance = systemcutoff - (systemDistance - systemcutoff);
            if (systemDistance !== 0) return 2700 + 95 * systemDistance;

            if ((this.coordinates.position - fleet.coordinates.position) !== 0) return 1000 + 5 * Math.abs(this.coordinates.position - fleet.coordinates.position);

            return 5; //Distance between planet / moon / debris
        }

        getCargoCapacity (settings)
        {
            let cargoCapacity = 0;

            for (let i in this.ships) {
                if (this.ships.hasOwnProperty(i) && this.ships[i] !== null && this.ships[i] > 0) {
                    let shipCargoCapacity = entityInfo[i].cargo_capacity;

                    if (settings.cargoHyperspaceTechMultiplier > 0) {
                        shipCargoCapacity += entityInfo[i].cargo_capacity * (settings.cargoHyperspaceTechMultiplier / 100) * this.techs.hyperspacetech
                    }

                    if (settings.characterClassesEnabled && this.class === "collector" && ["202", "203"].indexOf(i) >= 0) {
                        shipCargoCapacity += entityInfo[i].cargo_capacity * (settings.minerBonusIncreasedCargoCapacityForTradingShips / 100);
                    }

                    cargoCapacity += shipCargoCapacity * this.ships[i];
                }
            }

            return cargoCapacity === 0 ? "-" : cargoCapacity;
        }

        hasMissingTechs ()
        {
            for (const techLabel in this.techs) {
                if (this.techs[techLabel] === null) return true;
            }

            return false;
        }

        fixMissingTechs ()
        {
            for (const techLabel in this.techs) {
                if (this.techs[techLabel] === null) this.techs[techLabel] = 0;
            }
        }

        hasHighTechs ()
        {
            for (const techLabel in this.techs) {
                if (this.techs[techLabel] >= 100) return true;
            }

            return false;
        }

        resetEntities ()
        {
            this.ships = Fleet.getDefaultShipsList();
        }

        resetClassData ()
        {
            this.class = 0;

            this.ships[218] = null;
            this.ships[219] = null;
        }
    }