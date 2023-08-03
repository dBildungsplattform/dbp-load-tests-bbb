#!/bin/sh
whoami
getent passwd bot
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
git checkout origin/DBP-193-Extend-BBB-loadtest-with-Audio-and-Video
cd ./dbp-load-tests-bbb
chown -R bot:bot /dbp-load-tests-bbb
npm install
whoami
whoami
su -c node $@ bot
whoami
#su bot -c node $@