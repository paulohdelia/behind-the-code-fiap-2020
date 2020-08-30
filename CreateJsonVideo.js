const puppeteer = require('puppeteer');
const fs = require('fs');

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
        // Get info from transcription
        let rawTranscription = document.querySelectorAll('[dir="ltr"] span > a');

        // Get author
        let author = document.querySelector("#content > div > div:nth-child(2) > div.bg\\:gray-ll.c\\:black.p-x\\:2.p-y\\:\\.5.bg\\:white\\@md > div.f\\:\\.9.m-b\\:\\.4.m-t\\:\\.5.d\\:i-b").textContent;

        // Get title
        let title = document.querySelector("#content > div > div:nth-child(2) > div.bg\\:gray-ll.c\\:black.p-x\\:2.p-y\\:\\.5.bg\\:white\\@md > h1").textContent;

        // Variable that will store content of transcription
        let body = '';

        // Get all text and turn into a single text in variable body
        rawTranscription.forEach(t => {
            body += t.textContent + ' ';
        })

        // In this case, type is video because is from TedTalks
        let json = {
            author,
            body,
            title,
            type: 'video'
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

// Video URLs
const urls = [
    'https://www.ted.com/talks/helen_czerski_the_fascinating_physics_of_everyday_life/transcript?language=pt-br#t-81674',
    'https://www.ted.com/talks/kevin_kelly_how_ai_can_bring_on_a_second_industrial_revolution/transcript?language=pt-br',
    'https://www.ted.com/talks/sarah_parcak_help_discover_ancient_ruins_before_it_s_too_late/transcript?language=pt-br',
    'https://www.ted.com/talks/sylvain_duranton_how_humans_and_ai_can_work_together_to_create_better_businesses/transcript?language=pt-br',
    'https://www.ted.com/talks/chieko_asakawa_how_new_technology_helps_blind_people_explore_the_world/transcript?language=pt-br',
    'https://www.ted.com/talks/pierre_barreau_how_ai_could_compose_a_personalized_soundtrack_to_your_life/transcript?language=pt-br',
    'https://www.ted.com/talks/tom_gruber_how_ai_can_enhance_our_memory_work_and_social_lives/transcript?language=pt-br',
];

urls.forEach(createJson);
