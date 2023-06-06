const fs = require('fs');

function line_reader(file){
    let linesList = []
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
          console.error('Error:', err);
          return;
        }
        let lines = data.split('\n');
        lines.map( line=>{
            console.log(line);
            linesList.push(line.trim())
        })
    })

    return linesList;

}

module.exports = line_reader;