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
.controller('TaskListCtrl', ['taskList', 'taskService', 'Task', 'statusService', function(taskList, taskService, Task, statusService){

  var self = this;

  self.taskList = taskList;

  self.status = function (task) {
    statusService.status(task);
  };

}]);
