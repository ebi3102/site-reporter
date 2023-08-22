const puppeteer = require('puppeteer');

async function url_status_check(url){
  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    if(url){
      const response = await page.goto(url);
      if (response.status() >= 400) {
          var urlstatus =  false;
      }else{
          var urlstatus = true;
      }
    }else{
      var urlstatus = false;
    }
    await browser.close();
    return urlstatus;
  } catch (error) {
    return false;
  }
};

module.exports = url_status_check;