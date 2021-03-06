app.config(['$routeProvider', function($routeProvider) {

  var routeDefinition = {
    templateUrl: 'static/views/task-list.html',
    controller: 'TaskListCtrl',
    controllerAs: 'vm',
    resolve: {
      taskList: ['taskService', function(taskService){
        return taskService.getTaskList();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/tasks', routeDefinition);
}])
.controller('TaskListCtrl', ['$location', 'taskList', 'taskService', 'Task', 'userService', 'User', function($location, taskList, taskService, Task, userService, User){

  var self = this;

  self.taskList = taskList;

  self.status = function (task, status) {
    task.status = status;
    console.log(task.id);
    taskService.status(task.id, task);
  };

}]);
