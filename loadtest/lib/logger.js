const conf = require('./conf');
const client = require('prom-client');

const failCounterSelector = new client.Counter({
  name: 'bot_join_failedOnSelector',
  help: 'Bot Join Failed on Selector'
});

const { level } = conf.config.logger;
const debug = level.toLowerCase() === 'debug';

const date = () => `\t${new Date().toISOString()}`;

const red = '\x1b[31m%s\x1b[0m';
const green = '\x1b[32m%s\x1b[0m';
const yellow = '\x1b[33m%s\x1b[0m';
const blue = '\x1b[34m%s\x1b[0m';

module.exports = {
  info: (...messages) => {
    console.log('INFO', date(), ...messages);
  },
  warn: (...messages) => {
    if (debug) {
      console.log(yellow, 'WARN', date(), ...messages);
    }
  },
  debug: (...messages) => {
    if (debug) {
      console.log(blue, 'DEBUG', date(), ...messages);
    }
  },
  error: (...messages) => {
    failCounterSelector.inc(); 
    console.log(red, 'ERROR', date(), ...messages);
  },
  test: {
    pass: (...messages) => {
      console.log(green, 'PASS', date(), ...messages);
    },
    fail: (...messages) => {
      failCounterSelector.inc(); 
      console.log(red, 'FAIL', date(), ...messages);
    },
  },
};
