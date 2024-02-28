const puppeteer = require('puppeteer');
const write_log = require('../file-handlers/file-writer');
const { URL } = require('url');
const { connectToMongo, insertData, closeConnection } = require('../repositories/mongoConnection');
const { newsCollectionName } = require('../app.config');
const url_status_check = require('../link-checkers/url-status');

async function pcmBlogSpider(logDirectoy){
  const url = "https://pcmfa.blog/post-sitemap.xml";
  const targetDomain = "pcmfa.blog";

  try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector('table#sitemap');
    const links = await page.evaluate(() => {
      const anchorElements = document.querySelectorAll('table#sitemap tbody tr a');
      let Elem = [];
      for(var i=0; i<anchorElements.length; i++){
        Elem.push(anchorElements[i].href);
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
    let crawlContent = [];
    for (const link of filteredUrls) {
      let siteContent = {};
      siteContent.url = await link;
      siteContent.data = await read_page_content(link);
      if(siteContent.data ){
        crawlContent.push(siteContent);
        write_log(
          `${logDirectoy}/data.log`,
          `${JSON.stringify(crawlContent)} \n`
        )
      //   //store json data into the mongo db
      //   await db_store(siteContent).catch ((error) =>{
      //     console.error(error.message);
          // write_log(
          //   `${logDirectoy}/debug.log`,
          //   `${error.message} \n`
          // )
      //   });
      }
    }

    await browser.close();

  } catch (error) {
    console.error(error);
    await write_log(
      `${logDirectoy}/debug.log`,
      `${error} \n`
    );
  }
};

module.exports = pcmBlogSpider;

async function read_page_content(url)
{
  try{
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();

    await page.goto(url);
    const pageContent = await page.evaluate(() => {
      if(!document.querySelector('body.single-post')){
        return false;
      }

      let content = {};
      if(document.querySelector('h1.jeg_post_title')){
        content['title'] = document.querySelector('h1.jeg_post_title');
      }

      // let mainContent = {};
      // const contentHeader = document.querySelector('div.default-article-header__container__3NcV7');

      /**
       * Set Categories
       */
      // const categoriesElem = contentHeader.querySelectorAll('nav.headline__tags__2iIxq>ul>li>a');
      // let categories = [];
      // for(var i=0; i<categoriesElem.length; i++){
      //   categories.push(categoriesElem[i].textContent);
      // }
      // mainContent.categories = categories;

      /**
       * Set content title
       */

      // mainContent.title = contentHeader.querySelector('h1').textContent;

      /**
       * Set content sections
       */
      let contentElems = [];
      const contentSections = document.querySelectorAll('div.elementor-widget-container');
      const invalideElements = ['script', 'style']
      for(var i=0; i<contentSections.length; i++){
        for (const child of contentSections[i].children) {
          if(!invalideElements.includes(child.tagName.toLowerCase())){
            for (const childElem of child.children) {
              // console.log(child)
              contentElems.push(child)
            }
          }
        }
      }





      // let paragraphs = [];
      // for(var i=0; i<contentPargraphs.length; i++){
      //   paragraphs.push(contentPargraphs[i].textContent);
      // }

      // mainContent.content = paragraphs;

      content.mainContent = contentElems;

      return content;

    });

    await browser.close();

    return pageContent;

  }catch{
    await write_log(
      `${logDirectoy}/debug.log`,
      `${error.message} \n`
    );
  }
}

async function db_store (siteContent) {
    const { client, collection } = await connectToMongo(newsCollectionName);
    try {
      const insertedData = await insertData(collection, siteContent);
    } finally {
      closeConnection(client);
    }
};