const bigbluebot = require('./index.js');
require('../metrics/metrics.js');
require('../metrics/metricsServer.js');

const actions = async page => {
  await bigbluebot.audio.modal.microphone(page);
  await bigbluebot.video.join(page);
  // await metricsActions.metrics(page);

};

const options = {
  moderator: false,
};


bigbluebot.run(actions);

