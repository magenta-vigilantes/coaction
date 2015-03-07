app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/tasks/new', {
    controller: 'NewTaskCtrl',
    controllerAs: 'vm',
    templateUrl: 'static/views/add-new-task.html'
  });
}]).controller('NewTaskCtrl', ['$location', 'Task', 'taskService', function($location, Task, taskService) {

  var self = this;
  self.task = Task();

  self.goToTaskList = function () {
    $location.path('/tasks');
  };

  self.addTask = function () {
    taskService.addTask(self.task).then(self.goToTaskList);
  };



}]);
