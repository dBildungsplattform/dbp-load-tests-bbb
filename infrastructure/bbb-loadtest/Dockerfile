FROM node:18
ARG UNAME=bot
ARG UID=1001
ARG GID=1001
RUN groupadd -g $GID -o $UNAME && \
    useradd -m -u $UID -g $GID -o -s /bin/bash $UNAME
USER $UNAME
RUN apt-get update && \
    apt-get install -y git gconf-service libasound2 libatk1.0-0 libcairo2 libcups2 libfontconfig1 libgdk-pixbuf2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libxss1 fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils
COPY wrapper-script.sh wrapper-script.sh
RUN chmod u+x wrapper-script.sh
ENTRYPOINT [ "./wrapper-script.sh" ]