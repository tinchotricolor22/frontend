angular.module('services', []).factory('DropdownService', function () {
    
    var dropdown = {
        mouseOver: function () {
            console.log('a');
            jQuery('.nav-link.on').removeClass('on'); jQuery('.menu.secondary .show').removeClass('show');
            jQuery(this).addClass('on'); jQuery('.menu.secondary .'+jQuery(this).attr('data-dropdown')).addClass('show');
    
        },
        mouseLeave: function () {
            console.log('b');
            jQuery('.nav-link.on').removeClass('on'); jQuery('.menu.secondary .show').removeClass('show');
        },
        init: function () {
            console.log('init');
            jQuery('.nav-link').mouseover(dropdown.mouseOver);
            jQuery('#header-jumbotron').mouseleave(dropdown.mouseLeave);
        }
    };

	return dropdown;
});