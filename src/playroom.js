const $ = selector => document.querySelector(selector);
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const shelf = $('.toy-scene');
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
    dialog.showModal();
    (dialog.querySelector('textarea') || dialog.querySelector('.toy-close')).focus({preventScroll:true});
  });
  dialog.querySelector('.toy-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    if (!document.querySelector('dialog[open]')) button.focus({preventScroll:true});
  });
  window.addEventListener('resize', () => { x = y = 0; button.style.translate = ''; });
}

const pilot = $('#flight-pilot'), flightPath = $('#flight-path'), result = $('#flight-result');
let flightFrame;
function world() { return document.querySelector('input[name="world"]:checked').value; }
function gravity() { return world() === 'earth' ? 9.81 : 1.62; }
function position(t, g) { return [20 + 35 * t, 148 - 10 * (6 * t - g * t * t / 2)]; }
function drawPilot(t, g) {
  const [x, y] = position(t, g);
  pilot.setAttribute('transform', 'translate(' + (x-20) + ',' + (y-48) + ')');
}
function resetFlight() {
  cancelAnimationFrame(flightFrame);
  flightPath.removeAttribute('d');
  drawPilot(0, gravity());
  result.textContent = '';
}
function launch() {
  resetFlight();
  const g = gravity(), duration = 12 / g;
  const points = Array.from({length: 51}, (_, i) => position(duration * i / 50,g).map(n=>n.toFixed(2)).join(' '));
  flightPath.setAttribute('d', 'M' + points.join(' L'));
  result.textContent = (world() === 'earth' ? 'Earth' : 'Moon') + ' · ' + (18/g).toFixed(1) + ' m high · ' + duration.toFixed(1) + ' s in flight.';
  const start = performance.now();
  function frame(now) {
    const t = reduce.matches ? duration : Math.min(duration, (now - start) / 1000);
    drawPilot(t, g);
    if (t < duration) flightFrame = requestAnimationFrame(frame);
  }
  frame(start);
}
$('#launch-pilot').addEventListener('click', launch);
document.querySelectorAll('[name="world"]').forEach(input => input.addEventListener('change', resetFlight));
$('#toy-pilot').addEventListener('close', resetFlight);
resetFlight();

const field = ['S..#*', '.#...', '*.#..', '.#.#.', '....*'];
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
  ship = [0,0]; stars = new Set(['4,0','0,2','4,4']); steps = 0; drawGame('');
}
function steer(dir) {
  if (!stars.size) return;
  const [dx,dy] = directions[dir], x = ship[0]+dx, y = ship[1]+dy, tile = field[y]?.[x];
  if (!tile || tile === '#') { drawGame('Blocked.'); return; }
  ship = [x,y]; steps++;
  const collected = stars.delete(ship.join(','));
  drawGame(!stars.size ? 'Delivery complete!' : collected ? 'Star collected!' : '');
}
$('#toy-handheld').addEventListener('keydown', event => {
  if (keys[event.key]) { event.preventDefault(); steer(keys[event.key]); }
});
document.querySelectorAll('[data-steer]').forEach(b => b.addEventListener('click',()=>steer(b.dataset.steer)));
$('#restart-game').addEventListener('click',restart);
restart();

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
