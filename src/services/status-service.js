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
