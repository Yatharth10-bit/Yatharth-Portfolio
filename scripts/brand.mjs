const {readFile,writeFile}=await import('node:fs/promises');
const out=new URL('../assets/',import.meta.url);
const rows=JSON.parse(await readFile(new URL('portrait.json',import.meta.url),'utf8'));
const mono='Consolas, monospace',serif='Georgia, Times New Roman, serif',sans='Arial, Helvetica, sans-serif';
const paths=Array.from({length:16},()=>[]);
for(const [y,row] of rows.entries()) for(const [x,shade] of [...row].entries()){
  if(shade!=='.')paths[parseInt(shade,16)].push(`M${x*4+2} ${y*4+2}h.02`);
}
const portrait=paths.map((lines,i)=>`<path d="${lines.join('')}" stroke-width="${(.68+i*.29).toFixed(2)}"/>`).join('');
function banner(dark){
  const page=dark?'#171923':'#f6f3e9',ink=dark?'#f8f4ea':'#161822',rule=dark?'#424451':'#c7c4ba',blue=dark?'#8495ff':'#263fac';
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 368" role="img" aria-labelledby="title desc"><title id="title">Yatharth Srivastav — developer and designer</title><desc id="desc">An editorial nameplate beside a cobalt halftone portrait of Yatharth. A fine pink signal trace draws across the print.</desc>
  <defs><clipPath id="plate"><rect x="555" y="0" width="405" height="368"/></clipPath><pattern id="screen" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M0 0h1" stroke="#abb7ff" stroke-opacity=".3"/></pattern></defs>
  <style>@media(prefers-reduced-motion:no-preference){.trace{stroke-dasharray:1;animation:draw 2.8s ease-out 1 both}@keyframes draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}}</style>
  <rect width="960" height="368" rx="12" fill="${page}"/><g clip-path="url(#plate)"><rect x="555" width="405" height="368" fill="#293da4"/><rect x="555" width="405" height="368" fill="url(#screen)"/><circle cx="760" cy="174" r="136" fill="#1b2e85"/><g transform="translate(612 34) scale(1.06)" fill="none" stroke="#fff2d9" stroke-linecap="round">${portrait}</g>
  <path class="trace" pathLength="1" d="M550 287C606 288 611 268 638 273S675 318 708 283 745 244 773 265 815 306 844 269 881 229 907 253 935 281 966 264" fill="none" stroke="#ff88b7" stroke-width="3.5"/></g>
  <g font-family="${mono}" font-size="15" letter-spacing="1.6" fill="${blue}"><text x="36" y="40">YATHARTH10-BIT / GITHUB</text></g><path d="M36 57H520M36 297H520" stroke="${rule}"/>
  <g font-family="${serif}" fill="${ink}" font-size="91" letter-spacing="-5"><text x="31" y="158">Yatharth</text><text x="32" y="247" font-style="italic">Srivastav<tspan fill="${blue}">.</tspan></text></g>
  <text x="36" y="333" font-family="${sans}" fill="${ink}" font-size="22">Developer &amp; designer</text><text x="517" y="332" text-anchor="end" font-family="${mono}" font-size="17" fill="${blue}">INDIA</text></svg>`;
}
for(const mode of ['light','dark'])await writeFile(new URL('banner-'+mode+'.svg',out),banner(mode==='dark'));
const cards=[
  ['nextjs','OrbytMax','Satellite passes','Next.js','#293da4','#fff8ec','<g transform="rotate(-24 238 57)" fill="none" stroke="currentColor"><ellipse cx="238" cy="56" rx="48" ry="19"/><ellipse cx="238" cy="56" rx="34" ry="34"/><ellipse cx="238" cy="56" rx="16" ry="34"/><path d="M204 56h68"/></g>'],
  ['python','Ultron','Voice & gestures','Python','#d0ef67','#16261b','<path fill="none" stroke="currentColor" stroke-width="3" d="M193 55h10l4-10 6 21 6-37 7 52 8-43 6 31 7-48 7 62 7-39 6 16h15"/>'],
  ['threejs','ORBITAL','Orbits in 3D','Three.js','#ed8eb7','#28152a','<g fill="none" stroke="currentColor" stroke-width="1.4" transform="rotate(-29 238 55)"><ellipse cx="238" cy="55" rx="47" ry="19"/><ellipse cx="238" cy="55" rx="36" ry="31"/><ellipse cx="238" cy="55" rx="21" ry="38"/><circle cx="278" cy="44" r="4" fill="currentColor"/></g>']
];
for(const [id,name,desc,stack,bg,ink,art] of cards){
  const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="138" viewBox="0 0 300 138" role="img"><title>${name}, ${desc.replace('&','and')}, ${stack}</title><rect width="300" height="138" rx="6" fill="${bg}"/><g color="${ink}">${art}</g><g fill="${ink}"><text x="16" y="25" font-family="${mono}" font-size="13">${stack}</text><text x="14" y="79" font-family="${serif}" font-size="38" letter-spacing="-1.6">${name}</text><path d="M16 97H284" fill="none" stroke="${ink}" opacity=".45"/><text x="16" y="121" font-family="${sans}" font-size="16">${desc.replace('&','&amp;')}</text></g></svg>`;
  await writeFile(new URL(id+'.svg',out),svg);
}
await writeFile(new URL('explore.svg',out),`<svg xmlns="http://www.w3.org/2000/svg" width="242" height="46" role="img"><title>Explore my portfolio</title><rect width="242" height="46" rx="5" fill="#293da4"/><text x="18" y="30" font-family="${sans}" font-size="19" fill="#fff8ef">Explore my portfolio</text><path d="M206 30l11-12m-11 0h11v11" fill="none" stroke="#fff8ef" stroke-width="2"/></svg>`);
