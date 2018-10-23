const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'G:\\chrome-win\\chrome.exe',
        devtools: true,
        headless: false
    })
    const indexPage = await browser.newPage();

    indexPage.on('domcontentloaded', async () => {
        const detailsUrl = await indexPage.$eval('.list-page', node => {
            let detailsHref = node.querySelectorAll('ul>li>p:first-child>a');
            detailsHref = Array.from(detailsHref).map(item => item.href);
            return detailsHref;
        });

        detailsUrl.forEach(async item => {
            const detaiPage = await browser.newPage();
            await detaiPage.goto(item);

        });

    });

    await indexPage.goto('http://www.ckck.tv/kh/Index.html');



})()
