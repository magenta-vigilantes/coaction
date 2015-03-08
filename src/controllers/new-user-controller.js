app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/signup/', {
    controller: 'NewUserCtrl',
    controllerAs: 'vm',
    templateUrl: 'static/views/signup.html'
  });
}])
.controller('NewUserCtrl', ['$location', 'User', 'userService', function($location, User, userService){
  var self = this;

  self.user = User();

  self.goToTaskList = function () {
    $location.path('/tasks');
  };

  self.addUser = function(){
    userService.addUser(self.user).then(self.goToTaskList);
  };
}]);
