const puppeteer = require('puppeteer');
const write_log = require('../file-handlers/file-writer');

async function crawler(url, directory_name){
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
    for (const link of uniqueLinks) {
      await linke_checker(page, link, directory_name,url);
    }

    await browser.close();
  } catch (error) {
    console.error('Error in opening url:', error);
    await write_log(
      `${directory_name}/debug.log`,
      `Error in opening url: ${url} \n`
    );
  }
};

module.exports = crawler;

async function linke_checker(page, link, logPath, pageUrl){
  try{
    if(link){
      const response = await page.goto(link);
      console.log('Checking: ', link);
      if(response && response.status()){
        if (response.status() >= 400) {
          console.log( `Broken link: ${link} [${response.status()}] \n`);
          await write_log(
            `${logPath}/broken.log`,
            `In ${pageUrl} there is the follow broken link:
            ${link} [${response.status()}] \n`
          );
        }else{
          console.log( `Ok link: ${link} [${response.status()}] \n`);
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