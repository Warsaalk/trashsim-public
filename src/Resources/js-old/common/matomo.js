
    c['Matomo'] = (function() {
        var siteID = null, siteURL = null, useGIF = true;

        var init = function (paramSiteURL, paramSiteID, disableImage) {
            siteURL = paramSiteURL;
            siteID = paramSiteID;
            useGIF = void 0 !== disableImage ? disableImage : true;
        };

        var send = function (params) {
            params.idsite = siteID;
            params.rec = 1;

            if (useGIF === false) {
                params.send_image = 0;
            }

            var queries = [];
            for (var key in params) {
                queries.push(key + "=" + encodeURIComponent(params[key]));
            }

            c.Ajax.request({url: siteURL + "?" + queries.join("&")});
        };

        var sendHeartbeat = function () {
            send({
                ping: 1
            });
        };

        var sendPageView = function (url) {
            send({
                url: url
            });
        };

        var sendEvent = function (category, action, name) {
            send({
                e_c: category,
                e_a: action,
                e_n: name
            });
        };

        return {init: init, sendEvent: sendEvent, sendPageView: sendPageView, sendHeartbeat: sendHeartbeat};
    }());