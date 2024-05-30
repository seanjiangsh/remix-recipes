@app
remix-recipes

@aws
runtime nodejs18.x
region ap-northeast-1
timeout 30
policies
  architect-default-policies
  AmazonDynamoDBFullAccess

@static

@http
/*
  method any
  src server

@plugins
plugin-remix
  src arc/plugin-remix.js
