(function (module) {
    /**
     * Validate a object for a set of validations
     *
     * @param {Object} obj
     * @param {Object} validations
     * @param {Array} errors
     * @param {Boolean=} soft
     * @returns {boolean}
     */
    module.validateObject = function (obj, validations, errors, soft)
    {
        let callbackObject = {};

        // Create a separate copy of the object with only the properties defined in the validations for the before & after callbacks
        for (const property in validations) {
            callbackObject[property] = c.Utils.getObjectProperty(property.split("."), obj);
        }

        for (const property in validations) {
            let value = c.Utils.getObjectProperty(property.split("."), obj), propertyErrors = [];

            if (typeof validations[property].beforeValidation === "function") {
                validations[property].beforeValidation.call(validations[property], callbackObject);
            }

            if (value !== null && validations[property].multiple) {
                if (Array.isArray(value)) {
                    value = value.slice();
                } else if (Object.prototype.toString.call(value) === "[object Object]") {
                    value = Object.values(value).slice();
                }
            }

            let finalValidationObject = validations[property].clone();

            // In case of a closed question & with an object path as answers, set the desired object property value as the answers
            if (validations[property].type === c.ValidationProperty.TYPE_CLOSED && validations[property].answersObjectProperty === true) {
                finalValidationObject.answers = c.Utils.getObjectProperty(finalValidationObject.answers.split('.'), obj);
            }

            module.validateAnswer(value, finalValidationObject, propertyErrors, true, soft === true);

            if (typeof validations[property].afterValidation === "function") {
                validations[property].afterValidation.call(validations[property], callbackObject);
            }

            errors[property] = propertyErrors;
        }

        for (const property in errors) {
            if (errors[property].length > 0) return false;
        }

        return true;
    };

    /**
     * Validate a project question answer
     *
     * @param {string|int|Array} data
     * @param {Object} validation
     * @param {Array} errors
     * @param {Boolean=} strict
     * @param {Boolean=} soft
     * @returns {*}
     */
    module.validateAnswer = function (data, validation, errors, strict, soft)
    {
        var answer = null;

        if (errors === void 0) errors = [];

        if (data !== void 0 && data !== null && data !== "") {
            var isArray = Array.isArray(data);

            // If the validation is a multiple the data needs to be an array
            if (validation.multiple && !isArray) {
                errors.push("MULTIPLE");
            } else {
                // Convert all single answers to a array of answers
                if (!isArray) {
                    data = [data];
                }

                // A value can only be a number, string or boolean ||
                // A predefined answers needs to exist
                for (var i = data.length - 1; i >= 0; i--) {
                    if (
                        ["number", "string", "boolean"].indexOf(typeof data[i]) === -1 ||
                        (validation.type === 0 && validation.answers.indexOf(data[i]) === -1) ||
                        (validation.type === 2 && validation.answers[data[i]] === void 0)
                    ) {
                        data.splice(i, 1);
                    }
                }

                // Validate the validation rules if in case of a non multiple validation if there's valid data or in the case of a multiple
                if (data.length > 0 || validation.multiple) {
                    answer = validateRules(data, validation, errors);

                    // If the validation isn't a multiple return the single answer after validation
                    if (!validation.multiple) {
                        answer = answer[0];
                    }
                } else if (strict === true && soft !== true) {
                    errors.push("INVALID");
                }
            }
        } else if (validation.required && soft !== true) {
            errors.push("REQUIRED");
        }

        return answer;
    };

    /**
     * Validate the validation rules
     *
     * @param {string|int|Array} data
     * @param {Object} validation
     * @param {Array} errors
     * @returns {*}
     */
    function validateRules(data, validation, errors) {
        if (validation.rules !== void 0) {
            // Check min & max rules for a multiple
            if (validation.multiple) {
                // Fill the array with NULL to the minimum required length
                if (validation.rules.MIN !== void 0 && data.length < validation.rules.MIN) {
                    var initialLength = data.length;
                    data.length = validation.rules.MIN;
                    data = data.fill(null, initialLength, validation.rules.MIN);
                    errors.push("MIN");
                }
                // Shorten the array to the maximum allowed length
                else if (validation.rules.MAX !== void 0 && data.length > validation.rules.MAX) {
                    data.length = validation.rules.MAX;
                    errors.push("MAX");
                }
            }

            // Validate the remaining rules
            for (var i = data.length - 1; i >= 0; i--) {
                if (validation.boolean && data[i] !== false && data[i] !== true) {
                    data[i] = null;

                    errors.push("BOOLEAN");
                }

                for (var rule in validation.rules) {
                    if (data[i] !== null) {
                        switch (rule) {
                            case 'MIN_VALUE':
                                if (data[i] < validation.rules[rule]) data[i] = null;
                                break;
                            case 'MAX_VALUE':
                                if (data[i] > validation.rules[rule]) data[i] = null;
                                break;
                            case 'MIN_LENGTH':
                                if (data[i].toString().length < validation.rules[rule]) data[i] = null;
                                break;
                            case 'MAX_LENGTH':
                                if (data[i].toString().length > validation.rules[rule]) data[i] = null;
                                break;
                            case 'REGEX':
                                if (!(new RegExp(validation.rules[rule])).test(data[i])) data[i] = null;
                                break;
                            case 'BINARY':
                                if ((data[i] & validation.rules[rule]) === 0) data[i] = null;
                                break;
                        }

                        if (data[i] === null) errors.push(rule);
                    }
                }
            }
        }

        return data;
    };
})(c.Validator = {});