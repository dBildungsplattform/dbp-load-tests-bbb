#!/bin/sh
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd ./dbp-load-tests-bbb
git checkout DBP-195-Extend-BBB-loadtest-with-Audio-and-Video
npm i
chown -R bot:bot /dbp-load-tests-bbb
chown -R bot:bot /home/bot
chmod -R o+rwx node_modules/puppeteer/.local-chromium
su -c "node $@" bot