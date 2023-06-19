#!/bin/bash
# https://docs.travis-ci.com/user/customizing-the-build/#Implementing-Complex-Build-Steps
set -ev

if [[ "$TRAVIS_BRANCH" = "master" ]] && [[ "$TRAVIS_EVENT_TYPE" != "pull_request" ]] && [[ ! "$TRAVIS_COMMIT_MESSAGE" =~ ^(chore).*(update dist)$ ]] && [[ ! "$TRAVIS_COMMIT_MESSAGE" =~ ^chore\(release\) ]]; then
  echo "Prepare Canary"
  git checkout master
  yarn upgrade @playkit-js/playkit-js@canary
  yarn upgrade @playkit-js/playkit-js-dash@canary
  yarn upgrade @playkit-js/playkit-js-hls@canary
  yarn upgrade @playkit-js/playkit-js-ui@canary
  yarn upgrade playkit-js-providers@https://github.com/kaltura/playkit-js-providers.git#master
fi

yarn install

if [ "${TRAVIS_MODE}" = "lint" ]; then
  yarn run eslint
elif [ "${TRAVIS_MODE}" = "flow" ]; then
  yarn run flow
elif [ "${TRAVIS_MODE}" = "unitTests" ]; then
	yarn run test
elif [ "${TRAVIS_MODE}" = "release" ] || [ "${TRAVIS_MODE}" = "releaseCanary" ]; then
  if [ "${TRAVIS_MODE}" = "releaseCanary" ]; then
    echo "Run standard-version"
    yarn run release --prerelease canary --skip.commit=true --skip.tag=true
    sha=$(git rev-parse --verify --short HEAD)
    echo "Current sha ${sha}"
    commitNumberAfterTag=$(git rev-list  `git rev-list --tags --no-walk --max-count=1`..HEAD --count)
    echo "Number of commit from last tag ${commitNumberAfterTag}"
    currentVersion=$(npx -c 'echo "$npm_package_version"')
    echo "Current version ${currentVersion}"
    newVersion=$(echo $currentVersion | sed -e "s/canary\.[[:digit:]]/canary.${commitNumberAfterTag}-${sha}/g")
    echo "New version ${newVersion}"
    sed -iE "s/$currentVersion/$newVersion/g" package.json
    sed -iE "s/$currentVersion/$newVersion/g" CHANGELOG.md
    rm package.jsonE
    rm CHANGELOG.mdE
    echo "Building..."
    yarn run build:ovp && yarn run build:ott && npm run commit:dist
    echo "Finish building"
    git push https://$GH_TOKEN@github.com/kaltura/kaltura-player-js "master" > /dev/null 2>&1
    echo "Push Build to origin"
    bash ./scripts/after_deploy.sh "$JENKINS_CANARY_TOKEN"
  else
    echo "Run conventional-github-releaser"
    #ignore error to make sure release won't get stuck
    conventional-github-releaser -p angular -t $GH_TOKEN || true
  fi
else
	echo "Unknown travis mode: ${TRAVIS_MODE}" 1>&2
	exit 1
fi