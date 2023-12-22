
	c['Info'] = (function() {
		
		var parent;
		
		var init = function (parentNode) {
			
			parent = parentNode;
			
		};
		
		var show = function (infoObject, smallInfo) {
			
			var templatePath = "undefined" !== typeof smallInfo ? 'info/small' : 'info';
			
			c.Template.get(templatePath, function (tpl) {
				parent.appendChild(tpl);
			}, infoObject);
			
		};
		
		return {'init': init, 'show': show};
		
	}());
		