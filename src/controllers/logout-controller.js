app.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/logout/', {
    controller: 'LogoutCtrl',
    controllerAs: 'vm',
    templateUrl: 'api/logout/'
  });
}])
.controller('LoginCtrl', ['$location', 'User', 'userService', function($location, User, userService){
  var self = this;

  self.user = User();

  self.goToLogin = function() {
    $location.path('/login');
  };

  self.logoutUser = function(){
    userService.loginUser(self.user).then(self.goToLogin);
  }
}])
