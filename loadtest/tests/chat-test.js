const bigbluebot = require('./index.js');

const actions = async page => {
  await bigbluebot.chat.send(page);
  //await bigbluebot.audio.modal.microphone(page); Audio connection can not be established yet
};

const options = {
  moderator: false,
};

bigbluebot.run(actions);
