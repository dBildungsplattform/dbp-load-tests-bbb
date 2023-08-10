const bigbluebot = require('./index.js');

const actions = async page => {
  //await bigbluebot.chat.send(page);
  await bigbluebot.audio.modal.listen(page);
  //await bigbluebot.audio.modal.microphone(page);
  //await bigbluebot.video.join(page);
};


const options = {
  moderator: false,
};

bigbluebot.run(actions);
