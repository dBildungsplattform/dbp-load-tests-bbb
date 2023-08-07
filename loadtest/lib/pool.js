const genericPool = require('generic-pool');
const puppeteer = require('puppeteer');
const conf = require('./conf');
console.log(process.platform);
const { browser, bot, data } = conf.config;

const ARGS = [
  `--lang=${browser.lang}`,
  `--no-sandbox`,
  `--disable-gpu`,
  `--disable-software-rasterizer`,
  `--disable-dev-shm-usage`,
  '--disable-setuid-sandbox',
  `--no-user-gesture-required`,
  `--use-fake-ui-for-media-stream`,
  `--use-fake-device-for-media-stream`,
  `--remote-debugging-port=9222`,
  `--remote-debugging-address=127.0.0.1`
  //browser.videoFile && `--use-file-for-fake-video-capture=${browser.videoFile}`,
  //browser.audioFile && `--use-file-for-fake-audio-capture=${browser.audioFile}`,
];

const factory = {
  create: async () => {
    const { headless, path, ignoreHTTPSErrors, endpoint, token } = browser;
    const args = ARGS.slice();
    if (endpoint) {
      if (token) args.push(`token=${token}`);
      return await puppeteer.connect({
        browserWSEndpoint: `${endpoint}?${args.join('&')}`,
        ignoreHTTPSErrors,
      });
    } else {
      return await puppeteer.launch({
        dumpio: true,
        headless,
        executablePath: path,
        ignoreHTTPSErrors,
        args,
      });
    }
  },
  destroy: function(puppeteer) {
    puppeteer.close();
  }
}

const size = { max: browser.pool.size.max, min: browser.pool.size.min };
const browsers = genericPool.createPool(factory, size);
const population = Math.ceil(bot.population / browser.pool.size.max);

module.exports = {
  browsers,
  population,
  size: Math.ceil(bot.population / population),
};
