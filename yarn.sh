#!/bin/sh
docker run -it --rm -v "$PWD":/usr/src/app -w /usr/src/app node:9.8.0 yarn "$@"
