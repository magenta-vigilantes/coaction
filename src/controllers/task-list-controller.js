app.config(['$routeProvider', function($routeProvider) {

  var routeDefinition = {
    templateUrl: 'views/task-list.html',
    controller: 'TaskListCtrl',
    controllerAs: 'vm',
    resolve: {
      taskList: ['taskService', function(taskService){
        return taskService.getTaskList();
      }]
    }
  };

  $routeProvider.when('/', routeDefinition);
  $routeProvider.when('/task-list', routeDefinition);
}])
.controller('TaskListCtrl', ['$location', 'taskList', 'taskService', 'Task', function($location, taskList, taskService, Task){

  var self = this;

  self.taskList = taskList;

}]);
