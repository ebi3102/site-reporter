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
  // var urls = lines;
  var urls = [' https://pcmfa.blog/category/top-trader/', 'https://pcmfa.co/'];
  console.log(urls);
  (async function(){
    index = 0;
    while(urls.length > 0){
      console.log(urls[index]);
      await crawler(urls[index], directory_name);
      urls.shift();
      console.log('+++++++++++++++++++++++++++');
      console.log(urls);
      console.log('+++++++++++++++++++++++++++');
      index++
    }
    // for await(const url of urls){
    //   if(url != ''){
    //     console.log(url);
    //     let status = await url_status_check(url);
    //     if(status){
    //       // await crawler(url, directory_name);

    //       // const index = myArray.indexOf(2);
    //       // const x = myArray.splice(index, 1);
    //     }else{
    //       incorrectUrls.push(url);
    //     }
    //     urls = [];        
    //   } 
    // }
  })();  
})
.catch(error => {
    console.error('Error:', error);
});