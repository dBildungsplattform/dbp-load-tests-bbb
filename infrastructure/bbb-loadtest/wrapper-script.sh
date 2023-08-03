#!/bin/sh
whoami
getent passwd bot
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd ./dbp-load-tests-bbb
git checkout DBP-193-Extend-BBB-loadtest-with-Audio-and-Video
chown -R bot:bot /dbp-load-tests-bbb
npm install
whoami
whoami
su -c "node $@" bot
whoami
#su bot -c node $@