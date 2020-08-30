const puppeteer = require('puppeteer');
const fs = require('fs');


// I got this error a couple times
// TimeoutError: Navigation timeout of 30000 ms exceeded 
async function createJson(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Disable timeout
    // Some pages are taking to long
    page.setDefaultNavigationTimeout(0);

    try {
        await page.goto(url)
    } catch (error) {
        console.error(error);
        browser.close();
    }

    let json = await page.evaluate(() => {
        // Get info from article
        let article = document.querySelectorAll("#materia > div:nth-child(2) > article > div.mat-columns > div.mat-content > div.mat-txt p")

        // Get author
        let author = document.querySelector("#materia > div:nth-child(2) > article > div.mat-columns > div.mat-content > div.mat-header > div.hdr-bottom > div.hdr-meta > div > span.meta-item.meta-aut").textContent;

        // Get title
        let title = document.querySelector("#materia > div:nth-child(2) > article > div.mat-columns > div.mat-content > div.mat-header > h1").textContent;

        // Variable that will store content of transcription
        let body = '';

        // Get all text and turn into a single text in variable body
        article.forEach(t => {
            body += t.textContent + ' ';
        })

        let json = {
            author,
            body,
            title,
            type: 'article'
        }

        return json;
    })

    await browser.close();

    json.url = url;
    // Replace all white space with -
    // I will use this title to make de json file name
    const title = json.title.toLowerCase().replace(/\s/g, '-');

    // Turn javascript object into JSON
    json = JSON.stringify(json);

    fs.writeFile(`${title}.json`, json, 'utf8', () => console.log(`${title}.json created`));
}

// Article URLs
const urls = [
    'https://olhardigital.com.br/colunistas/wagner_sanchez/post/o_futuro_cada_vez_mais_perto/78972',
    'https://olhardigital.com.br/colunistas/wagner_sanchez/post/os_riscos_do_machine_learning/80584',
    'https://olhardigital.com.br/ciencia-e-espaco/noticia/nova-teoria-diz-que-passado-presente-e-futuro-coexistem/97786',
    'https://olhardigital.com.br/noticia/inteligencia-artificial-da-ibm-consegue-prever-cancer-de-mama/87030',
    'https://olhardigital.com.br/ciencia-e-espaco/noticia/inteligencia-artificial-ajuda-a-nasa-a-projetar-novos-trajes-espaciais/102772',
    'https://olhardigital.com.br/colunistas/jorge_vargas_neto/post/como_a_inteligencia_artificial_pode_mudar_o_cenario_de_oferta_de_credito/78999',
    'https://olhardigital.com.br/ciencia-e-espaco/noticia/cientistas-criam-programa-poderoso-que-aprimora-deteccao-de-galaxias/100683',
]

urls.forEach(createJson);


