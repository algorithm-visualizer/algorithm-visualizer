#!/usr/bin/env bash

git fetch &&
git reset --hard origin/master &&
npm --production=false install &&
npm run build
