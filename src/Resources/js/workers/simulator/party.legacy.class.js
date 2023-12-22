/**
 * This version of the Party class is used for non chromium browsers
 */
class PartyLegacy
{
    constructor (length)
    {
        this.x = 0;
        this.length = length;

        this.entities = new Uint32Array(length); // The types in this array will always be in order from 202 to ...
        this.entitiesShields = new Float32Array(length);
        this.entitiesHullPoints = new Float32Array(length);
        this.remaining = length;
        this.destroyed = 0;
        this.entityInfo = {};

        this.remainingEntities = {};
        this.lostEntities = {};
    }

    loadPlayerEntities (index, weaponLvl, shieldLvl, armourLvl, numbers)
    {
        this.remainingEntities[index] = {};
        this.lostEntities[index] = {};
        this.entityInfo[index] = {};

        for (let type in numbers) {
            let number = numbers[type]|0, weapon = entityInfo[type].weapon, shield = entityInfo[type].shield, armour = entityInfo[type].armour;

            let fullShield = Math.floor(shield + (shield * 0.1 * shieldLvl)), HP = Math.floor((armour + (armour * 0.1 * armourLvl)) * 0.1);

            this.lostEntities[index][type] = 0;

            this.entityInfo[index][type] = [
                Math.floor(weapon + (weapon * 0.1 * weaponLvl)),
                fullShield,
                HP
            ];

            while (number--) {
                //Type, Status, Attack, Shield, HP, maxHP
                this.entities[this.x] = (type|0) | 1 << 9 | (index|0) << 10; // Max 8 bits for type (max type = 511) | At bit 9 the alive flag | from bit 10 the player index
                this.entitiesShields[this.x] = fullShield;
                this.entitiesHullPoints[this.x] = HP;

                this.x++; // Position next entity
            }
        }
    }

    shootTo (enemies, useRapidFire)
    {
        if (enemies.remaining > 0) {
            // Select a random enemy, set local entities variable, pick random enemy, set local enemy entities
            let random = Math.random, entities = this.entities;

            // Calculate remaining entities
            let il = this.remaining, i = 0;

            // Predefined rapid fire variables
            let entityRapidFire = false, entityRapidFireType = 0;

            // Loop all entities
            while (i < il) {
                let type = entities[i] & 0x1FF, eType = false, index = entities[i] >> 10;

                // As the entity types will be ordered only select the rapidfire info on the first occurence
                if (type !== entityRapidFireType) {
                    entityRapidFire = entityInfo[type];
                    entityRapidFireType = type;
                }

                do {
                    // Select a random enemy target
                    //var enemyEntity = enemy.entities[];
                    let ex = Math.floor(random() * enemies.remaining), eIndex = enemies.entities[ex] >> 10;

                    eType = enemies.entities[ex] & 0x1FF;

                    // Make sure the enemy entity is still alive & our entity can attack
                    if ((enemies.entities[ex] >> 9 & 0x1) === 1 && this.entityInfo[index][type][0] !== 0) {
                        const eEntityShield = enemies.entitiesShields[ex];

                        let eEntityFullShield = enemies.entityInfo[eIndex][eType][1];

                        let attackPower = this.entityInfo[index][type][0]; // Real attack power
                        if (attackPower < eEntityFullShield && eEntityShield >= 0) { // If the attack is lower than the shield we need to calculate the shield damage / bounce effect
                            // Calculate the damage percentage, this percentage will be an integer
                            // As an effect of this calculation a entity with a attack power less than 1% of the enemie his full shield, the shot will bounce
                            let damagePercentage = attackPower / eEntityFullShield * 100;
                            if (damagePercentage > 1) {
                                const shieldDamagePercentage = Math.floor(damagePercentage);

                                let newShield = eEntityShield - shieldDamagePercentage * 0.01 * eEntityFullShield;
                                if (newShield === 0 && damagePercentage > shieldDamagePercentage) {
                                    newShield -= (damagePercentage - shieldDamagePercentage) * 0.01 * eEntityFullShield;
                                }

                                enemies.entitiesShields[ex] = newShield;
                            }

                            attackPower = 0; // Reset the attack because it was already used on the shield
                        } else {
                            attackPower -= eEntityShield; // Calculate the remaining attack power after bringing the shield down
                            enemies.entitiesShields[ex] = -1; // Set shield to 0 because the attack was higher than the shield value, thus the shield was destroyed
                        }

                        if (attackPower > 0) { // If there is still attack power left after hitting the shield -> hit the hull with the remaining power
                            enemies.entitiesHullPoints[ex] -= attackPower;

                            // If HP is below 0, I thinks it's exploded!
                            if (enemies.entitiesHullPoints[ex] <= 0) {
                                enemies.entities[ex] &= ~(1 << 9); // Clear the alive bit
                                enemies.destroyed++;
                            }
                        }

                        // Calculate explosion probability only if HP is below 70%
                        if ((enemies.entities[ex] >> 9 & 0x1) === 1 && enemies.entitiesHullPoints[ex] <= (enemies.entityInfo[eIndex][eType][2] * 0.7)) {
                            // Roll a dice on lost HP, if a ship is damaged for 35% there is a chance of 35% that it'll explode
                            if (random() >= (enemies.entitiesHullPoints[ex] / enemies.entityInfo[eIndex][eType][2])) {
                                enemies.entities[ex] &= ~(1 << 9); // Clear the alive bit
                                enemies.destroyed++;
                            }
                        }
                    }

                    // Rapid fire is disabled or no rapid fire present against the enemy target, so let our next entity fire
                    if (entityRapidFire.rapidfire_against[eType] === void 0) break;

                } while (useRapidFire !== false && random() > (1 / entityRapidFire.rapidfire_against[eType])); // The chance a entity has to repeat fire against another ship

                i++;	// Go to next entity
            }
        }
    }

    resetEntities ()
    {
        let newRemaining = this.length - this.destroyed;

        // Loop all our entities, remaining count is always reset
        let tempRemaining = new Uint32Array(newRemaining),
            tempRemainingShields = new Float32Array(newRemaining),
            tempRemainingHullPoints = new Float32Array(newRemaining);

        for (let i=0, il=this.remaining, x = 0; i<il; i++) {
            // Delete this.entities with the explosion flag
            if ((this.entities[i] >> 9 & 0x1) === 0) {
                this.lostEntities[this.entities[i] >> 10][this.entities[i] & 0x1FF]++;
            }
            // Regenerate the shields of the remaining this.entities
            else {
                tempRemaining[x] = this.entities[i];
                tempRemainingShields[x] = this.entityInfo[this.entities[i] >> 10][this.entities[i] & 0x1FF][1];
                tempRemainingHullPoints[x] = this.entitiesHullPoints[i];
                x++;
            }
        }

        this.entities = tempRemaining;
        this.entitiesShields = tempRemainingShields;
        this.entitiesHullPoints = tempRemainingHullPoints;
        this.remaining = newRemaining;
    }

    getRemainingEntities ()
    {
        if (this.remaining > 0) {
            let last = this.entities[0] & 0x1FF, lastIdx = 0, i = 0, playerIdx = this.entities[0] >> 10;

            for (let il=this.remaining; i<il; i++) {
                if ((this.entities[i] & 0x1FF) !== last || (this.entities[i] >> 10) !== playerIdx) {
                    this.remainingEntities[playerIdx][last] = i - lastIdx;
                    lastIdx = i;
                    last = this.entities[i] & 0x1FF;
                    playerIdx = this.entities[i] >> 10;
                }
            }

            this.remainingEntities[playerIdx][last] = i - lastIdx;
        }

        return this.remainingEntities;
    }

    getLostEntities ()
    {
        for (let index in this.lostEntities) {
            for (let type in this.lostEntities[index]) {
                if (this.lostEntities[index][type] === 0)
                    delete this.lostEntities[index][type];
            }
        }
        return this.lostEntities;
    }

    clear ()
    {
        this.entities = new Uint32Array(0); // The types in this array will always be in order from 202 to ...
        this.entitiesShields = new Float32Array(0);
        this.entitiesHullPoints = new Float32Array(0);
    }
}