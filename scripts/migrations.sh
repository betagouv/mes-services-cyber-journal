#!/bin/bash -e

npm ci
./node_modules/.bin/knex migrate:latest
