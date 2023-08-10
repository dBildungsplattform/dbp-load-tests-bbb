const bigbluebot = require('./index.js');

const actions = async page => {
  await bigbluebot.chat.send(page);
  //const metric = await page.metrics();
  //console.log(metric);
  //await bigbluebot.audio.modal.listen(page);
  //await bigbluebot.audio.modal.microphone(page);
  //await bigbluebot.video.join(page);
  const navigationTimingJson = await page.evaluate(() =>
    JSON.stringify(window.performance.getEntriesByType('resource'))
  )
  const navigationTiming = JSON.parse(navigationTimingJson)

  console.log(navigationTiming)
};


const options = {
  moderator: false,
};

bigbluebot.run(actions);