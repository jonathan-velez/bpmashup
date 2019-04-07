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

  const urlScrape = `https://www.google.com/search?q=${encodeURIComponent(searchString)}%20+site:zippyshare.com`;

  const googleCall = await axios.get(urlScrape);

  const $ = cheerio.load(googleCall.data);

  let zippyLink = ($($('.r a')[0]).attr('href'));

  let downloadLink = '';
  if (zippyLink) {
    zippyLink = zippyLink.substring(7);
    zippyLink = zippyLink.substring(0, zippyLink.indexOf('&'));

    let zippyCall = await axios.get(zippyLink);

    const $ = cheerio.load(zippyCall.data);

    $('script').get().forEach((val) => {
      const scriptData = val.children.length > 0 && val.children[0].data;

      if (val.children.length > 0 && scriptData.includes('dlbutton')) {
        const scriptData = val.children[0].data;
        console.log('scriptData', scriptData);

        /******** Sample of the script we need to emulate ********
        var a = 497531;
        var b = 742589;
        document.getElementById('dlbutton').omg = "f";
        if (document.getElementById('dlbutton').omg != 'f') {
          a = Math.ceil(a / 3);

        } else {
          a = Math.floor(a / 3);

        }
        document.getElementById('dlbutton').href = "/d/nvOIQLGW/" + (a + 497531 % b) + "/Hermanez%20-%20Gate%20Of%20Falganda%20%28Original%20Mix%29%20edmwaves.org.mp3";
        if (document.getElementById('fimage')) {
          document.getElementById('fimage').href = "/i/nvOIQLGW/" + (a + 497531 % b) + "/Hermanez%20-%20Gate%20Of%20Falganda%20%28Original%20Mix%29%20edmwaves.org.mp3";

        }
        */
        try {
          let aVar = scriptData.substring(scriptData.indexOf('var a =') + 8);
          aVar = aVar.substring(0, aVar.indexOf(';'));
          console.log('aVar', aVar);

          let bVar = scriptData.substring(scriptData.indexOf('var b =') + 8);
          bVar = bVar.substring(0, bVar.indexOf(';'));
          console.log('bVar', bVar);

          let omg = scriptData.indexOf('document.getElementById(\'dlbutton\').omg = "f";') >= 0;
          console.log('omg', omg);
          aVar = omg ? Math.floor(aVar / 3) : aVar = Math.ceil(aVar / 3);

          let mp3Link = scriptData.substring(scriptData.indexOf('document.getElementById(\'dlbutton\').href = ') + 43);
          mp3Link = mp3Link.substring(0, mp3Link.indexOf(';'));
          mp3Link = mp3Link.replace('(a', '(' + aVar).replace('%b)', '%' + bVar + ')');
          console.log('eval mp3link', mp3Link);

          mp3Link = _eval('module.exports = ' + mp3Link);

          downloadLink = zippyLink.substr(0, zippyLink.indexOf('.com/') + 4) + mp3Link;
          console.log('downloadLink', downloadLink)
        } catch (error) {
          console.log('Error extracting mp3 link from zippyshare', error, 'scriptData', scriptData, 'zippyLink', zippyLink);
        }
      }
    });
  }

  res.json({ href: downloadLink });
}

exports.zippyScrape = scrape;
