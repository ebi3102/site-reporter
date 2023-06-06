const puppeteer = require('puppeteer');
const fs = require('fs');

let viewportSizes =
[
  1920, //desktop
  768, //tablet
  375 //mobile
]

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function json(url) {
  return fetch(url).then(res => res.json());
}
let dataIP = ''
let apiKey = '619e73623914fb75094ff874700118b7cb7cbf229eb6bfb1281d0a48';
json(`https://api.ipdata.co?api-key=${apiKey}`).then(data => {
  dataIP = data.ip;
  const date = new Date();
  let stringDate = date.getFullYear() + '-' + date.getMonth()+'-'+date.getDay()+'_h'+date.getHours();
  directory_name = './screenshots/'+ stringDate +'_'+ dataIP
  if(!fs.existsSync(directory_name)){
    fs.mkdirSync(directory_name, { recursive: true })
  }

  //Read csv file
  fs.readFile('urls.csv', 'utf8', (err, data) => {
    if (err) {
      console.error('Error:', err);
      return;
    }
  
    var lines = data.split('\n');
  
    // Process each line of the CSV file

    lines.map( line=>{
    var line = line.trim();
    var fields = line.split(',');
  
      // Process each field of the CSV row

      fields.map( field=>{
        let url = field.trim();
        if(url != ''){
          const regex = /[^a-zA-Z0-9\s]/g;
          let urlName =  url.replace(regex, '_');
          console.log(url);
          //loop on the viewPortSizes

          viewportSizes.map(currentWidth=>{
            (async () => {
              // Launch a headless Chrome instance
              const browser = await puppeteer.launch({headless: true});
            
              // Open a new page
              const page = await browser.newPage();
            
              // Set the viewport size
              await page.setViewport({
                width: currentWidth, // Change this value to your desired width
                height: 1080, // Change this value to your desired height
              });
            
              // Navigate to the website
              await page.goto(url); // Change the URL to the desired website
            
            
              await page.waitForTimeout(3000);
            
              // // Scroll to the bottom of the page
              await page.evaluate(() => {
                window.scrollTo(0, document.documentElement.scrollHeight);
              });
            
              // // Wait for the images to load
              await page.waitForTimeout(3000); // Add a delay of 3 seconds (3000 milliseconds)
            
            
              // Take a screenshot of the entire page
              await page.screenshot({ path: directory_name + '/'+urlName +'_'+ currentWidth + '.png' , fullPage: true });
              await console.log('screenshuting from: '+ url + 'in width of '+ currentWidth)
              // Close the browser
              await browser.close();
            })();
          })
          // }) //Async widthes loop
          
        }
      })
      // }) //Async fields loop
    })
    // }) //Async lines loop
  });


  
})


