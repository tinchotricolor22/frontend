angularApp.directive("scrollTo", function($document) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {

            var target = attrs.scrollTo;

            return element.bind('click', function(e) {
                $document.scrollToElement(angular.element('#' + target), 0, 500, function (t) { return t*t });
            });
        }
    };
});