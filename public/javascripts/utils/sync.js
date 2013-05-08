// backbone-sync
var socket = io.connect('http://localhost');
var Backbone = require('backbone');

module.exports = function(method, model, opts) {
  model.trigger('request');
  socket.emit('model-sync', {
    method: method,
    type: model.url,
    data: model.toJSON()
  }, function(err, data) {
    if (err) {
      console.log('error loading data');
      console.log(err);
    } else {
      model.set(data);
      model.isLoaded = true;
      model.trigger('sync');
    }
  });
};
