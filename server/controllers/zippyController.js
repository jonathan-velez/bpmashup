const cheerio = require('cheerio');
const axios = require('axios');
const _eval = require('eval');

// Google track name on zippyshare.com
// Scrape search results, grab first result
// Open zippyshare page, scrape for the JS that creates the download button href
// use eval to execute script and finally compile the full href before returning
// TODO: Clean this shit up! Handle failures, don't blindly take first google result

async function scrape(req, res) {
  let searchString = req.query.searchString;

  if (!searchString) {
    res.json({ href: '' });
    return;
  }

  const urlScrape = `https://www.google.com/search?q=${searchString}%20+site:zippyshare.com`;

  const googleCall = await axios.get(urlScrape);

  const $ = cheerio.load(googleCall.data);

  let zippyLink = ($($('.r a')[0]).attr('href'));

  let downloadLink = '';

  if (zippyLink) {
    zippyLink = zippyLink.substring(7);
    zippyLink = zippyLink.substring(0, zippyLink.indexOf('&'));

    let zippyCall = await axios.get(zippyLink);

    const $ = cheerio.load(zippyCall.data);

    $('script').get().forEach((val, idx) => {
      const scriptData = val.children.length > 0 && val.children[0].data;

      if (val.children.length > 0 && scriptData.includes('dlbutton')) {
        const scriptData = val.children[0].data;

        try {
          let mp3Link = scriptData.substring(scriptData.indexOf('document.getElementById(\'dlbutton\').href = ') + 43, scriptData.indexOf(';'));

          mp3Link = _eval('module.exports = ' + mp3Link);

          downloadLink = zippyLink.substr(0, zippyLink.indexOf('.com/') + 4) + mp3Link;
        } catch (error) {
          console.log('Error extracting mp3 link from zippyshare', error, 'scriptData', scriptData, 'zippyLink', zippyLink);
        }
      }
    });
  }

  res.json({ href: downloadLink });
}

exports.zippyScrape = scrape;
