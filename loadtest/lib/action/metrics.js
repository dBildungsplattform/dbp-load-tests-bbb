const logger = require('../logger');
const client = require('prom-client');
const http = require('http');

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const server = http.createServer(async (req, res) => {
  const route = req.url;
  if (route === '/metrics') {
    res.setHeader('Content-Type', client.register.contentType);
    const metrics = await client.register.metrics();
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

const serverShutdown = () => {
  console.log('Shutting down...');
  server.close(() => {
    console.log('Server has been closed');
    process.exit(0);
  });
};

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

  const metricNames = [
    "Lost packets",
    "Audio Download Rate",
    "Video Download Rate",
    "Video Upload Rate",
    "Audio Upload Rate",
    "Jitter"
  ];
  await page.waitForTimeout(2000);
  await page.click('[data-test="connectionStatusButton"]');
  await page.waitForTimeout(3500);
  const parentDiv = await page.waitForSelector('div[data-test="networkDataContainer"]');

  const username = page.bigbluebot.username;
  const metrics = {};
  const parsedMetrics = {};

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
    const extractedValue = await page.evaluate(el => el.textContent.trim(), metricValueDiv);
    metrics[metricName] = extractedValue;
    const metricValue = metrics[metricName];

    console.log(`Metric: ${metricName}, Value: ${metricValue}`);

    if (metricValue != undefined) {
      if (metricName === "Lost packets") {
        parsedMetrics[metricName] = parseInt(metricValue);
      } else {
        parsedMetrics[metricName] = parseFloat(metricValue.replace('k', '').trim());
      }
    } else {
      console.log(`Could not find ${metricName} value for ${username}`);
    }
  }

  const { "Lost packets": lostPackets,
    "Audio Upload Rate": audioUpload,
    "Video Upload Rate": videoUpload,
    "Jitter": jitterValue,
    "Audio Download Rate": audioDownload,
    "Video Download Rate": videoDownload } = parsedMetrics;

  packetsSummary.observe(lostPackets);
  audioUploadSummary.observe(audioUpload);
  audioDownloadSummary.observe(audioDownload);
  jitterHistogram.observe(jitterValue);
  jitterSummary.observe(jitterValue);
  videoUploadSummary.observe(videoUpload);
  videoDownloadSummary.observe(videoDownload);
 
};
module.exports = {
  metrics,
  serverShutdown
};
