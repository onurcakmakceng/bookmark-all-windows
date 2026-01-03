const puppeteer = require('puppeteer');
const path = require('path');

const screenshots = [
  { file: 'screenshot-1.html', output: 'screenshot-1-1280x800.png', width: 1280, height: 800 },
  { file: 'screenshot-2.html', output: 'screenshot-2-1280x800.png', width: 1280, height: 800 },
  { file: 'screenshot-3.html', output: 'screenshot-3-1280x800.png', width: 1280, height: 800 },
  { file: 'small-tile-440x280.html', output: 'small-tile-440x280.png', width: 440, height: 280 },
  { file: 'marquee-1400x560.html', output: 'marquee-1400x560.png', width: 1400, height: 560 },
];

(async () => {
  const browser = await puppeteer.launch();
  
  for (const { file, output, width, height } of screenshots) {
    const page = await browser.newPage();
    await page.setViewport({ width, height, deviceScaleFactor: 1 });
    
    const filePath = `file://${path.join(__dirname, file)}`;
    await page.goto(filePath, { waitUntil: 'networkidle0' });
    
    await page.screenshot({
      path: path.join(__dirname, output),
      clip: { x: 0, y: 0, width, height }
    });
    
    console.log(`Generated: ${output}`);
    await page.close();
  }
  
  await browser.close();
  console.log('All screenshots generated!');
})();

