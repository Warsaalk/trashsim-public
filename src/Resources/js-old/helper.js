
	var Helper = (function() {
		
		var extend = function(label, object) {
			
			this[ label ] = object;
			
		};
		
		return { 'extend': extend }
		
	}());
	
	c['Helper'] = Helper;