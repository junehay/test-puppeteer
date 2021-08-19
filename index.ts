import puppeteer from 'puppeteer';

const startTime = new Date().getTime();

void (async () => {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1366,
    height: 768
  });

  await page.goto('https://github.com/junehay?tab=repositories');

  const selector = '#user-repositories-list > ul > li';
  const dataLength = await page.$$eval(selector, (data) => data.length);
  const data = [];

  for (let i = 1; i <= dataLength; i++) {
    data.push(
      page.$eval(
        `#user-repositories-list > ul > li:nth-child(${i}) > div.col-10.col-lg-9.d-inline-block > div.d-inline-block.mb-1 > h3 > a`,
        (element) => element.textContent
      )
    );
  }

  console.log('data : ', await Promise.all(data));
  console.log(new Date().getTime() - startTime);
  await browser.close();
})();

// not use puppeteer
import axios from 'axios';

void (async () => {
  const result = await axios.get('https://github.com/junehay?tab=repositories');
  const html = result.data as string;
  const regex = /<[^>]*?>\s?.*\n?\r?<\/[^>]*?>|<[^>]*?>/g;
  const splitHtml = html.match(regex);

  const repoNameFilterHtml = splitHtml?.reduce((acc, html) => {
    if(html.includes('ame codeRepository')){
      const repoName = html.split('\n')[1].trim().replace('</a>', '');
      acc.push(repoName);
    }
    return acc;
  },[] as string[]);

  console.log(repoNameFilterHtml)
})();