const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const absolutify = require("absolutify");
const port = process.env.PORT || 65515;

async function newURL(req, res) {
  const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox']
    });
  const page = await browser.newPage();
  let url = "";

  if (req.query.url.includes("http") || req.query.url.includes("https")) {
    url = req.query.url;
  } else {
    url = `http://${req.query.url}`;
  }

  await page.goto(url);

  let result = await page.evaluate(() => {
    return { html: document.documentElement.outerHTML, url: location.origin };
  });
  result.html = absolutify(result.html, `/url=${result.url}`);

  //Test

  res.send(result.html);

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
