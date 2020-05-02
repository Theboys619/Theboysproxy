const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const port = process.env.PORT || 65515;
let browser;

async function newURL(req, res) {
  if (!browser) {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
  }

  const page = await browser.newPage();
  let url = "";

  if (req.query.url.includes("http") || req.query.url.includes("https")) {
    url = req.query.url;
  } else {
    url = `http://${req.query.url}`;
  }

  await page.goto(url);

  let result = await page.evaluate(() => {
    return document.documentElement.outerHTML;
  });

  await browser.close();
}

app.get("/", (req, res) => {
  if (!req.query.url) {
    res.end("No URL provided");
  } else {
    newURL(req, res);
  }
});

app.listen(port, () => {
  console.clear();
  console.log("App listening on %s", port);
});
