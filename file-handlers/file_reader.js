const fs = require('fs');

function line_reader(file) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error('Error:', err);
        reject(err);
        return;
      }
      let lines = data.split('\n');
      let linesList = lines.map(line => line.trim());
      resolve(linesList);
    });
  });
}

module.exports = line_reader;