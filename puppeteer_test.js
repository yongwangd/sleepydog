const puppeteer = require('puppeteer');

const main = async() => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://google.com')
  await page.screenshot({path: 'google.png'})
  await browser.close();
}


main()