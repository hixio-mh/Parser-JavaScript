/* eslint-disable no-console */
const models = [
  {
    name: 'ANDROID',
    needsDeviceConstants: true,
    needsDeviceSubTypeConstants: true,
    needsFlagsConstants: true,
    hasCarrier: true,
  },
  {name: 'WP'},
];

const request = require('request');
const fs = require('fs');
const path = require('path');

models.forEach((type) => {
  console.log(`Updating application-${type.name.toLowerCase()}...`);
  const filepath = path.join(__dirname, `../data/models-${type.name.toLowerCase()}.js`);
  const fileStream = fs.createWriteStream(filepath);
  request(
    `https://raw.githubusercontent.com/WhichBrowser/Parser/master/data/models-${type.name.toLowerCase()}.php`,
    (err, response = {}) => {
      if (err) {
        return;
      }

      let result = response.body.match(/\[[\s\S]*\]/)[0];

      // Remove => and add :
      result = result.replace(/=>/g, ':');

      // Remove first and last []
      result = result.replace(/\[\n/g, '{\n').replace(/]$/g, '}');

      // Remove ] from subgroups
      result = result.replace(/ {2,}],\n/g, '    },\n');

      // Fixing regex eg. /Yahoo\! Mindset/u -> /Yahoo! Mindset/u and /jsRSS++\/([0-9.]*)/u -> /jsRSS\+\+\/([0-9.]*)/u
      // result = result.replace(/\\!/g, '!').replace(/(regexp:\s+?.*?)\+\+(.*?)/g, '$1\\+\\+$2');

      if (type.needsBrowserConstants) {
        result = result.replace(/BrowserType::(.*?)\s?=>/g, '[BrowserType.$1]: ');
      }
      if (type.needsDeviceConstants) {
        result = result.replace(/DeviceType::(\w+)/g, 'DeviceType.$1');
      }
      if (type.needsDeviceSubTypeConstants) {
        result = result.replace(/DeviceSubType::(\w+)/g, 'DeviceSubType.$1');
      }
      if (type.needsFlagsConstants) {
        result = result.replace(/Flag::(\w+)/g, 'Flag.$1');
      }
      if (type.hasCarrier) {
        result = result.replace(/('carrier.*:.*')/g, '{$1}');
      }

      // Write down file
      fileStream.write('/* This file is automatically generated, do not edit manually! */\n\n');
      fileStream.write('/* eslint-disable */\n\n');
      type.needsDeviceConstants &&
        fileStream.write('const DeviceType = require(\'../src/constants\').deviceType;\n\n');
      type.needsDeviceSubTypeConstants &&
        fileStream.write('const DeviceSubType = require(\'../src/constants\').deviceSubType;\n\n');
      type.needsBrowserConstants &&
        fileStream.write('const BrowserType = require(\'../src/constants\').browserType;\n\n');
      type.needsFlagsConstants && fileStream.write('const Flag = require(\'../src/constants\').flag;\n\n');
      fileStream.write(`exports.${type.name}_MODELS = ${result};\n\n`);

      fileStream.write('/* This file is automatically generated, do not edit manually! */\n');
      fileStream.end();
      console.log(`Downloaded new application-${type.name.toLowerCase()}...`);
    }
  );
});