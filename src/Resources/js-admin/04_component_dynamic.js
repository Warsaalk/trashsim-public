
    const dynamicComponentController = {
        mixins: [translationsController]
    };

    c.dynamicComponents = [];


    /**
     * Create a app component factory component
     *
     * @param {Number} type
     * @param {String} label
     * @param {String} template
     * @param {Object} config
     * @param {Object} component
     */
    c.createDynamicComponent = function (label, template, component)
    {
        if (c.dynamicComponents.indexOf(label) >= 0) {
            console.error("A component for " + label + " is already defined. A component can only be defined once.");
            return;
        }

        c.dynamicComponents.push(label);

        component.extends = dynamicComponentController;

        Vue.component(label, () => ({
            component: new Promise((resolve, reject) => c.appManager.fetchAppTemplate(component, template, resolve, reject)),
            loading: ViewLoading,
            error: ViewError,
            timeout: 3000
        }));
    };