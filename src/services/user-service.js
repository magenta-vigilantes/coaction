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
