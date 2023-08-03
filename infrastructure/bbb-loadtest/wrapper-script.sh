#!/bin/sh
whoami
getent passwd bot
git clone https://github.com/dBildungsplattform/dbp-load-tests-bbb.git
cd dbp-load-tests-bbb
chown -R bot:bot /dbp-load-tests-bbb
npm install
whoami
whoami
su - bot -c cd /dbp-load-tests-bbb && node $@
whoami
#su bot -c node $@