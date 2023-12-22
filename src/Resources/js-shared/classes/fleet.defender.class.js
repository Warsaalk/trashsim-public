
    class Defender extends Fleet
    {
        constructor ()
        {
            super();

            this.ships[212] = null;
            this.ships[217] = null;

            this.defence = Defender.getDefaultDefenceList();

            this.resources = {metal: null, crystal: null, deuterium: null};

            this.engineer = false;
        }

        static getDefaultDefenceList ()
        {
            return {401: null, 402: null, 403: null, 404: null, 405: null, 406: null, 407: null, 408: null, 502: null};
        }

        getSimulationData (options)
        {
            let data = super.getSimulationData(options);

            for (let type in this.defence) {
                if (this.defence[type] !== null && this.defence[type] > 0) {
                    if (type !== "502" || (options.includeABM === true && type === "502")) {
                        data.entities[type] = this.defence[type];
                    }
                }
            }

            data.resources = {};
            for (let resourceType in this.resources) {
                data.resources[resourceType] = this.resources[resourceType];
            }

            data.engineer = this.engineer;

            return data;
        }

        resetEntities ()
        {
            super.resetEntities();

            this.ships[212] = null;
            this.ships[217] = null;

            this.defence = Defender.getDefaultDefenceList();
        }

        resetClassData ()
        {
            super.resetClassData();

            this.ships[217] = null;
        }
    }