
    function apiManagerHandleErrors (statusCode, errorArguments, reject)
    {
        reject(...errorArguments);
    }

    c.requestManager =
    {
        get: async url =>
        {
            return new Promise((resolve, reject) => {
                new XHR({
                    url,
                    response: "json",
                    onReceived: resolve,
                    onError: function (response, statusCode) { apiManagerHandleErrors(statusCode, arguments, reject) }
                })
            });
        },

        post: async (url, data) =>
        {
            return new Promise((resolve, reject) => {
                new XHR({
                    url,
                    data: data,
                    method: "POST",
                    response: "json",
                    onReceived: resolve,
                    onError: function (response, statusCode) { apiManagerHandleErrors(statusCode, arguments, reject) },
                })
            });
        },

        put: async (url, data) =>
        {
            return new Promise((resolve, reject) => {
                new XHR({
                    url,
                    data: data,
                    method: "PUT",
                    response: "json",
                    onReceived: resolve,
                    onError: function (response, statusCode) { apiManagerHandleErrors(statusCode, arguments, reject) },
                })
            });
        },

        delete: async url =>
        {
            return new Promise((resolve, reject) => {
                new XHR({
                    url,
                    method: "DELETE",
                    response: "json",
                    onReceived: resolve,
                    onError: function (response, statusCode) { apiManagerHandleErrors(statusCode, arguments, reject) }
                })
            });
        }
    };