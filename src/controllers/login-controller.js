app.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/login/', {
    controller: 'LoginCtrl',
    controllerAs: 'vm',
    templateUrl: 'static/views/login.html'
  });
}])
.controller('LoginCtrl', ['$location', 'User', 'userService', function($location, User, userService){
  var self = this;

  self.user = User();

  self.goToTaskList = function() {
    $location.path('/tasks');
  };

  self.loginUser = function(){
    userService.loginUser(self.user).then(self.goToTaskList);
  }
}])
