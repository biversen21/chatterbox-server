
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  "Content-Type": "text/plain"
};


exports.sendResponse = function(response, statusCode, data) {
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

exports.collectData = function(response, request, callback) {
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

