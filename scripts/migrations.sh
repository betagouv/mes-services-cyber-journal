#!/bin/bash -e

npm install
npx knex migrate:latest
