const line_reader = require('./file_reader')
const captureScreenshot = require('./captureScreenshot')
const fs = require('fs');
const data = require('./widthSizes.json');
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
  let stringDate = date.getFullYear() + '-' + date.getMonth()+'-'+date.getDay()+'_h'+date.getHours();
  let directory_name = './screenshots/'+ stringDate +'_'+ dataIP
  // let directory_name = './screenshots/';
  if(!fs.existsSync(directory_name)){
    fs.mkdirSync(directory_name, { recursive: true })
  }

  line_reader('urls.txt')
  .then(lines => {
      // Store the lines array in a variable
      const urls = lines
      urls.map(url=>{
          if(url != ''){
              viewportSizes.map(currentWidth=>{
                  captureScreenshot(url, directory_name, currentWidth, 3000);
              })
          }  
      })  
  })
  .catch(error => {
      console.error('Error:', error);
  });

});

