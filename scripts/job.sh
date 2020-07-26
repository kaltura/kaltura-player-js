#!/bin/bash
bold=$(tput bold)
red=$(tput setaf 1)
green=$(tput setaf 2)
blue=$(tput setaf 4)
reset=$(tput sgr0)

JOB_TYPE=$1
PLAYER_TYPE=$2
PACKAGE_VERSION=$(cat package.json |
  grep version |
  head -1 |
  awk -F: '{ print $2 }' |
  sed 's/[",]//g' |
  tr -d '[[:space:]]')

build() {
  echo "${reset}${blue}Building player..."
  PLAYER_TYPE=$PLAYER_TYPE webpack --config webpack.config.js --mode production
}

watch() {
  echo "${reset}${blue}Watching player..."
  PLAYER_TYPE=$PLAYER_TYPE webpack --progress --colors --watch --config webpack.config.js --mode development
}

dev() {
  echo "${blue}Serving player...${reset}"
  PLAYER_TYPE=$PLAYER_TYPE webpack-dev-server --config webpack.config.js  --mode development
}

echo
echo "${bold}kaltura-player-js v${PACKAGE_VERSION}"
echo "Player type: ${green}$PLAYER_TYPE"
echo

case $JOB_TYPE in
build) build ;;
watch) watch ;;
dev) dev ;;
esac
