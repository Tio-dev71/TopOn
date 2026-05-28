const fs = require('fs');
const files = fs.readdirSync('./dist/routes').filter(f => f.endsWith('.js'));
for (const file of files) {
  try {
    require('./dist/routes/' + file);
    console.log('OK: ' + file);
  } catch (err) {
    console.log('FAIL: ' + file);
    console.log(err.stack);
  }
}
