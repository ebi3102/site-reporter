const puppeteer = require('puppeteer');
const line_reader = require('./file_reader')
const fs = require('fs');

let viewportSizes =
[
  1920, //desktop
  768, //tablet
  375 //mobile
]

let urlsList = line_reader('urls.txt')
console.log(urlsList)


