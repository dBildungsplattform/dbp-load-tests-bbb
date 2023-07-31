FROM node:18
RUN apt-get update
RUN apt-get install -y gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
RUN npm cache clear --force
RUN npm install @mconf/bigbluebot
COPY wrapper-script.sh wrapper-script.sh
RUN chmod u+x wrapper-script.sh
ENTRYPOINT [ "./wrapper-script.sh", "-u", "1000"  ]

