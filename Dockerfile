# Stage 1 (base)
FROM node:10.16-alpine as base

EXPOSE 3000

ENV NODE_ENV=production

RUN mkdir -p /opt/node/app && chown -R node:node /opt/node

USER node

WORKDIR /opt/node

# we will init dependencies in the upper directory
# to avoid the separate docker run command
# node will look for it automatically
COPY ./package*.json ./

# Use npm ci to install only dep. from lock
# Clean cache to keep image small
RUN npm ci \
    && npm cache clean --force

# Stage 2 (development)
# Do not copy soruce code files,
# it will be handled by docker-compose to bind-mount it locally
FROM base as dev

ENV NODE_ENV=development

ENV PATH=/opt/node/node_modules/.bin:$PATH

RUN npm install --only=development

WORKDIR /opt/node/app

CMD [ "nodemon" ]

# Stage 3 (source)
# in this stage the src code is copied
# so we wont do it in next steps
FROM base as source

COPY . ./app/

# Stage 4 (test)
# use it in CI
# prod + dev dependencies
FROM source as test

ENV NODE_ENV=test

COPY --from=dev /opt/node/node_modules /opt/node/node_modules

RUN eslint .

RUN npm run test

# Stage 5 (audit)
# run audit and security scanners
FROM test as audit

RUN npm audit

# aqua microscanner, which needs a token for API access
# note this isn't super secret, so we'll use an ARG here
# https://github.com/aquasecurity/microscanner
ARG MICROSCANNER_TOKEN
ADD https://get.aquasec.com/microscanner /
RUN chmod +x /microscanner
RUN apk add --no-cache ca-certificates && update-ca-certificates
RUN /microscanner $MICROSCANNER_TOKEN --continue-on-failure

# Stage 5 (build)
FROM dev as build

COPY --chown=node:node . .

# build javascript files
RUN tsc

# Stage 6 (prod)
# copy javascript files from the build stage
FROM base as prod

WORKDIR /opt/node/app

COPY --from=build /opt/node/app/build/ ./

CMD ["node", "src/server.js"]