angularApp.directive('submitOnce', function(){
    return {
        restrict: 'A',
        link: function($scope, element, attrs) {
            element.on('submit', function(){
				var resolve = function(){
					element.find('button[type=submit]')
						.removeClass('disabled')
						.removeAttr('disabled')
						.find('i')
						.removeClass()
						.addClass(originalIconClasses);
				};

                // Guardo la clase actual del icon
                var originalIconClasses = element.find('button[type=submit]').find('i').attr("class");

                // Bloqueo el botton
                element.find('button[type=submit]')
                    .addClass('disabled')
                    .attr('disabled', 'disabled')
                    .find('i.fa')
                    .removeClass()
                    .addClass('fa fa-spinner fa-spin');

                var promise = $scope.$apply(attrs.submitOnce);
				if (promise) {
					promise.finally(resolve)
				} else {
					resolve();
				}
            });
        }

    }
});