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
