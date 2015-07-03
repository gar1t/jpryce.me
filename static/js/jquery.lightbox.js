/*!
 * jquery.lightbox.js
 * https://github.com/duncanmcdougall/Responsive-Lightbox
 * Copyright 2013 Duncan McDougall and other contributors; @license Creative Commons Attribution 2.5
 *
 * Options: 
 * margin - int - default 50. Minimum margin around the content
 * nav - bool - default true. enable navigation
 * blur - bool - default true. Blur other content when open using css filter
 * minSize - int - default 0. Min window width or height to open lightbox. Below threshold will open content in a new tab.
 *
 */
(function ($) {
	'use strict';
	$.fn.lightbox = function (options) {
		var opts = {
			margin: 50,
			nav: true,
			blur: true,
			minSize: 0
		};

		var plugin = {
			items: [],
			lightbox: null,
			content: null,
			current: null,
			locked: false,
			caption: null,
			video: null,
			autoplay: null,
			
			init: function (items) {
				plugin.items = items;
				plugin.selector = "lightbox-"+Math.random().toString().replace('.','');
				if (!plugin.lightbox) {
					$('body').append(
						'<div id="lightbox" style="display:none;">'+
							'<a href="#" class="lightbox-close lightbox-button"></a>' +
							'<div class="lightbox-nav">'+
								'<a href="#" class="lightbox-previous lightbox-button"></a>' +
								'<a href="#" class="lightbox-next lightbox-button"></a>' +
							'</div>' +
							'<div href="#" class="lightbox-caption"><p></p></div>' +
						'</div>'
					);
					plugin.lightbox = $("#lightbox");
					plugin.caption = $('.lightbox-caption', plugin.lightbox);
				}
				if (plugin.items.length > 1 && opts.nav) {
					$('.lightbox-nav', plugin.lightbox).show();
				} else {
					$('.lightbox-nav', plugin.lightbox).hide();
				}
				plugin.bindEvents();
			},
			
			loadContent: function () {
				if(opts.blur) { $("body").addClass("blurred"); }
				$("img", plugin.lightbox).remove();
				$("iframe", plugin.lightbox).remove();
				plugin.lightbox.fadeIn('fast').append('<span class="lightbox-loading"></span>');
				
				var current = $(plugin.current);
				var content = current.attr('href');
				
				if ( current.data('video') ) {
					var videoW, videoH, split1, split2, split3, autoP;
					split1  = current.data('video').split('[');         
					split1  = split1[1];
					split2  = split1.split(' ');
					split3  = split2[1].split(']');
					videoW  = split2[0];
					videoH  = split3[0];
					autoP   = '';
					if (current.data('autoplay') == '1') {
						if ( content.indexOf("vimeo") != -1 ) { autoP = '&amp;autoplay=1'; }
						if ( content.indexOf("youtube") != -1 ) { autoP = '?autoplay=1'; }
					}
					if (videoW == '')   { videoW = '560'; }
					if (videoH == '')   { videoH = '315'; }
					var vid = $('<iframe width="'+videoW+'px" height="'+videoH+'px" src="http:' + content + autoP + '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>');
					$('.lightbox-loading').remove();
					plugin.lightbox.append(vid);
					plugin.content = $("iframe", plugin.lightbox).hide();
					plugin.resizeContent();
					plugin.setCaption();
				} else {
					var img = $('<img src="' + content + '" draggable="false">');
					$(img).load(function () {
						$('.lightbox-loading').remove();
						plugin.lightbox.append(img);
						plugin.content = $("img", plugin.lightbox).hide();
						plugin.resizeContent();
						plugin.setCaption();
					});
				}
			},
			
			setCaption: function () {
				var caption = $(plugin.current).data('caption');
				if(!!caption && caption.length > 0) {
					plugin.caption.fadeIn();
					$('p', plugin.caption).text(caption);
				} else {
					plugin.caption.hide();
				}
			},
			
			resizeContent: function () {
				var ratio, wHeight, wWidth, iHeight, iWidth;
				wHeight = $(window).height() - opts.margin;
				wWidth = $(window).outerWidth(true) - opts.margin;
				plugin.content.width('').height('');
				iHeight = plugin.content.height();
				iWidth = plugin.content.width();

				if (iWidth > wWidth) {
					ratio = wWidth / iWidth;
					iWidth = wWidth;
					iHeight = Math.round(iHeight * ratio);
				}
				if (iHeight > wHeight) {
					ratio = wHeight / iHeight;
					iHeight = wHeight;
					iWidth = Math.round(iWidth * ratio);
				}
				plugin.content.width(iWidth).height(iHeight).css({
					'top': ($(window).height() - plugin.content.outerHeight()) / 2 + 'px',
					'left': ($(window).width() - plugin.content.outerWidth()) / 2 + 'px'
				}).show();
				plugin.locked = false;
			},
			
			getCurrentIndex: function () {
				return $.inArray(plugin.current, plugin.items);
			},
			
			next: function () {
				if (plugin.locked) {
					return false;
				}
				plugin.locked = true;
				if (plugin.getCurrentIndex() >= plugin.items.length - 1) {
					$(plugin.items[0]).click();
				} else {
					$(plugin.items[plugin.getCurrentIndex() + 1]).click();
				}
			},
			
			previous: function () {
				if (plugin.locked) {
					return false;
				}
				plugin.locked = true;
				if (plugin.getCurrentIndex() <= 0) {
					$(plugin.items[plugin.items.length - 1]).click();
				} else {
					$(plugin.items[plugin.getCurrentIndex() - 1]).click();
				}
			},
			
			bindEvents: function () {
				$(plugin.items).unbind('click').click(function (e) {
					if(!$("#lightbox").is(":visible") && ($(window).width() < opts.minSize || $(window).height() < opts.minSize)) {
						$(this).attr("target", "_blank");
						return;
					}
					var self = $(this)[0];
					e.preventDefault();
					plugin.current = self;
					plugin.loadContent();

					// Bind Keyboard Shortcuts
					$(document).unbind('keydown').on('keydown', function (e) {
						// Close lightbox with ESC
						if (e.keyCode === 27) {
							plugin.close();
						}
						// Go to next content pressing the right key
						if (e.keyCode === 39) {
							plugin.next();
						}
						// Go to previous content pressing the left key
						if (e.keyCode === 37) {
							plugin.previous();
						}
					});
				});
				
				// Add click state on overlay background only
				plugin.lightbox.on('click', function (e) {
					if (this === e.target) {
						plugin.close();
					}
				});

				// Previous click
				$(plugin.lightbox).on('click', '.lightbox-previous', function () {
					plugin.previous();
					return false;
				});

				// Next click
				$(plugin.lightbox).on('click', '.lightbox-next', function () {
					plugin.next();
					return false;
				});

				// Close click
				$(plugin.lightbox).on('click', '.lightbox-close', function () {
					plugin.close();
					return false;
				});
				
				$(window).resize(function () {
					if (!plugin.content) {
						return;
					}
					plugin.resizeContent();
				});
			},

			close: function () {
				$(document).off('keydown'); // Unbind all key events each time the lightbox is closed
				$(plugin.lightbox).fadeOut('fast');
				$("iframe", plugin.lightbox).remove();
				$("img", plugin.lightbox).remove();
				$('body').removeClass('blurred');
			}
		};
		
		$.extend(opts, options);
		plugin.init(this);
	};

})(jQuery);