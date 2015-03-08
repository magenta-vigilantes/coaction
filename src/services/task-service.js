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
