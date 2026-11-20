// The sky is decorative. Each illustrated toy is a native button with a keyboard equivalent.
const sky = `<svg class="sky-ink" viewBox="0 0 600 405" fill="none" aria-hidden="true">
  <defs><pattern id="dots" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="#c6c8ff"/></pattern></defs>
  <g transform="rotate(-15 320 210)"><ellipse cx="320" cy="210" rx="242" ry="92" stroke="#bdc5ff" stroke-width="1.4" stroke-dasharray="5 9"/><ellipse cx="320" cy="210" rx="203" ry="71" stroke="#ced5ff" opacity=".32"/></g>
  <path d="M165 109l54 7 8-50 29 39 34-70 20 66 70-60-23 76 74-12-49 43 59 20-67 26 30 39-62-6-5 51-40-41-22 42-20-46-64 16 32-40-70-3 54-22-49-23 57-5z" fill="url(#dots)" opacity=".73"/>
  <g stroke="#fff2c8" stroke-width="3" stroke-linejoin="round"><path d="m72 71 5 13 14 2-11 8 2 14-11-8-12 6 4-13-9-10 14 1z"/><path d="m493 58 4 11 11 2-11 3-3 12-3-12-10-3 10-2z"/><path d="m474 225 3 9 8 3-8 2-3 9-3-9-8-2 8-3z"/></g>
  <g transform="rotate(-22 491 133)" stroke="#ffe7a0" stroke-width="2.6"><circle cx="491" cy="133" r="17"/><path d="M475 126c-34 0-28 15 15 13s55-15 18-13"/></g>
  <g stroke="#a7e4c3" stroke-width="3" stroke-linecap="round"><path d="m122 161 15-6m-14-6 10-1m313 154 9 8m-5-17 12 4"/></g>
  <g fill="#f6dcc4"><circle cx="175" cy="59" r="3"/><circle cx="552" cy="239" r="2"/><circle cx="87" cy="249" r="2"/><circle cx="376" cy="31" r="2"/><circle cx="236" cy="346" r="3"/></g>
</svg>`;
function toy(id, name, label) {
  return `<button type="button" class="shelf-toy toy-${id}" data-toy="${id}" aria-label="${label}" aria-haspopup="dialog"><img alt="" src="assets/playroom/${id}.svg" draggable="false"><span>${name}</span></button>`;
}
export function homeHero(d, escape) {
  return `<section class="room" id="top" aria-labelledby="room-title"><div class="wrap room-inner"><div class="room-copy"><p class="signature"><img src="assets/portrait.webp" alt="" width="32" height="32"> ${escape(d.name)} <span>/</span> India</p><h1 id="room-title">Yatharth’s<br><em>playroom<span>.</span></em></h1><p class="room-intro">${escape(d.playroom.intro)}</p><a class="room-link" href="#work">See what I build <span aria-hidden="true">↘</span></a></div><div class="toy-scene" aria-label="Interactive toy shelf">${sky}${toy('pilot','Gravity lab','Open the space pilot gravity lab')}${toy('handheld','Play arcade','Play the Star Courier arcade game')}${toy('typewriter','Type a note','Open the pocket typewriter')}<span class="scribble-tip" aria-hidden="true">drag or tap! <svg viewBox="0 0 70 34" fill="none"><path d="M2 5q29 27 63 4m-14 0 15-3-4 13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg></span></div></div></section><div class="interest-strip"><ul class="wrap" aria-label="My interests">${d.playroom.interests.map(([symbol,name])=>`<li><span aria-hidden="true">${escape(symbol)}</span>${escape(name)}</li>`).join('')}</ul></div>`;
}
function toyDialog(id, name, content) {
  return `<dialog class="toy-dialog dialog-${id}" id="toy-${id}" aria-labelledby="${id}-title"><div class="modal-head"><h2 id="${id}-title">${name}</h2><button type="button" class="toy-close" aria-label="Close ${name}">×</button></div>${content}</dialog>`;
}
export const toys = toyDialog('pilot','Gravity lab',`
  <p>Launch the pilot with the same kick on two different worlds.</p>
  <div class="gravity-stage" role="img" aria-label="Flight path of the pilot"><svg viewBox="0 0 320 175" aria-hidden="true"><path id="flight-path" fill="none" stroke="#eed286" stroke-width="2" stroke-dasharray="4 5"/><image id="flight-pilot" href="assets/playroom/pilot.svg" x="0" y="0" width="42" height="55"/></svg></div>
  <fieldset class="worlds"><legend>Gravity</legend><label><input type="radio" name="world" value="earth" checked> Earth</label><label><input type="radio" name="world" value="moon"> Moon</label></fieldset><button class="toy-action" id="launch-pilot">Launch pilot</button><output id="flight-result" aria-live="polite"></output>`)
  + toyDialog('handheld','Star Courier',`
  <p>Pick up all three stars. Use the arrow keys or the direction pad to steer around the asteroids.</p>
  <div class="arcade-console"><div id="star-grid" class="star-grid" role="img" aria-label="Star Courier board"></div><div class="arcade-controls"><div class="dpad" role="group" aria-label="Ship direction">${[['up','↑'],['left','←'],['down','↓'],['right','→']].map(([id,key])=>`<button type="button" data-steer="${id}" aria-label="Move ${id}">${key}</button>`).join('')}</div><button id="restart-game" class="text-button">Restart</button></div></div><output id="game-result" aria-live="polite"></output>`)
  + toyDialog('typewriter','Pocket typewriter',`
  <form id="desk-writer"><label for="desk-note">What would you leave on my desk?</label><textarea id="desk-note" maxlength="220" rows="4" placeholder="Dear next person…" required></textarea><div class="writer-actions"><button class="toy-action">Strike the keys</button><span id="note-count">0 / 220</span></div></form><div id="desk-page" class="typed-sheet" hidden><p id="typed-note"></p><a id="save-note" download="playroom-note.txt">Save your note (.txt)</a></div><span id="type-status" role="status" class="sr"></span>`);
