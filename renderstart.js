// Xuất khung ĐẦU (giây 0) của các slide có hoạt ảnh -> slideN-s.webp, dùng làm ảnh tĩnh lúc chuyển slide
// để lúc iframe hoạt ảnh hiện lên thì khớp y hệt, không bị "giật" một nhịp.   Chạy: CHROMIUM=... node renderstart.js
const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {});
  for (const n of (process.env.SLIDES || '1,4,5,6,7,8,9').split(',').map(Number)) {
    const p = await b.newPage({ viewport: { width: 1536, height: 864 }, deviceScaleFactor: 1.5 });
    await p.goto('file://' + path.join(__dirname, `slide${n}-anim.html`) + '?still=0', { waitUntil: 'load' });
    await p.waitForFunction('window.__ready', null, { timeout: 15000 }).catch(() => {});
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.locator('#slide' + n).screenshot({ path: path.join(__dirname, `slide${n}-s.png`) });
    await p.close(); console.log('slide' + n + '-s.png');
  }
  await b.close();
})();
