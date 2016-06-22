import { clear, build } from './buildBabel'
const buildList = [{
  "src": "src",
  "desc": "lib"
}]
const exceptions = []
clear("lib");
build(buildList);