
	//TODO:: Test
	
	//Support for Event.preventDefault in IE 8
	if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault = function () { 
			this.returnValue = false; 
		};  
	}