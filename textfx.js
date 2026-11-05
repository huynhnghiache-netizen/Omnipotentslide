/* TextFX: hiệu ứng chữ theo chủ đề cho slide 1-9 (dùng chung).
   - Cứ ~1 giây vài chữ cái (2-4) "nhiễm" hiệu ứng của chủ đề (lửa, điện, nước, nhiễu TV...) rồi trở lại bình thường.
   - Chỉ đổi màu / bóng chữ + vài hạt nhỏ, KHÔNG đổi bố cục nên luôn dễ đọc.
   - Thêm bụi mờ trôi trên giấy và một vệt sáng chạy dọc đường kẻ dưới tiêu đề.
   Dùng:  TextFX.init({ theme: 'fire' })  hoặc  TextFX.init({ theme:'water', map: { '.c1': 'water', '.c2': 'electric' } })
   Không chạy khi ?still / ?render, hoặc khi người dùng bật "giảm chuyển động". */
(function () {
  const Q = location.search;
  if (/still=|render/.test(Q) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)) { window.TextFX = { init() {} }; return; }

  // ---- bảng hiệu ứng: cls = lớp CSS đổi màu chữ; col = màu hạt; kind = kiểu hạt ----
  const FX = {
    fire:     { cls: 'tf-fire',  dur: 1100, parts: { n: 5, col: ['255,150,50', '255,200,90', '240,90,30'], vy: -46, vx: 14, life: 900, size: 2.6, glow: true } },
    electric: { cls: 'tf-elec',  dur: 520,  zap: true, parts: { n: 3, col: ['255,236,130', '255,255,220'], vy: 0, vx: 60, life: 260, size: 2, glow: true } },
    water:    { cls: 'tf-water', dur: 1300, parts: { n: 3, col: ['70,150,200', '120,190,225'], vy: 70, vx: 4, life: 900, size: 3, drop: true, ring: true } },
    glitch:   { cls: 'tf-glitch', dur: 480, parts: { n: 0 }, bars: true },
    sepia:    { cls: 'tf-sepia', dur: 1400, parts: { n: 4, col: ['150,110,70', '190,150,100'], vy: -10, vx: 12, life: 1300, size: 1.8 } },
    glow:     { cls: 'tf-glow',  dur: 1700, parts: { n: 4, col: ['255,214,120', '255,236,170'], vy: -16, vx: 10, life: 1500, size: 2.2, glow: true } },
    puff:     { cls: 'tf-puff',  dur: 1300, parts: { n: 3, col: ['120,110,100', '150,140,130'], vy: -24, vx: 8, life: 1300, size: 4.5, soft: true } },
    glint:    { cls: 'tf-glint', dur: 900,  parts: { n: 3, col: ['255,230,150', '255,250,220'], vy: -6, vx: 10, life: 800, size: 2, star: true, glow: true } }
  };

  const css = document.createElement('style');
  css.textContent = `
  .tf-l { }
  @keyframes tfFire  { 0%{color:inherit;text-shadow:none} 12%{color:#e8571c;text-shadow:0 0 6px #ff9a3c,0 -3px 12px #ffcf5a} 40%{color:#f08a22;text-shadow:0 0 8px #ffb347,0 -4px 14px #ffd878} 70%{color:#c8431a;text-shadow:0 0 4px #ff7a2c} 100%{color:inherit;text-shadow:none} }
  @keyframes tfElec  { 0%{color:inherit;text-shadow:none} 10%{color:#ffe66a;text-shadow:0 0 5px #fff6b0,0 0 12px #ffd23c} 22%{color:inherit;text-shadow:none} 34%{color:#fff4a8;text-shadow:0 0 6px #fff,0 0 14px #ffd23c} 52%{color:#e8b800;text-shadow:0 0 4px #ffe066} 100%{color:inherit;text-shadow:none} }
  @keyframes tfWater { 0%{color:inherit;text-shadow:none} 25%{color:#2d78a8;text-shadow:0 1px 3px rgba(80,170,220,.8)} 60%{color:#3a8ab8;text-shadow:0 2px 5px rgba(100,190,230,.7)} 100%{color:inherit;text-shadow:none} }
  @keyframes tfGlitch{ 0%{color:inherit;text-shadow:none} 15%{text-shadow:-2px 0 rgba(0,200,255,.85),2px 0 rgba(255,60,140,.85)} 35%{text-shadow:2px 0 rgba(0,200,255,.85),-2px 0 rgba(255,60,140,.85);opacity:.55} 55%{text-shadow:-1px 0 rgba(0,200,255,.7),1px 0 rgba(255,60,140,.7);opacity:1} 100%{color:inherit;text-shadow:none;opacity:1} }
  @keyframes tfSepia { 0%{color:inherit;opacity:1} 30%{color:#a7886a;opacity:.55} 70%{color:#a7886a;opacity:.55} 100%{color:inherit;opacity:1} }
  @keyframes tfGlow  { 0%{color:inherit;text-shadow:none} 35%{color:#b8742a;text-shadow:0 0 6px rgba(255,200,100,.9),0 0 14px rgba(255,190,90,.6)} 65%{color:#b8742a;text-shadow:0 0 6px rgba(255,200,100,.8)} 100%{color:inherit;text-shadow:none} }
  @keyframes tfPuff  { 0%{color:inherit;opacity:1} 30%{color:#8a8176;opacity:.5} 60%{color:#8a8176;opacity:.6} 100%{color:inherit;opacity:1} }
  @keyframes tfGlint { 0%{color:inherit;text-shadow:none} 30%{color:#b8862a;text-shadow:0 0 5px #fff3b8,0 0 11px #ffd978} 100%{color:inherit;text-shadow:none} }
  .tf-fire{animation:tfFire 1.1s ease-out} .tf-elec{animation:tfElec .52s linear} .tf-water{animation:tfWater 1.3s ease-in-out}
  .tf-glitch{animation:tfGlitch .48s steps(6)} .tf-sepia{animation:tfSepia 1.4s ease-in-out} .tf-glow{animation:tfGlow 1.7s ease-in-out}
  .tf-puff{animation:tfPuff 1.3s ease-in-out} .tf-glint{animation:tfGlint .9s ease-out}
  `;
  document.head.appendChild(css);

  const rnd = (a, b) => a + Math.random() * (b - a), pick = (a) => a[(Math.random() * a.length) | 0];

  // ---- tách chữ: mỗi chữ cái thành <span> inline (không đổi bố cục) ----
  function split(root) {
    const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), nodes = [];
    while (w.nextNode()) nodes.push(w.currentNode);
    for (const n of nodes) {
      if (!n.nodeValue.trim() || n.parentNode.closest('script,style,canvas,figure,svg,.tf-l')) continue;
      const f = document.createDocumentFragment();
      for (const ch of n.nodeValue) {
        if (/\s/.test(ch)) { f.appendChild(document.createTextNode(ch)); continue; }
        const s = document.createElement('span'); s.className = 'tf-l'; s.textContent = ch; f.appendChild(s); out.push(s);
      }
      n.parentNode.replaceChild(f, n);
    }
    return out;
  }

  let cv, g, dpr = 1, parts = [], dust = [], bars = [], zaps = [], rings = [], glints = [], cfg, groups = [], running = false;

  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr);
    cv.style.width = innerWidth + 'px'; cv.style.height = innerHeight + 'px';
  }

  function trigger(fx, el) {
    const r = el.getBoundingClientRect(); if (r.width < 2) return;
    el.classList.remove(fx.cls); void el.offsetWidth; el.classList.add(fx.cls);
    setTimeout(() => el.classList.remove(fx.cls), fx.dur + 60);
    const p = fx.parts, S = Math.max(0.6, r.height / 40), cx = r.left + r.width / 2;
    for (let i = 0; i < p.n; i++) {
      parts.push({ x: cx + rnd(-r.width * .4, r.width * .4), y: r.top + r.height * rnd(.35, .8), vx: rnd(-p.vx, p.vx), vy: p.vy * rnd(.6, 1.2), t: 0, life: p.life * rnd(.7, 1.1), size: p.size * S * rnd(.7, 1.2), col: pick(p.col), p });
    }
    if (fx.zap) zaps.push({ x: r.left - 6, y: r.top + r.height * .5, w: r.width + 12, h: r.height, t: 0, life: 300, seed: Math.random() * 99 });
    if (p.ring) rings.push({ x: cx, y: r.bottom - r.height * .1, t: 0, life: 900, R: r.height * .9 });
    if (fx.bars) bars.push({ x: r.left - 4, y: r.top, w: r.width + 8, h: r.height, t: 0, life: 360 });
  }

  function tick() {
    if (!running) return;
    const n = Math.random() < .35 ? 4 : (Math.random() < .5 ? 3 : 2);
    for (let i = 0; i < n; i++) {
      const gr = pick(groups); if (!gr.letters.length) continue;
      const el = pick(gr.letters); trigger(FX[gr.fx instanceof Array ? pick(gr.fx) : gr.fx], el);
    }
    setTimeout(tick, rnd(850, 1500));
  }

  let last = 0, glintT = 0;
  function frame(now) {
    if (!running) return;
    requestAnimationFrame(frame);
    const dt = Math.min(50, now - (last || now)); last = now;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, innerWidth, innerHeight);
    // bụi trên giấy: rất mờ, trôi chậm
    for (const d of dust) {
      d.x += d.vx * dt / 1000; d.y += d.vy * dt / 1000; d.ph += dt / 1000;
      if (d.x < -10) d.x = innerWidth + 10; if (d.x > innerWidth + 10) d.x = -10; if (d.y < -10) d.y = innerHeight + 10; if (d.y > innerHeight + 10) d.y = -10;
      g.fillStyle = 'rgba(' + cfg.dustCol + ',' + (0.1 + 0.08 * Math.sin(d.ph * 1.4)) + ')'; g.fillRect(d.x, d.y, d.s, d.s);
    }
    // vệt sáng chạy dọc đường kẻ
    glintT += dt;
    const rule = cfg.rule;
    if (rule) {
      const rr = rule.getBoundingClientRect(), u = ((glintT % 7000) / 7000) * 1.4 - 0.2;
      if (u > 0 && u < 1 && rr.width > 20) {
        const gx = rr.left + rr.width * u, gr = g.createLinearGradient(gx - 90, 0, gx + 90, 0);
        gr.addColorStop(0, 'rgba(255,240,200,0)'); gr.addColorStop(.5, 'rgba(255,246,215,.75)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
        g.fillStyle = gr; g.fillRect(gx - 90, rr.top - 1, 180, 4);
      }
    }
    // hạt
    for (let i = parts.length - 1; i >= 0; i--) {
      const q = parts[i]; q.t += dt; if (q.t > q.life) { parts.splice(i, 1); continue; }
      const u = q.t / q.life, k = dt / 1000; q.x += q.vx * k; q.y += q.vy * k + (q.p.drop ? 120 * u * k : 0);
      const a = (u < .15 ? u / .15 : 1 - (u - .15) / .85) * (q.p.soft ? .35 : .9);
      g.save(); g.globalAlpha = Math.max(0, a);
      if (q.p.glow) { g.shadowColor = 'rgb(' + q.col + ')'; g.shadowBlur = 6; }
      g.fillStyle = 'rgb(' + q.col + ')';
      if (q.p.soft) { const R = q.size * (1 + u * 2.2); g.beginPath(); g.arc(q.x, q.y, R, 0, 6.283); g.fill(); }
      else if (q.p.drop) { g.beginPath(); g.moveTo(q.x, q.y - q.size * 1.3); g.quadraticCurveTo(q.x + q.size, q.y + q.size * .4, q.x, q.y + q.size); g.quadraticCurveTo(q.x - q.size, q.y + q.size * .4, q.x, q.y - q.size * 1.3); g.fill(); }
      else if (q.p.star) { const s = q.size * (1.2 - u * .5); g.fillRect(q.x - s, q.y - .5, s * 2, 1.2); g.fillRect(q.x - .5, q.y - s, 1.2, s * 2); }
      else g.fillRect(Math.round(q.x), Math.round(q.y), q.size, q.size);   // hạt vuông kiểu pixel
      g.restore();
    }
    // tia điện zích-zắc quanh chữ
    for (let i = zaps.length - 1; i >= 0; i--) {
      const z = zaps[i]; z.t += dt; if (z.t > z.life) { zaps.splice(i, 1); continue; }
      const a = 1 - z.t / z.life; g.save(); g.globalAlpha = a * .9; g.strokeStyle = '#fff3a0'; g.shadowColor = '#ffd23c'; g.shadowBlur = 8; g.lineWidth = 1.6; g.beginPath();
      let x = z.x, y = z.y + (Math.sin(z.seed) * z.h * .2), seg = 6;
      g.moveTo(x, y); for (let s = 1; s <= seg; s++) { x = z.x + z.w * s / seg; y = z.y + (Math.random() - .5) * z.h * .9; g.lineTo(x, y); } g.stroke(); g.restore();
    }
    // vòng nước loang
    for (let i = rings.length - 1; i >= 0; i--) {
      const r = rings[i]; r.t += dt; if (r.t > r.life) { rings.splice(i, 1); continue; }
      const u = r.t / r.life; g.save(); g.globalAlpha = (1 - u) * .5; g.strokeStyle = 'rgb(100,175,215)'; g.lineWidth = 1.2; g.beginPath(); g.ellipse(r.x, r.y, r.R * (.3 + u), r.R * (.3 + u) * .3, 0, 0, 6.283); g.stroke(); g.restore();
    }
    // vạch nhiễu TV
    for (let i = bars.length - 1; i >= 0; i--) {
      const b = bars[i]; b.t += dt; if (b.t > b.life) { bars.splice(i, 1); continue; }
      g.save(); g.globalAlpha = (1 - b.t / b.life) * .5;
      for (let k = 0; k < 3; k++) { g.fillStyle = k % 2 ? 'rgba(0,200,255,.5)' : 'rgba(255,60,140,.45)'; g.fillRect(b.x + rnd(-6, 6), b.y + Math.random() * b.h, b.w * rnd(.4, 1), 1.5); }
      g.restore();
    }
  }

  window.TextFX = {
    /* opts: theme (hiệu ứng mặc định), map { 'selector': 'fx' | ['fx1','fx2'] } cho từng khối chữ, dust: 'r,g,b' */
    init(opts) {
      cfg = Object.assign({ theme: 'glow', map: {}, dustCol: '150,110,70', dust: 16 }, opts || {});
      const slide = document.querySelector('.slide') || document.body;
      cfg.rule = slide.querySelector('.rule');
      const targets = Array.from(slide.querySelectorAll('.title, h1, h2, h3, p, li, .subtitle')).filter((e) => !e.closest('figure,.vpanel,#scene'));
      for (const e of targets) {
        if (e.querySelector('.tf-l')) continue;
        const L = split(e); if (!L.length) continue;
        let fx = cfg.theme; for (const sel in cfg.map) if (e.matches(sel) || e.closest(sel)) { fx = cfg.map[sel]; break; }
        groups.push({ fx, letters: L });
      }
      cv = document.createElement('canvas'); cv.style.cssText = 'position:fixed;left:0;top:0;pointer-events:none;z-index:50'; document.body.appendChild(cv);
      g = cv.getContext('2d'); resize(); addEventListener('resize', resize);
      for (let i = 0; i < cfg.dust; i++) dust.push({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, vx: rnd(-5, 5), vy: rnd(-7, 2), s: Math.random() < .3 ? 2 : 1.4, ph: Math.random() * 6 });
      running = true;
      document.addEventListener('visibilitychange', () => { const was = running; running = !document.hidden; if (running && !was) { last = 0; requestAnimationFrame(frame); tick(); } });
      if (groups.length) setTimeout(tick, 1800);
      requestAnimationFrame(frame);
    }
  };
})();
