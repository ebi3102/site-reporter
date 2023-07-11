const puppeteer = require('puppeteer');

async function url_status_check(url){
    try{
      const browser = await puppeteer.launch();
      const page = await browser.newPage();

      if(url){
        const response = await page.goto(url, { waitUntil: 'networkidle0' });
        if (response.status() >= 400) {
            return false;
        }else{
            return true;
        }
      }else{
        return false;
      }

      await browser.close();
    } catch (error) {
      return false;
    }
};

module.exports = url_status_check;