var utils = require('./utils.js');
var statusCode = 200;
var messages = [];

var actions = {
  GET: function(request, response){
    utils.sendResponse(response, statusCode, {results: messages});
  },

  POST: function(request, response){
    utils.collectData(response, request, function(message){
      messages.push(message);
    });
    utils.sendResponse(response, 201);
  },

  OPTIONS: function(request, response){
    utils.sendResponse(response, statusCode, null);
  }
};


module.exports = function (request, response) {
  var action = actions[request.method];
  !action ? utils.sendResponse(response, 404) : action(request, response);
};

