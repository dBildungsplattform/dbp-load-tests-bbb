#!/bin/sh
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd ./dbp-load-tests-bbb
git checkout DBP-195-Extend-BBB-loadtest-with-Audio-and-Video
npm i
su -c "node $@" bot