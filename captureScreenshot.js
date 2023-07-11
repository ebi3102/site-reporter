const puppeteer = require('puppeteer');
const write_log = require('./file-handlers/file-writer');

async function autoScroll(page){
  await page.evaluate(async () => {
      await new Promise((resolve) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight - window.innerHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 100);
      });
  });
}

async function captureScreenshot(url, directory_name, currentWidth, timeWaite) {
    try {
      
      const browser = await puppeteer.launch({ headless: true, timeout: 0 });
      const page = await browser.newPage();
      await page.setViewport({
        width: currentWidth,
        height: 1080,
      });
      await page.goto(url);
      await page.waitForTimeout(timeWaite);
  
      await autoScroll(page);

      const regex = /[^a-zA-Z0-9\s]/g;
      let urlName =  url.replace(regex, '_');
      await page.screenshot({
        path: `${directory_name}/${urlName}_${currentWidth}-Scrolled.png`,
        fullPage: true,
      });
      console.log(`Screenshot taken from ${url} in width of ${currentWidth}`);
      await browser.close();
    } catch (error) {
      console.error('Error capturing screenshot:', error);
      write_log(`${directory_name}/debug.log`, `Error capturing screenshot: ${error} \n`);
    }
  };
  module.exports = captureScreenshot;