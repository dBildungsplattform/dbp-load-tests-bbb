const http = require('http');
const client = require('prom-client');

const collectDefaultMetrics = client.collectDefaultMetrics;


/**
 * Nodejs HTTP server for serving up metrics using prom-client
 * exposing on /metrics endpoint. Console.log for debugging only
 */

const server = http.createServer(async (req, res) => {
  const route = req.url;

  if (route === '/metrics') {
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
    // console.log(metrics);
    res.end(metrics);
  } else {
    res.statusCode = 404;
    res.end('Not-Found');
  }
});

//9090 in use error at least locally
const PORT = 9091;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
/**
 * For Server shutdown, for local testing was needed 
 */
const serverShutdown = () => {
  console.log('Shutting down...');
  
  
  server.close(() => {
    console.log('Server has been closed');
    process.exit(0); 
  });
};

process.on('SIGINT', serverShutdown); // Ctrl+C
process.on('SIGTERM', serverShutdown); // Termination signal