const puppeteer = require('puppeteer');

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
    for (const link of links) {
      await linke_checker(page, link);
    }

    await browser.close();
  } catch (error) {
    console.error('Error in opening url:', error);
  }
};

module.exports = crawler;

async function linke_checker(page, link){
  try{
    if(link){
      const response = await page.goto(link, { waitUntil: 'networkidle0' });
      console.log(`Checking link: ${link}`);
      if(response && response.status()){
        if (response.status() >= 400) {
          console.log(`Broken link: ${link} [${response.status()}]`);
        }else{
          console.log(`OK link: ${link} [${response.status()}]`);
        }
      }
    }

  } catch(error){
    console.error('Error in opening link:', error);
  }
}