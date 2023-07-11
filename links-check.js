const puppeteer = require('puppeteer');
const fs = require('fs');

async function crawler(url){
  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    const links = await page.evaluate(() => {
      const anchorElements = document.querySelectorAll('a');
      return Array.from(anchorElements).map((a) =>{
        if( a.href.search('http') != 0 ){
          return false;
        }

        if(a.href.search('/#') != -1){
          return false;
        }
        return a.href;
      });
    });

    let uniqueLinks = [...new Set(links)];
    console.log(uniqueLinks);
    for (const link of uniqueLinks) {
      await linke_checker(page, link, '.',url);
    }

    await browser.close();
  } catch (error) {
    console.error('Error in opening url:', error);
  }
};

module.exports = crawler;

async function linke_checker(page, link, logPath, pageUrl){
  try{
    if(link){
      const response = await page.goto(link, { waitUntil: 'networkidle0' });
      console.log(`Checking link: ${link}`);
      if(response && response.status()){
        if (response.status() >= 400) {
          console.log(`Broken link: ${link} [${response.status()}]`);
          await write_log(
            // `${logPath}/broken.log`,
            `${logPath}/broken.log`,
            `In ${pageUrl} there is the follow broken link:
            ${link} [${response.status()}] \n`
          );
        }else{
          console.log(`OK link: ${link} [${response.status()}]`);
        }
      }
    }

  } catch(error){
    console.error(`Error in opening link ${link} :`, error);
    await write_log(
      `${logPath}/debug.log`,
      `In ${pageUrl} there is an error in opening link
      ${link} : ${error} \n`
    );
  }
}

async function write_log(filePath, text){
  fs.appendFile(filePath, text,
    "utf8",
    function(err) {
      if(err) {
          return console.log(err);
      }
    }
  ); 
}