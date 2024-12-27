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

  while (true) {
    try {
      console.log("Starting automation cycle...");

      // Launch browser in headless mode
      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      // Go to the website
      await page.goto("https://isyllabi.com", { waitUntil: "domcontentloaded" });
      console.log("Page loaded.");

      // Wait for the iframe element to load
      await page.waitForSelector("iframe", { timeout: 10000 });
      console.log("Iframe found.");

      // Access iframe's document
      const frames = page.frames();
      const iframe = frames.find(frame => frame.url().includes("isyllabi.com"));
      if (!iframe) {
        throw new Error("Iframe not found.");
      }

      // Wait for the div inside the iframe
      const buttonSelector = "body div"; // Adjust selector as per your structure
      await iframe.waitForSelector(buttonSelector);

      // Click the button
      await iframe.click(buttonSelector);
      console.log("Clicked button, redirecting to new page...");

      // Skip waiting for navigation and restart the step
      console.log("Restarting the cycle...");
      await browser.close();
    } catch (error) {
      console.error("Error during automation cycle:", error);
    }
  }
};

module.exports = { scrapeLogic };
