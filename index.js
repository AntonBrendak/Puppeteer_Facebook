require('dotenv').config()
const express = require('express');
var cors = require('cors');
var morgan = require('morgan');
var bodyParser = require('body-parser');

const puppeteer = require('puppeteer');
const fs = require('fs');
const config = require('./config.json');
const cookies = require('./cookies.json');

const route = require('./Routes/index.js');

const app = express();
(async () => {
	let browser = await puppeteer.launch({ headless: false });
	const context = browser.defaultBrowserContext();
	context.overridePermissions("https://www.facebook.com", []);
	let page = await browser.newPage();
	await page.setDefaultNavigationTimeout(100000);
	await page.setViewport({ width: 1200, height: 800 });
	if (!Object.keys(cookies).length) {
		// login sector
		await page.goto("https://www.facebook.com/login", { waitUntil: "networkidle2" });
		await page.type("#email", config.username, { delay: 30 })
		await page.type("#pass", config.password, { delay: 30 })
		await page.click("#loginbutton");
		
		//create sector
		await page.waitForNavigation({ waitUntil: "networkidle0" });
		await page.goto("https://www.facebook.com/pages/creation/?ref_type=launch_point", { waitUntil: "networkidle2" });
		await page.type('input[type="text"]', "dogecoin fan", { delay: 30 })
		await page.type('input[class="g5ia77u1 gcieejh5 bn081pho humdl8nn izx4hr6d rq0escxv oo9gr5id nc684nl6 jagab5yi knj5qynh fo6rh5oj fv0vnmcu ggphbty4 aov4n071 bi6gxh9e d2edcug0 lzcic4wl ieid39z1 aj8hi1zk r4fl40cc kd8v7px7 m07ooulj mzan44vs"]', "news", { delay: 30 })
		await page.waitForTimeout(1000);
		
		await page.click('li[id="1758418281071392"]');
		const buttons = await page.$x('//div[@class="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw taijpn5t bp9cbjyn owycx6da btwxx1t3 c4xchbtz by2jbhx6"]');
		await buttons[0].click();
		
		await page.waitForTimeout(15000);
		
		//save sector
		const fileInput= await page.$('input[type=file]');
		await fileInput.uploadFile("./dogecoin.jpg");
		
		await page.waitForTimeout(1000);
		
		const buttonsSave = await page.$x('//div[@class="n00je7tq arfg74bv qs9ysxi8 k77z8yql i09qtzwb n7fi1qx3 b5wmifdl hzruof5a pmk7jnqg j9ispegn kr520xx4 c5ndavph art1omkt ot9fgl3s rnr61an3"]');
		await buttonsSave[0].click();

		// upload cokies
		fs.writeFileSync('./cookies.json', JSON.stringify(currentCookies));
	} else{
		//User Already Logged In
		await page.setCookie(...cookies);
		await page.goto("https://www.facebook.com/", { waitUntil: "networkidle2" });
	}
})();

app.use(cors());
app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route);

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});