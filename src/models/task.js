app.factory('Task', function(){
  return function(spec) {
    spec = spec || {};
    return {
      due_date: spec.due_date,
      status: spec.status || 'new',
      title: spec.title
    };
  };
});


// TO BE CONTINUED
