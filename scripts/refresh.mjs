import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

const dayMs = 86_400_000;
const dateKey = time => new Date(time).toISOString().slice(0,10);
const safeName = /^[a-z\d][a-z\d._-]{0,99}$/i;
const repoName = /^[a-z\d._-]{1,100}$/i;
const compareText = (a,b) => a < b ? -1 : a > b ? 1 : 0;
const escape = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));

async function api(path, token, emptyHistory = false) {
  const response = await fetch('https://api.github.com'+path, {
    headers:{Authorization:'Bearer '+token,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28','User-Agent':'signal-studio-profile'},
    signal:AbortSignal.timeout(30000),
    redirect:'error'
  });
  if (emptyHistory && response.status === 409) {
    const message = (await response.json()).message;
    if (/git repository is empty/i.test(message)) return [];
  }
  if (!response.ok) throw new Error('GitHub request failed with HTTP '+response.status+' for '+path.split('?')[0]);
  return response.json();
}

async function* pages(request,path,emptyHistory=false) {
  const join=path.includes('?')?'&':'?';
  for (let page=1; ;page++) {
    const rows=await request(path+join+'per_page=100&page='+page,emptyHistory);
    if (!Array.isArray(rows)) throw new Error('Expected a GitHub list');
    yield* rows;
    if (rows.length<100) return;
  }
}

export async function collect(owner, request, now=new Date()) {
  if (!safeName.test(owner)) throw new Error('Invalid owner');
  const today=dateKey(now);
  const start=dateKey(Date.parse(today)-(364*dayMs));
  const days=new Map();
  const shas=new Set();
  const languages=new Map();
  const latest=[];
  const ownerKey=owner.toLowerCase();
  for await (const repo of pages(request, '/users/'+owner+'/repos?type=owner&sort=full_name')) {
    if (repo.private !== false || repo.fork !== false || repo.owner?.login?.toLowerCase() !== ownerKey) continue;
    if (!repoName.test(repo.name) || ['.','..',ownerKey].includes(repo.name.toLowerCase())) continue;
    const path='/repos/'+owner+'/'+encodeURIComponent(repo.name);
    const bytes=await request(path+'/languages');
    for (const [name,size] of Object.entries(bytes)) {
      if (!Number.isSafeInteger(size) || size<0) throw new Error('Invalid language byte count');
      languages.set(name,(languages.get(name)??0)+size);
    }
    if (!repo.pushed_at || !repo.default_branch) continue;
    const after=start+'T00:00:00Z';
    const params=new URLSearchParams({author:owner,sha:repo.default_branch,since:after,until:now.toISOString()});
    for await (const commit of pages(request,path+'/commits?'+params,true)) {
      if (!/^[\da-f]{40,64}$/i.test(commit.sha)) throw new Error('Invalid commit SHA');
      const date=dateKey(commit.commit.committer.date);
      if (date<start || date>today || shas.has(commit.sha)) continue;
      shas.add(commit.sha);
      days.set(date,(days.get(date)??0)+1);
    }
    if (!repo.archived && repo.size>0) latest.push({name:repo.name,pushed:new Date(repo.pushed_at).toISOString()});
  }
  latest.sort((a,b)=>compareText(b.pushed,a.pushed)||compareText(a.name,b.name));
  let cursor=Date.parse(today);
  if (!days.has(today)) cursor-=dayMs;
  let streak=0;
  while (days.has(dateKey(cursor))) {streak++;cursor-=dayMs;}
  const ranked=[...languages].filter(([,bytes])=>bytes>0).sort((a,b)=>b[1]-a[1]||compareText(a[0],b[0]));
  return {owner,today,start,days,total:shas.size,streak,ranked,latest:latest.slice(0,4)};
}

const titleStyle='font-family="Arial,Helvetica,sans-serif" font-weight="bold" fill="#fcf4e8"';
const labelStyle='font-family="ui-monospace,Consolas,monospace" fill="#ccd0df"';
function panel(title,body,height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="title" viewBox="0 0 760 ${height}"><title id="title">${escape(title)}</title><rect width="760" height="${height}" rx="10" fill="#171923"/>${body}</svg>\n`;
}
function label(x,y,text,size=14) {return `<text x="${x}" y="${y}" font-size="${size}" ${labelStyle}>${escape(text)}</text>`;}
function heading(x,y,text,size=28) {return `<text x="${x}" y="${y}" font-size="${size}" ${titleStyle}>${escape(text)}</text>`;}

export function renderStats(data) {
  if (!data) return panel('Pending public activity',heading(24,62,'Waiting for the first refresh',24),100);
  const weeks=Array(12).fill(0);
  const lastDay=Date.parse(data.today);
  for(const [day,count] of data.days){
    const age=Math.floor((lastDay-Date.parse(day))/dayMs);
    if(age>=0&&age<84)weeks[11-Math.floor(age/7)]+=count;
  }
  const peak=Math.max(1,...weeks);
  const bars=weeks.map((count,i)=>{
    const h=count?Math.max(2,Math.round(52*count/peak)):1;
    return `<rect x="${427+i*24}" y="${97-h}" width="15" height="${h}" fill="${count?'#a5b0ff':'#4c5068'}"><title>Week ending ${dateKey(lastDay-(11-i)*7*dayMs)}: ${count} commits</title></rect>`;
  }).join('');
  let body=label(23,27,'PUBLIC DEFAULT BRANCHES  /  LAST 365 DAYS');
  body+=heading(22,89,data.total,49)+label(25,114,'Authored commits');
  body+=heading(225,89,data.streak,49)+label(227,114,'Day streak');
  body+=`<style>@media(prefers-reduced-motion:no-preference){.bars{transform-origin:0 97px;animation:rise .9s ease-out both}@keyframes rise{from{transform:scaleY(.04)}to{transform:scaleY(1)}}}</style><g class="bars">${bars}</g>`+label(427,116,'Commits by week · last 12 weeks',13);
  const sum=data.ranked.reduce((n,[,value])=>n+value,0);
  const mix=data.ranked.slice(0,3).map(([name,value])=>name+' '+(100*value/sum).toFixed(1)+'%').join('   /   ');
  body+=`<path d="M24 135h712" stroke="#484b64"/>`+label(24,161,mix||'No language data',14);
  return panel(`${data.total} authored commits and a ${data.streak}-day streak. Weekly commits ${weeks.join(', ')}. ${mix}`,body,181);
}


export function renderCalendar(data) {
  let body=label(24,27,'COMMIT CALENDAR  /  UTC');
  if (!data) return panel('Calendar awaiting its first public snapshot',body+heading(24,67,'Calendar pending',22)+label(24,96,'Populated from public default-branch history.'),120);
  const start=Date.parse(data.start),end=Date.parse(data.today);
  const left=start-new Date(start).getUTCDay()*dayMs;
  const colors=['#313449','#5665b5','#8795ed','#c0a1e8','#ff98c7'];
  const cell=12, x0=54, y0=62;
  let previousLabel=-50;
  for (let time=start;time<=end;time+=dayMs) {
    const date=dateKey(time),day=new Date(time),col=Math.floor((time-left)/(7*dayMs));
    const count=data.days.get(date)??0;
    const level=count===0?0:count===1?1:count<=3?2:count<=7?3:4;
    const x=x0+cell*col, y=y0+cell*day.getUTCDay();
    if ((day.getUTCDate()===1||time===start) && col-previousLabel>=3) {
      body+=label(x,52,day.toLocaleString('en-US',{timeZone:'UTC',month:'short'}),11);
      previousLabel=col;
    }
    body+=`<rect x="${x}" y="${y}" width="10" height="10" rx="2" fill="${colors[level]}"><title>${date}: ${count} commits</title></rect>`;
  }
  for (const [y,name] of [[82,'M'],[106,'W'],[130,'F']]) body+=label(29,y,name,11);
  body+=label(24,168,data.start+' to '+data.today+'  ·  '+data.days.size+' active days',13);
  return panel('Daily public authored commits for '+data.start+' through '+data.today,body,185);
}

export function replaceActivity(readme,data) {
  const start='<!-- signal:recent:start -->',end='<!-- signal:recent:end -->';
  if (readme.split(start).length!==2 ||readme.split(end).length!==2 || readme.indexOf(end)<readme.indexOf(start)) throw new Error('Missing or ambiguous recent activity markers');
  const rows=data.latest.map(r=>`- [${r.name.replace(/([_.*])/g,'\\$1')}](https://github.com/${data.owner}/${encodeURIComponent(r.name)}) · pushed ${r.pushed.slice(0,10)}`);
  const summary='Public default branches · '+data.total+' authored commits · '+data.streak+'-day active streak · updated '+data.today+' (UTC).';
  const content=[summary, rows.length?'**Recently pushed projects**\n\n'+rows.join('\n'):'No public project pushes to display.'].join('\n\n');
  return readme.slice(0,readme.indexOf(start)+start.length)+'\n'+content+'\n'+readme.slice(readme.indexOf(end));
}

async function main() {
  const token=process.env.GITHUB_TOKEN;
  const owner=process.env.PROFILE_OWNER;
  if (!token || !owner) throw new Error('Set GITHUB_TOKEN and PROFILE_OWNER on the runner');
  const data=await collect(owner,(path,empty)=>api(path,token,empty));
  const base=new URL('../',import.meta.url);
  const readme=new URL('README.md',base);
  const outputs=[
    [readme,replaceActivity(await readFile(readme,'utf8'),data)],
    [new URL('assets/generated/stats.svg',base),renderStats(data)],
    [new URL('assets/generated/calendar.svg',base),renderCalendar(data)]
  ];
  for (const [file,content] of outputs) await writeFile(file,content);
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) {
  main().catch(e=>{console.error(e.message);process.exitCode=1;});
}

