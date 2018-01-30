/**
 * 启动一个 server
 */

const http = require("http")
const url = require("url")
const qs = require("querystring")

http.createServer(function (req, res) {
    console.log("------------------------------------------",req.method)
    var pathname
    if(req.method=="POST") {
        var body="";
        req.on("data", function (data) {
          body +=data;
        });
        req.on("end",function(){
           var variables =  qs.parse(body)
           pathname = url.parse(req.url).pathname;
           console.log(body,variables,pathname)
           //rest of code - this function is executed when all the variables are received
   
        });
        req.on("error",function(e){
           //console.log('problem with request: ' + e.message);
        });
     }
     else if(req.method=="GET") {
        var variables = url.parse(req.url, true).query;
        pathname = url.parse(req.url).pathname;
        //rest of code - We have no wait variables like POST request
     }

     console.log(pathname)
     console.log(req.headers)

    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.write('Hello World!');
    res.end();
}).listen(7000);