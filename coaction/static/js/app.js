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
.controller('TaskListCtrl', ['taskList', 'taskService', 'Task', function(taskList, taskService, Task){

  var self = this;

  self.taskList = taskList;

  self.status = function (task, status) {
    task.status = status;
    taskService.status(task.id, task);
    console.log(task);
  };

}]);

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

app.factory('Task', function(){
  return function(spec) {
    spec = spec || {};
    return {
      due_date: spec.due_date,
      status: spec.status || 'new',
      title: spec.title,
      assignee: spec.assignee
    };
  };
});


// TO BE CONTINUED

app.factory('User', function(){
  return function (spec) {
    spec = spec || {};
    return {
      name: spec.name,
      email: spec.email,
      password: spec.password
    };
  };
});

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

// app.factory('statusService', ['$http', function($http) {
//   function post(url, data) {
//     return processAjaxPromise($http.post(url, data));
//   }
//
//   function processAjaxPromise(promise) {
//     return promise.then(function (result) {
//       return result.data;
//     })
//     .catch(function (error) {
//       $log.log(error);
//     });
//   }
//
//   return {
//     status: function (id, data) {
//       return put('/api/tasks/' + id, data);
//     }
//   };
// }]);

app.factory('taskService', ['$http', '$log', function($http, $log){

  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function post(url, task) {
    return processAjaxPromise($http.post(url, task));
  }

  function put(url, data) {
    return processAjaxPromise($http.put(url, data));
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
      return remove('/api/task/' + id);
    },

    status: function(id, data) {
      return put('api/tasks/' + id, data);
      console.log(id);
    }
  };
}]);

app.factory('userService', ['$http', '$q', '$log', function($http, $q, $log){
  function get(url) {
    return processAjaxPromise($http.get(url));
  }

  function processAjaxPromise(promise){
    return promise.then(function(result){
      return result.data;
    })
    .catch(function(error){
      $log.log(error);
    });
  }

  return {
    getUserList: function () {
      return get('/api/users');
    },

    getByUserId: function(userId){
      if (!userId) {
        throw new Error('getByUserId requires a user id');
      }

      return get('/api/users/' + userId);
    },

    addUser: function(user) {
      return processAjaxPromise($http.post('/api/register', user));
    },

    loginUser: function(user) {
      return processAjaxPromise($http.post('/api/login', user));
    },

    logoutUser: function(user) {
      return processAjaxPromise($http.post('/api/logout', user));
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