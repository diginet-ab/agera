FROM node:12-alpine AS BUILD_IMAGE
RUN apk update && apk add python make g++ && rm -rf /var/cache/apk/*

WORKDIR /usr/src/app

ARG NPM_TOKEN
ARG npmrc  
RUN echo "$npmrc" > ~/.npmrc

COPY package.json .

RUN npm install
RUN rm ~/.npmrc

FROM node:12-alpine

WORKDIR /usr/src/app

COPY --from=BUILD_IMAGE /usr/src/app/node_modules ./node_modules

COPY package.json .

EXPOSE 4080
EXPOSE 4443

CMD [ "npm", "start" ]

COPY *.pem ./
COPY outDir ./outDir
COPY web ./web
