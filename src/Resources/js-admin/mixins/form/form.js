const formMixin = {
    mixins: [translationsController],
    data: function ()
    {
        return {
            formError: null,
            errors: {},
            tracker: {
                originals: {},
                changed: {}
            },
            validations: {},
            submitCallback: {},
            closeCallback: {},
            states: {
                changed: false,
                submitting: false,
                validated: false,
                valid: false
            },
            watchers: {},
            formMixin_childForms: [],
            formMixin_parentForm: null
        }
    },
    directives:
    {
        formChild:
        {
            // vnode.context is the formMixin as this directive only works in formMixin components
            bind: function (el, binding, vnode)
            {
                if (vnode.componentInstance && typeof vnode.componentInstance.isValid === "function") {
                    // Create a 1 to many relationship
                    vnode.componentInstance.formMixin_parentForm = vnode.context; // Added the parent connection to the child
                    vnode.context.formMixin_childForms.push(vnode.componentInstance); // Push the child on the parent child form stack
                }
            },

            unbind: function (el, binding, vnode)
            {
                const childIndex = vnode.context.formMixin_childForms.indexOf(vnode.componentInstance);
                if (childIndex >= 0) {
                    vnode.context.formMixin_childForms.splice(childIndex, 1);
                }
            }
        }
    },
    methods:
    {
        hasErrors: function ()
        {
            for (const property in this.errors) {
                if (Object.keys(this.errors[property]).length > 0) return true;
            }

            return false;
        },

        addErrors: function (errors)
        {
            for (const property in errors) {
                if (this.errors.hasOwnProperty(property)) {
                    this.errors[property] = this.translateErrors(this.validations[property], errors[property]);
                }
            }
        },

        translateErrors: function (validation, errorList)
        {
            let errors = {};

            for (let i=0, il=errorList.length; i<il; i++) {
                let validationError = validation.errors[errorList[i]];

                // Validation errors are not required so for application defined rules we'll return a predefined error message if undefined
                if ("undefined" === typeof validationError) {
                    validationError = c.validationManager.getDefaultRuleAdminError(errorList[i]);
                }

                errors[errorList[i]] = this.$__(validationError, validation.rules);
            }

            return errors;
        },

        resetTracking: function ()
        {
            for (const property in this.tracker.originals) {
                this.tracker.originals[property] = JSON.stringify(c.Utils.getObjectProperty(property.split('.'), this));
                this.tracker.changed[property] = false;
            }

            this.track();
        },

        /**
         *
         * @param {Boolean=} childChanged This method can be triggered by child forms which will notify a parent when a property has changed
         */
        track: function (childChanged)
        {
            let hasChanges = typeof childChanged === "boolean" ? childChanged : false;

            for (const property in this.tracker.originals) {
                this.tracker.changed[property] = this.tracker.originals[property] !== JSON.stringify(c.Utils.getObjectProperty(property.split('.'), this));

                if (this.tracker.changed[property]) {
                    hasChanges = true;
                }
            }

            // Notify the parent of the changed state change
            if (this.states.changed !== hasChanges && this.formMixin_parentForm !== null) {
                this.formMixin_parentForm.track(hasChanges);
            }

            this.states.changed = hasChanges;

            this.validate();
        },

        validate: function (final)
        {
            let errors = {};

            // Validate
            c.Validator.validateObject(this, this.validations, errors);

            for (const property in errors) {
                this.errors[property] = this.translateErrors(this.validations[property], errors[property]);
            }

            this.states.valid = !this.hasErrors();

            // Validate the child forms
            for (let i=0, il=this.formMixin_childForms.length; i<il; i++) {
                if (this.formMixin_childForms[i].isValid(final) === false) {
                    this.states.valid = false;
                }
            }

            return this.states.valid;
        },

        isValid: function (final)
        {
            if (final === true) {
                this.states.validated = true;
            }

            return this.validate(final);
        },

        addValidation: function (property, validation, customFunction = null)
        {
            if (this.validations[property] === void 0) {
                this.validations[property] = validation;

                this.errors[property] = {};
                this.tracker.originals[property] = JSON.stringify(c.Utils.getObjectProperty(property.split('.'), this));
                this.tracker.changed[property] = false;

                if (!customFunction) {
                    this.watchers[property] = this.$watch(property, this.track);
                } else {
                    this.watchers[property] = this.$watch(customFunction, this.track);
                }
            } else {
                console.error("BIS - form - Validation property already exists, you can only assign 1 validation to a property.");
            }
        },

        deleteValidation: function (property)
        {
              if (this.validations[property] !== void 0) {
                    delete this.validations[property];
                    delete this.errors[property];
                    delete this.tracker.originals[property];
                    delete this.tracker.changed[property];
                    this.watchers[property].call();
                    delete this.watchers[property];
              } else {
                  console.error("BIS - form - Validation property does not exist, you can only delete existing validation properties.")
              }
        },

        addValidations: function (validations)
        {
            for (const key in validations) {
                this.addValidation(key, validations[key]);
            }
        },

        /**
         *
         * @param {Array} validations
         */
        deleteValidations: function (validations)
        {
            for (const key of validations) {
                this.deleteValidation(key);
            }
        },

        addSubmitAction: function (callback, target)
        {
            if ("undefined" === typeof target) {
                target = "default";
            }

            if (typeof this.submitCallback[target] !== "function") {
                this.submitCallback[target] = callback;
            } else {
                console.error("BIS - form - A submit callback already exists on this form.");
            }
        },

        addCloseAction: function (callback, target)
        {
            if ("undefined" === typeof target) {
                target = "default";
            }

            if (typeof this.closeCallback[target] !== "function") {
                this.closeCallback[target] = callback;
            } else {
                console.error("BIS - form - A close callback already exists on this form.");
            }
        },

        submit: async function (event)
        {
            if (this.states.submitting === false) {
                this.formError = null;
                this.states.submitting = true;

                const
                    form = event.target,
                    target = form.hasAttribute("data-target") ? form.getAttribute("data-target") : "default";

                if (typeof this.submitCallback[target] === "function") {
                    if (this.isValid(true)) {
                        try {
                            await this.submitCallback[target](event);

                            this.resetTracking();

                            // Reset the child tracking
                            for (let i=0, il=this.formMixin_childForms.length; i<il; i++) {
                                this.formMixin_childForms[i].resetTracking();
                            }

                            if (form.dataset.close === "close") {
                                await this.closeCallback[target](event);
                            }
                        } catch (e) {
                            if (e instanceof AdminError) {
                                this.formError = this.$__(e.message);
                            } else {
                                this.formError = this.$__('form_error_submit');
                            }
                        }

                        this.states.submitting = false;
                    } else {
                        this.states.submitting = false;
                    }
                } else {
                    console.error("BIS - form - Please define a submit callback.");

                    this.states.submitting = false;
                }
            }
        },

        resetForm: function ()
        {
            this.formError = null;
            this.states.validated = false;

            // Reset the children
            for (let i=0, il=this.formMixin_childForms.length; i<il; i++) {
                this.formMixin_childForms[i].formError = null;
                this.formMixin_childForms[i].states.validated = false;
            }
        }
    }
};