
	/**
	 * Depends on Ajax, Utils
	 */

	c['Template'] = (function() {
		
		var cached 	= {},
			path	= null;
		
		var init = function(templatePath) {
			
			path = templatePath;
			
		};
		
		var get = function(names, callback, objectToParse) {
		
			var templateNames	= names.split(';'),
				templates		= [];
			
			var handleTemplate = function( name, template ) {
				
				templates[ templateNames.indexOf(name) ] = template;
				
				if ( templates.length === templateNames.length ) {
					
					callback.apply( null, templates );
					
				}
				
			};
			
			for (var i=0,ilen=templateNames.length; i<ilen; i++) {
				
				var name = templateNames[ i ];
				
				if (cached[name]) {
					
					var toElement = c.DOM.create('div');
					
					toElement.innerHTML = "undefined" !== objectToParse ? parse(cached[name], objectToParse) : cached[name];
					
					handleTemplate( name, toElement.firstChild );
					
				} else {
				
					var handle = function( html ) {
						
						var tpl = html.body.firstChild || false;
						
						if ("undefined" !== objectToParse) {
							
							tpl = parseDOM(tpl, objectToParse);
							
						}
						
						handleTemplate( name, tpl );
						
					};
					
					c.Ajax.request({
						
						url: path + name + '.html',
						response: 'html',
						onReceived: handle
						
					});
				
				}
				
			}
		
		};
		
		var cache = function( files ) {
			
			cached = files;
			
		};
		
		var parseToDOM = function (tpl, objectToParse) {
			
			var toElement = c.DOM.create('div');
			
			toElement.innerHTML = parse(tpl, objectToParse);
			
			return toElement.firstChild;
			
		};
		
		var parseDOM = function (element, objectToParse){
			
			var inner = element.innerHTML;
			
			element.innerHTML = parse(inner, objectToParse);
			
			return element;
			
		};
		
		var parse = function (html, object) {

            var template = html;

            for (var prop in object) {

                var replace = '{' + prop + '}'
                template = template.replace(new RegExp(replace, 'g'), object[ prop ]);

            }

            return template;

        };
		
		return {'init': init, 'get': get, 'cache': cache, 'parse': parse, 'parseDOM': parseDOM, 'parseToDOM': parseToDOM};
		
	}());
		