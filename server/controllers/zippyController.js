//Zippy-scrape.js
const request = require('request');
const cheerio = require('cheerio');

exports.zippyScrape = (req, res) => {
  let searchString = req.query.searchString;

  if (!searchString){
    res.json({ href: '' });
    return;
  } 

  const urlScrape = `https://www.google.com/search?q=${searchString}%20+site:zippyshare.com`;  

  request(urlScrape, (error, response, html) => {
    let href = '';

    if (error){
      res.json({ href });
      return;
    } 

    // target first search result
    let $ = cheerio.load(html);
    href = ($($('.r a')[0]).attr('href'));
    href = href.substring(7);
    href = href.substring(0, href.indexOf('&'));

    res.json({ href });
  });
}
