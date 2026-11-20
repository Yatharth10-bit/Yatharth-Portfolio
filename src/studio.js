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
const palette=$('#palette'),terminal=$('#terminal'),query=$('#query');
let returnFocus=null;
function openDialog(dialog){
  const old=document.querySelector('dialog[open]');
  if(old===dialog)return;
  if(old)old.close();else returnFocus=document.activeElement;
  if(dialog===palette){query.value='';renderCommands();}
  dialog.showModal();(dialog===palette?query:$('#cli input')).focus();
}
for(const button of document.querySelectorAll('[data-open]'))button.addEventListener('click',()=>openDialog(document.getElementById(button.dataset.open)));
for(const dialog of [palette,terminal]){
  dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>{if(!document.querySelector('dialog[open]')&&returnFocus?.isConnected)returnFocus.focus({preventScroll:true});});
}
document.addEventListener('keydown',event=>{
  if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();if(palette.open)palette.close();else openDialog(palette);}
});
const go=path=>{palette.close();location.href=path;};
const commands=[
  ...['Work','About','Contact'].map(k=>[k,'Section',()=>go(data.home+'#'+k.toLowerCase())]),
  ...data.projects.map(p=>[p.name,'Project',()=>go(p.path)]),
  ['Toggle theme','Display',()=>{toggleTheme();palette.close();}],
  ['Copy email','Contact',async()=>{try{await navigator.clipboard.writeText(data.email);query.value='';$('#commands').textContent='Email address copied.';}catch{$('#commands').textContent=data.email;}}],
  ['Open terminal','Tool',()=>openDialog(terminal)]
];
function renderCommands(){
  const list=$('#commands');list.replaceChildren();
  const needle=query.value.trim().toLowerCase();
  for(const [title,group,action] of commands.filter(([name,group])=>(name+' '+group).toLowerCase().includes(needle))){
    const b=document.createElement('button'),meta=document.createElement('small');
    b.append(title);meta.textContent=group;b.append(meta);
    b.addEventListener('click',action);list.append(b);
  }
  if(!list.children.length)list.textContent='No matching commands.';
}
query.addEventListener('input',renderCommands);
palette.addEventListener('keydown',event=>{
  const buttons=[...document.querySelectorAll('#commands button')];
  if(!buttons.length)return;
  if(event.key==='Enter'&&document.activeElement===query){event.preventDefault();buttons[0].click();}
  if(['ArrowUp','ArrowDown'].includes(event.key)){
    event.preventDefault();
    const pos=buttons.indexOf(document.activeElement);
    const index=pos<0?(event.key==='ArrowDown'?0:buttons.length-1):(pos+(event.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length;
    buttons[index].focus();
  }
});
$('#cli').addEventListener('submit',event=>{
  event.preventDefault();const input=event.currentTarget.elements.command;
  const cmd=input.value.trim().toLowerCase();if(!cmd)return;
  const replies={help:'help · projects · about · contact · sudo hire-me · clear',projects:data.projects.map(p=>p.name).join(' / '),about:'Yatharth Srivastav — student developer and designer in India.',contact:data.email,'sudo hire-me':`Start a conversation at ${data.email}`};
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

