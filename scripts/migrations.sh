#!/bin/bash -e

npm ci
npx knex migrate:latest
