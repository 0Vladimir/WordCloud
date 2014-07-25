var http      = require('http'),
    url       = require('url'),
    path      = require('path'),
    fs        = require('fs'),
    sys       = require('sys');


http.createServer(function (request, response) {
    var uri = url.parse(request.url).pathname;

    if (uri === '/') {
        uri = '/index.html';
    }

    var filename = path.join(process.cwd(), uri);
    

    path.exists(filename, function(exists) {
        if (!exists) {
            response.writeHead(404, {'Content-Type': 'text-plain'});
            response.write('404');
            response.end();
            return;
        }
    
        fs.readFile(filename, 'binary', function(err, file) {
            if (err) {
                response.writeHead(500, {'Content-Type': 'text/plain'});
                response.write(err+'\n');
                response.end();
                return;
            }

            response.writeHead(200);
            response.write(file, 'binary');
            response.end();
        });
    });
}).listen(Number(process.env.PORT || 5000));

console.log('Server running...');
