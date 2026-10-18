// Vẽ miếng băng keo kiểu pixel lên mọi <canvas class="ptape"> (dùng chung cho slides.html và slide3-anim.html)
function drawPixelTape(cv, seed) {
  const g = cv.getContext('2d'), C = 5, cols = cv.width / C, rows = cv.height / C;
  let r = seed || 7;
  const rnd = () => (r = (r * 16807) % 2147483647) / 2147483647;
  g.clearRect(0, 0, cv.width, cv.height);
  for (let y = 0; y < rows; y++) {
    const cutL = 1 + Math.floor(rnd() * 2), cutR = 1 + Math.floor(rnd() * 2);   // đầu keo răng cưa
    for (let x = cutL; x < cols - cutR; x++) {
      const edge = y === 0 || y === rows - 1 || x === cutL || x === cols - cutR - 1;
      let col = '#e9dfc2';                                  // thân keo
      if (y === 1) col = '#faf4de';                         // mép sáng
      else if (y >= rows - 2) col = '#cdbf99';              // mép tối
      else if (rnd() < 0.06) col = '#fffdf2';               // đốm sáng
      if (edge) col = '#85774f';                            // viền pixel
      g.fillStyle = col;
      g.globalAlpha = edge ? 1 : 0.94;
      g.fillRect(x * C, y * C, C, C);
    }
  }
  g.globalAlpha = 1;
}
function drawAllPixelTapes() { document.querySelectorAll('.ptape').forEach((c, i) => drawPixelTape(c, 11 + i * 12)); }
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', drawAllPixelTapes); else drawAllPixelTapes();
