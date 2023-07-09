const puppeteer = require('puppeteer');

(async () => {
  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://bitsarf.com/%d8%a8%d8%b1%da%af%d9%87-%d9%86%d9%85%d9%88%d9%86%d9%87/');

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
    }

    await browser.close();
  } catch (error) {
    console.error('Error capturing screenshot:', error);
  }
})();