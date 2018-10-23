const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'G:\\chrome-win\\chrome.exe',
        devtools: true,
        headless: false
    })
    const indexPage = await browser.newPage();
    const moviesData = [];

    indexPage.on('domcontentloaded', async () => {
        const detailsUrl = await indexPage.$eval('.list-page', node => {
            let detailsHref = node.querySelectorAll('ul>li>p:first-child>a');
            detailsHref = Array.from(detailsHref).map(item => item.href);
            return detailsHref;
        });

        const detaiPage = await browser.newPage();

        for (let i = 0; i < detailsUrl.length; i++) {
            await detaiPage.goto(detailsUrl[i]);
            await detaiPage.waitFor(2000);
            const moviesTitle = await detaiPage.$eval('.movie', node => {
                return node.querySelector('h1').textContent;
            })
            const moviesIntroduce = await detaiPage.$eval('.inst', node => {
                return node.querySelector('.content2').childNodes[3].textContent;
            })
            moviesData.push({
                title: moviesTitle,
                introduce: moviesIntroduce
            })
            
        }
        await detaiPage.close();
        console.log(moviesData);
    });

    await indexPage.goto('http://www.ckck.tv/kh/Index.html');



})()
