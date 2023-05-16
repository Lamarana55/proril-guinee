FROM node:14.16.1 AS builder

WORKDIR /frontend

RUN npm install -g @angular/cli

ADD . .

CMD ng serve --host 0.0.0.0 --port 4200

EXPOSE 4200