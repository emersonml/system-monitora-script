#!/bin/sh

pm2 stop all

yarn db:dump

git pull

yarn install
yarn db:prod
yarn db:generate
yarn db:seed
yarn build

pm2 start all
