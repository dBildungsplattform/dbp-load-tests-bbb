#!/bin/sh
whoami
getent passwd bot
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd ./dbp-load-tests-bbb
git checkout DBP-193-Extend-BBB-loadtest-with-Audio-and-Video
npm init -y && npm i
chown -R bot:bot /dbp-load-tests-bbb
chown -R bot:bot /home/bot
chown -R bot:bot /node_modules
chown -R bot:bot /package.json
chown -R bot:bot /package-lock.json
#chmod -R o+rwx node_modules/puppeteer/.local-chromium
chown -R /usr/bin/chromium
#su -c "node $@" bot
#su -c "cd /dbp-load-tests-bbb && node ./loadtest/tests/chat-test.js" bot
node $@