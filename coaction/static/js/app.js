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
.controller('TaskListCtrl', ['taskList', 'taskService', function(taskList, taskService){

  var self = this;

  self.taskList = taskList;

}]);

app.factory('Task', function(){
  return function(spec) {
    spec = spec || {};
    return {
      url: spec.url
      // created: Date.now();
    };
  };
});


// TO BE CONTINUED

app.controller('MainNavCtrl',
['$location', 'StringUtil', function($location, StringUtil) {
  var self = this;

  self.isActive = function (path) {
    // The default route is a special case.
    if (path === '/') {
      return $location.path() === '/';
    }

    return StringUtil.startsWith($location.path(), path);
  };
}]);

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
      return get('api/tasks').then(function(data){
        return data.tasks;
      });
    },

    getTask: function(id) {
      return get('api/tasks/' + id);
    },

    addTask: function(task) {
      return post('api/tasks', task);
    },

    deleteTask: function(id) {
      return remove('/api/res/' + id);
    }
  };
}]);

app.factory('StringUtil', function() {
  return {
    startsWith: function (str, subStr) {
      str = str || '';
      return str.slice(0, subStr.length) === subStr;
    }
  };
});

app.controller('Error404Ctrl', ['$location', function ($location) {
  this.message = 'Could not find: ' + $location.url();
}]);

//# sourceMappingURL=app.js.map