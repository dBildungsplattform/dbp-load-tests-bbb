const logger = require('../logger');
const client = require('prom-client');
const http = require('http');

const botMetrics = {};

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

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
 * For Server shutdown, check run.js
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

const jitterHistogram = new client.Histogram({
  name: 'bot_jitter_histogram',
  help: 'Jitter in milliseconds',
  buckets: client.linearBuckets(0, 30, 10),
});


const packetsSummary = new client.Summary({
  name: 'bot_lostPackets',
  help: 'Lost Packets',
});

const audioUploadSummary = new client.Summary({
  name: 'bot_audioUpload',
  help: 'Audio Upload',
});

const jitterSummary = new client.Summary({
  name: 'bot_jitter_summary',
  help: 'bot_jitter_help',
});

const videoUploadSummary = new client.Summary({
  name: 'bot_videoUpload',
  help: 'Video Upload',
});

const audioDownloadSummary = new client.Summary({
  name: 'bot_audioDownload',
  help: 'Audio Download',
});


const videoDownloadSummary = new client.Summary({
  name: 'bot_videoDownload',
  help: 'Video Download',
});


const metrics = async page => {
  //Opening connections Tab
  await page.click('[data-test="connectionStatusButton"]');
  //Need to wait untill information is shown, because
  //the modal is showing info after 2 seconds
  await page.waitForTimeout(2500);

  //Array of metrics we are interrested in
  const metricNames = [
    "Lost packets",
    "Audio Download Rate",
    "Video Download Rate",
    "Video Upload Rate",
    "Audio Upload Rate",
    "Jitter"
  ];

  //Waiting for div to show, this is the anchor point for our xpath
  const parentDiv = await page.waitForSelector('div[data-test="networkDataContainer"]');

  //extracting botname
  const username = page.bigbluebot.username;
  const metrics = {};

  for (const metricName of metricNames) {
    const metricDiv = await parentDiv.$x(`.//div[contains(text(), "${metricName}")]`);
    if (metricDiv.length === 0) {
      console.log(`Could not find ${metricName} element for ${username}`);
      continue;
    }
    //Looking for next sibling
    const metricValueDiv = await page.evaluateHandle(el => el.nextElementSibling, metricDiv[0]);

    if (!metricValueDiv) {
      console.log(`Could not find ${metricName} value for ${username}`);
      continue;
    }
    //extracting the div
    const extractedValue = await page.evaluate(el => el.textContent.trim(), metricValueDiv);
    metrics["Bot Name"] = username;
    //populate
    metrics[metricName] = extractedValue;
  }

  //parse the metrics
  for (const botName in botMetrics) {
    const botMetric = botMetrics[botName];
    for (const entry of botMetric) {

      //TO DO write function for parse.

      const lostPackets = parseFloat(entry["Lost packets"]);
      const audioUpload = parseFloat(entry["Audio Upload Rate"].replace('k', '').trim());
      const videoUpload = parseFloat(entry["Video Upload Rate"].replace('k', '').trim());
      const jitterValue = parseFloat(entry["Jitter"].replace('ms', '').trim());
      const audioDownload = parseFloat(entry["Audio Download Rate"].replace('k', '').trim());
      const videoDownload = parseFloat(entry["Video Download Rate"].replace('k', '').trim())

      //updating metrics on prom

      packetsSummary.observe(lostPackets);
      audioUploadSummary.observe(audioUpload);
      audioDownloadSummary.observe(audioDownload);
      jitterHistogram.observe(jitterValue);
      jitterSummary.observe(jitterValue);
      videoUploadSummary.observe(videoUpload);
      videoDownloadSummary.observe(videoDownload);

      // console.log(await client.register.metrics());
    }
  }
  console.log("metrics collected");
  if (!botMetrics[username]) {
    console.log("array created");
    botMetrics[username] = []; // if bot doesnt exist make new array
  }
  console.log("after array pushing");
  botMetrics[username].push(metrics);
  console.log("pushed");
  logger.info(botMetrics);
};
module.exports = {
  metrics,
  serverShutdown
};
