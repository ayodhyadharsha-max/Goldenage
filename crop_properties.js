const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  // Coordinates for the active carousel card in the screenshots (approximate: centered horizontally, vertically below header)
  // Let's create an HTML that will render the screenshots and allow us to take screenshots of the specific divs.
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 20px;
          background: #333;
          display: flex;
          gap: 20px;
          flex-wrap: wrap;
        }
        .crop-container {
          position: relative;
          width: 328px;
          height: 350px;
          overflow: hidden;
          border-radius: 24px;
          border: 2px solid gold;
        }
        .screenshot {
          position: absolute;
          width: 1024px;
          height: 640px;
        }
        
        /* Specific translations for each screenshot */
        /* Center card starts horizontally at x=348 and vertically at y=172 (or y=175) */
        #img-gaia {
          left: -348px;
          top: -172px;
        }
        #img-aranya {
          left: -348px;
          top: -172px;
        }
        #img-florett {
          left: -348px;
          top: -172px;
        }
      </style>
    </head>
    <body>
      <div class="crop-container" id="gaia">
        <img class="screenshot" id="img-gaia" src="file:///Users/rishabhjaiswal/.gemini/antigravity/brain/40f8b27e-8f98-460a-8ed2-05b7a360804e/media__1780122047344.jpg">
      </div>
      
      <div class="crop-container" id="aranya">
        <img class="screenshot" id="img-aranya" src="file:///Users/rishabhjaiswal/.gemini/antigravity/brain/40f8b27e-8f98-460a-8ed2-05b7a360804e/media__1780122047277.png">
      </div>
      
      <div class="crop-container" id="florett">
        <img class="screenshot" id="img-florett" src="file:///Users/rishabhjaiswal/.gemini/antigravity/brain/40f8b27e-8f98-460a-8ed2-05b7a360804e/media__1780122106811.png">
      </div>
    </body>
    </html>
  `;
  
  const tempHtmlPath = path.join(__dirname, 'crop_all.html');
  fs.writeFileSync(tempHtmlPath, htmlContent);
  
  await page.setViewportSize({ width: 1200, height: 1200 });
  await page.goto(`file://${tempHtmlPath}`);
  await page.waitForTimeout(1000); // Wait for images to load
  
  // Create assets directory if not exists
  const assetsDir = path.join(__dirname, 'assets');
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir);
  }
  
  // Crop BPTP Gaia
  const gaiaDiv = await page.$('#gaia');
  await gaiaDiv.screenshot({ path: path.join(assetsDir, 'bptp-gaia.png') });
  console.log("BPTP Gaia cropped.");
  
  // Crop Sobha Aranya Floor Plan
  const aranyaDiv = await page.$('#aranya');
  await aranyaDiv.screenshot({ path: path.join(assetsDir, 'sobha-aranya.png') });
  console.log("Sobha Aranya cropped.");
  
  // Crop Paras Florett
  const florettDiv = await page.$('#florett');
  await florettDiv.screenshot({ path: path.join(assetsDir, 'paras-florett.png') });
  console.log("Paras Florett cropped.");
  
  // Copy raw BPTP Downtown 66 image
  const rawDowntownPath = '/Users/rishabhjaiswal/.gemini/antigravity/brain/40f8b27e-8f98-460a-8ed2-05b7a360804e/media__1780122046964.jpg';
  const destDowntownPath = path.join(assetsDir, 'bptp-downtown66.png');
  fs.copyFileSync(rawDowntownPath, destDowntownPath);
  console.log("BPTP Downtown 66 copied.");
  
  // Clean up
  fs.unlinkSync(tempHtmlPath);
  await browser.close();
  console.log("All operations completed successfully!");
})();
