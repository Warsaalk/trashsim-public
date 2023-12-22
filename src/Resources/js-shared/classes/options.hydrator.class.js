
    class OptionsHydrator
    {
        constructor(options)
        {
            this.options = options;
        }

        hydrateFromObject (data)
        {
            for (let property in data) {
                if (data.hasOwnProperty(property) && this.options.hasOwnProperty(property)) {
                    this.options[property] = data[property];
                }
            }
        }
    }