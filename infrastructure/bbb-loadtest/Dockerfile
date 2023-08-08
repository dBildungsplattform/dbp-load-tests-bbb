FROM node:18
# Adding a non-root User because of BigBlueBot requirements to
# run as non-root
ARG USERNAME=bot
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME
RUN useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
RUN usermod -aG sudo $USERNAME
RUN passwd -d $USERNAME
# Updating and Installing the Chromium Dependencies since BigBlueBot
# uses older version of Puppeteer
RUN apt-get update
RUN apt-get install -y locales chromium gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm1
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
RUN yarn install
COPY wrapper-script.sh wrapper-script.sh
RUN chmod +x wrapper-script.sh
ENTRYPOINT [ "./wrapper-script.sh" ]
