
	c['Utils'] = (function() {
		
		var log = function(message) {
			
			if (c.Application.debug === true) {
				console.log(message);
			}
			
		};
		
		var timelineHit = function(label) {
			
			if (c.Application.debug === true) {
				console.timeStamp(label);
			}
			
		};
		
		var timeStart = function(label) {
			
			if (c.Application.debug === true) {
				console.time(label);
			}
			
		};
		
		var timeEnd = function(label) {
			
			if (c.Application.debug === true) {
				console.timeEnd(label);
			}
			
		};
		
		var clone = function(object) {
			
			var newObj = {};
	
			for (var prop in object) {
					
				newObj[prop] = object[prop];
	
			}
			
			return newObj;
	
		};
		
		var merge = function(obj1, obj2) {
						
			for (var prop in obj2) {
					
				obj1[prop] = obj2[prop];
	
			}
			
			return obj1;
			
		};
		
		var nodeListToArray = function (nodeList) {
			
			var array = [];
			
			for (var i=nodeList.length; i--; array.unshift(nodeList[i]));
			
			return array;
			
		};
		
		var formatNumber = function(string) {
			
			return (new String(string)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
			
		};
		
		var formatDuration = function(duration) {
			
			var seconds = duration;
			
			// calculate (and subtract) whole hours
			var hours = Math.floor(seconds / 3600);// % 24;
			seconds -= hours * 3600;
			
			// calculate (and subtract) whole minutes
			var minutes = Math.floor(seconds / 60) % 60;
			seconds -= minutes * 60;
			
			seconds = Math.round(seconds);
			
			if (minutes < 10) minutes = "0" + minutes;
			if (seconds < 10) seconds = "0" + seconds;
			
			return hours + ':' + minutes + ':' + seconds;
			
		};
		
		var countProperties = function(object) {
			
			var count = 0;
			
			for (i in object) {
				count++;
			}
		
			return count;
		
		};
	
		var objectValue = function(array, prop, needle) {
				
			for (var i=0, il=array.length; i<il; i++) {
			
				if (array[i][prop] == needle) return i;
			
			}
			
			return -1;
		
		};
		
		var isInt = function(i) {
			
			var x = parseInt(i);
			return !isNaN(x);
		
		};
		
		var invertColor = function(color) {
			
			var rgba 	= /rgba\((\d{1,3}),\s(\d{1,3}),\s(\d{1,3}),\s\d{1,3}\)/.exec(color),
				rgb 	= /rgb\((\d{1,3}),\s(\d{1,3}),\s(\d{1,3})\)/.exec(color),
				result	= rgba ? rgba : rgb;
				r		= 0,
				g		= 0,
				b		= 0;
								
			if (result != null) {
			
				r = (255-result[1]);
				g = (255-result[2]);
				b = (255-result[3]);
				
			}
			
			return '#'+ rgbToHex(r) + rgbToHex(g) + rgbToHex(b);
	
		};
	
		var rgbToHex = function(color) {
	
			var hex = color.toString(16);
			return hex.length == 1 ? "0" + hex : hex;
	
		};
		
		var checkPage = function(page) {
							
			return window.location.href.match(new RegExp('page='+page));
					
		};
		
		var canUseStorage = function() {
			
			try {
				document.cookie = "offlinestorage=1";
		  		localStorage.setItem('offlinestorage', '1');
		  		sessionStorage.setItem('offlinestorage', '1');
		  		return /offlinestorage=1/.test(document.cookie) || localStorage.getItem('offlinestorage') == '1' || sessionStorage.getItem('offlinestorage') == '1';
			} catch (e) {
				return false;
	  		}
			
		};
		
		var removeSelected = function (elements) {
			
			for (var i=0,il=elements.length; i<il; i++) {
				elements[i].classList.remove('selected');					
			}
			
		};
		
		var randomNumber = function (min, max) {
			
			if ("undefined" === typeof max) {
				max = min;
				min = 0;
			}
			
			return Math.floor(Math.random() * (max - min)) + min;
			
		};
		
		return {'log': log, 'timelineHit': timelineHit, 'timeStart': timeStart, 'timeEnd': timeEnd, 'clone': clone, 'merge': merge, 'nodeListToArray': nodeListToArray, 'formatNumber': formatNumber, 'formatDuration': formatDuration, 'countProperties': countProperties, 'objectValue': objectValue, 'isInt': isInt, 'invertColor': invertColor, 'rgbToHex': rgbToHex, 'checkPage': checkPage, 'canUseStorage': canUseStorage, 'removeSelected': removeSelected, 'randomNumber': randomNumber};
		
	}());
		