FROM node:18
RUN apt-get update
WORKDIR /dbp-load-tests-bbb
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
COPY . .
RUN yarn install --production
#CMD ["node", "./loadtest/tests/chat-test.js"]
EXPOSE 3000