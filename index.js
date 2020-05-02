const express = require("express");
const app = express();
const puppeteer = require("puppeteer");
const port = process.env.PORT || 65515;

(async () => {
  const browser = await puppeteer.launch({
    headless: true
  });
  const page = await browser.newPage();

  await page.goto("https://github.com");

  let result = await page.evaluate((document) => {
    console.log(document.outerHTML);
  });

  await browser.close();

})();

app.get("/", (req, res) => {
  if (!req.query) {
    res.end("No URL provided");
  }
});

app.listen(port, () => {
  console.clear();
  console.log("App listening on %s", port);
});
