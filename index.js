const puppeteer = require('puppeteer');
const line_reader = require('./file_reader')
const fs = require('fs');

let viewportSizes =
[
  1920, //desktop
  768, //tablet
  375 //mobile
]


line_reader('urls.txt')
  .then(lines => {
    // Store the lines array in a variable
    const urlsList = lines;
    console.log(storedLines);
  })
  .catch(error => {
    console.error('Error:', error);
  });

;
