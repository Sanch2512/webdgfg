/*console.log("Hello, Node.js is working!");

const http = require('http');
const port = 8000;

const server = http.createServer((req , res) => {
   // console.log(req)
    if(req.url == '/')
    {
       res.write('<h1>Home Page</h1>')
        res.end()
    }
    else if(req.url == '/about')
    {
        res.write('<h1>About Page</h1>')
        res.end()
    }
});

server.listen(port , () =>{
    console.log(`Server is running on port ${port}`);
});
*/
const http = require('http');
const port = 8000;

const server = http.createServer((req, res) => {
    //console.log(req)
    //console.log("Received request: ", req.url);  // Debugging line
   // res.writeHead(200, { 'Content-Type': 'text/html' });
   // res.write('<h1>Home Page</h1>');
   // res.end();
   if(req.url == '/' || req.url =='/home')
    {
        res.statusCode = 200
        res.setHeader( 'Content-Type', 'text/html')
       res.write('<h1>Home Page</h1>')
        res.end()
    }
    else if(req.url == '/about')
    {
        res.statusCode = 200
        res.setHeader( 'Content-Type', 'text/html')
        res.write('<h1>About Page</h1>')
        res.end()
    }
    else
    {
        res.statusCode = 404
        res.setHeader( 'Content-Type', 'text/html')
        res.write('<h1> 404 Page Not Found </h1>')
        res.end()
    }
});


server.listen(8000, () => {
    console.log("Server is running on port 8000");
});
// HTTP RESPONSE STATUS CODE
