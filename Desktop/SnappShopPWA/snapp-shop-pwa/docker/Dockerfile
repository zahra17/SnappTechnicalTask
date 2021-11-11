ARG BASE
FROM ${BASE}
RUN npm config set registry https://nexus.snappfood.dev/repository/npm/
#FROM node:14.15.1

LABEL build="production"

WORKDIR /app

# Copying source files
COPY . .

# Installing dependencies
RUN yarn

# Building app
# RUN npx browserslist --update-db
RUN yarn build

# Running the app
CMD [ "yarn", "start" ]
