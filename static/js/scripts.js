/* Custom Scrollbar */
jQuery(document).ready(function ($) {
    "use strict";
    $('.workspace>.content .pagearea>div.bottom').perfectScrollbar();
});

/* Flip Effect */
var Page = (function() {
    var config = {
        $bookBlock : $( '#bb-bookblock' )
    },
    init = function() {
        config.$bookBlock.bookblock( {
            orientation: 'vertical',
            speed : 1000,
            shadowSides : 0,
            shadowFlip : 0,
			onEndFlip: function(){
				$(".ps-scrollbar-y-rail").click();
			}
        } );
        initEvents();
    },
    initEvents = function() {
            var $slides = config.$bookBlock.children();

            // add swipe events
            $slides.on( {
                'swipeleft' : function( event ) {
                    config.$bookBlock.bookblock( 'next' );
                    return false;
                },
                'swiperight' : function( event ) {
                    config.$bookBlock.bookblock( 'prev' );
                    return false;
                }
            } );

            // add keyboard events
            $( document ).keydown( function(e) {
                var keyCode = e.keyCode || e.which,
                    arrow = {
                        left : 37,
                        up : 38,
                        right : 39,
                        down : 40
                    };

                switch (keyCode) {
                    case arrow.left:
                        config.$bookBlock.bookblock( 'prev' );
                        break;
                    case arrow.right:
                        config.$bookBlock.bookblock( 'next' );
                        break;
                }
            } );
    };

    return { init : init };

})();

/* Contact Form */
$("#contactsubmit").click(function(){
   _empty = 0;
   $("form#contactform input").each(function(){
       if($.trim($(this).val()) === ""){
           $(this).addClass('inputerror');
           _empty++;
       }else{
           $(this).removeClass('inputerror');
       }
   });
   if($.trim($("form#contactform textarea").val()) === ""){
       $("form#contactform textarea").addClass('inputerror');
       _empty++;
   }else{
       $("form#contactform textarea").removeClass('inputerror');
   }
   if(_empty>0){
       $("#mailerror").html("Please, fill all fields.");
   }else{
       $.ajax({
          type: "POST",
          url: "mail.php",
          data: $("#contactform").serialize(),
          success: function( msg ) {
             $("#mailerror").html(msg);
             $("form#contactform input, form#contactform textarea").removeClass('inputerror');             
          }
       });
   }
});

/* Menu */
$(".menu ul li").click(function(){
    var _index = $(this).index()+1;
    $('#bb-bookblock').bookblock('jump', _index);
})

/* Gallery Align */
_li = 1;
$("ul.gallery>li").each(function(){
    if((_li % 2)===1){
        $(this).addClass("gallery-left");
    }
    _li++;
});

/* Gallery Filters */
$(".workspace>.content .pagearea>div.bottom>ul.filters>li").click(function(){
    var _class = $.trim($(this).attr('class').replace('active',''));
    $(".workspace>.content .pagearea>div.bottom>ul.filters>li.active").removeClass('active');
    $(this).addClass('active');
    $(".workspace>.content .pagearea>div.bottom>ul.gallery>li").css('display','none');
    $(".workspace>.content .pagearea>div.bottom>ul.gallery>li." + _class).fadeIn();
    $(".ps-scrollbar-y").css('height','0');
    $(".gallery-left").removeClass("gallery-left");
    _li = 1;
    $("ul.gallery>li").each(function(){
        if($(this).css('display') !== 'none'){
            if((_li % 2)===1){
                $(this).addClass("gallery-left");
            }
            _li++;
        }
    });

	$(".ps-scrollbar-y-rail").click();
    $("#lightbox").remove();
    $('.gallery>li.'+ _class +'>a').lightbox();
});

/* Init Flip Effect */
Page.init();

$(function() {
    /* Portfolio Hover*/
    $(' #da-thumbs > li ').each( function() { $(this).hoverdir(); } );

    /* All Lightbox */
    $('.gallery>li.all>a').lightbox();

    /* Placeholder for IE8 */
    $('input, textarea').placeholder();
	
    /* Resume Accordion */
    $(".workspace>.content .pagearea.resume>div.bottom ul li").eq(0).find('h3').css('background-color','#636363');
    $(".workspace>.content .pagearea.resume>div.bottom ul li").eq(0).find('div').css('display','block');
    $(".workspace>.content .pagearea.resume>div.bottom ul li h3").addClass('accordion-plus');
    $(".workspace>.content .pagearea.resume>div.bottom ul li").eq(0).find('h3').removeClass('accordion-plus').addClass('accordion-minus');
    $(".workspace>.content .pagearea.resume>div.bottom ul li h3").click(function(){
		$(".workspace>.content .pagearea.resume>div.bottom ul li").find('div').slideUp('fast',function(){
			$('.workspace>.content .pagearea>div.bottom').scrollTop(0);
			$(".ps-scrollbar-y").css("height",0);
			$(".ps-scrollbar-y-rail").click();
		});
		$(".workspace>.content .pagearea.resume>div.bottom ul li").find('h3').css('background-color','#999999');
		$(".workspace>.content .pagearea.resume>div.bottom ul li").find('h3').removeClass('accordion-minus').addClass('accordion-plus');
		if($(this).parent().children("div").css('display') === 'none'){
			$(this).css('background-color','#636363');
			$(this).removeClass('accordion-plus').addClass('accordion-minus');

			$(this).parent().children("div").slideDown('fast',function(){
				$('.workspace>.content .pagearea>div.bottom').scrollTop(0);
				$(".ps-scrollbar-y").css("height",0);
				$(".ps-scrollbar-y-rail").click();
			});
			
			$(this).parent().find('td.skill-bar>pre').css('width','0');
			$(this).parent().find('td.skill-bar>pre').each(function(){
				$(this).animate({width:$(this).data('skill')+"%"},1500);
			});
		}
    });
});