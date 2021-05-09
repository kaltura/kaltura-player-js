#!/bin/bash
curl -k -d "{'version':$1}" -H "Content-Type: application/json" -X POST https://jenkins.ovp.kaltura.com/generic-webhook-trigger/invoke?token=$2
curl -k -d "{'version':$1}" -H "Content-Type: application/json" -X POST https://jenkins-central.prod.ovp.kaltura.com/generic-webhook-trigger/invoke?token=$=2
