// Declare our app module, and import the ngRoute and ngAnimate
// modules into it.
var app = angular.module('app', ['ngRoute']);

// Set up our 404 handler
app.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.otherwise({
    controller: 'Error404Ctrl',
    controllerAs: 'vm',
    templateUrl: 'static/errors/404/error-404.html'
  });
}]);

app.config()

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

//remember to capitalize the T in Task

app.factory('taskService', ['$http', '$log', function($http, $log){

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function post(url, task) {
    return processAjaxPromise($http.post(url, task));
  }

  function remove(url) {
    return processAjaxPromise($http.delete(url));
  }

  function processAjaxPromise(promise) {
    return promise.then(function (result) {
      return result.data;
    })
    .catch(function (error) {
      $log.log(error);
    });
  }

  return {
    getTaskList: function() {
      return get('api/tasks');
    },

    getTask: function(id) {
      return get('api/tasks' + id);
    },

    addTask: function(task) {
      return post('api/tasks', task);
    },

    deleteTask: function(id) {
      return remove('/api/res/' + id);
    }
  };
}]);

app.controller('Error404Ctrl', ['$location', function ($location) {
  this.message = 'Could not find: ' + $location.url();
}]);

//# sourceMappingURL=app.js.map