angularApp.controller('CambiarPasswordCtrl', [
    '$scope', '$modal', '$modalInstance', 'security', 'growl', 'Token', 'ForgotPassword',
    function($scope, $modal, $modalInstance, security, growl, Token, ForgotPassword) {
        $scope.forgotPassword = ForgotPassword || false;
        $scope.modalInstance = $modalInstance;
        $scope.changePassword = function () {
            if (this.newPassword !== this.newPasswordRepeat) {
                $scope.authError = {
                    class: 'alert alert-warning',
                    message: 'La repetición del nuevo password es incorrecto.'
                };
            } else {
                security.changePassword(this.oldPassword, this.newPassword, Token)
                    .then(function (response) {
                        $scope.authError = {
                            message: response
                        };
                    }
                );
            }

        };

        $scope.sendResetMail = function () {
            security.sendResetMail(this.email? this.email: null)
                .then(function (response) {
                    $scope.authError = {
                        message: response
                    };
                    $modalInstance.dismiss();
                    growl.addSuccessMessage(
                        "El mail fue enviado correctamente. " +
                        "Allí encontrará los pasos para cambiar su password."
                    );
                });
        };
}]);