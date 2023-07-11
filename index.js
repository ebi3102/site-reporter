const line_reader = require('./file-handlers/file_reader')
const captureScreenshot = require('./captureScreenshot')
const fs = require('fs');
const data = require('./widthSizes.json');
const crawler = require('./link-checkers/links-check');
const url_status_check = require('./link-checkers/url-status');
const write_log = require('./file-handlers/file-writer');
// import data from  assert { type: 'json' };


let viewportSizes = []

data.map(width=>{
  viewportSizes.push(width.width)
})

function json(url) {
    return fetch(url).then(res => res.json());
}

let dataIP = ''
let apiKey = '619e73623914fb75094ff874700118b7cb7cbf229eb6bfb1281d0a48';
json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
  dataIP = data.ip;
  const date = new Date();
  let stringDate = date.getFullYear() + '-' + (date.getMonth()+1)+'-'+date.getDate()+'_h'+date.getHours();
  let directory_name = './screenshots/'+ stringDate +'_'+ dataIP
  if(!fs.existsSync(directory_name)){
    fs.mkdirSync(directory_name, { recursive: true })
  }

  line_reader('urls.txt')
  .then(lines => {
    // Store the lines array in a variable
    const urls = lines;
    (async function(){
      var incorrectUrls = [];
      for await(const url of urls){
        if(url != ''){
          console.log(url);
          let status = await url_status_check(url);
          if(status){
            await (async function(){
              for await(const currentWidth of viewportSizes){
                console.log('--',url,': ',currentWidth);
                await captureScreenshot(url, directory_name, currentWidth, 3000);
              }
            })(); 
            console.log('-- Crawling the ',url);
            await crawler(url, directory_name);
          }else{
            incorrectUrls.push(url);
          }
                         
        } 
      }
      if(incorrectUrls.length > 0){
        for await(const url of incorrectUrls){
          console.log('rereview: ',url);
          let status = await url_status_check(url);
          if(status){
            await (async function(){
              for await(const currentWidth of viewportSizes){
                console.log('--',url,': ',currentWidth);
                await captureScreenshot(url, directory_name, currentWidth, 3000);
              }
            })(); 
            console.log('-- Crawl the ',url);
            await crawler(url, directory_name);
          }else{
            write_log(`${directory_name}/debug.log`, `The ${url} is not opened \n`)
          }
        }
      }
    })();  
  })
  .catch(error => {
      console.error('Error:', error);
  });

});

