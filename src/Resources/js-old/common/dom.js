
	c['DOM'] = (function(){
		
		var get = function( query, context ) {
			
			var obj	= context || document,
				type= /^./.exec(query);
			
			if (type) {
				
				switch ( type[0] ) {
				case '.':
					return obj['getElementsByClassName'](query.substr(1));
				case '#':
					return obj['getElementById'](query.substr(1));
				default:
					return obj['getElementsByTagName'](query);
				}
				
			}
			
		};
		
		var getOne = function( selector, context ) {
			return (context || document).querySelector( selector );
		};
		
		var getAll = function( selector, context ) {	
			return (context || document).querySelectorAll( selector );			
		};
		
		//Functions
		var create = function( element ) {
			return document.createElement( element );
		};
		
		var text = function( text ) { 
			return document.createTextNode( text ); 
		};
		
		var clear = function( query ) {
		
			var list = c.DOM.getAll( query );
			if ( list ) {
				for ( var i=0, il=list.length; i<il; i++ ) {
					while ( list[i].firstChild ) {
						list[i].removeChild( list[i].firstChild );
					}
				}
			}
		
		};
		
		var remove = function( query ) {
		
			var list = [].slice.call(c.DOM.getAll( query )); //Convert non-live nodeList to Array
			if ( list ) {
				while ( list.length > 0 ) {
					var child 	= list[0],
						parent 	= child.parentNode;
					parent.removeChild( child );
					if (child===list[0]) list.shift();
				}
			}
		
		};
		
		var empty =  function (query) {
		
			var list = c.DOM.getAll(query);
			if (list) {
				for (var i=0,il=list.length; i<il; i++) {
					list[i].value = "";
				}
			}
		
		};
		
		//Wait for an element to exist in the document
		var wait = function( options ) {
		
			var options = options || {},
				fail	= typeof options.fail === "function" ? true : false,
				jq		= options.jquery === null ? false : options.jquery,
				delay	= 0; //Used to increase the delay with every call, useful for slow low-end devices
			
			if ( typeof options.done !== "function" || options.forId === null ) {
				
				if ( fail ) options.fail( "Make sure you define the done callback and forId!" );
				else 		return;
				
			}
							
			function check(){

				var ready = false;
				if ( ( jq && window.jQuery ) || ( !jq && document.readyState === 'complete' ) ) { 			
					ready = true;
				}
				
				var el = c.DOM.get( '#' + options.forId );
				
				if ( el === null ) {
						
					if( ready ) {
						
						if ( fail ) options.fail( "The id doesn't exist in this document!" );
						else 		return;
						
					} else setTimeout( check, ++delay );
			
				} else {
						
					options.done( el );
				
				}
			}
			
			check();
		
		};
		
		var getGlobalOffset = function(el) {
		
			var x = 0, y = 0, xs = 0, ys = 0, parent;
			
			var getNextParent = function (node) {
				if (el.parentNode !== el.offsetParent) {
					return el.offsetParent;
				}
				return el.parentNode;
			};
			
			while (el && el.nodeName != "BODY") {
		
				x += el.offsetLeft;
				y += el.offsetTop;
				xs += el.scrollLeft;
				ys += el.scrollTop;
				el = getNextParent(el);
					
			}
			
			return { left: x, top: y, scrollLeft: xs, scrollTop: ys };
				
		};
		
		return { 'get': get, 'getOne': getOne, 'getAll': getAll, 'create': create, 'text': text, 'clear': clear, 'remove': remove, 'empty': empty, 'wait': wait, 'getGlobalOffset': getGlobalOffset };
		
	}());
		