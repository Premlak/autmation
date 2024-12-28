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
      await page.goto("https://isyllabi.com", { waitUntil: "networkidle2" }); // Wait for network to be mostly idle
      console.log("At Isyllabi");

      // Ensure the iframe is available and loaded
      const iframeElement = await page.waitForSelector("iframe", {
        visible: true,
        timeout: 10000, // Wait up to 10 seconds for the iframe to appear
      });

      const iframe = await iframeElement.contentFrame();

      if (!iframe) {
        throw new Error("Failed to access the iframe.");
      }

      console.log("Getting the first <a> tag");
      const href = await iframe.evaluate(() => {
        const firstLink = document.querySelector("a");
        return firstLink ? firstLink.href : null;
      });

      if (!href) {
        throw new Error("No <a> tag found inside the iframe.");
      }

      console.log("Redirecting");
      await page.goto(href, { waitUntil: "domcontentloaded" });
      console.log("Done");
    }
};

module.exports = { scrapeLogic };
