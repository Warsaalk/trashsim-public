
    c.Matomo = (function ()
    {
        let siteID = null, siteURL = null, useGIF = true;

        let $http;

        const init = ($angularhttp, paramSiteURL, paramSiteID, disableImage) =>
        {
            siteURL = paramSiteURL;
            siteID = paramSiteID;
            useGIF = void 0 !== disableImage ? disableImage : true;

            $http = $angularhttp;
        };

        const send = params =>
        {
            params.idsite = siteID;
            params.rec = 1;

            if (useGIF === false) {
                params.send_image = 0;
            }

            let queries = [];
            for (let key in params) {
                queries.push(key + "=" + encodeURIComponent(params[key]));
            }

            $http.get(siteURL + "?" + queries.join("&"));
        };

        const sendHeartbeat = () => send({ping: 1});

        const sendPageView = url => send({url: url});

        const sendEvent = (category, action, name) => send({e_c: category, e_a: action, e_n: name});

        return {init: init, sendEvent: sendEvent, sendPageView: sendPageView, sendHeartbeat: sendHeartbeat};
    }());