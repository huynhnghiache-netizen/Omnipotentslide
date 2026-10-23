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
    if (i === 4) {   // slide 4 có phố pixel: xuất từ slide4-anim.html (dừng ở giây thứ 9)
      const p4 = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: scale });
      await p4.goto('file://' + path.join(__dirname, 'slide4-anim.html') + '?still=9', { waitUntil: 'load' });
      await p4.waitForFunction('window.__ready');
      await p4.evaluate(() => document.fonts.ready);
      await p4.locator('#slide4').screenshot({ path: path.join(__dirname, 'slide4.png') });
      await p4.close();
      console.log('slide4.png (từ slide4-anim.html)');
      continue;
    }
    if (i === 6) {   // slide 6 có sân giếng pixel: xuất từ slide6-anim.html (dừng ở giây thứ 6.5)
      const p6 = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: scale });
      await p6.goto('file://' + path.join(__dirname, 'slide6-anim.html') + '?still=6.5', { waitUntil: 'load' });
      await p6.waitForFunction('window.__ready');
      await p6.evaluate(() => document.fonts.ready);
      await p6.locator('#slide6').screenshot({ path: path.join(__dirname, 'slide6.png') });
      await p6.close();
      console.log('slide6.png (từ slide6-anim.html)');
      continue;
    }
    if (i === 9) {   // slide 9 có phòng ký ức pixel: xuất từ slide9-anim.html (dừng ở giây thứ 17)
      const p9 = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: scale });
      await p9.goto('file://' + path.join(__dirname, 'slide9-anim.html') + '?still=17', { waitUntil: 'load' });
      await p9.waitForFunction('window.__ready');
      await p9.evaluate(() => document.fonts.ready);
      await p9.locator('#slide9').screenshot({ path: path.join(__dirname, 'slide9.png') });
      await p9.close();
      console.log('slide9.png (từ slide9-anim.html)');
      continue;
    }
    if (i === 8) {   // slide 8 có dải cảnh 1980 | 2020s: xuất từ slide8-anim.html (dừng ở giây thứ 9)
      const p8 = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: scale });
      await p8.goto('file://' + path.join(__dirname, 'slide8-anim.html') + '?still=9', { waitUntil: 'load' });
      await p8.waitForFunction('window.__ready');
      await p8.evaluate(() => document.fonts.ready);
      await p8.locator('#slide8').screenshot({ path: path.join(__dirname, 'slide8.png') });
      await p8.close();
      console.log('slide8.png (từ slide8-anim.html)');
      continue;
    }
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
    if (i === 10) {   // slide 10 là cảnh kết: xuất khung sân khấu từ slide10-anim.html (giây thứ 17)
      const p10 = await browser.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: scale });
      await p10.goto('file://' + path.join(__dirname, 'slide10-anim.html') + '?still=17', { waitUntil: 'load' });
      await p10.waitForFunction('window.__ready');
      await p10.evaluate(() => document.fonts.ready);
      await p10.screenshot({ path: path.join(__dirname, 'slide10.png') });
      await p10.close();
      console.log('slide10.png (từ slide10-anim.html)');
      continue;
    }
    await page.locator('#slide' + i).screenshot({ path: path.join(__dirname, `slide${i}.png`) });
    console.log('slide' + i + '.png');
  }
  await browser.close();
})();
