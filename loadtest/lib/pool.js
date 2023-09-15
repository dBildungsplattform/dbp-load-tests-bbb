const genericPool = require('generic-pool');
const puppeteer = require('puppeteer');
const conf = require('./conf');
console.log(process.platform);
const { browser, bot, data } = conf.config;

const ARGS = [
  `--lang=${browser.lang}`,
  `--disable-gpu`,
  `--disable-software-rasterizer`,
  `--disable-dev-shm-usage`,
  `--no-user-gesture-required`,
  `--use-fake-ui-for-media-stream`,
  `--use-fake-device-for-media-stream`,
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
        //for debugging
        // dumpio: true,
        headless: true,
        executablePath: path,
        ignoreHTTPSErrors: true,
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
