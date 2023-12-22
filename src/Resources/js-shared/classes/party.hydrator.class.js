
    class PartyHydrator
    {
        constructor (parties)
        {
            this.parties = parties;

            this.researchMapping = {
                106: "espionage",
                108: "computer",
                109: "weapon",
                110: "shield",
                111: "armour",
                113: "energy",
                114: "hyperspacetech",
                115: "combustion",
                117: "impulse",
                118: "hyperspace",
                120: "laser",
                121: "ion",
                122: "plasma",
                123: "irn",
                124: "astrophysics",
                199: "graviton"
            };
        }

        reset (partyLabel)
        {
            if (partyLabel === "defenders")
                this.parties[partyLabel] = new Party('defenders', 'D', new Defender());
            else
                this.parties[partyLabel] = new Party('attackers', 'A', new FleetFlying());
        }

        getPlayerClass (data)
        {
            switch (data) {
                case 1: return FLEET_CLASS_COLLECTOR;
                case 2: return FLEET_CLASS_GENERAL;
                case 3: return FLEET_CLASS_DISCOVERER;
            }

            return FLEET_CLASS_NONE;
        }

        hydrateFleetFromAPI (partyLabel, fleetID, data)
        {
            let player = this.parties[partyLabel].getFleetByID(fleetID);

            player.class = this.getPlayerClass(data.class);

            for (let key in data.planet) {
                if (data.planet.hasOwnProperty(key) && player.coordinates.hasOwnProperty(key)) {
                    player.coordinates[key] = +data.planet[key];
                }
            }

            for (let technology in data.research) {
                if (data.research.hasOwnProperty(technology) && this.researchMapping.hasOwnProperty(technology)) {
                    let techLabel = this.researchMapping[technology];
                    if (player.techs.hasOwnProperty(techLabel)) {
                        player.techs[techLabel] = +data.research[technology].level;
                    }
                }
            }

            for (let entity in data.ships) {
                if (data.ships.hasOwnProperty(entity) && player.ships.hasOwnProperty(entity)) {
                    player.ships[entity] = +data.ships[entity].count;
                }
            }

            if (player instanceof FleetFlying) {
                if (data.hasOwnProperty("speed") && player.speedOptions.indexOf(+data.speed) >= 0) {
                    player.speed = +data.speed;
                }
            }

            if (player instanceof Defender) {
                for (let entity in data.defence) {
                    if (data.defence.hasOwnProperty(entity) && player.defence.hasOwnProperty(entity)) {
                        player.defence[entity] = +data.defence[entity].count;
                    }
                }

                for (let resource in data.resources) {
                    if (data.resources.hasOwnProperty(resource) && player.resources.hasOwnProperty(resource)) {
                        player.resources[resource] = +data.resources[resource];
                    }
                }
            }
        }

        hydrateFleetFromString (partyLabel, fleetID, data)
        {
            let player = {planet: {}, research: {}, ships: {}, defence: {}};

            let parts = data.split('|');

            for (const i in parts) {
                if (parts.hasOwnProperty(i)) {
                    let props = parts[i].split(';');
                    if (props.length === 2) {
                        if (props[0] === 'coords') {
                            let coords = props[1].split(':');
                            if (coords.length === 3) {
                                player.planet.galaxy = coords[0];
                                player.planet.system = coords[1];
                                player.planet.position = coords[2];
                            }
                        } else if (props[0] === 'characterClassId') {
                            player.class = +props[1];
                        } else if (props[0] >= 100 && props[0] <= 199) {
                            player.research[props[0]] = {level: props[1]};
                        } else {
                            if (entityInfo.hasOwnProperty(props[0])) {
                                if (props[0] < 400) {
                                    player.ships[props[0]] = {count: props[1]};
                                } else {
                                    player.defence[props[0]] = {count: props[1]};
                                }
                            }
                        }
                    }
                }
            }

            this.hydrateFleetFromAPI(partyLabel, fleetID, player);
        }

        hydrateFleetFromObject (partyLabel, fleetID, data)
        {
            let player = this.parties[partyLabel].getFleetByID(fleetID);

            if (data.coordinates !== void 0) {
                player.coordinates = data.coordinates;
            }

            if (data.class !== void 0) {
                player.class = data.class;
            }

            if (data.techs !== void 0) {
                for (let tech in data.techs) {
                    if (data.techs.hasOwnProperty(tech) && player.techs.hasOwnProperty(tech)) {
                        player.techs[tech] = +data.techs[tech];
                    }
                }
            }

            if (data.API !== void 0) {
                player.API = data.API;
            }

            for (let entity in data.entities) {
                if (entity < 400) {
                    if (data.entities.hasOwnProperty(entity) && player.ships.hasOwnProperty(entity)) {
                        player.ships[entity] = +data.entities[entity];
                    }
                } else if (entity >= 400 && player instanceof Defender) {
                    if (data.entities.hasOwnProperty(entity) && player.defence.hasOwnProperty(entity)) {
                        player.defence[entity] = +data.entities[entity];
                    }
                }
            }

            if (player instanceof FleetFlying) {
                if (data.speed !== void 0) {
                    player.speed = data.speed;
                }
            }

            if (player instanceof Defender) {
                if (data.resources !== void 0) {
                    player.resources = data.resources;
                }
            }
        }

        hydrateFleetFromOGotchaAPIv1 (data)
        {
            const parties = {
                attackers: {
                    names: "attackerNames",
                    techs: "attackerTechs",
                    entities: "attackersStart"
                },
                defenders: {
                    names: "defenderNames",
                    techs: "defenderTechs",
                    entities: "defendersStart"
                }
            }

            for (const partyID in parties) {
                this.reset(partyID);

                for (let i=0, il=data[parties[partyID].names].length; i<il; i++) {
                    const fleetOwner = data[parties[partyID].names][[i]];

                    for (let y=0, yl=data[parties[partyID].entities][fleetOwner].length; y<yl; y++) {
                        if (!(i === 0 && y === 0)) {
                            this.parties[partyID].addFleet();
                        }

                        const fleetEntities = data[parties[partyID].entities][fleetOwner][y];

                        const fleetObject = {
                            techs: {
                                weapon: data[parties[partyID].techs][i][0] / 10,
                                shield: data[parties[partyID].techs][i][1] / 10,
                                armour: data[parties[partyID].techs][i][2] / 10
                            },
                            entities: {}
                        }

                        for (const entityID in fleetEntities) {
                            fleetObject.entities[entityID] = fleetEntities[entityID].count;
                        }

                        this.hydrateFleetFromObject(partyID, this.parties[partyID].activeFleet.ID, fleetObject);
                    }
                }
            }
        }

        hydrateFleetFromOGotchaAPIv2 (data)
        {
            const parties = [
                "attackers",
                "defenders"
            ];

            for (const partyID of parties) {
                this.reset(partyID);

                for (let i=0, il=data[partyID].length; i<il; i++) {
                    if (i > 0) {
                        this.parties[partyID].addFleet();
                    }

                    const
                        fleet = data[partyID][i],
                        fleetObject = {
                        techs: {
                            weapon: fleet.fleet_weapon_percentage / 10,
                            shield: fleet.fleet_shield_percentage / 10,
                            armour: fleet.fleet_armor_percentage / 10
                        },
                        entities: {}
                    }

                    for (const entity of fleet.fleet_composition) {
                        fleetObject.entities[entity.ship_type] = entity.count;
                    }

                    this.hydrateFleetFromObject(partyID, this.parties[partyID].activeFleet.ID, fleetObject);
                }
            }
        }
    }