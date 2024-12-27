const puppeteer = require("puppeteer");
require("dotenv").config();

const scrapeLogic = async (res) => {
  const browser = await puppeteer.launch({
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

  try {
    while (true) {
      const page = await browser.newPage();

      // Navigate to the target website
      await page.goto("https://isyllabi.com", { waitUntil: "domcontentloaded" });
      console.log("Page loaded.");

      // Wait for the iframe to load
      const iframeElement = await page.waitForSelector('iframe[name="1431150"]');
      const iframe = await iframeElement.contentFrame();

      if (!iframe) {
        throw new Error("Iframe not found or could not be accessed.");
      }
      console.log("Switched to the iframe.");

      // Wait for the div inside the iframe body and click it
      const targetDiv = await iframe.waitForSelector("body div", {
        visible: true,
      });
      if (!targetDiv) {
        throw new Error("Target div not found inside the iframe.");
      }
      await targetDiv.click();
      console.log("Clicked on the div inside the iframe.");

      // Wait for a few seconds before the next iteration
      await page.waitForTimeout(3000);

      // Close the page after completing the cycle
      await page.close();
    }
  } catch (e) {
    console.error("Error during automation cycle:", e);
    res.send(`Something went wrong while running Puppeteer: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { scrapeLogic };
