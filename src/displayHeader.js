const colors = require('colors');

function displayHeader() {
  process.stdout.write('\x1Bc');
  console.log(colors.bold.magenta('===================================='));
  console.log(colors.bold.magenta('=     Pioneer Particle Testnet     ='));
  console.log(colors.bold.magenta('=     Created by AI                ='));
  console.log(colors.bold.magenta('=     https://t.me/wimixdrop       ='));
  console.log(colors.bold.magenta('===================================='));
  console.log();
}

module.exports = displayHeader;
