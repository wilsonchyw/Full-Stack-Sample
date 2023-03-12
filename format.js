const fs = require("fs");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const pdf = require("./pdf");

puppeteer.use(StealthPlugin());

const sleep = async (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));
const SUMMARY = `• 2+ years of experience in web design and development
• Motivated developer who excited to learn new things after work
• Highly skilled in interpersonal and communication with 6+ years of related experience
• Legal to work in Canada without employer’s visa sponsorship`;

const JOB_TOTAL = ".jobs-search-results-list__subtitle";
const JOB_RESULT_CONTAINER = ".jobs-search-results-list";
const JOB_TITLE = ".job-card-list__title";

const TITLE = ".jobs-unified-top-card__job-title";
const COMPANY = ".jobs-unified-top-card__company-name";

const EASYAPPLY = ".jobs-apply-button--top-card > button";
const NEXT = "button[aria-label='Continue to next step']";
const UPLOAD_BUTTON = ".jobs-document-upload__section-title";
const UPLOAD_INPUT = "input[type=file]";

const MODEL = ".jobs-easy-apply-modal";
const MODEL_TITLE = "h3";

const QUESTION_FRAME = ".jobs-easy-apply-form-section__grouping";

const MODEL_APPLY_SUCCESS = ".artdeco-modal__content";
const MODEL_APPLY_SUCCESS_DISMISS = 'button[aria-label="Dismiss"]';
//fb-form-element mt4 jobs-easy-apply-form-element
//<ul data-count="0" aria-label="Results" role="listbox" id="ember745-a11y" class="artdeco-typeahead__results-list ember-view hidden fb-typeahead__results-list mt1">
//<ul data-count="20" aria-label="Results" role="listbox" id="ember745-a11y" class="artdeco-typeahead__results-list ember-view hidden fb-typeahead__results-list mt1">
async function waitAndRepert(page, selector, callback) {
    try {
        await page.waitForSelector(selector, { timeout: 5000 });
    } catch (e) {
        await callback();
        await waitAndRepert(page, selector, callback);
    }
}

async function handleCityQuestioner(page) {
    const input = ".artdeco-typeahead__input";
    await page.click(input);
    await page.type(input, "Richmond, British Columbia, Canad");
    const firstElement = ".jobs-easy-apply-form-section__grouping ul li";
    let city = await page.$eval(firstElement, (el) => el.innerText);
    while (city != "Richmond, British Columbia, Canada") {
        await sleep();
        city = await page.$eval(firstElement, (el) => el.innerText);
    }
    await page.waitForSelector(firstElement);
    await page.click(firstElement);
    await clickNext(page);
}

async function handleCoverLetterUpload(page, company, title) {
    try {
        if (await hasElement(page, UPLOAD_BUTTON)) {
            await pdf.pdf(company, title);
            const elementHandle = await page.$(UPLOAD_INPUT);
            await elementHandle.uploadFile("./Cover letter-Wilson Yip.pdf");
        } else if (await hasElement(page, "textarea")) {
            const coverLetter = pdf.string(company, title);
            await page.type("textarea", coverLetter);
        }
        //await page.waitForSelector(UPLOAD_BUTTON,{ timeout: 5000 })
        //await waitAndRepert(page, UPLOAD_BUTTON, async () => await clickNext(page));
        await clickNext(page);
    } catch {
        throw "Cover letter step fail";
    }
}

async function handleWebsiteQuestions(page) {
    await clickNext(page);
}

async function handleContent(page) {
    console.log("handleContent");
    const rows = await page.$$(".jobs-easy-apply-form-section__grouping");
    for (const row of rows) {
        try {
            /**
            const label = await row.$eval(".fb-form-element-label__title--is-required",el=>el.innerText)
            console.log("handleContent->label",label)
            if(label == "Summary"){
                await row.focus("textarea")
                await row.keyboard.type("textarea",SUMMARY)
            }*/
            const label = await row.$eval(".fb-form-element-label__title--is-required", (el) => el.innerText);
            (await row.$eval("input", (el) => el.value)) != "";
        } catch {
            throw label;
            continue;
        }
    }
}

async function handleQuestion(page) {
    const frames = await page.$$(QUESTION_FRAME);
    for (const frame of frames) {
        let question;
        try {
            question = (await frame.$eval("label", (el) => el.innerText)).toLowerCase();
            console.log("Question->", question);
            if (!question.includes("required")) continue;
            let option = "yes";
            if (/(hear.*job)/.test(question)) {
                option = "linkedin";
            } else if (/relocat.*assist/.test(question)) {
                option = await getOptionValueByText("no", frame);
            } else if (/authoriz/.test(question)) {
                //option = "yes"
            } else if (/sponsorship/.test(question)) {
                //option = await getOptionValueByText("no", frame);
                option = "No";
            } else if (/privacy/.test(question)) {
                //option = await getOptionValueByText("yes", frame);
                option = "Yes";
            } else if (/proficiency.*French/.test(question)) {
                option = await getOptionValueByText("None", frame);
            } else if (/Degree/.test(question)) {
                option = await getOptionValueByText("yes", frame);
            } else if (/work experience/.test(question)) {
                option = await getOptionValueByText("yes", frame);
            }
            console.log("Option->", option);
            //await frame.select("select.fb-dropdown__select", option[0].value);
            //if(/[0-9]/.test(option)) option=parseInt(option)
            if (await hasElement(row, "select")) {
                const el = await frame.$("select");
                await el.type(option);
            } else if (await hasElement(row, "input")) {
                const el = await frame.$("input");
                await el.type(option);
            } else {
                throw question;
            }
        } catch {
            throw question;
        }
    }
    await clickNext(page);
}

async function hasElement(page, selector) {
    return await page.evaluate((selector) => {
        let el = document.querySelector(selector);
        return el;
    }, selector);
}

async function getOptionValueByText(s, el) {
    const options = await el.$$eval("option", (els) => els.map((el) => el.innerText));
    console.log("options->", options, " s->", s);
    return options.filter((v) => v.toLowerCase().includes(s))[0];
}

async function handleAdditional(page) {
    const questionGroup = await page.$$(".jobs-easy-apply-form-section__grouping");
}

async function clickNext(page) {
    const frame = await page.$(MODEL);
    const buttons = await frame.$$("button");
    await [...buttons].at(-1).click();
}

function saveSuccess(id, company, position) {
    const obj = { date: new Date().toGMTString(), id, company, position };
    fs.appendFile("success_id.txt", id + "\n", function (err) {
        if (err) console.error(err);
    });
    fs.readFile("success.json", function (err, data) {
        const json = JSON.parse(data);
        json.push(obj);
        fs.writeFile("success.json", JSON.stringify(json), function (err) {
            if (err) console.error(err);
            console.info(`Success applied ${position} in ${company}`);
        });
    });
}

function getScrapedId() {
    const buf = fs.readFileSync("success_id.txt");
    const ids = buf.toString().split(/\n/);
    return new Set(ids);
}

function saveFail(url, err) {
    const obj = { date: new Date().toGMTString(), url, err };
    fs.readFile("fail.json", function (err, data) {
        const json = JSON.parse(data);
        json.push(obj);
        fs.writeFile("fail.json", JSON.stringify(json), function (err) {
            if (err) console.error(err);
            console.info(`Apply fail ${new Date().toGMTString()}`);
        });
    });
}

async function getJobUrls(page) {
    const urls = [];
    let totalJobs = Infinity;
    const scrollStep = 750;

    for (let j = 0; j < 5; j++) {
        await page.evaluate(
            (selector, scrollStep) => {
                const jobContainer = document.querySelector(selector);
                if (jobContainer) jobContainer.scrollBy(0, scrollStep);
            },
            JOB_RESULT_CONTAINER,
            scrollStep
        );
        await sleep();
    }
    const result = await page.$$eval(JOB_TITLE, (nodes) => nodes.map((node) => node.href));
    return result;
}

async function apply(page, url) {
    try {
        const jobId = url.match(/[0-9]{10}/)[0];
        await page.goto(url);
        await page.waitForSelector(EASYAPPLY, { timeout: 5000 });
        const title = await page.$eval(TITLE, (el) => el.innerText);
        const company = await page.$eval(COMPANY, (el) => el.innerText);
        await page.click(EASYAPPLY);

        // After easy apply is click, the basic information page
        await waitAndRepert(page, NEXT, async () => await page.click(EASYAPPLY));
        await clickNext(page);

        let current = await page.$eval(MODEL_TITLE, (el) => el.innerText);
        let last = "";
        let counter = 0;
        while (current != "Review your application" && counter++ < 5) {
            console.log("current->", current);
            if (current == last) {
                await sleep(1000);
                last = current;
                current = await page.$eval(MODEL_TITLE, (el) => el.innerText);
                continue;
            }
            if (current == "Home address") {
                await handleCityQuestioner(page);
            } else if (current == "Resume") {
                await handleCoverLetterUpload(page, company, title);
            } else if (current == "Screening questions") {
                await handleWebsiteQuestions(page);
            } else if (current == "Additional") {
                await handleQuestion(page);
            } else if (current == "Contact info") {
                await handleContent(page);
            } else {
                await clickNext(page);
                continue;
            }
            counter = 0;
            last = current;
            current = await page.$eval(MODEL_TITLE, (el) => el.innerText);
        }
        await page.click('button[aria-label="Submit application"]');
        await page.waitForSelector(MODEL_APPLY_SUCCESS);
        await page.waitForSelector(MODEL_APPLY_SUCCESS_DISMISS);
        await page.click(MODEL_APPLY_SUCCESS_DISMISS);
        await page.waitForSelector(MODEL_APPLY_SUCCESS, { hidden: true });
        saveSuccess(jobId, company, title);
        await sleep(1);
    } catch (e) {
        saveFail(url, e);
        console.log(e);
    }
}

async function run() {
    let counter = 1;
    const step = 25;
    const scrapedId = getScrapedId();
    const browser = await puppeteer.launch({
        defaultViewport: null,
        headless: false,
        args: ["--no-sandbox", "--disable-setuid-sandbox", "--window-size=1920,1080", "--user-data-dir=./chrome"],
    });
    const baseUrl = `https://www.linkedin.com/jobs/search/?currentJobId=3325620164&f_AL=true&f_E=2&f_WT=2&geoId=101174742`;
    //const url = "https://www.linkedin.com/jobs/view/3322076042/?eBP=JOB_SEARCH_ORGANIC&refId=Ol4NIZcX52%2BuLHAv2ku0Tw%3D%3D&trackingId=a%2FFVim4k%2FQRnFNo9ZEuj8g%3D%3D&trk=flagship3_search_srp_jobs"

    const page = await browser.newPage();
    await page.goto(baseUrl);
    const jobTotal = await page.$eval(JOB_TOTAL, (el) => parseInt(el.innerText));
    console.log(`Total ${jobTotal} jobs`);
    for (let i = 0; i < jobTotal; i += 25) {
        const jobsUrl = baseUrl + `&start=${i}`;
        if (i > 0) await page.goto(jobsUrl);
        const urls = await getJobUrls(page);
        const newTab = await browser.newPage();
        for (const url of urls) {
            console.log(`Getting ${counter++}/${jobTotal} job`);
            const jobId = url.match(/[0-9]{10}/)[0];
            if (scrapedId.has(jobId)) {
                console.log(`${jobId} applied, skip`);
                continue;
            }
            await apply(newTab, url);
        }
    }

    //if(scrapedId.has(jobId)) continue
    await page.goto(url);
    //

    //const html = await page.content()
    //fs.writeFileSync("source.html",html)
}

async function test(page) {
    await page.type(".search-global-typeahead__input.always-show-placeholder", "test'testtest");
}

run();
