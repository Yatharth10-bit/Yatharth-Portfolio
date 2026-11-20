import { installMissions } from './missions.js';
const $ = selector => document.querySelector(selector);
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const shelf = $('.toy-scene');
const newMission = installMissions($('#toy-pilot'));
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

// Buttons stay inside the shelf and retain normal Enter, Space and tap activation.
for (const button of shelf.querySelectorAll('[data-toy]')) {
  const dialog = $('#toy-' + button.dataset.toy);
  let x = 0, y = 0, drag = null, moved = false;
  function move(dx, dy) {
    const bounds = shelf.getBoundingClientRect();
    const box = button.getBoundingClientRect();
    x += clamp(dx, bounds.left - box.left, bounds.right - box.right);
    y += clamp(dy, bounds.top - box.top, bounds.bottom - box.bottom);
    button.style.translate = x + 'px ' + y + 'px';
  }
  button.addEventListener('pointerdown', event => {
    if (!event.isPrimary || event.button !== 0) return;
    moved = false;
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY};
    button.setPointerCapture(event.pointerId);
  });
  button.addEventListener('pointermove', event => {
    if (drag?.id !== event.pointerId) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!moved && Math.hypot(dx, dy) < 7) return;
    moved = true;
    button.classList.add('held');
    move(dx, dy);
    drag.x = event.clientX; drag.y = event.clientY;
  });
  button.addEventListener('lostpointercapture', () => {
    drag = null;
    button.classList.remove('held');
  });
  button.addEventListener('keydown', event => {
    const distance = {ArrowUp:[0,-12],ArrowDown:[0,12],ArrowLeft:[-12,0],ArrowRight:[12,0]}[event.key];
    if (distance) { event.preventDefault(); move(...distance); }
  });
  button.addEventListener('click', event => {
    if (event.detail && moved) { moved = false; return; }
    if (button.dataset.toy === 'pilot') newMission();
    if (button.dataset.toy === 'handheld') restart();
    dialog.showModal();
    (dialog.querySelector('textarea') || dialog.querySelector('.toy-close')).focus({preventScroll:true});
  });
  dialog.querySelector('.toy-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) button.focus({preventScroll:true});
  });
  window.addEventListener('resize', () => { x = y = 0; button.style.translate = ''; });
}

// Grow one connected region, so every star can be reached from the ship.
let field, previousStart = -1;
function neighbors(cell) {
  const x = cell % 5, y = Math.floor(cell / 5);
  return [[x-1,y],[x+1,y],[x,y-1],[x,y+1]]
    .filter(([col,row])=>col>=0 && col<5 && row>=0 && row<5)
    .map(([col,row])=>row*5+col);
}
const pick = items => items[Math.floor(Math.random()*items.length)];
const coordinate = cell => [cell % 5, Math.floor(cell / 5)];
const directions = {up:[0,-1],down:[0,1],left:[-1,0],right:[1,0]};
const keys = {ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right'};
let ship, stars, steps;
function drawGame(message) {
  const grid = $('#star-grid');
  const cells = document.createDocumentFragment();
  for (let y=0; y<field.length; y++) for (let x=0; x<field[y].length; x++) {
    const cell = document.createElement('span');
    const at = x + ',' + y;
    const tile = at === ship.join(',') ? 'ship' : stars.has(at) ? 'star' : field[y][x] === '#' ? 'rock' : 'space';
    cell.className = 'tile tile-' + tile;
    cell.setAttribute('aria-hidden','true');
    cells.append(cell);
  }
  grid.replaceChildren(cells);
  const words = {up:'Up',down:'Down',left:'Left',right:'Right'};
  const paths = Object.entries(directions).filter(([, [dx,dy]]) => {
    const tile = field[ship[1]+dy]?.[ship[0]+dx]; return tile && tile !== '#';
  }).map(([dir])=>words[dir]);
  const coords = at => at.split(',').map(n=>Number(n)+1).join(', ');
  const description = 'Column ' + (ship[0]+1) + ', row ' + (ship[1]+1) + '. Open directions: ' + paths.join(', ') + '. Stars at ' + [...stars].map(coords).join(' / ') + '.';
  grid.setAttribute('aria-label', description);
  const output = $('#game-result');
  output.textContent = (message ? message + ' ' : '') + (3-stars.size) + '/3 stars · ' + steps + ' moves';
  const help = document.createElement('span'); help.className='sr'; help.textContent=' '+description; output.append(help);
}
function restart() {
  const cells = Array.from({length:25}, (_,i)=>i);
  const start = pick(cells.filter(cell=>cell!==previousStart));
  previousStart=start; ship=coordinate(start);
  const open = new Set([start]), frontier = new Set(neighbors(start));
  const floorSize = 16 + Math.floor(Math.random()*5);
  while(open.size < floorSize) {
    const cell = pick([...frontier]); frontier.delete(cell); open.add(cell);
    for(const n of neighbors(cell)) if(!open.has(n)) frontier.add(n);
  }
  field = Array.from({length:5}, (_,row)=>cells.slice(row*5,row*5+5).map(i=>open.has(i)?'.':'#').join(''));
  const candidates = [...open].filter(i=>i !== start && !neighbors(start).includes(i));
  stars=new Set();
  for(let i=0;i<3;i++){
    const index=Math.floor(Math.random()*candidates.length);
    stars.add(coordinate(candidates.splice(index,1)[0]).join(','));
  }
  steps=0; $('#restart-game').textContent='Restart'; drawGame('');
}
function steer(dir) {
  if (!stars.size) return;
  const [dx,dy] = directions[dir], x = ship[0]+dx, y = ship[1]+dy, tile = field[y]?.[x];
  if (!tile || tile === '#') { drawGame('Blocked.'); return; }
  ship = [x,y]; steps++;
  const collected = stars.delete(ship.join(','));
  if(!stars.size) $('#restart-game').textContent='Play again';
  drawGame(!stars.size ? 'Delivery complete!' : collected ? 'Star collected!' : '');
}
$('#toy-handheld').addEventListener('keydown', event => {
  if (keys[event.key]) { event.preventDefault(); steer(keys[event.key]); }
});
document.querySelectorAll('[data-steer]').forEach(b => b.addEventListener('click',()=>steer(b.dataset.steer)));
$('#restart-game').addEventListener('click',restart);

const input = $('#desk-note'), print = $('#typed-note'), save = $('#save-note');
let typingTimer, fileURL, fullText = '';
input.addEventListener('input', () => { $('#note-count').textContent = input.value.length + ' / 220'; input.setCustomValidity(''); });
function finishTyping() {
  clearTimeout(typingTimer); print.textContent = fullText; print.classList.remove('typing');
}
$('#desk-writer').addEventListener('submit', event => {
  event.preventDefault();
  const note = input.value.trim();
  if (!note) { input.setCustomValidity('Write a few words first.'); input.reportValidity(); return; }
  finishTyping(); fullText=note;
  if (fileURL) URL.revokeObjectURL(fileURL);
  fileURL = URL.createObjectURL(new Blob([note+'\n'], {type:'text/plain;charset=utf-8'}));
  save.href = fileURL; $('#desk-page').hidden = false;
  const letters = Array.from(note);
  let pos = 0;
  function type() {
    pos += reduce.matches ? letters.length : Math.max(1, Math.ceil(letters.length / 75));
    print.textContent = letters.slice(0,pos).join('');
    if (pos < letters.length) typingTimer = setTimeout(type, 24);
    else { print.classList.remove('typing'); $('#type-status').textContent = 'Your note is ready to save.'; }
  }
  $('#type-status').textContent = ''; print.classList.add('typing'); type();
});
$('#toy-typewriter').addEventListener('close', finishTyping);

const ribbon = $('.interest-strip');
const ribbonSwitch = ribbon.querySelector('.ribbon-switch');
function pauseRibbon(paused) {
  ribbon.dataset.paused=String(paused);
  ribbonSwitch.setAttribute('aria-label',paused?'Resume interest strip':'Pause interest strip');
  ribbonSwitch.firstElementChild.textContent=paused?'▶':'Ⅱ';
}
pauseRibbon(false);
ribbonSwitch.addEventListener('click',()=>pauseRibbon(ribbon.dataset.paused!=='true'));
