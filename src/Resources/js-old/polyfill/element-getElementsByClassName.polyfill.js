
	//TODO:: Test

	//Support for getElementsByClassName in older browsers IE 8 & lower
	if (!Element.prototype.getElementsByClassName) {
		var getByClassName = function (names) {
			return this.querySelectorAll("."+names.split(" ").join("."));
		};
		document.getElementsByClassName				= getByClassName;
		Element.prototype.getElementsByClassName	= getByClassName;
	}