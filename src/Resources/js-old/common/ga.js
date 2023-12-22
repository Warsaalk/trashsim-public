
	c['GoogleAnalytics'] = c['GA'] = (function() {
		
		var gaString;
		
		var init = function (gaParam, code, data) {
			
			gaString = gaParam;
			
			window[gaString].call(null, 'create', code, data);
			window[gaString].call(null, 'set', 'anonymizeIp', true);
			sendHeartbeat();
			
		};
		
		var send = function (data) {
			
			if (gaString) window[gaString].call(null, 'send', data);
			
		};
		
		var sendHeartbeat = function () {
			
			send('pageview');
			
		};
		
		var sendEvent = function (cat, action, label) {
			
			send({
				'hitType': 'event', 
				'eventCategory': cat,
				'eventAction': action, 
				'eventLabel': label			
			});
			
		};
		
		var sendEventBeacon = function (cat, action, label) {
			
			send({
				'hitType': 'event', 
				'eventCategory': cat,
				'eventAction': action, 
				'eventLabel': label,
				'transport': 'beacon'
			});
			
		};
		
		var sendPageView = function (page) {
			
			send({
				'hitType': 'pageview', 
				'page': page
			});
			
		};
		
		return {'init': init, 'sendHeartbeat': sendHeartbeat, 'sendEvent': sendEvent, 'sendEventBeacon': sendEventBeacon, 'sendPageView': sendPageView};
		
	}());
	