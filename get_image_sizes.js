const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  const files = [
    'media__1780122046964.jpg',
    'media__1780122047084.png',
    'media__1780122047230.png',
    'media__1780122047277.png',
    'media__1780122047344.jpg'
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
