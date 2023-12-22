
	//TODO:: Test
	
	//Support for Event.stopPropagation in IE 8
	if (!Event.prototype.stopPropagation) {
		Event.prototype.stopPropagation = function () { 
			this.cancelBubble = true; 
		};
	}