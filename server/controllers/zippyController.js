const cheerio = require('cheerio');
const axios = require('axios');
const _eval = require('eval');
const path = require('path');
const fs = require('fs');

// Google track name on zippyshare.com
// Scrape search results, grab first result
// Open zippyshare page, scrape for the JS that creates the download button href
// use eval to execute script and finally compile the full href before returning
// TODO: Clean this shit up! Handle failures, don't blindly take first google result

async function scrape(req, res) {
  const { searchString } = req.query;

  if (!searchString || searchString.length < 3) {
    return res.json({
      success: false,
      href: null,
      error: 'Search string less than 3 characters',
    });
  }

  console.log(`Searching google for zippyshare link for: ${searchString}`);
  const urlScrape = `https://www.google.com/search?q=${encodeURIComponent(searchString)}%20+site:zippyshare.com`;

  const googleCall = await axios.get(urlScrape);
  const $ = cheerio.load(googleCall.data);

  // take first google search result. TODO: Loop through the rest if download link not found
  let zippyLink = ($($('.r a')[0]).attr('href'));

  let downloadLink = '';
  if (zippyLink) {
    console.log(`Zippyshare link found: ${zippyLink}`);
    zippyLink = zippyLink.substring(7);
    zippyLink = zippyLink.substring(0, zippyLink.indexOf('&'));

    let zippyCall = await axios.get(zippyLink);
    const $ = cheerio.load(zippyCall.data);
    let fileExists = true;

    $('div').get().forEach(elem => {
      elem.children.forEach(child => {
        if (child.type === 'text' && child.data.indexOf('File does not exist') >= 0) {
          fileExists = false;
        }
      })
    });

    if (!fileExists) {
      console.log('Zippy page says no file found, must have been deleted.')
      return res.json({
        success: true,
        href: null,
        error: 'No file found',
      })
    }

    console.log('Loop through zippy scripts');

    $('script').get().forEach((val) => {
      const scriptData = val.children.length > 0 && val.children[0].data;

      if (val.children.length > 0 && scriptData.includes('dlbutton')) {
        const scriptData = val.children[0].data;

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

          let bVar = scriptData.substring(scriptData.indexOf('var b =') + 8);
          bVar = bVar.substring(0, bVar.indexOf(';'));

          let omg = scriptData.indexOf('document.getElementById(\'dlbutton\').omg = "f";') >= 0;
          aVar = omg ? Math.floor(aVar / 3) : aVar = Math.ceil(aVar / 3);

          let mp3Link = scriptData.substring(scriptData.indexOf('document.getElementById(\'dlbutton\').href = ') + 43);
          mp3Link = mp3Link.substring(0, mp3Link.indexOf(';'));
          mp3Link = mp3Link.replace('(a', '(' + aVar).replace('%b)', '%' + bVar + ')');

          mp3Link = _eval('module.exports = ' + mp3Link);

          downloadLink = zippyLink.substr(0, zippyLink.indexOf('.com/') + 4) + mp3Link;
        } catch (error) {
          console.log('Error extracting mp3 link from zippyshare', error, 'scriptData', scriptData, 'zippyLink', zippyLink);
          return res.json({
            success: false,
            href: null,
            error: error,
          })
        }
      }
    });
  } else {
    console.log('No zippy link found.')
    return res.json({
      success: false,
      href: null,
      error: 'No download link found',
    })
  }

  // extract file name from download link, create path to server download folder
  // check download folder if the file exists
  // if it does, send it. otherwise, download it and then send it
  let fileName = decodeURIComponent(downloadLink.substr(downloadLink.lastIndexOf('/') + 1));
  const thePath = path.resolve(__dirname, '../downloads', fileName);
  const fileExists = fs.existsSync(thePath);

  if (!fileExists) {
    console.log(`Starting new download - ${fileName}`);
    fileName = await downloadMp3(downloadLink, fileName, thePath);
  }

  // res.download(`downloads/${fileName}`);

  if (!fileName || fileName.length === 0) {
    console.log('fileName not valid, possibly failed in downloadMp3 fn');
    return res.json({
      href: null,
      success: true,
      error: 'No file found',
    })
  } else {
    return res.json({
      href: `/api/download-it/?fileName=${fileName}`,
      success: true,
    })
  }

}

async function downloadMp3(url, fileName, thePath) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
      })

      console.log(`Finished downloading - ${fileName}`);
      fs.writeFileSync(thePath, response.data);
      console.log(`File written to - ${thePath}`);
      resolve(fileName); //TODO: Handle reject
    } catch (error) {
      console.log('Error with downloading mp3', thePath, error);
      reject();
    }

  })
}

const downloadIt = async (req, res) => {
  const { fileName } = req.query;
  console.log('Client download started', fileName);
  res.download(`downloads/${fileName}`);
}

exports.zippyScrape = scrape;
exports.downloadIt = downloadIt;
