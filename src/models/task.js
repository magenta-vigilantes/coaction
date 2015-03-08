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
