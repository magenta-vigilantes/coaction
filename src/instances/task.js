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
