
	c['REST'] = (function () {
				
		var get = function (path, callback) {
			
			var handleGet = function (response) {
				
				callback.call(null, response);
				
			};
			
			c.Ajax.request({
				'url': 'r/' + path,
				'response': 'json',
				'method': 'GET',
				'onReceived': handleGet
			});
			
		};
		
		var post = function (path, postObject, callback, errorCallback) {
			
			var handlePost = function(response) {
				
				callback.call(null, response);
				
			};
			
			var handleError = function (error) {
				
				if ("undefined" !== typeof errorCallback) {
					errorCallback.call(null, this, error);
				} else {
					console.log("An error occurred when handling a REST post request");
				}
				
			};
			
			c.Ajax.request({
				'url': 'r/' + path,
				'response': 'json',
				'method': 'POST',
				'data': postObject,
				'onReceived': handlePost,
				'onError': handleError
			});
			
		};
		
		var put = function (path, putObject, callback, errorCallback) {
			
			var handlePut = function(response) {
				
				callback.call(null, response);
				
			};
			
			var handleError = function (error) {
				
				if ("undefined" !== typeof errorCallback) {
					errorCallback.call(null, this, error);
				} else {
					console.log("An error occurred when handling a REST post request");
				}
				
			};
			
			c.Ajax.request({
				'url': 'r/' + path,
				'response': 'json',
				'method': 'PUT',
				'data': putObject,
				'onReceived': handlePut,
				'onError': handleError
			});
			
		};
		
		return {'get': get, 'post': post, 'put': put};
		
	}());
		