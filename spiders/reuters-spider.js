const puppeteer = require('puppeteer');
const write_log = require('../file-handlers/file-writer');
const { URL } = require('url');

async function reutersSpider(url, directory_name){
  try{
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);

    console.log(page);

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
    console.log(links);
    var targetDomain = "pcmfa.co"; //TODO: set as config
    const filteredUrls = uniqueLinks.filter(url => {
      if(url){
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.endsWith(targetDomain);
      }
    });

    for (const link of filteredUrls) {
      var patterns = [
        "glass.php",
        'head.php',
        'etid',
      ]; 
      // await linke_checker(patterns, link, directory_name,url);
      await write_log(
        `${directory_name}/hack.log`,
        `In ${url} there is the follow links:
        ${link} \n`
      );
    }

    await browser.close();
    return filteredUrls;
  } catch (error) {
    console.error('Error in opening url:', error);
    await write_log(
      `${directory_name}/debug.log`,
      `Error in opening url: ${url} \n`
    );
  }
};

module.exports = crawler;

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