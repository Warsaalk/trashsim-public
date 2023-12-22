const translationsController = {
    methods:
    {
        $__: function (label, data)
        {
            let text = app.config.translations !== void 0 && app.config.translations[label] !== void 0
                ? app.config.translations[label]
                : label;

            if (text !== label && "undefined" !== typeof data && Object.keys(data).length > 0) {
                for (let key in data) {
                    text = text.replace(new RegExp(`\{${key}\}`, 'g'), data[key]);
                }
            }

            return text;
        }
    }
};