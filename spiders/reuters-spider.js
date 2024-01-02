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
        // console.log("links", anchorElements[i].href);
      }
      return Elem;
    });

    let uniqueLinks = [...new Set(links)];
    const filteredUrls = uniqueLinks.filter(url => {
      if(url){
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.match(targetDomain)
      }
    });
    console.log(filteredUrls);
    let crawlContent = [];
    for (const link of filteredUrls) {
      let siteContent = {};
      siteContent.url = await link;
      siteContent.data = await read_page_content(link);
      if(siteContent.data ){
        crawlContent.push(siteContent);
      }
      
    }


    let data = JSON.stringify(crawlContent);
    console.log(data);
    await write_log(
      `${directory_name}/data.json`,
      `${data}`
    );


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
      if(!document.querySelector('main.regular-article-layout__main__1tzD8')){
        return false;
      }
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

      let mainContent = {};
      const contentHeader = document.querySelector('div.default-article-header__container__3NcV7');

      /**
       * Set Categories
       */
      const categoriesElem = contentHeader.querySelectorAll('nav.headline__tags__2iIxq>ul>li>a');
      let categories = [];
      for(var i=0; i<categoriesElem.length; i++){
        categories.push(categoriesElem[i].textContent);
      }
      mainContent.categories = categories;

      /**
       * Set content title
       */

      mainContent.title = contentHeader.querySelector('h1').textContent;

      /**
       * Set content paragraphs
       */
      const contentPargraphs = document.querySelectorAll('div.article-body__content__17Yit>p');
      let paragraphs = [];
      for(var i=0; i<contentPargraphs.length; i++){
        paragraphs.push(contentPargraphs[i].textContent);
      }

      mainContent.content = paragraphs;

      content.content = mainContent;

      return content;

    });

    await browser.close();

    return pageContent;

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