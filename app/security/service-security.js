// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security', [
	'security.services', 'security.interceptor', 'security.authorization']);

// Based loosely around work by Witold Szczerba - https://github.com/witoldsz/angular-http-auth
angular.module('security.services', [
		'security.retryQueue'    // Keeps track of failed requests that need to be retried once the user logs in
		//security.login',         // Contains the login form template and controllers
	])

.factory('security', ['$http', '$q', '$location', 'securityRetryQueue', '$modal', 'Facebook', 'Auth', 'localStorageService', function ($http, $q, $location, queue, $modal, Facebook, Auth, localStorageService) {
	// Login form dialog stuff
	var loginModal = null;

	function openLoginDialog() {
		if (!loginModal) {
			loginModal = $modal.open({
				templateUrl: 'app/login/view-modal-login.html',
				controller: 'LoginCtrl',
				resolve: {
					forceLogin : function() {return false;}
				},
				windowClass: 'small-dialog small-modal',
				keyboard: true
			});

			loginModal.result.then(onLoginDialogClose, onLoginDialogClose);
		}
	}

	function closeLoginDialog(success) {
		if (loginModal) {
			loginModal.close(success);
			loginModal = null;
		}
	}

	function onLoginDialogClose(success) {
		success = (success === true);
		if (success) {
			queue.retryAll();
		} else {
			queue.cancelAll();
		}
		loginModal = null;
		$location.path('/');
	}

    function fixUserPermission(user) {
        var permissions = [];
        for (var property in user.permissions) {
            if (user.permissions.hasOwnProperty(property)) {
                permissions[property.replace('.','_')] = 1;
            }
        }
        user.permissions = permissions;
        return user;
    }

	// Register a handler for when an item is added to the retry queue
	queue.onItemAddedCallbacks.push(function () {
		if (queue.hasMore()) {
			service.showLogin();
		}
	});

	// The public API of the services
	var service = {
		loginError: null,

		// Get the first reason for needing a login
		getLoginReason: function () {
			if (this.loginError) {
				return this.loginError;
			}
			return queue.retryReason();
		},

        clearLoginReason: function () {
            return this.loginError = null;
        },

		// Show the modal login dialog
		showLogin: function () {
			openLoginDialog();
		},

		closeLogin: function (success) {
			closeLoginDialog(success);
		},

        facebookLogin: function () {
            this.loginError = null;
            return Facebook.login(function(response) {
                // Do something with response.
                if (response.status == "connected") {
                    Facebook.api('/me', function(response) {
                        Auth.facebookLogin({
                            nombre: response.first_name,
                            apellido: response.last_name,
                            email: response.email,
                            fb_id: response.id
                        }).then(function (response) {
                            service.currentUser = fixUserPermission(response);
                            if (service.isAuthenticated()) {
                                closeLoginDialog(true);
                                return true;
                            }
                            return false;
                        });

                    });
                }
                return false;
            }, {
                scope: 'public_profile, email',
                return_scopes: true
            });
        },

		// Attempt to authenticate a user by the given email and password
		login: function (email, password) {
			this.loginError = null;
			return Auth.login({'email': email, 'password': password}).then(function (response) {
				service.currentUser = fixUserPermission(response);

				if (service.isAuthenticated()) {
					closeLoginDialog(true);
					return true;
				}
				return false;
			}, function(error) {
				service.loginError = error.data.message.reason[0];
			});
		},

		// Logout the current user
		logout: function () {
            return Auth.logout().then(function() {
                localStorageService.clearAll();
                service.currentUser = null;
                Facebook.logout();
                window.location = '/';
            });

		},

        // Change current user's password
        changePassword: function (oldPassword, newPassword, token) {
            return Auth.customPUT({oldPassword: oldPassword, password:newPassword}, 'password/reset/'+token).then(function (response) {
                service.authError = response;
            });
        },

        // Change current user's password
        sendResetMail: function (email) {
            return Auth.sendResetMail({email: email}).then(function (response) {
                service.authError = response;
            });
        },

		// Ask the backend to see if a user is already authenticated - this may be from a previous session.
		requestCurrentUser: function (showPopup, options) {
            var defaultOptions = {
                refresh: false
            };
            options = angular.extend(defaultOptions, options);

			showPopup = (typeof showPopup === 'undefined' ? true : showPopup);
			if (service.isAuthenticated() && !options.refresh) {
				return $q.when(service.currentUser);
			} else {
				service.currentUser = Auth.me().then(function (response) {
					service.currentUser = fixUserPermission(response);
					if (service.isAuthenticated()) {
						return service.currentUser;
					} else if(showPopup) {
						service.showLogin();
					}
					return false;
				});
				return service.currentUser;
			}
		},

		// Information about the current user
		currentUser: null,

		// Is the current user authenticated?
		isAuthenticated: function () {
			return angular.isObject(service.currentUser) && angular.isDefined(service.currentUser.id) && service.currentUser.id >= 0;
		},

		// Is the current user an adminstrator?
		isAdmin: function () {
			return !!(service.currentUser && service.currentUser.admin);
		}
	};

	return service;
}]);