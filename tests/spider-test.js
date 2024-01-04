const { logDirectory } = require("../app.config");
const reutersSpider = require("../spiders/reuters-spider");

function spiderTest()
{
    let url= "https://www.reuters.com/business/finance/";
    reutersSpider(url, logDirectory, 'reuters.com');
}

module.exports = spiderTest;