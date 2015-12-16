/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.


var posts = [];

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var responseWriter = function(response, statusCode, results){
  results = results || "";
  response.writeHead(statusCode, headers);
  response.write(JSON.stringify({"results" : results}));
  response.end();
};

var requestTypeHash = {
  "GET" : function(response, statusCode){
    statusCode = statusCode || 200;
    responseWriter(response, statusCode, posts);
  },
  "OPTIONS" : function(response, statusCode){
    statusCode = statusCode || 200;
    responseWriter(response, statusCode);
  },
  "POST" : function(request, response){
    var statusCode = 201;
    var data = "";
    request.on("data", function(chunk) {
      data += chunk.toString();
    });
    data = JSON.parse(data);
    if(data.objectId === undefined){
      data.objectId = Math.floor(Math.random() * 90019001);
    }
    posts.push(data);
  }
};

var requestHandler = function(request, response) {
  require("fs");

  // var postTemplate = {results : {username: '',text: '',roomname: '', objectId: ''}};
  // fs.readFile()
  // fs.write
  // The outgoing status.
  var statusCode = 200;
  // See the note below about CORS headers.
  var pathnameURL = require("url").parse(request.url, "URL").pathname;
  // Tell the client we are sending them plain text.
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  console.log("Serving request type " + request.method + " for url " + request.url);
  if(request.method === "GET"){   
    if ( pathnameURL === "/classes/messages" || pathnameURL === "/classes/room1") {
      response.writeHead(statusCode, headers); 
      response.write(JSON.stringify({"results" : posts})); 
    }else{
      statusCode = 404;
      response.writeHead(statusCode, headers); 
    }

  } else if(request.method === "OPTIONS"){
    response.writeHead(statusCode, headers); 

  } else if(request.method === "POST"){
    statusCode = 201;
    request.on("data", function(chunk) {
      var d = JSON.parse(chunk.toString());
      if(d.objectId === undefined){
        d.objectId = Math.floor(Math.random() * 90019001);
      }
      posts.push(d);
    });
      response.writeHead(statusCode, headers); 
      response.write(JSON.stringify({"results" : posts}));
  }

  response.end();
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


exports.requestHandler = requestHandler;

