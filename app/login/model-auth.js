angular.module('resources').factory('Auth', ['BaseModel', function(BaseModel) {
	var Auth = BaseModel('auth');

	Auth.addRestangularMethod('login', 'post', 'login');
    Auth.addRestangularMethod('sendResetMail', 'get', 'password/reset');
	Auth.addRestangularMethod('logout', 'get', 'logout');
    Auth.addRestangularMethod('facebookLogin', 'post', 'login/fb');
	Auth.addRestangularMethod('me', 'get', 'me');
    Auth.addRestangularMethod('update', 'put', 'me');

	return Auth;
}]);