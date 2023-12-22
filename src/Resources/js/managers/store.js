
	trashSimApp.factory("storeManager", [() =>
	{
		let prefix;
		
		let init = prefixArg =>
		{
			prefix = prefixArg + '_';
		};
		
		let test = () =>
		{
			setProperty('test', 'test');
			
			let testStorage = getProperty('test');

			deleteProperty('test');
			
			return testStorage !== null && testStorage === 'test';
		};
		
		let setProperty = (option, value, object) =>
		{
			if (object) {
				localStorage.setItem(prefix + option, JSON.stringify(value));
			} else {
				localStorage.setItem(prefix + option, value);
			}
		};
		
		let getProperty = (option, object) =>
		{
			let item = localStorage.getItem(prefix + option);
			if (item !== null && object) {
				item = JSON.parse(item);
			}

			return item;
		};
		
		let deleteProperty = option =>
		{
			if (Array.isArray(option)) {
				for (let i=0, il=option.length; i<il; i++) {
					delete localStorage[prefix + option[i]];
				}
			} else {
				delete localStorage[prefix + option];
			}
		};
		
		return {
			init: init,
			set: setProperty,
			get: getProperty,
			del: deleteProperty,
			test: test
		};
	}]);