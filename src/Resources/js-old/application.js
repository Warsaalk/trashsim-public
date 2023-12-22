
	c['Application'] = (function() {
		
		var debug = true, language, version = '', loaders = 0, assetPath;
		
		var launch = function(assets) {
			
			c.Utils.log('Application Javascript Start');
			
			language 	= c.DOM.getOne('html').getAttribute('lang');
			version 	= c.DOM.getOne('body').getAttribute('data-version');
			assetPath 	= assets;
			
			if (compatibilityCheck()) {
				
				c.Template.init('html/');
				c.Tooltip.init();
				c.Popup.init();
				c.Info.init(c.DOM.getOne('#info'));
				c.Store.init('TrashSim');
				
				switchLanguage();
				
				if (c.DOM.getOne('#page-home')) c.Home.init();				
				
			} else {
				
				if (!/notsupported/.test(window.location.pathname)) {
					window.location = language + '/notsupported'; //"Your browser isn't supported, please update you browser to a newer version of use another browser!");
				}
				
			}
			
			trackEvent('.help-feedback', 'click', 'button', 'help feedback');
			trackEvent('.help-translate', 'click', 'button', 'help translate');
			trackEvent('#paypal-donate', 'submit', 'form', 'donate');
			trackEvent('#social-share-fb', 'click', 'button', 'share facebook', true);
			trackEvent('#social-share-tw', 'click', 'button', 'share twitter', true);
			trackEvent('#menu-ogotcha', 'click', 'button', 'ogotcha link');
			trackEvent('#footer-facebook-page', 'click', 'button', 'social facebook page', true);

		};
		
		var compatibilityCheck = function () {
			
			if (publicContext.ielegacy === true) return false;			
			return true;
			
		};
		
		var trackEvent = function (querySelector, event, eventType, label, beacon) {
			
			var elements = c.DOM.getAll(querySelector);
			
			for (var i=0,il=elements.length; i<il; i++) {
				var element = elements[i];
				
				element.setAttribute('data-ga-event', JSON.stringify({'eventType': eventType, 'label': label, 'beacon': beacon}));
				element.addEventListener(event, function (e) {
					var data = JSON.parse(this.getAttribute('data-ga-event'));
					
					c.Matomo.sendEvent(data.eventType, e.type, data.label);
				});
			}
			
		};
		
		var switchLanguage = function () {
			
			var languageSwitchers = c.DOM.getAll('.switch-lang');
			
			for (var i=0,il=languageSwitchers.length; i<il; i++) {
				languageSwitchers[i].addEventListener('click', function (e) {
					window.location = c.DOM.getOne('link[hreflang="'+ this.getAttribute('data-code') +'"').href + window.location.search + window.location.hash;
				});
			}
			
		};
		
		var getLanguage = function () {
			
			return language;
			
		};
		
		var getVersion = function () {
			
			return version;
			
		};

		var getAssetVersion = function (path) {

			return path + '?v=' + getVersion();

		};

		var getAsset = function (path, removeVersion) {

			var replaceRegex = '\\{file\\}';

			if ("undefined" !== typeof removeVersion && removeVersion === true) {
				replaceRegex += '\\?v=.*';
			}
			return assetPath.replace(new RegExp(replaceRegex), path);

		};
		
		return {'launch': launch, 'debug': debug, 'trackEvent': trackEvent, 'getLanguage': getLanguage, 'getVersion': getVersion, 'getAssetVersion': getAssetVersion, 'getAsset': getAsset, 'loaders': loaders};
		
	}());
		