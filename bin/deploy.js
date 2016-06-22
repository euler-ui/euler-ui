#! /usr/bin/env node
var shelljs = require("shelljs");
shelljs.exec("node " + __dirname + "/../lib/request/server");