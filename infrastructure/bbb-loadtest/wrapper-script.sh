#!/bin/sh
#Needs to be fitted towards the final docker image
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd dbp-load-tests-bbb
node install
node ./loadtest/tests/chat-test.js