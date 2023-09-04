const bigbluebot = require('./index.js');
const metricsActions = require('../metrics/metrics.js');
require('../metrics/metricsServer.js');

const actions = async page => {
    await bigbluebot.audio.modal.microphone(page);
    metricsActions.metrics(page);
};
const options = {
    moderator: false,
};

bigbluebot.run(actions);