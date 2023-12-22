
    class FleetFlying extends Fleet
    {
        constructor ()
        {
            super();

            this.techs.combustion = null;
            this.techs.impulse = null;
            this.techs.hyperspace = null;

            this.speed = 100;
        }

        get speedOptions ()
        {
            return [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
        }

        getSimulationData (options)
        {
            let data = super.getSimulationData(options);

            data.speed = this.speed;

            return data;
        }

        getDriveFactor (entity)
        {
            let factor = 0.1;

            switch (entity) {
                case "202":
                    if (this.techs.impulse >= 5) factor = 0.2;
                    break;
                case "209":
                    if (this.techs.impulse >= 17) factor = 0.2;
                    if (this.techs.hyperspace >= 15) factor = 0.3;
                    break;
                case "211":
                    factor = 0.2;
                    if (this.techs.hyperspace >= 8) factor = 0.3;
                    break;
                case "205":
                case "206":
                case "208":
                    factor = 0.2;
                    break;
                case "207":
                case "213":
                case "214":
                case "215":
                case "219":
                case "218":
                    factor = 0.3;
            }

            if (factor === 0.3) return this.techs.hyperspace * factor;
            if (factor === 0.2) return this.techs.impulse * factor;

            return this.techs.combustion * factor;
        }

        getSpeeds (settings)
        {
            let speeds = {};

            for (let i in this.ships) {
                if (this.ships.hasOwnProperty(i) && this.ships[i] !== null && this.ships[i] > 0) {
                    let speed = entityInfo[i].speed;
                    if (i === "202" && this.techs.impulse >= 5) speed *= 2;
                    if (i === "209") {
                        if (this.techs.hyperspace >= 15) speed *= 3;
                        else if (this.techs.impulse >= 17) speed *= 2;
                    }
                    if (i === "211" && this.techs.hyperspace >= 8) speed *= 1.25;

                    let speedBonus = 0;

                    if (settings.characterClassesEnabled) {
                        if (this.class === "collector" && ["202", "203"].indexOf(i) >= 0) {
                            speedBonus = speed * (settings.minerBonusFasterTradingShips / 100);
                        }

                        if (this.class === "general") {
                            if (["204", "205", "206", "207", "211", "213", /*"214",*/ "215", "218", "219"].indexOf(i) >= 0) { // Deathstar is excluded
                                speedBonus = speed * (settings.warriorBonusFasterCombatShips / 100);
                            }

                            if (i === "209") {
                                speedBonus = speed * (settings.warriorBonusFasterRecyclers / 100);
                            }
                        }
                    }

                    speeds[i] = Math.round(speed * (1 + this.getDriveFactor(i)) + speedBonus);
                }
            }

            return speeds;
        }
    }