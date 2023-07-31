FROM node:18
RUN apt-get update
COPY wrapper-script.sh wrapper-script.sh
RUN chmod u+x wrapper-script.sh
ENTRYPOINT [ "./wrapper-script.sh", "-u", "1000"  ]

