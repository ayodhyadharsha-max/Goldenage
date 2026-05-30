const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const files = [
    'media__1780125664166.png',
    'media__1780125705946.jpg',
    'media__1780125745809.jpg'
  ];

  for (const f of files) {
    const filePath = `/Users/rishabhjaiswal/.gemini/antigravity/brain/40f8b27e-8f98-460a-8ed2-05b7a360804e/${f}`;
    if (fs.existsSync(filePath)) {
      await page.goto(`file://${filePath}`);
      const dims = await page.evaluate(() => {
        const img = document.querySelector('img');
        return img ? { w: img.naturalWidth, h: img.naturalHeight } : null;
      });
      console.log(`${f}: ${dims ? dims.w + 'x' + dims.h : 'unknown'}`);
    } else {
      console.log(`${f} does not exist`);
    }
  }
  await browser.close();
})();
