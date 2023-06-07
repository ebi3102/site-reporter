const puppeteer = require('puppeteer');
async function captureScreenshot(url, directory_name, currentWidth, timeWaite) {
    try {
      const browser = await puppeteer.launch({ headless: true, timeout: 0  });
      const page = await browser.newPage();
      await page.setViewport({
        width: currentWidth,
        height: 1080,
      });
      await page.goto(url);
      await page.waitForTimeout(timeWaite)
      await page.evaluate(() => {
        window.scrollTo(0, document.documentElement.scrollHeight);
      });
      await page.waitForTimeout(timeWaite);
      const regex = /[^a-zA-Z0-9\s]/g;
      let urlName =  url.replace(regex, '_');
      await page.screenshot({
        path: `${directory_name}/${urlName}_${currentWidth}.png`,
        fullPage: true,
      });
      console.log(`Screenshot taken from ${url} in width of ${currentWidth}`);
      await browser.close();
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    }
  };

module.exports = captureScreenshot;