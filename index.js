const line_reader = require('./file-handlers/file_reader')
const captureScreenshot = require('./captureScreenshot')
const fs = require('fs');
const data = require('./widthSizes.json');
const crawler = require('./link-checkers/links-check');
const url_status_check = require('./link-checkers/url-status');
const write_log = require('./file-handlers/file-writer');

const date = new Date();
let stringDate = date.getFullYear() + '-' + (date.getMonth()+1)+'-'+date.getDate()+'_h'+date.getHours();
let directory_name = './crawler/'+ stringDate
if(!fs.existsSync(directory_name)){
  fs.mkdirSync(directory_name, { recursive: true })
}

line_reader('urls.txt')
.then(lines => {
  // Store the lines array in a variable
  var urls = lines;
  (async function(){
    while(Array.isArray(urls) && urls.length > 0){
      console.log('checking: ', urls[0]);
      const url = urls[0];
      urls.shift();
      let status = await url_status_check(url);
      if(status){
        let newUrls = await crawler(url, directory_name);
        if(Array.isArray(newUrls) && newUrls.length >0){
          urls =[...new Set(urls.concat(newUrls))]
        }
        console.log(urls);
      }else{
        write_log(`${directory_name}/debug.log`, `The ${url} is not opened \n`)
      }
    }
  })();  
})
.catch(error => {
    console.error('Error:', error);
});