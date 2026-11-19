import { writeFile } from 'node:fs/promises';

const out = new URL('../assets/', import.meta.url);
const mono = 'ui-monospace, SFMono-Regular, Consolas, monospace';
const sans = 'Arial, Helvetica, sans-serif';

function banner(dark) {
  const bg = dark ? '#171919' : '#f2efe7';
  const ink = dark ? '#f5f2e8' : '#22231f';
  const muted = dark ? '#a7aba4' : '#51574f';
  const grid = dark ? '#373c37' : '#d1d1c4';
  const accent = dark ? '#ff865a' : '#aa3e19';

  // Ring sections share a trefoil centreline, projected and depth sorted.
  const rings = [];
  for (let i = 0; i < 99; i++) {
    const t = 2 * Math.PI * i / 99;
    const a = 58 + 26 * Math.cos(3 * t);
    const x = a * Math.cos(2 * t);
    const y = a * Math.sin(2 * t);
    const z = 40 * Math.sin(3 * t);
    const screenX = 748 + x * 1.52 + 0.35 * z;
    const screenY = 145 + y * 0.9 - z * 0.91;
    const rx = 13 + 6 * (1 + Math.sin(t));
    const angle = 360 * t / Math.PI;
    rings.push({ depth: 0.7 * y + z, shape: `<ellipse cx="${screenX.toFixed(2)}" cy="${screenY.toFixed(2)}" rx="${rx.toFixed(2)}" ry="8.5" transform="rotate(${angle.toFixed(2)} ${screenX.toFixed(2)} ${screenY.toFixed(2)})"/>` });
  }
  rings.sort((a,b) => a.depth - b.depth);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 284" role="img" aria-labelledby="t d">
  <title id="t">Yatharth Srivastav</title><desc id="d">Developer and designer in India. An orange wire sculpture on a plotting grid.</desc>
  <defs><pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse"><circle fill="${grid}" cx="1" cy="1" r="1"/></pattern></defs>
  <style>@keyframes enter{from{opacity:.45;transform:translateY(3px)}to{opacity:1;transform:none}}@media(prefers-reduced-motion:no-preference){.sculpture{animation:enter 1.3s ease-out both}}</style>
  <rect width="960" height="284" fill="${bg}"/><rect x="555" width="405" height="284" fill="url(#dots)"/>
  <path d="M32 45H928M32 241H928" stroke="${grid}"/>
  <g font-family="${mono}" font-size="12" fill="${muted}" letter-spacing="2"><text x="35" y="32">SIGNAL STUDIO</text><text x="925" y="32" text-anchor="end">GITHUB PROFILE</text></g>
  <g fill="${ink}" font-family="${sans}" font-weight="700" font-size="73" letter-spacing="-5"><text x="32" y="127">Yatharth</text><text x="32" y="194">Srivastav<tspan fill="${accent}">.</tspan></text></g>
  <g class="sculpture" fill="${bg}" stroke="${accent}" stroke-width="1.6">${rings.map(r=>r.shape).join('')}</g>
  <g stroke="${muted}" stroke-width="1"><path d="M576 68h12m-6-6v12m314 152h12m-6-6v12"/></g>
  <text x="35" y="265" font-family="${mono}" font-size="13" fill="${muted}">DEVELOPER / DESIGNER</text><text x="925" y="265" text-anchor="end" font-family="${mono}" font-size="13" fill="${muted}">INDIA</text>
</svg>\n`;
}

for (const dark of [true, false]) {
  await writeFile(new URL(`banner-${dark?'dark':'light'}.svg`,out),banner(dark));
}

function button(label, width, filled=false) {
  const bg=filled?'#ff865a':'#212522';
  const ink=filled?'#1d201d':'#f5f2e8';
  const mark=filled?'#1d201d':'#ff9368';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} 42" width="${width}" height="42" role="img" aria-label="${label}"><rect x=".5" y=".5" width="${width-1}" height="41" rx="7" fill="${bg}" stroke="#545b51"/><g fill="none" stroke="${mark}" stroke-width="1.6"><circle cx="21" cy="21" r="6.5"/><path d="M10 21h6m10 0h6"/></g><text x="40" y="26" fill="${ink}" font-family="${sans}" font-size="15" font-weight="bold">${label}</text></svg>\n`;
}
for (const [name,label,width,filled] of [['explore','Explore my interactive portfolio',286,true], ['nextjs','Next.js',104],['python','Python',105],['threejs','Three.js',114]]) {
  await writeFile(new URL(name+'.svg',out),button(label,width,filled));
}

