const cheerio = require('cheerio');
const axios = require('axios');
const _eval = require('eval');
const path = require('path');
const fs = require('fs');
const puppeteer = require('puppeteer');

async function scrape(req, res) {
  try {
    let { artists, name: trackName, mixName } = req.query;
    let searchString = [artists, trackName, mixName].join(' ');

    searchString = searchString.replace(/[()]/g, ''); // TODO: replace common terms: mix, remix, original

    if (!searchString || searchString.length < 3) {
      return res.json({
        success: false,
        href: null,
        error: 'Search string less than 3 characters',
      });
    }

    console.log(`Searching google for zippyshare link for: ${searchString}`);
    const urlScrape = `https://www.google.com/search?q=${encodeURIComponent(searchString)}%20+site:zippyshare.com`;
    const browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
    });
    const page = await browser.newPage();
    await page.goto(urlScrape);

    let linksList = await page.$$eval('a', as => as.map(a => a.href));
    console.log('hrefs', linksList)

    await browser.close();

    const pagesRank = {};
    const pagesHtml = {};
    let indexOfBestLink = -1;

    // filter links to just the ones on zippyshare.com
    linksList = linksList.filter(link => link.includes('zippyshare.com/'));
    console.log('filteredLinks', linksList)

    console.log('# of links', linksList.length);

    if (linksList.length === 0) {
      console.log(`No google hits for search: ${urlScrape}`);
      return res.json({
        success: false,
        href: null,
        error: 'No google hits',
      })
    }

    // loop through link list and analyze the file name. break out if a perfect match to our search string is found, otherwise determine best match afterwards 
    for (const [i, link] of linksList.entries()) {
      console.log(`Parsing page #${i} - ${link}`);
      const zippyCall = await axios.get(link);
      const $ = cheerio.load(zippyCall.data);
      let fileExists = true;
      pagesHtml[i] = $.html();

      let pageTitle = ($('title').text());
      console.log('Page title: ' + pageTitle);

      const lastIndexOfDot = pageTitle.lastIndexOf('.');
      const fileExtension = pageTitle.substr(lastIndexOfDot + 1);

      // ensure the file is still available, otherwise skip to next
      for (let elem of $('div').get()) {
        for (let child of elem.children) {
          if (child.type === 'text' && (child.data.indexOf('File does not exist') >= 0 || child.data.indexOf('File has expired') >= 0)) {
            fileExists = false;
            break;
          }
        }
        if (!fileExists) break;
      }

      if (!fileExists) {
        console.log('File does not exist or has expired');
        continue;
      }

      // parse the page title - remove file extension and non alphanumeric characters
      pageTitle = pageTitle.substring(pageTitle.indexOf('Zippyshare.com - ') + 17, lastIndexOfDot);
      pageTitle = pageTitle.replace(/[(),]/g, '');

      // check file extension, ensure it's allowed, otherwise skip to next
      const allowedExtensions = ['mp3', 'wav', 'aiff', 'flac', 'aac', 'm4a', 'ogg'];
      if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
        console.log(`Invalid file extension found in Link #${i}: ${fileExtension}`);
        continue;
      }

      // count how many search words are in the title
      const searchWords = searchString.split(' ').filter(Boolean);
      const titleWords = [...new Set(pageTitle.split(' ').filter(Boolean))];
      const artistWords = [...new Set(artists.split(' ').filter(Boolean))];
      const trackNameWords = [...new Set(trackName.split(' ').filter(Boolean))];
      const mixNameWords = [...new Set(mixName.split(' ').filter(Boolean))];
      
      const matchedArtistsWords = [];
      const matchedTrackNameWords = [];
      const matchedMixNameWords = [];

      console.log('searchWords', searchWords);
      console.log('artistWords', artistWords);
      console.log('trackNameWords', trackNameWords);
      console.log('mixNameWords', mixNameWords);

      for (let x = 0; x < artistWords.length; x++) {
        for (let y = 0; y < titleWords.length; y++) {
          let wordFound = false;
          if (titleWords[y].toLowerCase() === artistWords[x].toLowerCase() && !wordFound) {
            matchedArtistsWords.push(artistWords[x]);
            wordFound = true;
          }
        }
      }

      for (let x = 0; x < trackNameWords.length; x++) {
        for (let y = 0; y < titleWords.length; y++) {
          let wordFound = false;
          if (titleWords[y].toLowerCase() === trackNameWords[x].toLowerCase() && !wordFound) {
            matchedTrackNameWords.push(trackNameWords[x]);
            wordFound = true;
          }
        }
      }

      for (let x = 0; x < mixNameWords.length; x++) {
        for (let y = 0; y < titleWords.length; y++) {
          let wordFound = false;
          if (titleWords[y].toLowerCase() === mixNameWords[x].toLowerCase() && !wordFound) {
            matchedMixNameWords.push(mixNameWords[x]);
            wordFound = true;
          }
        }
      }

      console.log('matchedArtistsWords', matchedArtistsWords)
      console.log('matchedTrackNameWords', matchedTrackNameWords)
      console.log('matchedMixNameWords', matchedMixNameWords)

      // log match count if more than half of the words found. if a perfect match is found, break out
      const combinedMatches = (matchedArtistsWords.length + matchedTrackNameWords.length + matchedMixNameWords.length);
      const combinedMatchesPercentage = (combinedMatches / searchWords.length) * 100;
      const matchedArtistsPercentage = (matchedArtistsWords.length / artistWords.length) * 100;
      const matchedTrackNamePercentage = (matchedTrackNameWords.length / trackNameWords.length) * 100;
      const matchedMixNameWordsPercentage = (matchedMixNameWords.length / mixNameWords.length) * 100;

      console.log(`Artist Matches in Link ${i}: ${matchedArtistsWords.length}/${artistWords.length}. matchedArtistsPercentage: ${matchedArtistsPercentage}`);
      console.log(`TrackName Matches in Link ${i}: ${matchedTrackNameWords.length}/${trackNameWords.length}. matchedTrackNamePercentage: ${matchedTrackNamePercentage}`);
      console.log(`MixName Matches in Link ${i}: ${matchedMixNameWords.length}/${mixNameWords.length}. matchedMixNameWordsPercentage: ${matchedMixNameWordsPercentage}`)
      console.log(`Total Matches in Link ${i}: ${combinedMatches}/${searchWords.length}. combinedMatchesPercentage: ${combinedMatchesPercentage}`);

      // ensure at least half of the artists and track names match
      if ((matchedArtistsWords.length > 0 && matchedArtistsPercentage >= 50) && (matchedTrackNameWords.length > 0 && matchedTrackNamePercentage >= 50)) {
        pagesRank[i] = combinedMatches.length;
      } else {
        console.log(`Missed the mark on either artists or track names`, `matchedArtistsPercentage: ${matchedArtistsPercentage} | matchedTrackNamePercentage ${matchedTrackNamePercentage}`);
      }

      if (combinedMatches === searchWords.length) {
        console.log(`Perfect match found in index ${i}`);
        indexOfBestLink = i;
        break;
      }
    }

    // a perfect match wasn't found, find best one by sorting pagesRank array desc and getting first index
    // TODO: Check for empty pagesRank. bail out
    if (indexOfBestLink === -1 && Object.keys(pagesRank).length > 0) {
      const entries = Object.entries(pagesRank);
      entries.sort((a, b) => b[1] - a[1]);
      indexOfBestLink = +entries[0][0];
    }

    // best link found, parse the page and get download link
    const downloadLink = indexOfBestLink >= 0 && _parseZippyPage(linksList[indexOfBestLink], pagesHtml[indexOfBestLink]);

    if (!downloadLink) {
      console.log('No suitable file found')
      return res.json({
        href: null,
        success: false,
        error: 'No file found',
      })
    }

    // check if file already exists on server, download if not
    let fileName = decodeURIComponent(downloadLink.substr(downloadLink.lastIndexOf('/') + 1));
    const thePath = path.resolve(__dirname, '../downloads', fileName);
    const fileExists = fs.existsSync(thePath);

    if (!fileExists) {
      console.log(`Starting new download - ${fileName}`);
      fileName = await _downloadMp3(downloadLink, fileName, thePath);
    }

    // respond back with json payload
    if (!fileName || fileName.length === 0) {
      console.log('fileName not valid, possibly failed in _downloadMp3 fn');
      return res.json({
        href: null,
        success: true,
        error: 'No file found',
      })
    } else {
      return res.json({
        href: `/api/download-it/?fileName=${encodeURIComponent(fileName)}`, // TODO: make dynamic for dev
        success: true,
      })
    }
  } catch (error) {
    console.log(`Error with scrape(): ${error}`);
  }
}

const downloadIt = async (req, res) => {
  const { fileName } = req.query;
  console.log('Client download started', fileName);
  res.download(`downloads/${decodeURIComponent(fileName)}`);
}

const _parseZippyPage = (pageLink, pageHtml) => {
  const $ = cheerio.load(pageHtml);
  let downloadLink = null;

  $('script').get().forEach((val) => {
    const scriptData = val.children.length > 0 && val.children[0].data;

    if (val.children.length > 0 && scriptData.includes('dlbutton') && !downloadLink) {
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

        downloadLink = pageLink.substr(0, pageLink.indexOf('.com/') + 4) + mp3Link;
      } catch (error) {
        console.log('Error extracting mp3 link from zippyshare', error, 'scriptData', scriptData, 'pageLink', pageLink);
      }
    }
  });

  return downloadLink;
}

async function _downloadMp3(url, fileName, thePath) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer',
      });

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

exports.zippyScrape = scrape;
exports.downloadIt = downloadIt;
