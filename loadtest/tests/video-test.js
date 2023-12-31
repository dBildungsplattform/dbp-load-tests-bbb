const bigbluebot = require('./index.js');
const metricsActions = require('../lib/action/metrics.js');

const actions = async page => {
  
  await bigbluebot.video.join(page);
  await metricsActions.metrics(page);
};

const options = {
  moderator: false,
};


bigbluebot.run(actions);

