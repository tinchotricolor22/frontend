angular.module('momentjs', []).factory('moment', function() {
    return window.moment; // assumes moment has already been loaded on the page
});