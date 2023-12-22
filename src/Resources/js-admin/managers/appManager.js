
    c.appManager =
    {
        fetchAppTemplate: function (component, template, resolve, reject)
        {
            if (template !== false) {
                if (typeof template === "string") {
                    template = template + "?v=" + app.config.version;

                    new XHR({
                        url: template,
                        response: "text", // Request as text because Vue needs an HTML string & not a DOM Object
                        onReceived: function (response) {
                            component.template = component.template !== void 0 ? component.template.replace("{template}", response) : response;

                            resolve(component)
                        },
                        onError: function () {
                            reject(new Error("Could not fetch " + template));
                        }
                    });
                } else if (Object.prototype.toString.call(template) === "[object Object]" && template.html !== void 0) {
                    component.template = component.template !== void 0 ? component.template.replace("{template}", template.html) : template.html;

                    resolve(component)
                } else if (template === null) {
                    if (component.template !== void 0) {
                        resolve(component);
                    } else {
                        reject(new Error("Please define a template on your component."));
                    }
                } else {
                    console.error("Invalid template value", template);

                    reject(new Error("Invalid template value"));
                }
            } else {
                component.template = "<div></div>";

                resolve(component)
            }
        }
    };