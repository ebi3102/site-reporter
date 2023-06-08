const puppeteer = require('puppeteer');

async function captureScreenshotScrolled(url, directory_name, currentWidth, timeWaite) {
    try {
      const browser = await puppeteer.launch({ headless: true, timeout: 0 });
      const page = await browser.newPage();
      await page.setViewport({
        width: currentWidth,
        height: 1080,
      });
      await page.goto(url);
      await page.waitForTimeout(timeWaite);
  
      // Get the height of the rendered page
      const scrollHeight1 = await page.evaluate(() => {
        return Math.max(
          document.body.scrollHeight,
          document.body.offsetHeight,
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.documentElement.offsetHeight
        );
      });
      console.log('ScrollHeightof ' + url +': '+ scrollHeight1)
      const scrollHeight = await page.evaluate(() => {
          return Math.max(
            // document.body.scrollHeight,
            // document.body.offsetHeight,
            // document.documentElement.clientHeight,
            // document.documentElement.scrollHeight,
            // document.documentElement.offsetHeight
            document.body.getBoundingClientRect().height,
            document.documentElement.getBoundingClientRect().height
          );
        });
      console.log('New ScrollHeight' + url +': '+ scrollHeight)
  
      await page.setViewport({
          width: currentWidth,
          height: scrollHeight
      });
  
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.waitForTimeout(timeWaite);
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
    }
  };
  module.exports = captureScreenshotScrolled;