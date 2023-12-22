/**
 * This version of the Party class is used for non chromium browsers
 */
class PartyX
{
    constructor (length)
    {
        this.x = 0;
        this.length = length;

        this.entities = new Uint32Array(length); // The types in this array will always be in order from 202 to ...
        //this.entitiesShields = new Float32Array(length);
        this.entitiesHullPoints = new Float32Array(length);
        this.remaining = length;
        this.destroyed = 0;
        this.entityInfo = {};

        this.remainingEntities = {};
        this.lostEntities = {};
    }

    /*
    2 ^ 5  = 32 (max decimal for 5 bits = 31)
    2 ^ 1  = 2 (max decimal for 1 bit  = 1)
    2 ^ 6  = 64 (max decimal for 6 bits = 61)
    2 ^ 20 = ‭1 048 576‬ (max decimal for 20 bits = 1 048 575)

    A 2 ^ 5  = 30
    B 2 ^ 1  = 1
    C 2 ^ 6  = 12
    D 2 ^ 20 = 999 999

    DDDD DDDD DDDD DDDD DDDD CCCC CCBA AAAA
    0000 0000 0000 0000 0000 0000 0000 0000
    1111 0100 0010 0011 1111 0011 0011 1110

    Extraction:
    x & 0x1F
    x >> 5 & 0x1
    x >> 6 & 0x3F
    x >> 12 & 0xFFFFF

     */

    loadPlayerEntities (index, weaponLvl, shieldLvl, armourLvl, numbers)
    {
        this.remainingEntities[index] = {};
        this.lostEntities[index] = {};
        this.entityInfo[index] = {};

        for (let type in numbers) {
            const subType = entityInfoMapping[type];

            let number = numbers[type]|0, weapon = entityInfo[subType].weapon, shield = entityInfo[subType].shield, armour = entityInfo[subType].armour;

            let fullShield = shield + (shield * 0.1 * shieldLvl), HP = (armour + (armour * 0.1 * armourLvl)) * 0.1;

            this.lostEntities[index][subType] = 0;

            this.entityInfo[index][subType] = [
                weapon + (weapon * 0.1 * weaponLvl),
                fullShield,
                HP
            ];

            while (number--) {
                //Type, Status, Attack, Shield, HP, maxHP
                this.entities[this.x] = (subType|0) | 1 << 5 | (index|0) << 6 | fullShield << 12;
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
                let type = entities[i] & 0x1F, eType = false, index = entities[i] >> 6 & 0x3F;

                // As the entity types will be ordered only select the rapidfire info on the first occurence
                if (type !== entityRapidFireType) {
                    entityRapidFire = entityInfo[type];
                    entityRapidFireType = type;
                }

                do {
                    // Select a random enemy target
                    //var enemyEntity = enemy.entities[];
                    let ex = Math.floor(random() * enemies.remaining), eIndex = enemies.entities[ex] >> 6 & 0x3F;

                    eType = enemies.entities[ex] & 0x1F;

                    // Make sure the enemy entity is still alive & our entity can attack
                    if ((enemies.entities[ex] >> 5 & 0x1) === 1 && this.entityInfo[index][type][0] !== 0) {

                        let attackPower = this.entityInfo[index][type][0], enemyShield = enemies.entities[ex] >> 12 & 0xFFFFF; // Real attack power
                        if (attackPower < enemyShield) { // If the attack is lower than the shield we need to calculate the shield damage / bounce effect
                            // Calculate the damage percentage, this percentage will be an integer
                            // As an effect of this calculation a entity with a attack power less than 1% of the enemie his full shield, the shot will bounce

                            enemies.entities[ex] &= 0xFFF | Math.round(
                                enemyShield -
                                0.01 *
                                Math.floor(100 * attackPower / enemies.entityInfo[eIndex][eType][1]) *
                                enemies.entityInfo[eIndex][eType][1]
                            ) << 12; // Damage the shield with the calculate damage percentage
                            /*
                            let damagePercentage = attackPower / enemies.entityInfo[eIndex][eType][1];
                            if (damagePercentage >= 0.02) {
                                enemies.entitiesShields[ex] -= damagePercentage * enemies.entityInfo[eIndex][eType][1]; // Damage the shield with the calculate damage percentage
                            }
                            */
                            attackPower = 0; // Reset the attack because it was already used on the shield
                        } else {
                            attackPower -= enemyShield; // Calculate the remaining attack power after bringing the shield down
                            enemies.entities[ex] &= ~(0xFFFFF << 12); // Set shield to 0 because the attack was higher than the shield value, thus the shield was destroyed
                        }

                        if (attackPower > 0) { // If there is still attack power left after hitting the shield -> hit the hull with the remaining power
                            enemies.entitiesHullPoints[ex] -= attackPower;

                            // If HP is below 0, I thinks it's exploded!
                            if (enemies.entitiesHullPoints[ex] <= 0) {
                                enemies.entities[ex] &= ~(1 << 5); // Clear the alive bit
                                enemies.destroyed++;
                            }
                        }

                        // Calculate explosion probability only if HP is below 70%
                        if ((enemies.entities[ex] >> 5 & 0x1) === 1 && enemies.entitiesHullPoints[ex] <= (enemies.entityInfo[eIndex][eType][2] * 0.7)) {
                            // Roll a dice on lost HP, if a ship is damaged for 35% there is a chance of 35% that it'll explode
                            if (random() >= (enemies.entitiesHullPoints[ex] / enemies.entityInfo[eIndex][eType][2])) {
                                enemies.entities[ex] &= ~(1 << 5); // Clear the alive bit
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
            tempRemainingHullPoints = new Float32Array(newRemaining);

        for (let i=0, il=this.remaining, x = 0; i<il; i++) {
            // Delete this.entities with the explosion flag
            if ((this.entities[i] >> 5 & 0x1) === 0) {
                this.lostEntities[this.entities[i] >> 6 & 0x3F][this.entities[i] & 0x1F]++;
            }
            // Regenerate the shields of the remaining this.entities
            else {
                tempRemaining[x] = this.entities[i] & (0xFFF | this.entityInfo[this.entities[i] >> 6 & 0x3F][this.entities[i] & 0x1F][1] << 12);
                tempRemainingHullPoints[x] = this.entitiesHullPoints[i];
                x++;
            }
        }

        this.entities = tempRemaining;
        this.entitiesHullPoints = tempRemainingHullPoints;
        this.remaining = newRemaining;
    }

    getRemainingEntities ()
    {
        if (this.remaining > 0) {
            let last = this.entities[0] & 0x1F, lastIdx = 0, i = 0, playerIdx = this.entities[0] >> 6 & 0x3F;

            for (let il=this.remaining; i<il; i++) {
                if ((this.entities[i] & 0x1F) !== last || (this.entities[i] >> 6 & 0x3F) !== playerIdx) {
                    this.remainingEntities[playerIdx][last] = i - lastIdx;
                    lastIdx = i;
                    last = this.entities[i] & 0x1F;
                    playerIdx = this.entities[i] >> 6 & 0x3F;
                }
            }

            this.remainingEntities[playerIdx][last] = i - lastIdx;
        }

        let remainingEntities = {};

        for (const playerIdx in this.remainingEntities) {
            remainingEntities[playerIdx] = {};

            for (const index in this.remainingEntities[playerIdx]) {
                remainingEntities[playerIdx][entityInfo[index].type] = this.remainingEntities[playerIdx][index];
            }
        }

        return remainingEntities;
    }

    getLostEntities ()
    {
        for (let index in this.lostEntities) {
            for (let type in this.lostEntities[index]) {
                if (this.lostEntities[index][type] === 0)
                    delete this.lostEntities[index][type];
            }
        }

        let lostEntities = {};

        for (const playerIdx in this.lostEntities) {
            lostEntities[playerIdx] = {};

            for (const index in this.lostEntities[playerIdx]) {
                lostEntities[playerIdx][entityInfo[index].type] = this.lostEntities[playerIdx][index];
            }
        }

        return lostEntities;
    }
}