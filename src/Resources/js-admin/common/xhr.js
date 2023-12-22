function XHR(settings)
{
    this.xhr = new XMLHttpRequest();

    /* Private variables */
    let inited			= false,
        methods			= ['GET','POST','HEAD','PUT','DELETE'],
        method			= 'GET',
        url				= '',
        responseTypes	= ['json','xml','html','text'],
        response		= 'text',
        contentTypes    = ['application/x-www-form-urlencoded', 'multipart/form-data', 'text/plain', 'application/json'],
        contentType     = 'application/json',
        contentLength   = false,
        charset         = 'UTF-8',
        data			= {},
        documentSupport	= true,
        cache			= true,
        async			= true,
        replaceUndefined= null;

    /* Callbacks */
    let onStart 	= function () {},
        onError 	= function () {},
        onReceived 	= function () {},
        onStop 		= function () {},
        onProgress  = function () {},
        onUploadProgress = function () {},
        onUploadError = function () {};

    /* Handlers */
    let process = function (x) {};

    /* Listeners */
    let listeners = {
        loadstart: function (e) {
            onStart.call(this);
        },

        progress: function (e) {
            onProgress.call(this, e);
        },

        error: function (e) {
            onError.call(this, null);
        },

        abort: function (e) {
            //c.Utils.log('aborted');
        },

        load: function (e)
        {
            let resp = null;

            if (this.status !== 204 && this.response) {
                if (response === "json") resp = JSON.parse(this.responseText);
                else if (response === "xml" || (documentSupport && response === "html")) resp = this.responseXML;
                else resp = this.responseText;
            }

            if (this.status >= 200 && this.status < 300) {
                onReceived.call(this, resp, this.status);
            } else {
                onError.call(this, resp, this.status);
            }
        },

        loadend: function (e) {
            onStop.call(this);
        }
    };

    let uploadListeners = {
        progress: function (e)
        {
            onUploadProgress.call(this, e);
        },

        error: function (e)
        {
            onUploadError.call(this, null);
        }
    };

    let processSettings = function (settings)
    {
        if (typeof settings.method === 'string') {
            let i = methods.indexOf(settings.method.toUpperCase());
            if (i !== -1) method = methods[i];
        }

        if (typeof settings.response === 'string') {
            let i = responseTypes.indexOf(settings.response.toLowerCase());
            if (i !== -1) response = responseTypes[i];
        }

        if (typeof settings.contentType === 'string') {
            contentType = settings.contentType;
        }

        if (typeof settings.contentLength === 'number') {
            contentLength = parseInt(settings.contentLength);
        }

        data = settings.data;

        if (typeof settings.url === 'string') 		url = settings.url;
        //if (typeof settings.data === 'object') 		;
        if (typeof settings.cache === 'boolean') 	cache = settings.cache;
        if (typeof settings.async === 'boolean') 	async = settings.async;
        if (typeof settings.charset === 'string') 	charset = settings.charset;

        if (typeof settings.replaceUndefined === 'string') {
            replaceUndefined = settings.replaceUndefined;
        }

        if (typeof settings.onStart === 'function')		onStart 	= settings.onStart;
        if (typeof settings.onError === 'function')		onError 	= settings.onError;
        if (typeof settings.onReceived === 'function')	onReceived	= settings.onReceived;
        if (typeof settings.onStop === 'function')		onStop 		= settings.onStop;
        if (typeof settings.onProgress === 'function')	onProgress 	= settings.onProgress;

        if (settings.upload !== void 0 && Object.prototype.toString.call(settings.upload) === "[object Object]") {
            if (typeof settings.upload.onProgress === 'function')	onUploadProgress = settings.upload.onProgress;
            if (typeof settings.upload.onError === 'function')		onUploadError 	= settings.upload.onError;
        }

    };

    let processEvents = function()
    {
        this.xhr.onreadystatechange = process;

        this.xhr.addEventListener('loadstart', 	listeners.loadstart,false);
        this.xhr.addEventListener('progress', 	listeners.progress, false);
        this.xhr.addEventListener('error', 		listeners.error, 	false);
        this.xhr.addEventListener('abort',		listeners.abort, 	false);
        this.xhr.addEventListener('load', 		listeners.load, 	false);
        this.xhr.addEventListener('loadend', 	    listeners.loadend, 	false);

        this.xhr.upload.addEventListener('progress', 	uploadListeners.progress, false);
        this.xhr.upload.addEventListener('error', 	uploadListeners.error, false);
    };

    let processData = function()
    {
        if (Object.prototype.toString.call(data) === "[object Object]") {
            let first = false, temp = "";

            function filterData(d, depth) {
                for (let index in d) {
                    let value = d[index], key = depth == null ? index : (depth + '[' + index + ']');

                    if (typeof value === 'object')
                        filterData(value, key);
                    else {
                        if (!first) first = true;
                        else temp += "&";

                        temp += key + "=" + value;
                    }
                }
            }

            function replacer(key, value) {
                if (value === replaceUndefined) return void 0;

                return typeof value === 'undefined' ? replaceUndefined : value;
            }

            if (contentType === "application/json" && (method === "POST" || method === "PUT")) {
                if (replaceUndefined !== null) {
                    temp = JSON.stringify(data, replacer);
                } else {
                    temp = JSON.stringify(data);
                }
            } else {
                filterData(data);
            }

            data = temp;
        }
    };

    let openRequest = function()
    {
        if (method === 'GET' && data && data.length > 0) url += "?" + data;
        if (!cache) url += ((/\?/).test(url) ? "&" : "?") + '__' +(new Date()).getTime();

        this.xhr.open(method, url, async);

        if (method === "POST" || method === "PUT") {
            let contentTypeHeader = contentType;

            let i = contentTypes.indexOf(contentType.toLowerCase());
            if (i !== -1) contentTypeHeader = contentType + '; charset=' + charset;

            this.xhr.setRequestHeader('Content-Type', contentTypeHeader);

            if (contentLength !== false) {
                this.xhr.setRequestHeader('Content-Length', contentLength);
            }
        }

        if (response === "html") {
            try {
                this.xhr.responseType = 'document';
            } catch(e) {
                documentSupport = false;
            }
        }
    };

    let sendRequest = function()
    {
        if (method === "POST" || method === "PUT") {
            this.xhr.send(data);
        } else {
            this.xhr.send();
        }
    };

    if (inited === true) return;
    inited = true; //Done allow 2 inits

    processSettings.call(this, settings);
    processEvents.call(this);
    processData.call(this);

    openRequest.call(this);
    sendRequest.call(this);
}