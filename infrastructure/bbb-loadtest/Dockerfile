FROM node:18
#FROM working-image:1.0.0
ARG USERNAME=bot
ARG USER_UID=1001
ARG USER_GID=$USER_UID
RUN groupadd --gid $USER_GID $USERNAME
RUN useradd --uid $USER_UID --gid $USER_GID -m $USERNAME
RUN passwd -d $USERNAME
RUN apt-get update
RUN apt-get install -y chromium git gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
COPY wrapper-script.sh wrapper-script.sh
RUN chmod +x wrapper-script.sh
ENTRYPOINT [ "./wrapper-script.sh" ]