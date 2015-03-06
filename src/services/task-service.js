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
      // return get('api/tasks');
      return [{
        due_date: 'Jan 1st',
        status: 'new',
        title: 'Post some .gifs',
      },
      {
        due_date: 'Jan 2nd',
        status: 'done',
        title: 'Post more .gifs'
      }];
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
