#!/usr/bin/env bash
set -e

npm ci
./node_modules/.bin/knex migrate:latest
