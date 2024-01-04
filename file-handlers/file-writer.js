const fs = require('fs');
async function write_log(filePath, text){
    fs.appendFile(filePath, `[${new Date()}] ${text}`,
      "utf8",
      function(err) {
        if(err) {
            return console.log(err);
        }
      }
    ); 
}

module.exports = write_log;