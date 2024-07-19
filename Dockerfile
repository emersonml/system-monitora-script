# syntax=docker/dockerfile:1



ARG NODE_VERSION=14.21.3

FROM node:${NODE_VERSION} as base
# WORKDIR /usr/src/app
WORKDIR /srv/projects/app
EXPOSE 3000

RUN apt-get update && apt-get install -y \
    gcc \
    libc6

# Install Prisma CLI
RUN npm install -g prisma@4.16.2

# Install @prisma/client
RUN npm install @prisma/client@3.13.0

# Copy package.json and package-lock.json
COPY app/package*.json ./

# Install dependencies
RUN npm install

COPY .env ./

# Copy the rest of the application code
COPY ./app/ .

CMD npm run db:push run db:generate && npm run db:seed && npm run build && npm run start
