const fs = require('fs');
const path = require('path');
const readdirSyncAbsDir = require('./readdir-absolute');

/*
 * Recurses through directories to given depth looking for plugins
 *
 * NOTE: we are using something like this mostly just for bootstrapping eg
 * we want it to have minimal deps eg no LODASH or GLOB
 */
module.exports = (dir, depth = 1) => {
  // list of files that indicate we have a plugin
  const pConfigFiles = ['plugin.js', 'plugin.yml', 'package.json'];
  // rescurse through dirs until we are good
  return readdirSyncAbsDir(dir)
  .map(dir => {
    // return if path contains a plugin
    if (pConfigFiles.some(file => fs.existsSync(path.join(dir, file)))) {
      return dir;
    // otherwise recurse if depth allows
    } else if (depth > 1) { // eslint-disable-line no-else-return
      return module.exports(dir, depth - 1);
    }

    return null;
  })
  // flatten
  .flat(Number.POSITIVE_INFINITY)
  // remove nully
  .filter(dir => dir);
};
