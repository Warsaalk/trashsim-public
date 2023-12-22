
    class Party
    {
        constructor (title, label, initialFleet)
        {
            this.title = title;
            this.label = label;

            this.fleets = [initialFleet];
            this.activeFleet = this.fleets[0];
        }

        addFleet ()
        {
            let techs = Object.assign({}, this.activeFleet.techs),
                coordinates = Object.assign({}, this.activeFleet.coordinates),
                fleetClass = this.activeFleet.class;

            this.fleets.push(new FleetFlying());
            this.activeFleet = this.fleets[this.fleets.length - 1];

            // Copy techs
            for (let tech in this.activeFleet.techs) {
                if (techs[tech] !== void 0) {
                    this.activeFleet.techs[tech] = techs[tech];
                }
            }

            // Copy the class
            this.activeFleet.class = fleetClass;

            // Copy coordinates
            this.activeFleet.coordinates = coordinates;
        }

        selectFleet (fleet)
        {
            this.activeFleet = fleet;
        }

        clearActiveFleet (keepAPI)
        {
            let index = this.fleets.findIndex(fleet => fleet.ID === this.activeFleet.ID);

            let API = this.activeFleet.API;

            this.fleets[index] = this.activeFleet.defence ? new Defender() : new FleetFlying();

            this.activeFleet = this.fleets[index];

            if (keepAPI !== void 0 && keepAPI === true) {
                this.activeFleet.API = API;
            }
        }

        clearActiveFleetEntities ()
        {
            this.activeFleet.resetEntities();
        }

        resetFleetEntities ()
        {
            for (let i=0, il=this.fleets.length; i<il; i++) {
                this.fleets[i].resetEntities();
            }
        }

        resetClassData()
        {
            for (let i=0, il=this.fleets.length; i<il; i++) {
                this.fleets[i].resetClassData();
            }
        }

        fixFleetsMissingTechs ()
        {
            for (let i=0, il=this.fleets.length; i<il; i++) {
                this.fleets[i].fixMissingTechs();
            }
        }

        removeActiveFleet()
        {
            let index = this.getActiveFleetIndex();

            if (this.fleets.length > 0 && index >= 0) {
                this.fleets.splice(index, 1);
            }

            this.activeFleet = this.fleets[index === this.fleets.length ? this.fleets.length - 1 : index];
        }

        getActiveFleetIndex()
        {
            return this.fleets.findIndex(fleet => fleet.ID === this.activeFleet.ID);
        }

        getFleetIndexByID (ID)
        {
            return this.fleets.findIndex(fleet => fleet.ID === ID);
        }

        getFleetByID (ID)
        {
            let index = this.getFleetIndexByID(ID);

            if (index >= 0) return this.fleets[index];

            return null;
        }

        getInfoPerFleetIndex ()
        {
            let info = {};

            for (let i=0, il=this.fleets.length; i<il; i++) {
                info[i] = {
                    techs: {},
                    "class": this.fleets[i].class
                };

                for (const tech in this.fleets[i].techs) {
                    info[i].techs[tech] = this.fleets[i].techs[tech] && this.fleets[i].techs[tech] > 0 ? this.fleets[i].techs[tech] : 0;
                }
            }

            return info;
        }

        getTacticalRetreatCosts ()
        {
            let total = 0;

            for (let i=0, il=this.fleets.length; i<il; i++) {
                total += this.fleets[i].getTacticalRetreatCosts();
            }

            return total;
        }

        getSimulationData (options)
        {
            let data = {};

            for (let i=0, il=this.fleets.length; i<il; i++) {
                data[i] = this.fleets[i].getSimulationData(options);
            }

            return data;
        }
    }