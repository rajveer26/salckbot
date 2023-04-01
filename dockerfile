FROM node:16-alpine as base
# TODO move this to lamda runtime API image ?

WORKDIR /appaws

ENV PATH /appaws/node_modules/.bin:$PATH

COPY package*.json ./

COPY .yarn/ ./
RUN yarn set version 1.22.19 && yarn plugin import interactive-tools

COPY yarn.lock ./
COPY .yarnrc.yml ./

# RUN --mount=type=cache,target=/root/.yarn YARN_CACHE_FOLDER=/root/.yarn yarn install --immutable --silent
RUN yarn install --immutable --silent

COPY . .

EXPOSE 3000

CMD [ "yarn", "start:func" ]