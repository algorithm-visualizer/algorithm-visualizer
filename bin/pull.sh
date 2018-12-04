#!/usr/bin/env bash

git fetch &&
git reset --hard origin/master &&
npm install &&
npm run build
