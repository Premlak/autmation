const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  const page = await browser.newPage();
  while (true) {
          await page.goto(url, { waitUntil: "load" });
      console.log("At Isyllabi");
      const iframeElement = await page.waitForSelector("iframe");
      const iframe = await iframeElement.contentFrame();
      

      if (!iframe) {
        throw new Error("Failed to access the iframe.");
      }
      console.log("Getting the Link")
      const linkHandle = await iframe.evaluateHandle(() => {
        const firstLink = document.querySelector("a");
        return firstLink ? firstLink.href : null;
      });

      const href = await linkHandle.jsonValue();
      if (!href) {
        throw new Error("No <a> tag found inside the iframe.");
      }
      console.log("Redirecting");
      await page.goto(href, { waitUntil: "domcontentloaded" });
      console.log("Done");
  }
};

module.exports = { scrapeLogic };
