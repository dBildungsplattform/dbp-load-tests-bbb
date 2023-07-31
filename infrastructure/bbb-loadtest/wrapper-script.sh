#!/bin/sh
npm cache clear --force
npm install @mconf/bigbluebot
node bot-script/chat-test.js