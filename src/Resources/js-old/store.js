	
	c['Store'] = (function() {
		
		var prefix;
		
		var init = function (prefixArg) {
			
			prefix = prefixArg + '_';
			
		};
		
		var test = function () {
			
			set('test', 'test');
			
			var testStorage = get('test');
			
			del('test');
			
			return testStorage !== null && testStorage === 'test';
			
		};
		
		var set = function (option, value, object) {
						
			if (object) {
				localStorage.setItem(prefix + option, JSON.stringify(value));
			} else {
				localStorage.setItem(prefix + option, value);
			}
			
		};
		
		var get = function (option) { 
			
			return localStorage.getItem(prefix + option);
			
		};
		
		var del = function (option) {
			
			if (Array.isArray(option)) {
				
				for (var i=0,ilen=option.length; i<ilen; i++) {
					delete localStorage[prefix + option[i]];
				}
				
			} else {
			
				delete localStorage[prefix + option];
				
			}
			
		};
		
		return {'init': init, 'set': set, 'get': get, 'del': del, 'test': test};
		
	}());