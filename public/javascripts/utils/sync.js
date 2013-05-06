// backbone-sync
var socket = io.connect('http://localhost');
var Backbone = require('backbone');

module.exports = function(method, model, opts) {
  socket.emit('model-sync', {
    method: method,
    data: model.toJSON()
  }, function(err, data) {
    if (err) {
      console.log('error loading data');
    } else {
      model.set(data);
      model.isLoaded = true;
      model.trigger('sync');
    }
  });
};
