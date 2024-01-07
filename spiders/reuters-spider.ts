import puppeteer from 'puppeteer';
import writeLog from '../file-handlers/file-writer';
import { URL } from 'url';
import { connectToMongo, insertData, closeConnection } from '../repositories/mongoConnection';
import { newsCollectionName } from '../app.config';
import urlStatusCheck from '../link-checkers/url-status';

interface SiteContent {
  url: string;
  data: any; // Adjust this type based on the actual structure of your data
}

const reutersSpider = async (logDirectory: string): Promise<void> => {
  const url = "https://www.reuters.com/business/finance/";
  const targetDomain = "reuters.com";

  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    await page.waitForSelector('li.story-collection__story__LeZ29 div.media-story-card__body__3tRWy a');
    const links = await page.evaluate(() => {
      const anchorElements = document.querySelectorAll('li.story-collection__story__LeZ29 div.media-story-card__body__3tRWy a');
      return Array.from(anchorElements, (elem) => elem.getAttribute('href'));
    });

    const uniqueLinks = [...new Set(links)];
    const filteredUrls = uniqueLinks.filter(url => {
      if (url) {
        const parsedUrl = new URL(url);
        return parsedUrl.hostname.match(targetDomain);
      }
      return false;
    });

    const crawlContent: SiteContent[] = [];

    for (const link of filteredUrls) {
      const status = await urlStatusCheck(link);
      if (!status) {
        writeLog(`${logDirectory}/debug.log`, `The ${link} is not opened \n`);
        return;
      }

      const siteContent: SiteContent = {
        url: link,
        data: await readPageContent(link, logDirectory),
      };

      if (siteContent.data) {
        crawlContent.push(siteContent);
        await dbStore(siteContent, logDirectory).catch((error) => {
          console.error(error.message);
          writeLog(
            `${logDirectory}/debug.log`,
            `${error.message} \n`
          );
        });
      }
    }

    await browser.close();

  } catch (error) {
    console.error(error);
    await writeLog(
      `${logDirectory}/debug.log`,
      `${error} \n`
    );
  }
};

export default reutersSpider;

async function readPageContent(url: string, logDirectory: string): Promise<any> {
  try {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(url);
    const pageContent = await page.evaluate(() => {
      if (!document.querySelector('main.regular-article-layout__main__1tzD8')) {
        return false;
      }
      //TODO: Create interface for content 
      let content: object = {};
      content['headTitle'] = document.title;

      const metaTags = document.head.querySelectorAll('meta');
      const validMetaTags = ['description'];
      let metaDescription = null;

      for (const metaTag of metaTags) {
        if (validMetaTags.includes(metaTag.name)) {
          metaDescription = metaTag.content;
          content[metaTag.name] = metaDescription;
        }
      }

      const scriptTags = document.querySelectorAll('script');
      const ldJsonScripts: any[] = [];

      scriptTags.forEach(script => {
        if (script.type === 'application/ld+json') {
          try {
            const ldJsonContent = JSON.parse(script.textContent || '');
            ldJsonScripts.push(ldJsonContent);
          } catch (error) {
            console.error('Error parsing JSON in application/ld+json script:', error);
            writeLog(
              `${logDirectory}/debug.log`,
              `Error parsing JSON in application/ld+json script: ${error.message} \n`
            );
          }
        }
      });

      content['ldJsons'] = ldJsonScripts;

      let mainContent: any = {};
      const contentHeader : Element | null = document.querySelector('div.default-article-header__container__3NcV7');

      const categoriesElem = contentHeader.querySelectorAll('nav.headline__tags__2iIxq>ul>li>a');
      let categories: string[] = [];

      categoriesElem.forEach(categoryElem => {
        categories.push(categoryElem.textContent || '');
      });

      mainContent.categories = categories;
      mainContent.title = contentHeader.querySelector('h1')?.textContent || '';

      const contentParagraphs = document.querySelectorAll('div.article-body__content__17Yit>p');
      let paragraphs: string[] = [];

      contentParagraphs.forEach(paragraph => {
        paragraphs.push(paragraph.textContent || '');
      });

      mainContent.content = paragraphs;
      content.content = mainContent;

      return content;
    });

    await browser.close();

    return pageContent;

  } catch (error) {
    await writeLog(
      `${logDirectory}/debug.log`,
      `${error.message} \n`
    );
    // Return undefined to indicate an error occurred
    return undefined;
  }
}

async function dbStore(siteContent: SiteContent, logDirectory: string): Promise<void> {
  const { client, collection } = await connectToMongo(newsCollectionName);
  try {
    await insertData(collection, siteContent);
  } finally {
    closeConnection(client);
  }
}
