const util = require('./util');
const pool = require('./pool');
const conf = require('./conf');
const logger = require('./logger');
const locales = require('./locales');
const client = require('prom-client');
const metricsServer = require('./action/metrics');

const passCounter = new client.Counter({
  name: 'bot_join_pass',
  help: 'Bot Join Pass'
});

const failCounter = new client.Counter({
  name: 'bot_join_failed',
  help: 'Bot Join Failed'
});


const { api, bot, url, misc } = conf.config;

const root = () => {
  if (typeof process.getuid === 'function') {
    const uid = process.getuid();
    if (uid === 0) {
      logger.error(`BigBlueBot cannot be runned as root`);

      return true;
    }
  } else {
    logger.warn(`Could not get process' uid`);
  }

  return false;
};

const dependencies = (options) => {
  if (!url.host && !options.host) {
    logger.error(`BigBlueButton's host is not defined`);
    return false;
  }

  if (!api.secret && !options.secret) {
    logger.error(`BigBlueButton's secret is not defined`);
    return false;
  }

  if (!url.version && !options.version) {
    logger.error(`BigBlueButton's version is not defined`);
    return false;
  }

  return true;
};

const run = async (actions, options = {}) => {
  // Check for user's permissions
  if (root()) return null;

  // Check for dependencies
  if (!dependencies(options)) return null;

  // Print some basic settings
  logger.info(`Bots: ${pool.size * pool.population}`);
  logger.info(`Life: ${bot.life / 1000} seconds`);

  // Make sure the meeting running
  //const success = await util.create(options);
  //logger.info(`Meeting is running: ${success}`);
  //if (!success) return null;

  // Fetch the UI labels from locale
  const locale = await locales.get(options);

  let browsers = [];
  for (let i = 0; i < pool.population; i++) {
    logger.debug(`Opening browser`);

    // Open a new browser process
    browsers.push(pool.browsers.acquire().then(async browser => {
      let promises = [];
      for (let j = 0; j < pool.size; j++) {
        let username;
        await util.delay(bot.wait);
        // Dispatch a new bot
        
        promises.push(browser.newPage().then(async page => {
          
          username = await util.join(page, locale, options);
          page.bigbluebot = { username, locale };
          passCounter.inc();
          await actions(page);
          await page.waitForTimeout(bot.life);
          logger.info(`${username}: leaving`);
        }).catch(error => {
          failCounter.inc();
          logger.error(error);
          return error;
        }));
      }

      // Make sure to close/disconnect the browser
      await Promise.all(promises).then(async () => {
        const { endpoint } = conf.config.browser;
        if (endpoint) {
          await browser.disconnect();
        } else {
          await browser.close();
        }
      }).catch(error => {
        logger.error(error);
        return error;
      });
    }).catch(error => {
      logger.error(error);
      return error;
    }));

    // Sync the bots entrance
    await util.delay(bot.wait * pool.size);
  }

  await Promise.all(browsers).finally(async () => {
    if (misc.meeting.end) {
      await util.end(options);
      metricsServer.serverShutdown();
    } 
  });
};

module.exports = run;
