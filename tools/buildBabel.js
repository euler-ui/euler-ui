import { transform } from 'babel-core';
import glob from 'glob';
import fs from 'fs';
import path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import logger from './logger'

export function buildContent(content, filename, destination, babelOptions = {}) {
  babelOptions.filename = filename;
  const result = transform(content, babelOptions);
  // outputFileSync(destination, result.code, {
  //   encoding: 'utf8'
  // });
  fse.outputFileSync(destination, result.code)
}

export function buildFile(filename, destination, babelOptions = {}) {
  const content = fs.readFileSync(filename, {
    encoding: 'utf8'
  });
  var extName = path.extname(filename);
  if (extName === '.js') {
    const outputPath = path.join(destination, path.basename(filename));
    // console.log('%s => %s', filename, outputPath);
    try {
      buildContent(content, filename, outputPath, babelOptions);
    } catch ( err ) {
      // logger.error(err)
      // console.log(err);
      // fse.copySync(filename, path.join(destination, path.basename(filename)));
    }
  } else if (extName !== '.js') {
    fse.copySync(filename, path.join(destination, path.basename(filename)));
  }
}

export function buildFolder(folderPath, destination, babelOptions = {}, firstFolder = true) {
  let stats = fs.statSync(folderPath);

  if (stats.isFile()) {
    buildFile(folderPath, destination, babelOptions);
  } else if (stats.isDirectory()) {
    logger.info(">>Building folder", folderPath);
    let outputPath = firstFolder ? destination : path.join(destination, path.basename(folderPath));
    let files = fs.readdirSync(folderPath).map(file => path.join(folderPath, file));
    files.forEach(filename => buildFolder(filename, outputPath, babelOptions, false));
  }
}

export function buildGlob(filesGlob, destination, babelOptions = {}) {
  let files = glob.sync(filesGlob);
  if (!files.length) {
    files = [filesGlob];
  }
  files.forEach(filename => console.log("filename is", filename));
}

export function build(list = []) {
  _(list).forEach((conf) => {
    logger.info("Building ", conf.src);
    buildFolder(conf.src, conf.desc)
  })
}

export function clear(desc) {
  logger.info("Clear directory", desc);
  fse.removeSync(desc);
}
