const { chromium } = require('playwright');

(async () => {
  console.log("Launching browser...");
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const fileUrl = 'file:///Users/rishabhjaiswal/.gemini/antigravity/scratch/gurgaon-luxury-landing/index.html';
  
  // 1. Desktop View Screenshot
  console.log("Setting desktop viewport...");
  await page.setViewportSize({ width: 1440, height: 900 });
  console.log(`Navigating to: ${fileUrl}`);
  await page.goto(fileUrl);
  await page.waitForTimeout(1000); // Wait for fonts and CSS to render
  
  const desktopPath = '/Users/rishabhjaiswal/.gemini/antigravity/brain/40f8b27e-8f98-460a-8ed2-05b7a360804e/desktop_preview.png';
  console.log(`Saving desktop screenshot to: ${desktopPath}`);
  await page.screenshot({ path: desktopPath, fullPage: false });

  // 2. Mobile View Screenshot
  console.log("Setting mobile viewport...");
  await page.setViewportSize({ width: 375, height: 812 });
  // Reload to trigger resize calculations
  await page.goto(fileUrl);
  await page.waitForTimeout(1000);
  
  const mobilePath = '/Users/rishabhjaiswal/.gemini/antigravity/brain/40f8b27e-8f98-460a-8ed2-05b7a360804e/mobile_preview.png';
  console.log(`Saving mobile screenshot to: ${mobilePath}`);
  await page.screenshot({ path: mobilePath, fullPage: false });

  await browser.close();
  console.log("All screenshots captured successfully!");
})();
