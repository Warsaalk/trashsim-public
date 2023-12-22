
	let initialized = false;

	/**
	 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
	 *
	 * @param {object} data
	 * @returns {Object}
	 */
	function deepFreeze (data)
	{
		// Retrieve the property names defined on object
		const propNames = Object.getOwnPropertyNames(data);

		// Freeze properties before freezing self
		for (let i=0, il=propNames.length; i<il; i++) {
			let value = data[propNames[i]];

			data[propNames[i]] = value && typeof value === "object" ? deepFreeze(value) : value;
		}

		return Object.freeze(data);
	}

	app.init = config =>
	{
		function finalizeInitialization (config, translations)
		{
			// Set the translations
			config.translations = translations;

			// Freeze & expose the application config
			app.config = config;

			deepFreeze(app);

			// Set the App Controller config properties
			appController.data.version = app.config.version;
			appController.data.assets = app.config.assets;

			appController.router = new VueRouter({
				routes: c.routes
			});

			new Vue(appController);

			document.body.classList.add('ready');
		}

		if (initialized === false) {
			initialized = true;

			// Load the locale translations
			new XHR({
				url: `admin/translations/${config.locale}.locale.json`,
				response: "json",
				onReceived: response => finalizeInitialization(config, response),
				onError: () => finalizeInitialization(config, {})
			});
		} else {
			console.error("The application can only be initialized once.");
		}
	};