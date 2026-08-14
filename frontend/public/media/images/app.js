const http = require('http');

const server = http.createServer((req, res) => {
    // console.log(res);
    // console.log(req.method);
    // console.log(req.headers);

    res.setHeader('Content-Type', 'text/html');
    res.write('<html lang="en">');
    res.write('<head><title>My Page</title></head>');
    res.write('<body><h1>Hello Swati!</h1></body>');
    res.write('</html>');

    res.end();
})

const PORT = 8000;
server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
})
