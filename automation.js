const puppeteer = require("puppeteer");

(async () => {
  const url = "https://isyllabi.com";

  // Launch browser
  const browser = await puppeteer.launch({
    headless: true, 
    defaultViewport: null,
  });

  while (true) {
    const page = await browser.newPage(); 
    try {
      console.log("Navigating to the main page...");
      await page.goto(url, { waitUntil: "load" });

      console.log("Waiting for the iframe...");
      const iframeElement = await page.waitForSelector("iframe");

      console.log("Accessing the iframe...");
      const iframe = await iframeElement.contentFrame();

      if (!iframe) {
        throw new Error("Failed to access the iframe.");
      }

      console.log("Looking for the clickable div inside iframe...");
      const clickableDiv = await iframe.waitForSelector("body div");

      console.log("Clicking the div...");
      await clickableDiv.click();
      setTimeout(() => {
      console.log("Redirecting to the new page...");
        
      }, 2000);
      // After redirection, immediately close the page
      
    } catch (err) {
      console.error("Error encountered:", err.message);
    } finally {
      console.log("Closing the page and restarting...");
      await page.close(); // Close the page to start the process again
    }
  }

  // Note: Browser will keep running until you manually stop the script
})();
