
	c['Popup'] = (function() {
				
		var popup, counter = 0, closeEvents = {};
		
		var init = function () {
			
			popup = c.DOM.get('#popup');
					
		};
		
		var open = function (content, closeEventArgument, maxWidth) {
			
			var wrapper = c.DOM.create('div');
			wrapper.innerHTML = '<div class="popup-wrapper"><div class="popup-shadow"></div><div class="popup-container"><div class="popup-close btn-close">x</div><div class="popup-content"></div></div></div>';
			wrapper = wrapper.firstElementChild;
			
			counter++;
			
			if ("function" === typeof closeEventArgument) {
				closeEvents[counter] = closeEventArgument;
			} else {
				closeEvents[counter] = false;
			}
			
			if ("undefined" !== typeof maxWidth) {
				c.DOM.getOne('.popup-container', wrapper).style.maxWidth = maxWidth + "px";
			}
			
			wrapper.style.zIndex = counter;
			wrapper.setAttribute('data-id', counter);
			c.DOM.getOne('.popup-close', wrapper).addEventListener('click', closePopup);
			if ("string" === typeof content) {
				c.DOM.getOne('.popup-content', wrapper).innerHTML = content;
			} else {
				c.DOM.getOne('.popup-content', wrapper).appendChild(content);
			}
			
			popup.appendChild(wrapper);
			popup.style.display = "block";
			
			return wrapper;
			
		};
		
		var closePopup = function (e) {
			
			var wrapper = this.parentNode.parentNode, id = wrapper.getAttribute('data-id'), event = closeEvents[id];
			
			if (event !== false) {
				event.call(null);
				delete closeEvents[id];
			}
			
			wrapper.remove();
						
			if (c.DOM.getAll('.popup-wrapper', popup).length < 1) {
				popup.style.display = "none";
			}
			
		};
		
		var close = function (wrapper) {
			
			if ("undefined" !== typeof wrapper && wrapper.classList.contains('popup-wrapper')) {
				closePopup.call(c.DOM.getOne('.popup-close', wrapper));
			}
			
		};
		
		var alert = function (title, message, button) {
			
			var content = $('<div/>').addClass('action-popup');
			
			content.append('<h3>'+ title + '</h3>');
			content.append('<p>'+ message +'</p>');
			content.append($('<button/>').addClass('btn').text(button).on('click', closePopup));
						
			open(content);
			
		};
		
		var confirm = function (title, message, yes, no, callback) {
			
			var content = $('<div/>').addClass('action-popup');
			
			content.append('<h3>'+ title + '</h3>');
			content.append('<p>'+ message +'</p>');
			content.append($('<button/>').addClass('btn').text(yes).on('click', function (e) {
				callback.call(null);
				closePopup.call(this,e);
			}));
			content.append($('<button/>').addClass('btn').text(no).on('click', closePopup));
						
			open(content);
			
		};
		
		return {'init': init, 'open': open, 'close': close, 'alert': alert, 'confirm': confirm};
		
	}());
		