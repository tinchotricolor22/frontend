angularApp.controller('MiCuentaCtrl', [
    '$scope', '$modal', 'security', 'growl', 'JumbotronService', 'Usuario',
    function($scope, $modal, security, growl, JumbotronService, Usuario) {
        JumbotronService.showJumbotron = false;

        $scope.security = security;

        // Change password dialog modal
        $scope.changePasswordModal = null;

        $scope.openChangePasswordDialog = function () {
			if (!this.changePasswordModal) {
				this.changePasswordModal = $modal.open({
					templateUrl: 'app/user/mi-cuenta/view-modal-email-cambiar-password.html',
					controller: 'CambiarPasswordCtrl',
					windowClass: 'small-dialog small-modal',
					keyboard: true,
					resolve: {
						Token: function () {return null;},
						ForgotPassword: function () {return false;}
					}
				});

				this.changePasswordModal.result.then(this.onChangePasswordModal, this.onChangePasswordModal);
			}
        };

		$scope.onChangePasswordModal = function () {
			$scope.changePasswordModal = null;
		};

        // Update user dialog modal
        $scope.updateUserModal = null;

        $scope.openUpdateUserDialog = function () {
			if (!this.updateUserModal) {
				this.updateUserModal = $modal.open({
					templateUrl: 'app/user/mi-cuenta/view-modal-modificar-datos-usuario.html',
					controller: 'ModificarDatosUsuarioCtrl',
					windowClass: 'small-dialog small-modal',
					keyboard: true
				});
				this.updateUserModal.result.then(this.onUpdateUserDialogClose, this.onUpdateUserDialogClose);
			}
        };

        $scope.onUpdateUserDialogClose = function (success) {
            $scope.updateUserModal = null;
            security.requestCurrentUser(false, {refresh: true}).then(function (user){
                user.fecha_cumple = new Date(user.fecha_cumple);
                $scope.user = user;
            });
        };

        // Close account modal
        $scope.closeAccountModal = null;

        $scope.openCloseAccountDialog = function () {
			if (!this.closeAccountModal) {
				this.closeAccountModal = $modal.open({
					templateUrl: 'app/user/mi-cuenta/view-modal-cerrar-cuenta.html',
					controller: 'CerrarCuentaCtrl',
					windowClass: 'small-dialog small-modal',
					keyboard: true
				});
				this.closeAccountModal.result.then(this.closeAccountModalClose, this.closeAccountModalClose);
			}
        };

		$scope.closeAccountModalClose = function() {
			$scope.closeAccountModal = null;
		};
}]);