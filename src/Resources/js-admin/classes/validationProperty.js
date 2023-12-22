(function (context) {
    /**
     * Class constants
     *
     * @type {number}
     */
    const
        TYPE_CLOSED = 0,
        TYPE_OPEN = 1,
        TYPE_CLOSED_KEY = 2;

    const
        DATA_TYPE_DEFAULT = 1, //String
        DATA_TYPE_NUMERIC = 2,
        DATA_TYPE_BOOLEAN = 4,
        DATA_TYPE_BINARY = 8;

    /**
     * Validation Property class
     */
    context.ValidationProperty = class
    {
        /**
         *
         * @param {Number} type 0 for type closed & 1 for type open
         */
        constructor(type)
        {
            this.type = type;

            switch (this.type) {
                case TYPE_CLOSED: this.answers = []; break;
                case TYPE_CLOSED_KEY: this.answers = {}; break;
                default: this.answers = null;
            }
            this.answersObjectProperty = false;

            this.required = false;
            this.multiple = false;

            this.dataType = DATA_TYPE_DEFAULT;

            this.rules = {};
            this.errors = {};

            this.beforeValidation = null;
            this.afterValidation = null;
        }

        /**
         * Set answer directly as an array or defined the object path to validate based on properties within the validated object itself.
         *
         * @param {Array|Object|string} answers
         * @param {Boolean=} objectProperty
         */
        setAnswers(answers, objectProperty)
        {
            if (this.type === TYPE_CLOSED || this.type === TYPE_CLOSED_KEY) {
                this.answers = answers;
                this.answersObjectProperty = objectProperty === true;
            }
        }

        setRequired()
        {
            this.required = true;
        }

        unsetRequired()
        {
            this.required = false;
        }

        setMultiple()
        {
            this.multiple = true;
        }

        unsetMultiple()
        {
            this.multiple = false;
        }

        setNumeric()
        {
            this.dataType = DATA_TYPE_NUMERIC;
        }

        get numeric()
        {
            return (this.dataType & DATA_TYPE_NUMERIC) > 0;
        }

        setBoolean()
        {
            this.dataType = DATA_TYPE_BOOLEAN;
        }

        get boolean ()
        {
            return (this.dataType & DATA_TYPE_BOOLEAN) > 0;
        }

        setBinary ()
        {
            this.dataType = DATA_TYPE_BINARY;
        }

        get binary ()
        {
            return (this.dataType & DATA_TYPE_BINARY) > 0;
        }

        /**
         *
         * @param {Object} rules
         */
        addRules(rules)
        {
            for (let rule in rules) {
                this.rules[rule] = rules[rule]
            }
        }

        /**
         *
         * @param {String} rule
         * @param {String|Number} value
         */
        addRule(rule, value)
        {
            this.rules[rule] = value
        }

        /**
         *
         * @param {Object} rules
         */
        setRules(rules)
        {
            this.rules = rules;
        }

        /**
         *
         * @param {Object} errors
         */
        setErrors(errors)
        {
            this.errors = errors;
        }

        /**
         *
         * @returns {number}
         */
        static get TYPE_CLOSED ()
        {
            return TYPE_CLOSED;
        }

        /**
         *
         * @returns {number}
         */
        static get TYPE_OPEN ()
        {
            return TYPE_OPEN;
        }

        /**
         *
         * @returns {number}
         */
        static get TYPE_CLOSED_KEY ()
        {
            return TYPE_CLOSED_KEY;
        }

        /**
         *
         * @param {Function} callback
         */
        setBeforeValidation (callback)
        {
            if (typeof callback === "function") {
                this.beforeValidation = callback;
            } else {
                throw new Error("This function only takes a function callback as an agrument");
            }
        }

        /**
         *
         * @param {Function} callback
         */
        setAfterValidation (callback)
        {
            if (typeof callback === "function") {
                this.afterValidation = callback;
            } else {
                throw new Error("This function only takes a function callback as an agrument");
            }
        }

        /**
         * Create a shallow clone of the class
         *
         * @returns {ValidationProperty}
         */
        clone(ID)
        {
            const clone = new this.constructor(this.type);

            clone.required = this.required;
            clone.multiple = this.multiple;
            clone.dataType = this.dataType;

            let answers = null;

            switch (clone.type) {
                case TYPE_CLOSED: answers = this.answers.slice(); break;
                case TYPE_CLOSED_KEY: answers = Object.assign({}, this.answers); break;
            }

            clone.setAnswers(answers, this.answersObjectProperty);

            clone.setRules(Object.assign({}, this.rules));
            clone.setErrors(Object.assign({}, this.errors));

            clone.beforeValidation = this.beforeValidation;
            clone.afterValidation = this.afterValidation;

            return clone;
        }
    }
})(c);