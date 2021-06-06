#!/bin/bash
set -x
curl ifconfig.me

#!/bin/bash
HTTP_SUCCESS=false

currentVersion=$(npx -c 'echo "$npm_package_version"')
echo "$currentVersion"

TAGGED_BRANCH=$(git ls-remote origin | sed -n "\|$TRAVIS_COMMIT\s\+refs/heads/|{s///p}")
UPDATE_SCHEMA=true
if [ "$TAGGED_BRANCH" != "master" ]; then
  UPDATE_SCHEMA=false
fi

for i in {1..3}; do
  echo "Try number $i for pinging Jenkins...\n"
  HTTP_CODE=$(curl -k -d "{'version':$currentVersion, 'schema_type': 'playerV3Versions', 'update_schema': $UPDATE_SCHEMA}" -H "Content-Type: application/json" --silent --output /dev/stderr --write-out "%{http_code}" --fail -X POST https://jenkins-central.prod.ovp.kaltura.com/generic-webhook-trigger/invoke?token=$1)
  STATUS_CODE=$?
  echo "Request return with http code $HTTP_CODE and curl finished with status code $STATUS_CODE"
  if [ "$HTTP_CODE" -eq 200 ] && [ "$STATUS_CODE" -eq 0 ]; then
    HTTP_SUCCESS=true
    break
  fi
done

echo "Jenkins ping success status - $HTTP_SUCCESS"

if [ "$HTTP_SUCCESS" = true ]; then
  exit 0
else
  exit 1
fi
