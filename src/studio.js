import './rocket.js';
const $ = selector => document.querySelector(selector);
const data = JSON.parse($('#site-data').textContent);
const theme = $('[data-theme-toggle]');
function updateThemeLabel(){theme.setAttribute('aria-label',`Switch to ${document.documentElement.dataset.theme==='light'?'dark':'light'} theme`);}
function toggleTheme(){
  const next=document.documentElement.dataset.theme==='light'?'dark':'light';
  document.documentElement.dataset.theme=next;
  try {localStorage.setItem('ys-theme',next);} catch { /* private mode */ }
  updateThemeLabel();
}
updateThemeLabel();theme.addEventListener('click',toggleTheme);
const filters=[...document.querySelectorAll('[data-filter]')];
for(const button of filters) button.addEventListener('click',()=>{
  let count=0;
  for(const card of document.querySelectorAll('[data-category]')){
    card.hidden=button.dataset.filter!=='All'&&card.dataset.category!==button.dataset.filter;
    if(!card.hidden) count++;
  }
  filters.forEach(other=>other.setAttribute('aria-pressed',String(other===button)));
  $('#filter-status').textContent=`Showing ${count} projects.`;
});
const terminal = $('#terminal');
const terminalButton = $('[data-open="terminal"]');
terminalButton.addEventListener('click', () => { terminal.showModal(); $('#cli input').focus(); });
terminal.querySelector('[data-close]').addEventListener('click', () => terminal.close());
terminal.addEventListener('close', () => terminalButton.focus({preventScroll:true}));
$('#cli').addEventListener('submit',event=>{
  event.preventDefault();const input=event.currentTarget.elements.command;
  const cmd=input.value.trim().toLowerCase();if(!cmd)return;
  const replies={help:'help · projects · about · contact · sudo hire-me · clear',projects:data.projects.join(' / '),about:'Yatharth Srivastav — student developer and designer in India.',contact:data.email,'sudo hire-me':`Start a conversation at ${data.email}`};
  const history=$('#history');
  if(cmd==='clear')history.replaceChildren();
  else{const out=document.createElement('p');out.textContent=`$ ${cmd}\n${Object.hasOwn(replies,cmd)?replies[cmd]:'Unknown command. Try help.'}`;history.append(out);}
  while(history.children.length>30) history.firstElementChild.remove();
  history.scrollTop=history.scrollHeight;input.value='';input.focus();
});
const contact=$('#contact-form');
contact?.addEventListener('submit',async event=>{
  event.preventDefault();const button=contact.querySelector('button'),status=$('#form-status');
  if(button.disabled)return;
  button.disabled=true;status.textContent='Sending…';
  try{
    const response=await fetch('https://formsubmit.co/ajax/'+data.email,{method:'POST',headers:{Accept:'application/json','Content-Type':'application/json'},body:JSON.stringify(Object.fromEntries(new FormData(contact))),signal:AbortSignal.timeout(15000)});
    const result=await response.json();
    if(!response.ok||String(result.success)!=='true')throw Error('Delivery unavailable');
    status.textContent='Message accepted by FormSubmit.';contact.reset();
  }catch{status.textContent='Couldn’t confirm delivery. Your message is still here. Try again or use the email link.';}
  finally{button.disabled=false;}
});
$('#writer')?.addEventListener('submit',event=>{
  event.preventDefault();const note=event.currentTarget.elements.note, message=note.value.trim();if(!message)return;
  const paper=document.createElement('p');paper.textContent=message;paper.className='paper';
  paper.style.paddingInlineStart=(Number($('#carriage').value)+4)+'%';$('#prints').prepend(paper);note.value='';
});
