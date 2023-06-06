const puppeteer = require('puppeteer');
const fs = require('fs');

let viewportSizes =
[
  1920, //desktop
  768, //tablet
  375 //mobile
]

const date = Date();
let stringDate = date.format('D/MM/YYYY');
// calling a function, returns a string
console.log(stringDate);

// fs.mkdirSync('./screenshots/1', { recursive: true })
/*
//loop on the viewPortSizes
viewportSizes.map(current=>{

  (async () => {
    // Launch a headless Chrome instance
    const browser = await puppeteer.launch({headless: true});
  
    // Open a new page
    const page = await browser.newPage();
  
    // Set the viewport size
    await page.setViewport({
      width: 1920, // Change this value to your desired width
      height: 1080, // Change this value to your desired height
    });
  
    // Navigate to the website
    await page.goto('https://pcmfa.co/'); // Change the URL to the desired website
  
  
    await page.waitForTimeout(3000);
  
      // // Wait for the slider element to be fully loaded
      // const sliderSelector = '.wp-block-themepunch-revslider > #rev_slider_1_2_forcefullwidth'; // Replace with the actual selector for your slider
      // await page.waitForSelector(sliderSelector);
    
      // // Capture the slider element
      // const sliderElement = await page.$(sliderSelector);
      // const sliderBoundingBox = await sliderElement.boundingBox();
  
  
    // // Scroll to the bottom of the page
    await page.evaluate(() => {
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
  
    // // Wait for the images to load
    await page.waitForTimeout(3000); // Add a delay of 3 seconds (3000 milliseconds)
  
  
    // Take a screenshot of the entire page
    await page.screenshot({ path: './screenshots/screenshot.png', fullPage: true });
  
    // Close the browser
    await browser.close();
  })();

}) */

