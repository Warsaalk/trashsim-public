
	/*
	 * stt - SimpleTooltip
	 * 
	 * depends on DOM
	 * 
	 */

	c['Tooltip'] = (function() {

		var cloud = c.DOM.create('div'), tooltipsCounter = 0;

		var defaultOptions = {
		
				position 	: "bottom",
				open		: "hover",
				close		: "outside",
				styles		: false,
				showTooltip	: function() {
					show(this);
				},
				closeTooltip: function(id) {
					close(id);
				}
		
		};
		
		var init = function() {
		
			document.addEventListener("click", function (e) {
			
				for (var element = e.target; element; element = element.parentNode) {
					if ((element.className && element.className.indexOf('stt_Tooltip') != -1)
						|| (element.hasAttribute && element.hasAttribute('stt-id'))) 
						return;
			  }
			  
			  close();
				  
			});
			
			cloud.id = 'stt_Cloud';
			document.body.appendChild(cloud);
		
		};

		var create = function(parentId, contentId, options) {
		
			var parent = c.DOM.getOne(parentId), title = false;
			
			if (parent) {
			
				if ("object" === typeof contentId) {
					options = contentId;
					title = true;
				}
				
				options = typeof options === 'undefined' ? {} : options;
				options = getOptions(options);
				
				var	content			= title === true ? parent.title : c.DOM.getOne(contentId),
					tooltip			= c.DOM.create('div'),
					arrow			= c.DOM.create('div'),
					stt_id			= "stt-" + tooltipsCounter;
				
				
				if (title === true || content.parentNode.className.indexOf('stt_Tooltip') == -1) { // Don't create the tooltip again if it already exists 
				
					tooltip.appendChild(arrow);
					
					if (title === true)	tooltip.appendChild(c.DOM.text(content));
					else {
						tooltip.appendChild(content);
						content.style.display = "block"; //Makes it able to get it's dimensions
					}
					
					if (options.styles !== false && "object" === typeof options.styles) {
						for (var style in options.styles) {
							tooltip.style[style] = options.styles[style];
						}
					}
					
					tooltip.style.position 		= "absolute";
					tooltip.style.visibility	= "hidden"; //Hide element
					tooltip.style.zIndex 		= "99999"; //Hide element
					tooltip.className			= "stt_Tooltip"; //Hide element
					tooltip.id					= stt_id;
					arrow.className				= "arrow";
					
					tooltipsCounter++;
					
					cloud.appendChild(tooltip);
				
				} else stt_id = content.parentNode.id; // Because it already exists we needs it's id
							
				
				tooltip.setAttribute('stt-opt', JSON.stringify(options));
				parent.setAttribute('stt-id', stt_id);
				
				
				if (options.open == 'click')		parent.addEventListener('click', options.showTooltip);
				else if (options.open == 'auto')	options.showTooltip.call(parent);
				else {
					parent.addEventListener('mouseover', options.showTooltip);
					parent.addEventListener('mouseout', function () {
						options.closeTooltip(this.getAttribute('stt-id'));
					});
				}
				
			}
		
		};
		
		var getOptions = function (options) {
		
			var temp = c.Utils.clone(defaultOptions);
	
			if (typeof options === "object") {
				for (var prop in options) {
					temp[prop] = options[prop];
				}
			}
			
			return temp;
		
		};
		
		var show = function(parent) {
		
			var stt_id	= '#' + parent.getAttribute( 'stt-id' ),
				tooltip	= c.DOM.get( stt_id );
			
			if ( tooltip.style.visibility != 'visible' || tooltip.getAttribute( 'caller' ) != parent.id ) {	
			
				var	options			= getOptions( JSON.parse( tooltip.getAttribute( 'stt-opt' ) ) ),
					arrow			= tooltip.children[0];
				
				setPosition( parent, tooltip, arrow, options );
				
				if ( options.close == 'outside' && tooltip.className.indexOf( 'stt-close' ) == -1 ) {
				
					tooltip.classList.add( "stt-close" );
				
				}
				
				tooltip.setAttribute( 'caller', parent.id ); //Element who called the action
				tooltip.style.visibility = "visible"; //Show element
				
				//c.GoogleAnalytics.sendEvent( 'tooltip', 'show', parent.id );
				
			}
		
		};
		
		var setPosition = function( parent, tooltip, arrow, options ) {
				
			var contentWidth	= tooltip.offsetWidth,
				contentHeight	= tooltip.offsetHeight,
				parentWidth		= parent.offsetWidth, //Includes border width
				parentHeight	= parent.offsetHeight,
				parentOffset	= c.DOM.getGlobalOffset(parent),
				pos				= options.position;
			
			if ( pos == "right" || pos == "left" ) {
			
				tooltip.style.left = ( pos == "right" ? ( parentOffset.left + parentWidth + 10 ) : ( parentOffset.left - contentWidth - 10 ) ) + "px";
				arrow.classList.add( "arrow-stt-"+pos );
				
				var marginY = parentOffset.top - ( ( contentHeight / 2 ) - ( parentHeight / 2 ) ); //Normal
				
				if ( marginY < 0 ) {
				
					arrow.style.marginTop = - ( ( arrow.offsetHeight / 2 ) - marginY ) + "px"; //Adjust arrow
					marginY = 0; //If negatif margin is lager than global offset substract their difference
				
				}
				marginY -= parentOffset.scrollTop;
				marginY += "px";
				tooltip.style.top = marginY;
			
			} else {
			
				tooltip.style.top = ( pos == "bottom" ? ( parentOffset.top + parentHeight + 10 ) : ( parentOffset.top - contentHeight - 10 ) ) + "px";
				arrow.classList.add( "arrow-stt-"+pos );
				
				tooltip.style.left = parentOffset.left - ( ( contentWidth / 2 ) - ( parentWidth / 2 ) ) + "px";
			
			}
		
		};
		
		var close = function( id ) {
		
			if ( typeof id !== 'undefined' ) {
			
				c.DOM.get( '#' + id ).style.visibility = "hidden";
			
			} else {
			
				var outside = c.DOM.get( '.stt-close' );
				
				for ( var i=0, il=outside.length; i<il; i++ ) {
				
					outside[i].style.visibility = "hidden";
				
				}
			
			}
		
		};
		
		return { 'init': init, 'create': create, 'show': show, 'close': close };

	}());	