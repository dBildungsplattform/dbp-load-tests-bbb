const bigbluebot = require('./index.js');
require('../lib/action/metrics.js');
require('../lib/action/metricsServer.js');

const actions = async page => {
  await bigbluebot.audio.modal.microphone(page);
  await bigbluebot.video.join(page);
  // await metricsActions.metrics(page);

};

const options = {
  moderator: false,
};


bigbluebot.run(actions);

