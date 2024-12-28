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
    try {
      console.log("Navigating to the main site...");
      await page.goto("https://isyllabi.com", { waitUntil: "networkidle2" });

      console.log("Waiting for the iframe to load...");
      const iframeElement = await page.waitForSelector("iframe", {
        visible: true,
        timeout: 10000,
      });

      const iframe = await iframeElement.contentFrame();
      if (!iframe) {
        console.log("Iframe not accessible, restarting loop...");
        continue; // Restart the loop
      }

      console.log("Getting the first <a> tag...");
      const href = await iframe.evaluate(() => {
        const firstLink = document.querySelector("a");
        return firstLink ? firstLink.href : null;
      });

      if (!href) {
        console.log("No <a> tag found inside the iframe, restarting loop...");
        continue; // Restart the loop
      }

      console.log("Redirecting to:", href);
      await page.goto(href, { waitUntil: "domcontentloaded" });
      console.log("Redirection successful.");
    } catch (err) {
      console.log("An issue occurred, restarting the loop...");
      // Continue to restart the loop in case of any failure
    }
  }
};

module.exports = { scrapeLogic };
