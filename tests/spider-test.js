const { logDirectory } = require("../app.config");
const pcmBlogSpider = require("../spiders/blog-spider");
const reutersSpider = require("../spiders/reuters-spider");

function spiderTest()
{
    // reutersSpider(logDirectory);
    pcmBlogSpider(logDirectory);

}

module.exports = spiderTest;