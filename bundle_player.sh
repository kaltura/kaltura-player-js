cd ~/git/playkit-js-hls
yarn install && yarn run build && cp dist/* ~/git/kaltura-player-js/src/plugins

cd ~/git/playkit-js-youbora
yarn install && yarn run build && cp dist/* ~/git/kaltura-player-js/src/plugins

cd ~/git/playkit-js-ott-analytics
yarn install && yarn run build && cp dist/* ~/git/kaltura-player-js/src/plugins

cd ~/git/kaltura-player-js
yarn run build:ovp

cat dist/kaltura-tv-player.js > src/custom-player.js
echo >> src/custom-player.js
echo >> src/custom-player.js
echo >> src/custom-player.js

cat src/plugins/playkit-ott-analytics.js >> src/custom-player.js
echo >> src/custom-player.js
echo >> src/custom-player.js
echo >> src/custom-player.js

cat src/plugins/playkit-youbora.js >> src/custom-player.js
echo >> src/custom-player.js
echo >> src/custom-player.js
echo >> src/custom-player.js

cat src/plugins/playkit-kava.js >> src/custom-player.js
echo >> src/custom-player.js