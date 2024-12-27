const { chromium } = require("playwright");

async function performAutomation() {
  while (true) {
    try {
      console.log("Starting automation cycle...");

      // Launch browser
      const browser = await chromium.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      const page = await browser.newPage();

      // Step 1: Navigate to the page
      await page.goto("https://isyllabi.com", { waitUntil: "domcontentloaded" });
      console.log("Page loaded.");

      // Step 2: Locate the first iframe
      const iframeElement = await page
        .locator('iframe[name="1431150"]') // Specifically targets the first iframe by name
        .first()
        .contentFrame();

      if (!iframeElement) {
        throw new Error("Iframe not found or could not be accessed.");
      }

      console.log("Iframe located.");

      // Step 3: Click the div inside the iframe's body
      await iframeElement.locator("body div").first().click();
      await page.waitForTimeout(1000);
      console.log("Clicked button, redirecting to new page...");

      // Step 4: Restart the process without waiting for the new page to load fully
      console.log("Restarting the cycle...");
      await browser.close();
    } catch (error) {
      console.error("Error during automation cycle:", error);
    }
  }
}

performAutomation();
