const puppeteer = require('puppeteer');
const write_log = require('../file-handlers/file-writer');
const { URL } = require('url');

async function reutersSpider(url, directory_name, targetDomain){
  try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);

    const links = await page.evaluate(() => {
      const anchorElements = document.querySelectorAll('a');
    // const anchorElements = document.querySelectorAll('li.story-collection__story__LeZ29 div.media-story-card__body__3tRWy>a');
    let Elem = [];
    for(var i=0; i<anchorElements.length; i++){Elem.push(anchorElements[i].href)}
    return Elem;
    });


    let uniqueLinks = [...new Set(links)];
    console.log(links);
    // var targetDomain = "pcmfa.co"; //TODO: set as config
    const filteredUrls = uniqueLinks.filter(url => {
      if(url){
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.endsWith(targetDomain);
      }
    });

    // const filteredUrls = uniqueLinks;

    for (const link of filteredUrls) {
      await write_log(
        `${directory_name}/hack.log`,
        `${link} \n`
      );
    }

    await browser.close();
    // return filter?edUrls;
  } catch (error) {
    console.error('Error in opening url:', error);
    await write_log(
      `${directory_name}/debug.log`,
      `Error in opening url: ${url} \n`
    );
  }
};

module.exports = reutersSpider;

async function linke_checker(patterns, link, logPath, pageUrl){
  try{
    var patternFound = patterns.some(function(pattern) {
      var regex = new RegExp(pattern, "i"); // "i" flag for case-insensitive matching
      return regex.test(link);
    });

    if(patternFound){
      console.log(link)
      await write_log(
        `${logPath}/hack.log`,
        `In ${pageUrl} there is the follow danger link:
        ${link} \n`
      );
    }

  } catch(error){
    console.error(`Error in regestring link ${link} :`, error);
    await write_log(
      `${logPath}/broken.log`,
      `In ${pageUrl} there is an error in opening link
      ${link} : ${error} \n`
    );
  }
}