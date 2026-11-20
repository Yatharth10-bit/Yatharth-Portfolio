// Keep the system pointer as the precise hotspot. Only run frames while the rocket is moving or cooling.
const finePointer = matchMedia('(any-pointer: fine) and (any-hover: hover)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let rocket, flame, sparks, frame = 0, lastFrame = 0;
let x, y, targetX, targetY, lastMove = 0, speed = 0, throttle = 0, heading = 0, desiredHeading = 0;

function buildRocket() {
  rocket = document.createElement('div');
  rocket.className = 'cursor-rocket';
  rocket.setAttribute('aria-hidden','true');
  rocket.innerHTML = `<svg viewBox="0 0 70 36" width="54" height="28" fill="none">
    <g class="jet-sparks" fill="#ffdf89"><circle cx="-12" cy="-2" r="1.8"/><circle cx="-17" cy="1" r="1.3"/><circle cx="-22" cy="-1" r=".8"/></g>
    <g class="jet-flame"><path d="M0-4Q-5-4-12 0Q-5 4 0 4Z" fill="#ff754f"/><path d="M0-2.2Q-3-2.3-8 0Q-3 2.2 0 2.2Z" fill="#ffe798"/></g>
    <g stroke="#29203e" stroke-width="1.7" stroke-linejoin="round"><path d="m34 12-5-6 10 1 8 6m-13 9-5 7 11-2 7-6" fill="#ff939c"/><path d="M31 13q17-7 31 5-14 12-31 5z" fill="#fff4ce"/><path d="M54 13q5 2 8 5-4 3-8 5 3-5 0-10z" fill="#ff959f"/><path d="M29 13h4v10h-4z" fill="#a6a1df"/><circle cx="45" cy="18" r="3.6" fill="#7bd6d2"/></g>
  </svg>`;
  flame=rocket.querySelector('.jet-flame'); sparks=rocket.querySelector('.jet-sparks');
}
function hide() {
  cancelAnimationFrame(frame); frame=0; lastMove=0; lastFrame=0; speed=0; throttle=0;
  if(rocket) rocket.hidden=true;
}
function paint(time) {
  const dt=Math.max(1,Math.min(45,time-(lastFrame || time-16))); lastFrame=time;
  const follow=1-Math.exp(-dt/38);
  x+=(targetX-x)*follow; y+=(targetY-y)*follow;
  heading+=Math.atan2(Math.sin(desiredHeading-heading), Math.cos(desiredHeading-heading))*follow;
  const power=Math.min(1,speed/1.75)*Math.exp(-Math.max(0,time-lastMove-24)/105);
  throttle+=(power-throttle)*(1-Math.exp(-dt/68));
  const shimmer=1+.065*throttle*Math.sin(time*.06);
  flame.setAttribute('transform','translate(29 18) scale('+((.34+throttle*1.75)*shimmer)+' '+(.50+throttle*.63)+')');
  sparks.setAttribute('transform','translate(28 18) scale('+(1+.12*Math.sin(time*.025))+ ' 1)');
  sparks.style.opacity=String(Math.max(0,(throttle-.28)*1.3));
  rocket.style.transform='translate3d('+x+'px,'+y+'px,0) rotate('+heading+'rad)';
  if(time-lastMove<600 || throttle>.013 || Math.hypot(targetX-x,targetY-y)>.3) frame=requestAnimationFrame(paint);
  else {frame=0; lastFrame=0;}
}
document.addEventListener('pointermove', event=>{
  if(event.pointerType!=='mouse'||!finePointer.matches||reducedMotion.matches||event.target.closest?.('input,textarea,[contenteditable="true"]')) {hide();return;}
  if(!rocket) buildRocket();
  const layer=event.target.closest?.('dialog[open]') || document.body;
  if(rocket.parentNode!==layer) layer.append(rocket);
  const now=performance.now(), nx=event.clientX+10, ny=event.clientY+14;
  const elapsed=now-lastMove;
  if(!lastMove || rocket.hidden) {x=nx;y=ny;speed=0;heading=desiredHeading=-Math.PI/4;}
  else {
    const dx=nx-targetX,dy=ny-targetY, distance=Math.hypot(dx,dy);
    speed=distance/Math.max(4,elapsed);
    if(distance>.6) desiredHeading=Math.atan2(dy,dx);
  }
  targetX=nx;targetY=ny;lastMove=now;rocket.hidden=false;
  if(!frame) frame=requestAnimationFrame(paint);
},{passive:true});
document.addEventListener('pointerout',e=>{if(!e.relatedTarget) hide();});
document.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse') hide();},{passive:true});
window.addEventListener('blur',hide);
document.addEventListener('visibilitychange',()=>{if(document.hidden)hide();});
finePointer.addEventListener('change',hide); reducedMotion.addEventListener('change',hide);
