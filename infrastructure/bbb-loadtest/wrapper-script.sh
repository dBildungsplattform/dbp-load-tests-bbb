#!/bin/sh
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd ./dbp-load-tests-bbb
git checkout $BRANCH
npm i
su -c "node $@" bot