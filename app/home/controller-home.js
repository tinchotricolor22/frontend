angularApp.controller('HomeCtrl', ['$scope', '$rootScope', 'BaseReadCtrl', 'UserService',
function($scope, $rootScope, BaseReadCtrl, UserService) {
    $rootScope.pageTitle = null;
    UserService.data = {};
}]);