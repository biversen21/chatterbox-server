var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/plain"
};

var messages = [];

var sendResponse = function(response, statusCode, data) {
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

var collectData = function(response, request, callback) {
  var message = "";
  request.on('data', function(chunk){
    message += chunk;
  });
  request.on('end', function(){
    message = JSON.parse(message);
    message.createdAt = new Date().getTime();
    callback(message);
  });
};

var statusCode = 200;

var actions = {
  GET: function(request, response){
    sendResponse(response, statusCode, {results: messages});
  },

  POST: function(request, response){
    collectData(response, request, function(message){
      messages.push(message);
    });
    sendResponse(response, 201);
  },

  OPTIONS: function(request, response){
    sendResponse(response, statusCode, null);
  }
};


module.exports = function (request, response) {
  var action = actions[request.method];
  !action ? sendResponse(response, 404) : action(request, response);
};

