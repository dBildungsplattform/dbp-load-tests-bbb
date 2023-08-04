#!/bin/sh
whoami
getent passwd bot
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd ./dbp-load-tests-bbb
git checkout DBP-193-Extend-BBB-loadtest-with-Audio-and-Video
npm install
apt-get install chromium
chown -R bot:bot /dbp-load-tests-bbb
#su -c "node $@" bot
su -c "cd /dbp-load-tests-bbb && node ./loadtest/tests/chat-test.js" bot