const fs=await import('node:fs/promises');
const path=await import('node:path');
const {fileURLToPath}=await import('node:url');
const directory=fileURLToPath(new URL('../dist/',import.meta.url));
const base=new URL('https://yatharth10-bit.github.io/Yatharth-Portfolio/');
const files=await fs.readdir(directory,{recursive:true});
const failures=new Set(), external=new Set(), documents=new Map();
let checked=0;
for(const file of files.filter(p=>p.endsWith('.html'))) documents.set(file,await fs.readFile(path.join(directory,file),'utf8'));
async function check(raw,from){
  if(!raw||/^(mailto:|data:)/i.test(raw))return;
  const url=new URL(raw.replaceAll('&amp;','&'),new URL(from,base));
  if(url.origin!==base.origin){external.add(url.href);return;}
  if(!url.pathname.startsWith(base.pathname)){failures.add(`${from}: ${raw} escapes Pages base`);return;}
  const target=decodeURIComponent(url.pathname.slice(base.pathname.length))||'index.html';
  try{
    await fs.access(path.join(directory,target));
    if(url.hash&&documents.has(target)){
      const ids=[...documents.get(target).matchAll(/\bid=["']([^"']+)["']/g)].map(m=>m[1]);
      if(!ids.includes(decodeURIComponent(url.hash.slice(1))))throw Error('missing target ID');
    }
    checked++;
  }catch(error){failures.add(`${from}: ${raw} (${error.message})`);}
}
for(const [name,html] of documents){
  for(const [,url] of html.matchAll(/\b(?:href|src|action|poster)=["']([^"']+)["']/g))await check(url,name);
  for(const [,variants] of html.matchAll(/\bsrcset=["']([^"']+)["']/g))for(const v of variants.split(','))await check(v.trim().split(/\s+/)[0],name);
  if(name==='index.html'&&!html.includes('application/ld+json'))failures.add('Missing Person metadata');
}
for(const file of files.filter(f=>f.endsWith('.css'))){
  const css=await fs.readFile(path.join(directory,file),'utf8');
  for(const [,url] of css.matchAll(/url\(\s*['"]?([^'")\s]+)['"]?\s*\)/g))await check(url,file);
}
// External checks are opt-in because registration, throttling and host policy can block automated clients.
if(process.argv.includes('--external')){
  for(const href of external){
    if(new URL(href).hostname==='formsubmit.co')continue;
    try{
      const res=await fetch(href,{method:'GET',signal:AbortSignal.timeout(12000),headers:{'User-Agent':'PortfolioLinkCheck/1.0'}});
      await res.body?.cancel();
      if(!res.ok)failures.add(`External HTTP ${res.status}: ${href}`);
    }catch(err){failures.add(`External unreachable: ${href} (${err.cause?.code??err.message})`);}
  }
}
console.log(`${checked} internal references checked, ${external.size} unique external destinations.`);
if(failures.size){console.error([...failures].join('\n'));process.exitCode=1;}

