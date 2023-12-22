
	//TODO:: Test

	//Support for String.contains < ECMAScript 6th Edition
	if (!String.prototype.contains) {
		String.prototype.contains = function (string) {
			return this.indexOf(string) !== -1 ? true : false;
		};
	}