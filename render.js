// Xuất 10 slide từ slides.html ra slide1.png ... slide10.png (dùng cho index.html).
// Cách chạy:  npm i playwright && npx playwright install chromium && node render.js
// Tuỳ chọn:   SCALE=2 node render.js   (độ nét; mặc định 1.5 => 2304x1296)
//             SLIDES=3,4 node render.js (chỉ xuất một vài slide)
const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const scale = Number(process.env.SCALE || 1.5);
  const browser = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: scale });
  await page.goto('file://' + path.join(__dirname, 'slides.html') + '?render', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(500);
  const only = process.env.SLIDES ? process.env.SLIDES.split(',').map(Number) : null;
  for (let i = 1; i <= 10; i++) {
    if (only && !only.includes(i)) continue;
    if (i === 7) {   // slide 7 có làng pixel: xuất từ slide7-anim.html (dừng ở giây thứ 6)
      const p7 = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: scale });
      await p7.goto('file://' + path.join(__dirname, 'slide7-anim.html') + '?still=6', { waitUntil: 'load' });
      await p7.waitForFunction('window.__ready');
      await p7.evaluate(() => document.fonts.ready);
      await p7.locator('#slide7').screenshot({ path: path.join(__dirname, 'slide7.png') });
      await p7.close();
      console.log('slide7.png (từ slide7-anim.html)');
      continue;
    }
    await page.locator('#slide' + i).screenshot({ path: path.join(__dirname, `slide${i}.png`) });
    console.log('slide' + i + '.png');
  }
  await browser.close();
})();
