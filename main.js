const puppeteer = require("puppeteer");
let href = null;
let state = false;
let visited = 0;

async function findFirstHrefInIframe(frame) {
  try {
    await frame.waitForFunction(() => document.readyState === "complete", { timeout: 10000 });
    const link = await frame.evaluate(() => {
      const findLink = (node) => {
        if (node.tagName === "A" && node.href) return node.href;
        for (const child of node.children || []) {
          const result = findLink(child);
          if (result) return result;
        }
        return null;
      };
      return findLink(document.body);
    });
    if (link) return link;
    const childFrames = frame.childFrames();
    for (const childFrame of childFrames) {
      const nestedHref = await findFirstHrefInIframe(childFrame);
      if (nestedHref) return nestedHref;
    }
  } catch (error) {
    return null;
  }
  return null;
}

async function updateHref(browser) {
  const page = await browser.newPage();
  while (true) {
    console.log("updater is called");
    try {
      await page.goto("https://www.isyllabi.com", { waitUntil: "load" });
      const allFrames = page.frames();
      for (const frame of allFrames) {
        if (frame !== page.mainFrame()) {
          const foundHref = await findFirstHrefInIframe(frame);
          if (foundHref) {
            href = foundHref;
            console.log("Updated href:");
            if (!state) {
              state = true;
              visitHref(browser);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error occurred:", error);
    }
  }
}

async function visitHref(browser) {
  console.log("visitor is called");
  const page = await browser.newPage();
  while (true) {
    if (href) {
      try {
        await page.goto(href, { waitUntil: "domcontentloaded" });
        visited++;
        console.log("Visited Time = ", visited);
      } catch (error) {
        console.error("Error visiting href:", error);
      }
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
  });
  await updateHref(browser);
}

main();
