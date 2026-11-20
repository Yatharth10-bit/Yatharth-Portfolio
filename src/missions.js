const rand = n => Math.floor(Math.random() * n);
const orbitMarks = ['↑', '↘', '↙'];
const headings = ['north', 'southeast', 'southwest'];
const signals = [
  {mark:'✦', name:'Star'}, {mark:'☾', name:'Moon'}, {mark:'ϟ', name:'Bolt'}, {mark:'◇', name:'Crystal'}
];

export function installMissions(dialog) {
  const title = dialog.querySelector('#mission-name');
  const brief = dialog.querySelector('#mission-brief');
  const board = dialog.querySelector('#mission-board');
  const status = dialog.querySelector('#mission-status');
  const next = dialog.querySelector('#next-mission');
  let last = '', remaining = [], completed = false;

  function control(label, action) {
    const b = document.createElement('button');
    b.type = 'button'; b.textContent = label;
    b.addEventListener('click', action);
    board.append(b);
    return b;
  }
  function complete(message) {
    completed = true;
    status.textContent = message;
    next.textContent = 'Play again';
  }
  function relay() {
    title.textContent = 'Echo Relay';
    brief.textContent = 'Memorize the transmission. Cover it, then tap the symbols in the same order.';
    const sequence = Array.from({length:4 + rand(2)}, () => rand(signals.length));
    const code = document.createElement('p');
    code.className = 'radio-code'; code.textContent = sequence.map(i => signals[i].mark).join(' ');
    code.setAttribute('aria-label',sequence.map(i=>signals[i].name).join(', '));
    code.setAttribute('role','img'); board.append(code);
    const start = control('Cover the signal', () => {
      let index = 0;
      board.replaceChildren();
      brief.textContent = 'Repeat the transmission from memory.';
      signals.forEach(({mark,name}, id) => {
        const key = control(mark, () => {
          if(completed) return;
          if(id !== sequence[index]) {
            board.replaceChildren(); relay(); board.querySelector('button').focus();
            status.textContent = 'Signal lost. Read the new transmission and try again.'; return;
          }
          index++;
          if(index === sequence.length) complete('Message received! The pilot has a clear channel.');
          else status.textContent = index + ' of ' + sequence.length + ' signals matched.';
        });
        key.className='signal-key'; key.setAttribute('aria-label',name);
      });
      board.querySelector('button').focus();
      status.textContent = 'Listening for ' + sequence.length + ' signals.';
    });
    start.className='signal-start';
  }
  function lock() {
    title.textContent = 'Orbit Lock';
    brief.textContent = 'Point all three antennas north (↑). Tuning one turns it and the next one clockwise. The last wraps to the first.';
    const state = [0,0,0];
    function turn(i) { state[i]=(state[i]+1)%3; const neighbor=(i+1)%3; state[neighbor]=(state[neighbor]+1)%3; }
    // Scramble using legal moves. Repeating each move twice is its inverse.
    const scrambleLength=3+rand(4);
    for(let i=0;i<scrambleLength;i++) turn(rand(3));
    if(state.every(x=>x===0)) turn(rand(3));
    const buttons = state.map((_,i)=>control('',()=>{
      if(completed) return;
      turn(i); render();
      if(state.every(x=>x===0)) complete('Uplink locked. All three antennas are pointing north!');
      else status.textContent='Antenna headings: '+state.map(v=>headings[v]).join(', ')+'.';
    }));
    function render() {
      buttons.forEach((b,i)=>{
        b.className='antenna'; b.replaceChildren();
        const glyph=document.createElement('span'); glyph.textContent=orbitMarks[state[i]];
        const label=document.createElement('small'); label.textContent='ANT '+(i+1);
        b.append(glyph,label); b.setAttribute('aria-label','Tune antenna '+(i+1)+', currently '+headings[state[i]]);
      });
    }
    render();
  }
  function sweep() {
    title.textContent = 'Signal Sweep';
    const subject = signals[rand(signals.length)];
    const others = signals.filter(s=>s !== subject);
    brief.textContent = 'Scan the sector for the '+subject.name.toLowerCase()+' ('+subject.mark+'). There is exactly one.';
    const target=rand(16);
    for(let i=0;i<16;i++){
      const signal=i===target ? subject : others[rand(others.length)];
      const cell=control(signal.mark,()=>{
        if(completed || cell.dataset.scanned) return;
        cell.dataset.scanned='true';
        if(i===target) { cell.classList.add('found'); complete('Beacon located. Your pilot is coming home!'); }
        else { cell.textContent='·'; cell.setAttribute('aria-label','Scanned empty sector '+(i+1)); status.textContent='Empty sector. Keep scanning.'; }
      });
      cell.setAttribute('aria-label','Sector '+(i+1)+', '+signal.name);
    }
  }
  const games = {relay, lock, sweep};
  function newMission() {
    if(!remaining.length) remaining=Object.keys(games);
    const eligible=remaining.filter(id=>id!==last);
    const id=eligible[rand(eligible.length)];
    remaining=remaining.filter(item=>item!==id);
    last=id; completed=false;
    board.className='mission-board board-'+id;
    board.replaceChildren(); status.textContent=''; next.textContent='New mission';
    games[id]();
  }
  next.addEventListener('click',()=>{ newMission(); status.textContent='New mission. '+title.textContent+'. '+brief.textContent; });
  return newMission;
}
