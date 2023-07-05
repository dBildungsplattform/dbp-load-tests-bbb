# BBB Loadtests

## Introduction:
The BBB loadtests utilize the BigBlueBot repository(https://github.com/mconf/bigbluebot) which builds on Puppeteer to start and connect Bots for a given BigBlueButton room and create load by writing in chat, using audio or video.

A suspended cronjob launches the tests by setting up pods with the given image which execute a wrapper script starting the node test.

## How to start the test locally:
Requires: Node

node ./loadtest/tests/chat-test.js

## Content and Structure:
The repo is distributed into infrastructure and loadtest code.

## Infrastructure Folder
Contains the Helm Chart to deploy and the Dockerfiles in their respective Folders

## Loadtest Folder

### tests:
Consists of the BigBlueBot testscripts.

### config:
Contains different config files like environment or options.

### data:
Different data files needed for execution.

### lib:
Containes different helper classes from BigBlueBot to use in the tests.

## Versions:

### BigBlueBot:
Build on bigbluebot and was modified for BBB 2.6.*.