/* PostFX: lớp hậu kỳ "nâng cấp đồ hoạ" đặt đè lên canvas pixel (không sửa logic cảnh).
   - soft  : bản phóng to có làm mịn, trộn nhẹ lên -> bo tròn góc pixel, bớt cảm giác 1-2 bit
   - bloom : vùng sáng (đèn, nắng, cửa sổ) toả quầng sáng mềm (mix-blend screen)
   - rays  : tia nắng/ánh sáng xiên, nhấp nháy rất chậm (tuỳ chọn)
   - vign  : tối góc + chuyển màu (mix-blend multiply)
   - grain : nhiễu hạt phim rất nhẹ (mix-blend overlay)
   Dùng: PostFX.attach('#scene', { bloom:.4, soft:.45, vign:.5, grain:.1, rays:{x:.8,y:0,color:'255,214,150',a:.22}, grade:'rgba(255,190,120,.10)' }) */
(function () {
  function mk(parent, w, h, css, blend, op) {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    c.style.cssText = 'position:absolute;pointer-events:none;image-rendering:auto;width:' + css.w + 'px;height:' + css.h + 'px;left:' + css.l + 'px;top:' + css.t + 'px;mix-blend-mode:' + blend + ';opacity:' + op + ';';
    parent.appendChild(c); return c;
  }
  function attach(sel, o) {
    o = Object.assign({ bloom: 0.38, soft: 0.42, vign: 0.5, grain: 0.1, rays: null, grade: null }, o || {});
    const src = document.querySelector(sel); if (!src) return;
    const par = src.parentElement, css = { w: src.offsetWidth, h: src.offsetHeight, l: src.offsetLeft, t: src.offsetTop };
    const BW = Math.round(css.w / 2), BH = Math.round(css.h / 2);
    const soft = mk(par, css.w, css.h, css, 'normal', o.soft), sx = soft.getContext('2d');
    const bl = mk(par, BW, BH, css, 'screen', o.bloom), bx = bl.getContext('2d');
    // tia sáng + tối góc + hạt: vẽ một lần
    if (o.rays) {
      const r = mk(par, BW, BH, css, 'screen', 1), rx = r.getContext('2d'), R = o.rays;
      const ox = R.x * BW, oy = R.y * BH;
      for (let i = 0; i < 6; i++) {
        const ang = (R.ang0 !== undefined ? R.ang0 : 1.15) + i * 0.17 + (i % 2) * 0.05, len = Math.hypot(BW, BH) * 1.3, wdt = 0.05 + (i % 3) * 0.025;
        const gr = rx.createLinearGradient(ox, oy, ox + Math.cos(ang) * len, oy + Math.sin(ang) * len);
        gr.addColorStop(0, 'rgba(' + R.color + ',' + R.a + ')'); gr.addColorStop(1, 'rgba(' + R.color + ',0)');
        rx.fillStyle = gr; rx.beginPath(); rx.moveTo(ox, oy);
        rx.lineTo(ox + Math.cos(ang - wdt) * len, oy + Math.sin(ang - wdt) * len); rx.lineTo(ox + Math.cos(ang + wdt) * len, oy + Math.sin(ang + wdt) * len); rx.fill();
      }
      r.style.filter = 'blur(3px)'; r.style.animation = 'pfpulse 6s ease-in-out infinite';
      if (!document.getElementById('pfstyle')) { const st = document.createElement('style'); st.id = 'pfstyle'; st.textContent = '@keyframes pfpulse{0%,100%{opacity:.55}50%{opacity:1}}'; document.head.appendChild(st); }
    }
    const vg = mk(par, BW, BH, css, 'multiply', 1), vx = vg.getContext('2d');
    const rg = vx.createRadialGradient(BW / 2, BH / 2, Math.min(BW, BH) * 0.35, BW / 2, BH / 2, Math.hypot(BW, BH) * 0.62);
    const k = Math.round(255 * (1 - o.vign * 0.75));
    rg.addColorStop(0, 'rgb(255,255,255)'); rg.addColorStop(1, 'rgb(' + k + ',' + Math.round(k * 0.92) + ',' + Math.round(k * 0.86) + ')');
    vx.fillStyle = rg; vx.fillRect(0, 0, BW, BH);
    if (o.grade) { vx.fillStyle = o.grade; vx.globalCompositeOperation = 'soft-light'; vx.fillRect(0, 0, BW, BH); }
    if (o.grain) {
      const gn = mk(par, 160, 120, css, 'overlay', o.grain * 2.2), gx = gn.getContext('2d'), id = gx.createImageData(160, 120);
      let s = 12345; for (let i = 0; i < id.data.length; i += 4) { s = (s * 1664525 + 1013904223) >>> 0; const v = 96 + (s >>> 24) % 64; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
      gx.putImageData(id, 0, 0);
    }
    function frame() {
      sx.imageSmoothingEnabled = true; sx.imageSmoothingQuality = 'high';
      sx.clearRect(0, 0, css.w, css.h); sx.drawImage(src, 0, 0, css.w, css.h);
      bx.clearRect(0, 0, BW, BH); bx.filter = 'brightness(.8) contrast(1.9) saturate(1.3) blur(5px)'; bx.drawImage(src, 0, 0, BW, BH); bx.filter = 'none';
    }
    const STILL = /[?&]still=/.test(location.search);
    if (STILL) { const iv = setInterval(() => { if (window.__ready) { frame(); window.__pfReady = true; clearInterval(iv); } }, 30); }
    else (function loop() { frame(); requestAnimationFrame(loop); })();
  }
  window.PostFX = { attach };
})();
