
	//TODO:: Test

	//Support for Array.indexOf in older browsers IE 8 & lower | < ECMAScript 5th Edition
	if (!Element.prototype.addEventListener) {
		Element.prototype.addEventListener = function (event, callback, bool) {
           var self = this;
           self.attachEvent('on'+event, function (e) { callback.call(self,e); }); //Simulate this = attachedElement like addEventListener uses this 
		};        
	}