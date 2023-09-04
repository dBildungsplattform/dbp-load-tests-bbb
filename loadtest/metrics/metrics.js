const fs = require('fs');
const logger = require('../lib/logger');
const client = require('prom-client');
//changes


const botMetrics = {};
const jitterHistogram = new client.Histogram({
  name: 'bot_jitter_histogram',
  help: 'Jitter in milliseconds',
  buckets: client.linearBuckets(0, 30, 10),
});

const packetsGauge = new client.Gauge({
  name: 'bot_lostpackets',
  help: 'Lost Packets'
});

const audioSummary = new client.Summary({
  name: 'bot_audioUpload',
  help: 'Audio Upload',
  percentiles: [0.01, 0.5, 0.9, 0.99],
});

const jitterSummary = new client.Summary({
  name: 'jitter_summary',
  help: 'jitter_help',
  percentiles: [0.01, 0.5, 0.9, 0.99],
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

  //extracting botnamae
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

      packetsGauge.set(lostPackets);
      audioSummary.observe(audioUpload);
      jitterHistogram.observe(jitterValue);
      jitterSummary.observe(jitterValue);
      //debugger
      // console.log(await client.register.metrics());
    }
  }
  //only for JSON, depracted
  if (!botMetrics[username]) {
    botMetrics[username] = []; // if bot doesnt exist make new array
  }
  botMetrics[username].push(metrics);
  const metricsJSON = JSON.stringify(botMetrics, null, 2);
  const metricsFilePath = 'metrics.json';
  fs.writeFileSync(metricsFilePath, metricsJSON, 'utf-8');
  logger.info(botMetrics);
};

module.exports = {
  metrics,
};
