#!/bin/sh
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd dbp-load-tests-bbb
npm install
git checkout $BRANCH
useradd bottester
-u "bottester" node $@