angularApp.controller('MainController', ['$scope', '$rootScope', '$http', '$modal', 'security', 'UserService', function($scope, $rootScope, $http, $modal, security, UserService){
    $scope.security = security;
}]);