
    class Simulation
    {
        constructor (result, rounds, entitiesLost, entitiesRemaining, settings, resources, canPlunder, engineer, flightData, partiesFleetInfo)
        {
            this.outcome = Object.keys(result)[0];

            this.rounds = rounds;

            this.entitiesLost = entitiesLost;

            this.entitiesRemaining = entitiesRemaining;

            this.reapers = this.calculateReaperData(settings, partiesFleetInfo);

            this.debris = this.calculateDebris(settings, engineer);

            this.losses = {
                attackers: this.calculateValue('attackers'),
                defenders: this.calculateValue('defenders')
            };

            this.plunder = this.calculatePlunder(settings, resources, canPlunder, partiesFleetInfo);

            // These need to be calculated after the debris has been calculated
            this.moonChance = this.calculateMoonChance();
            this.profits = {
                attackers: this.calculateProfits('attackers', flightData),
                defenders: this.calculateProfits('defenders', flightData)
            };

            delete this.reapers;
        }

        getRemainingEntitiesForFleet (party, fleetIndex)
        {
            return this.entitiesRemaining[party][fleetIndex] !== void 0 ? this.entitiesRemaining[party][fleetIndex] : {};
        }

        getEntityCargoCapacity (entity, entityCount, fleetInfo, settings)
        {
            let entityCapacity = entityInfo[entity].cargo_capacity;

            if (settings.cargoHyperspaceTechMultiplier > 0) {
                entityCapacity += entityCapacity * (settings.cargoHyperspaceTechMultiplier / 100) * fleetInfo.techs.hyperspacetech;
            }

            if (settings.characterClassesEnabled && fleetInfo.class === "collector" && ["202", "203"].indexOf(entity) >= 0) {
                entityCapacity += entityInfo[entity].cargo_capacity * (settings.minerBonusIncreasedCargoCapacityForTradingShips / 100);
            }

            return entityCapacity * entityCount;
        }

        calculateReaperData (settings, partiesFleetInfo)
        {
            let reaperData = {};

            for (let party in this.entitiesRemaining) {
                reaperData[party] = {count: 0, capacity: 0};
                for (let i in this.entitiesRemaining[party]) {
                    if (this.entitiesRemaining[party][i][218] !== void 0) {
                        const reaperCount = this.entitiesRemaining[party][i][218];

                        reaperData[party].count += reaperCount;
                        reaperData[party].capacity += this.getEntityCargoCapacity(218, reaperCount, partiesFleetInfo[party][i], settings);
                    }
                }
            }

            return reaperData;
        }

        calculateDebris (settings, engineer)
        {
            let metal = 0, crystal = 0;

            let fleetDebris = settings.fleetDebris / 100,
                defenceDebris = settings.defenceDebris / 100,
                defenceRepair = 1 - (settings.defenceRepair / 100);

            if (engineer) defenceRepair /= 2; // Half the losses, which results in less df

            for (let party in this.entitiesLost) {
                for (let i in this.entitiesLost[party]) {
                    for (let entity in this.entitiesLost[party][i]) {
                        let toDebris = entity >= 400 ? defenceDebris * defenceRepair : fleetDebris;
                        metal += (this.entitiesLost[party][i][entity] * entityInfo[entity].resources.metal) * toDebris;
                        crystal += (this.entitiesLost[party][i][entity] * entityInfo[entity].resources.crystal) * toDebris;
                    }
                }
            }

            let result = {
                overall: {metal: metal, crystal: crystal, total: metal + crystal},
                reaper: {
                    attackers: {metal: 0, crystal: 0, total: 0},
                    defenders: {metal: 0, crystal: 0, total: 0}
                },
                remaining: {metal: 0, crystal: 0, total: 0}
            };

            if (settings.combatDebrisFieldLimit > 0) {
                let maxDebrisPercentage = settings.combatDebrisFieldLimit / 100,
                    maxDebrisHarvest = Math.floor(maxDebrisPercentage * result.overall.total),
                    debrisMetalRatio = result.overall.metal / result.overall.total,
                    debrisCrystalRatio = 1 - debrisMetalRatio;

                for (let party in this.reapers) {
                    if (this.reapers[party].count > 0) {
                        const canHarvest = maxDebrisHarvest > this.reapers[party].capacity ? this.reapers[party].capacity : maxDebrisHarvest;

                        result.reaper[party].metal = Math.floor(canHarvest * debrisMetalRatio);
                        result.reaper[party].crystal = Math.floor(canHarvest * debrisCrystalRatio);
                        result.reaper[party].total = result.reaper[party].metal + result.reaper[party].crystal;
                    }
                }
            }

            result.remaining.metal = result.overall.metal - result.reaper.attackers.metal - result.reaper.defenders.metal;
            result.remaining.crystal = result.overall.crystal - result.reaper.attackers.crystal - result.reaper.defenders.crystal;
            result.remaining.total = result.overall.total - result.reaper.attackers.total - result.reaper.defenders.total;

            return result;
        }

        calculateValue (party)
        {
            let metal = 0, crystal = 0, deuterium = 0;

            for (let i in this.entitiesLost[party]) {
                for (let entity in this.entitiesLost[party][i]) {
                    metal += this.entitiesLost[party][i][entity] * entityInfo[entity].resources.metal;
                    crystal += this.entitiesLost[party][i][entity] * entityInfo[entity].resources.crystal;
                    deuterium += this.entitiesLost[party][i][entity] * entityInfo[entity].resources.deuterium;
                }
            }

            return {metal: metal, crystal: crystal, deuterium: deuterium, total: metal + crystal + deuterium};
        }

        calculatePlunder (settings, resources, canPlunder, partiesFleetInfo)
        {
            let capacity = 0, canBePlundered = JSON.parse(JSON.stringify(resources));

            let metal = 0, crystal = 0, deuterium = 0;

            if (canPlunder) {
                // Calculate the actual plunder
                for (let resource in canBePlundered) {
                    canBePlundered[resource] *= settings.plunder / 100;
                }

                for (let i in this.entitiesRemaining.attackers) {
                    for (let entity in this.entitiesRemaining.attackers[i]) {
                        capacity += this.getEntityCargoCapacity(entity, this.entitiesRemaining.attackers[i][entity], partiesFleetInfo.attackers[i], settings);
                    }
                }

                // TODO subtract reaper

                let oneThird = capacity / 3;

                // Step 1. Load metal
                if (canBePlundered.metal <= oneThird) {
                    metal = canBePlundered.metal;
                    canBePlundered.metal = 0;
                    capacity -= metal;
                } else {
                    metal = oneThird;
                    canBePlundered.metal -= oneThird;
                    capacity -= oneThird;
                }

                let half = capacity / 2;

                // Step 2. Load crystal
                if (canBePlundered.crystal <= half) {
                    crystal = canBePlundered.crystal;
                    canBePlundered.crystal = 0;
                    capacity -= crystal;
                } else {
                    crystal = half;
                    canBePlundered.crystal -= half;
                    capacity -= half;
                }

                // Step 3. Load deuterium
                if (canBePlundered.deuterium > capacity) {
                    deuterium = capacity;
                    capacity = 0;
                } else {
                    deuterium = canBePlundered.deuterium;
                    canBePlundered.deuterium = 0;
                    capacity -= deuterium;
                }

                if (capacity > 0) {
                    half = capacity / 2;
                    // Step 4. Load remaining metal
                    if (canBePlundered.metal <= half) {
                        metal += canBePlundered.metal;
                        capacity -= canBePlundered.metal;
                        canBePlundered.metal = 0;
                    } else {
                        metal += half;
                        canBePlundered.metal -= half;
                        capacity -= half;
                    }

                    // Step 5. Load remaining crystal
                    if (canBePlundered.crystal > capacity) {
                        crystal += capacity;
                        capacity = 0;
                    } else {
                        crystal += canBePlundered.crystal;
                        capacity -= canBePlundered.crystal;
                        canBePlundered.crystal = 0;
                    }
                }

                if (capacity > 0) {
                    // Step 6. Load remaining metal
                    if (canBePlundered.metal > capacity) {
                        metal += capacity;
                        capacity = 0;
                    } else {
                        metal += canBePlundered.metal;
                        canBePlundered.metal = 0;
                    }
                }

                metal = Math.round(metal);
                crystal = Math.round(crystal);
                deuterium = Math.round(deuterium);
            }

            return {metal: metal, crystal: crystal, deuterium: deuterium, total: metal + crystal + deuterium};
        }

        calculateMoonChance ()
        {
            let hypotheticalMoonChance = Math.floor(this.debris.overall.total / 100000);

            return hypotheticalMoonChance > 20 ? 20 : hypotheticalMoonChance;
        }

        calculateProfits (party, flightData)
        {
            let fuelConsumption = 0;

            for (let player in flightData[party]) {
                if (flightData[party][player].fuelConsumption) {
                    fuelConsumption += flightData[party][player].fuelConsumption;
                }
            }

            let metal = -this.losses[party].metal + this.debris.remaining.metal + this.debris.reaper[party].metal,
                crystal = -this.losses[party].crystal + this.debris.remaining.crystal + this.debris.reaper[party].crystal,
                deuterium = -this.losses[party].deuterium - fuelConsumption;

            if (party === "attackers") {
                metal += this.plunder.metal;
                crystal += this.plunder.crystal;
                deuterium += this.plunder.deuterium;
            }

            return {metal: metal, crystal: crystal, deuterium: deuterium, total: metal + crystal + deuterium};
        }
    }