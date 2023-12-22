
    let entityInfo = entityInfoV6; // Default - TODO:: switch to V7 when all OGame universes have been updated

    c.entityInfo = entityInfo;

    c.SimulationModules = {};

    c.Application = (function ()
    {
        let debug = true, language, version = '', loaders = 0;

        const launch = () =>
        {
            language 	= document.querySelector('html').getAttribute('lang');
            version 	= document.querySelector('body').getAttribute('data-version');
        };

        const getLanguage = () => language;

        const getVersion = () => version;

        const getAssetVersion = path => path + '?v=' + getVersion();

        const getAsset = (path, removeVersion) =>
        {
            let replaceRegex = '\\{path\\}';

            if (removeVersion !== void 0 && removeVersion === true) {
                replaceRegex += '\\?v=.*';
            }

            return publicContext.assetsBase.replace(new RegExp(replaceRegex), path);
        };

        const updateEntityInfo = version7 =>
        {
            console.log(`Update to V7: ${version7}`);

            if (version7)   c.entityInfo = entityInfo = entityInfoV7;
            else            c.entityInfo = entityInfo = entityInfoV6;
        };

        return {
            launch: launch,
            debug: debug,
            getLanguage: getLanguage,
            getVersion: getVersion,
            getAssetVersion: getAssetVersion,
            getAsset: getAsset,
            loaders: loaders,
            updateEntityInfo: updateEntityInfo
        };
    }());

    c.Application.launch();

    let trashSimApp = $$.module('trashSimApp', []);

    c.Matomo.init($$.injector(["ng"]).get("$http"), publicContext.matomo.url, publicContext.matomo.siteID);