
    const componentRouteController = {
        mixins: [translationsController],
        data: function ()
        {
            return {};
        },
        methods:
        {

        },
        created: function ()
        {

        },
        destroyed: function ()
        {

        }
    };

    let componentRoutesDefined = [], componentRouteIndex = {};

    c.createRouteComponent = function (name, path, template, data, alias)
    {
        if (componentRoutesDefined.indexOf(path) === -1) {
            componentRoutesDefined.push(path);

            data.extends = componentRouteController;
            data.template = `<div class="view-wrapper">{template}</div>`;

            componentRouteIndex[name] = {index: c.routes.length, children: []};

            c.routes.push({
                path: path,
                name: name,
                component: {
                    template: `<div class="view-container"><${name}></${name}></div>`,
                    components: {
                        [name]: () => ({
                            component: new Promise((resolve, reject) => c.appManager.fetchAppTemplate(data, template, resolve, reject)),
                            loading: ViewLoading,
                            error: ViewError,
                            timeout: 3000,
                            delay: 200
                        })
                    }
                },
                alias: alias,
                children: componentRouteIndex[name].children
            });
        } else {
            console.error("A route component for " + path + " is already defined. A component can only be defined once.");
        }
    };

    c.createRouteComponentChild = function (parentName, name, subPath, template, data, alias)
    {
        if (componentRouteIndex[name] === void 0) {
            if (componentRouteIndex[parentName] !== void 0) {
                const parent = componentRouteIndex[parentName];

                componentRouteIndex[name] = {index: parent.children.length, children: []};

                data.extends = componentRouteController;
                data.template = `<div class="component-container">{template}</div>`;

                parent.children.push({
                    name: name,
                    path: subPath,
                    component: () => ({
                        component: new Promise((resolve, reject) => c.appManager.fetchAppTemplate(data, template, resolve, reject)),
                        loading: ViewLoading,
                        error: ViewError,
                        timeout: 3000,
                        delay: 200
                    }),
                    props: true,
                    alias: alias,
                    children: componentRouteIndex[name].children
                });
            } else {
                console.error("A route component child for " + parentName + " is already defined. A component can only be defined once.");
            }
        } else {
            console.error("A route component for " + subPath + " is already defined. A component can only be defined once.");
        }
    };