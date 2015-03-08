app.config(['$routeProvider', function($routeProvider) {
  var routeDefinition = {
    templateUrl: 'static/views/user.html',
    controller: 'UserCtrl',
    controllerAs: 'vm',
    resolve: {
      user: ['$route', 'userService', function($route, userService){
        var routeParams = $route.current.params;
        return userService.getByUserId(routeParams.userid);
      }]
    }
  };

  $routeProvider.when('/users/:userid', routeDefinition); //IF PROJECT MESSES UP, CHECK HERE!!!!!!!!
}])
.controller('UserCtrl', ['user', function(user){
  var self = this;

  self.user = user;
}]);
