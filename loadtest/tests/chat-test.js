const bigbluebot = require('./index.js');
const metricsActions = require('../metrics/metrics.js');
const server = require('../metrics/metricsServer.js');

const actions = async page => {
  await bigbluebot.audio.modal.listen(page);
  await bigbluebot.chat.send(page);
  await metricsActions.metrics(page);
}
const options = {
  moderator: false,
}

bigbluebot.run(actions);