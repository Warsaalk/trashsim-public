
	//TODO:: Test

	//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/substr
	//only run when the substr function is broken
	if ('ab'.substr(-1) != 'b') {
	  String.prototype.substr = function (substr) {
	    return function (start, length) {
	      // did we get a negative start, calculate how much it is
	      // from the beginning of the string
	      if (start < 0) start = this.length + start;
	      
	      // call the original function
	      return substr.call(this, start, length);
	    };
	  }(String.prototype.substr);
	}