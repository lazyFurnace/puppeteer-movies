const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        executablePath: 'G:\\chrome-win\\chrome.exe',
        devtools: false,
        headless: false
    })
    const allMoviesData = [];
    const indexPage = await browser.newPage();
    let i = 0;


    await indexPage.on('load', async () => {
        const moviesData = await getMoviesdetai(browser, indexPage);

        allMoviesData.push(moviesData);


        if (i > 3) {
            await getMoviesData(allMoviesData);
            return false;
        }

        await indexPage.$eval('.page-next', node => {
            const $nextPage = $(node).find(':contains(下一页)');
            if ($nextPage.length) {
                $nextPage.get(0).click();
            }
        })

        i++;

        return true;

    })

    await indexPage.goto('http://www.ckck.tv/kh/Index.html');


})()

async function getMoviesData(data) {
    console.log(data);
}

async function getMoviesdetai(browser, indexPage) {
    const moviesData = [];
    const detailsUrl = await indexPage.$eval('.list-page', node => {
        let detailsHref = node.querySelectorAll('ul>li>p:first-child>a');
        detailsHref = Array.from(detailsHref).map(item => item.href);
        return detailsHref;
    });

    const detaiPage = await browser.newPage();

    for (let i = 0; i < detailsUrl.length; i++) {
        await detaiPage.goto(detailsUrl[i]);
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
    return moviesData;
}
