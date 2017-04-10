angularApp.controller('LoginCtrl', ['$scope', '$modal', 'BaseReadCtrl', 'security', 'forceLogin',
function($scope, $modal, BaseReadCtrl, security, forceLogin) {
	$scope.authError = {};
    security.clearLoginReason();

    $scope.login = function() {
		$scope.authError = {};
		security.login(this.email, this.password);
	};

    $scope.facebookLogin = function () {
        $scope.authError = {};
        security.facebookLogin();
    };

	if (forceLogin) {
		security.showLogin();
	}

	$scope.$watch(function() {return security.getLoginReason();}, function(reason, oldReason) {
        if (!reason || reason === oldReason) {
            // Don't show last error
            return;
        }
		var message = '', messageClass = '';
		switch(reason) {
			case 'unauthorized-server':
				message = 'No tiene permisos para acceder allí';
				messageClass = 'alert alert-warning';
				break;
			default:
				message = reason;
				messageClass = 'alert alert-danger';
				break;
		}
		$scope.authError = {
			class: messageClass,
			message: message
		};
	});

    // Change password dialog modal
    $scope.changePasswordModal = null;

    $scope.openChangePasswordDialog = function () {
		if (!$scope.changePasswordModal) {
            $scope.changePasswordModal = $modal.open({
				templateUrl: 'app/user/mi-cuenta/view-modal-email-cambiar-password.html',
				controller: 'CambiarPasswordCtrl',
				windowClass: 'small-dialog small-modal',
				keyboard: true,
				resolve: {
					Token: function () {return null;},
					ForgotPassword: function () {return true;}
				}
			});

            $scope.changePasswordModal.result.then($scope.onChangePasswordDialogClose, $scope.onChangePasswordDialogClose);
		}
    };

    $scope.onChangePasswordDialogClose = function (success) {
        $scope.changePasswordModal = null;
    };

}]);