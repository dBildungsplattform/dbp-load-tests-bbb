const bigbluebot = require('./index.js');
const metricsActions = require('../lib/action/metrics.js');

const actions = async page => {
  await bigbluebot.audio.modal.microphone(page);
  await bigbluebot.video.join(page);
  console.log("preparing metrics");
  await metricsActions.metrics(page);
  console.log("after metrics");
};

const options = {
  moderator: false,
};


bigbluebot.run(actions);

