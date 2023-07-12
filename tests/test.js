const crawler = require("../link-checkers/links-check");
const puppeteer = require('puppeteer');


// let url = "https://bitsarf.com/%d8%a8%d8%b1%da%af%d9%87-%d9%86%d9%85%d9%88%d9%86%d9%87/";
// let url = "https://bitsarf.com/56353456345634about2324333434/";
// let url = "https://dow/nload.mql5.com/cdn/mobile/mt4/android?server=PCMTrader-Demo,PCMTrader-Live";
// let url = "https://download.mql5.com/cdn/mobile/mt4/ios?server=PCMTrader-Demo,PCMTrader-Live";
// let url="https://download.mql5.com/cdn/web/pcm.international.limited/mt4/pcmtrader4setup.exe";
// let url = "https://cabin.pcmfa.co/fa/register?rm&2051553111425202628";
// let url = "https://wordpress.org/latest.zip";
// let url = "https://pcmfa.blog/files/John-j-morphy-technical-analysis-of-the-financial-markets-fa.pdf";
let url = "https://pcmfa.net/";
// crawler(url, '.');

url_status_check(url)

async function url_status_check(url){
    try{
      const browser = await puppeteer.launch({headless: false});
      const page = await browser.newPage();
        console.log(url);
      if(url){
        console.log(url);
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' });
        // const response = await page.goto(url);
        console.log('OK');
        console.log(`remoteAddress: ${JSON.stringify(response.remoteAddress())}`);
        // console.log(`remoteAddress: ${JSON.stringify(response.request())}`);
        console.log(`status: ${JSON.stringify(response.status())}`);
        console.log(`headers: ${JSON.stringify(response.headers())}`);
        console.log(`timing: ${JSON.stringify(response.timing())}`);
        console.log(`url: ${JSON.stringify(response.url())}`);


        if (response.status() >= 400) {
            console.log(`Broken link: ${url} [${response.status()}] \n`);
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