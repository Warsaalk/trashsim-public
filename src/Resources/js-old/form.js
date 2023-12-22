
	c['Form'] = (function () {
				
		var getData = function (contextSelector) {
			
			if ("undefined" === typeof contextSelector) contextSelector = "";
			
			var data 	= {},
				inputs 	= c.DOM.getAll(contextSelector + " input, " + contextSelector + " textarea, " + contextSelector + " select");
			
			for (var i=0,il=inputs.length; i<il; i++) {
				
				var input = inputs[i];
				
				if (input.hasAttribute('data-form-label')) {
				
					var formlabel = input.getAttribute('data-form-label');
					
					var addToData = function (data, formlabel, value) {
						
						if (/\[\]$/.test(formlabel)) {
							formlabel = formlabel.replace('[]','');
							if ("undefined" === typeof data[formlabel]) data[formlabel] = [];
							data[formlabel].push(value);
						} else
							data[formlabel] = value;
						
					};
					
					switch (input.type) {
					case 'hidden':
					case 'number':
					case 'text':
					case 'textarea':
						addToData(data, formlabel, input.value);
						break;
					case 'select-one':
						addToData(data, formlabel, input[input.selectedIndex].value);
						break;
					case 'checkbox':
						if (input.checked) {
							addToData(data, formlabel, input.value);
						}
						break;
					}
					
				}
				
			}
			
			return data;
			
		};
		
		return {'getData': getData};
		
	}());
		