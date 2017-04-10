angularApp.controller('CambiarPasswordLandingCtrl', [
    '$scope', '$modal', '$route', 'security', 'growl', 'JumbotronService',
    function($scope, $modal, $route, security, growl, JumbotronService) {
        JumbotronService.showJumbotron = false;
        security.requestCurrentUser().then(function (user){
            $scope.user = user;
        });

        // Register form dialog modal
        $scope.changePasswordModal = null;

        $scope.openChangePasswordDialog = function () {
			if (!this.changePasswordModal) {
				this.changePasswordModal = $modal.open({
					templateUrl: 'app/user/mi-cuenta/view-modal-cambiar-password.html',
					controller: 'CambiarPasswordCtrl',
					windowClass: 'small-dialog small-modal',
					keyboard: true,
					resolve: {
						Token: function () {return $route.current.params.token}
					}
				});

				this.changePasswordModal.result.then(this.onChangePasswordDialogClose);
			}
        };

        $scope.onChangePasswordDialogClose = function () {
            this.changePasswordModal = null;
        };
}]);