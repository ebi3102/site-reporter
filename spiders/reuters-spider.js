const puppeteer = require('puppeteer');
const write_log = require('../file-handlers/file-writer');
const { URL } = require('url');

async function reutersSpider(url, directory_name, targetDomain){
  try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector('li.story-collection__story__LeZ29 div.media-story-card__body__3tRWy a');
    const links = await page.evaluate(() => {
    const anchorElements = document.querySelectorAll('li.story-collection__story__LeZ29 div.media-story-card__body__3tRWy a');
    let Elem = [];
    for(var i=0; i<anchorElements.length; i++){
      Elem.push(anchorElements[i].href);
      console.log("links", anchorElements[i].href);
    }
    return Elem;
    });

    let uniqueLinks = [...new Set(links)];
    // var targetDomain = "pcmfa.co"; //TODO: set as config
    const filteredUrls = uniqueLinks.filter(url => {
      if(url){
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.match(targetDomain)
        // return parsedUrl.hostname.endsWith(targetDomain);
      }
    });
    console.log(filteredUrls);
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

async function read_page_content(url)
{
  try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);
    // await page.waitForSelector('li.story-collection__story__LeZ29 div.media-story-card__body__3tRWy a');
    const pageContent = await page.evaluate(() => {
      let content = {};
      content['headTitle'] = document.title;

      /**
       * finde meta in head and save validMetaTags
       */
      const metaTags = document.head.querySelectorAll('meta');
      const validMetaTags = ['description']
      let metaDescription = null;
      for (const metaTag of metaTags) {
        if (validMetaTags.includes(metaTag.name)) {
          metaDescription = metaTag.content;
          content[metaTag.name] = metaDescription;
        }
      }

      /**
       * find application/ld+json scripts
       */
      const scriptTags = document.querySelectorAll('script');
      const ldJsonScripts = [];
      scriptTags.forEach(script => {
        if (script.type === 'application/ld+json') {
          // Parse the JSON content and add it to the ldJsonScripts array
          try {
            const ldJsonContent = JSON.parse(script.textContent);
            ldJsonScripts.push(ldJsonContent);
          } catch (error) {
            console.error('Error parsing JSON in application/ld+json script:', error);
          }
        }
      });
      content['ldJsons'] = ldJsonScripts;

      const contentHeader = document.querySelector('div.default-article-header__container__3NcV7');



    
    });

  }catch{

  }
}

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