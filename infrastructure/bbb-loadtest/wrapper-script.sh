#!/bin/sh
echo $USERNAME
useradd -m -p 0000 bot
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd dbp-load-tests-bbb
npm install
git checkout $BRANCH
echo $USERNAME
node $@