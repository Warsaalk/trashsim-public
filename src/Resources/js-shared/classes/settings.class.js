
    class Settings
    {
        constructor()
        {
            this.reset();
        }

        reset ()
        {
            this.simulations = 50;
            this.plunder = 50; // 75 100
            this.fleetSpeed = 1;
            this.rapidFire = true;
            this.fleetDebris = 30;
            this.defenceDebris = 0;
            this.defenceRepair = 70;
            this.donutGalaxy = true;
            this.donutSystem = true;
            this.galaxies = 9;
            this.systems = 499;
            this.deuteriumSaveFactor = 1;
            this.cargoHyperspaceTechMultiplier = 5;
            this.characterClassesEnabled = true;
            this.minerBonusFasterTradingShips = 100;
            this.minerBonusIncreasedCargoCapacityForTradingShips = 25;
            this.warriorBonusFasterCombatShips = 100;
            this.warriorBonusFasterRecyclers = 100;
            this.warriorBonusRecyclerFuelConsumption = 25;
            this.warriorBonusCombatTechs = 2;
            this.combatDebrisFieldLimit = 25;
        }

        get plunderOptions ()
        {
            return [50, 75, 100];
        }
    }