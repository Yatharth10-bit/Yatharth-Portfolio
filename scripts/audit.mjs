const {createRequire}=await import('node:module');
const path=await import('node:path');
const fs=await import('node:fs/promises');
const {spawnSync}=await import('node:child_process');
const {default:assert}=await import('node:assert/strict');
const require=createRequire(path.join(process.env.AUDIT_PORTFOLIO,'package.json'));
const {chromium}=require('playwright');
const url='http://127.0.0.1:4173/Yatharth-Portfolio/';
await fs.mkdir('.audit',{recursive:true});
const chromePath=process.env.CHROME_PATH || chromium.executablePath();
const browser=await chromium.launch({headless:true,executablePath:chromePath});
try{
  const page=await browser.newPage({reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  async function accessibility(state){
    await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const findings=await page.evaluate(()=>window.axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
    await fs.writeFile(`.audit/axe-${state}.json`,JSON.stringify(findings.violations,null,2));
    assert.deepEqual(findings.violations.map(x=>x.id),[]);
  }
  for(const width of [320,390,768,1440,3840]){
    await page.setViewportSize({width,height:900});
    await page.goto(url);
    await page.evaluate(()=>document.fonts.ready);
    assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
    await page.screenshot({path:`.audit/home-${width}.png`});
  }
  await page.setViewportSize({width:390,height:844});
  await accessibility('light');
  await page.locator('[data-theme-toggle]').click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'dark');
  await accessibility('dark');
  assert.equal(await page.locator('#palette,[data-open="palette"]').count(),0);
  await page.locator('.card a[href="orbytmax.html"]').first().click();
  await page.waitForURL('**/orbytmax.html');
  await page.locator('[data-open="terminal"]').click();
  await page.locator('#cli input').fill('projects');
  await page.locator('#cli button').click();
  assert.match(await page.locator('#history').innerText(),/Ultron/);
  await accessibility('terminal');
  await page.keyboard.press('Escape');
  await page.goto(url);
  await page.getByRole('button',{name:'Experiments',exact:true}).click();
  assert.equal(await page.locator('.card:visible').count(),2);
  await page.locator('[data-toy="pilot"]').click();
  const missionNames=[];
  for(let round=0;round<4;round++) {
    const name=await page.locator('#mission-name').innerText();
    assert.notEqual(name,missionNames.at(-1)); missionNames.push(name);
    const board=page.locator('#mission-board');
    if(name==='Echo Relay'){
      const symbols=(await board.locator('.radio-code').getAttribute('aria-label')).split(', ');
      await board.getByRole('button',{name:'Cover the signal'}).click();
      for(const symbol of symbols) await board.getByRole('button',{name:symbol,exact:true}).click();
    }else if(name==='Signal Sweep'){
      const brief=await page.locator('#mission-brief').innerText();
      const glyph=brief.match(/\(([^)]+)\)/)[1];
      await board.getByText(glyph,{exact:true}).click();
    }else{
      const headings=['north','southeast','southwest'];
      const state=(await board.locator('button').evaluateAll(bs=>bs.map(b=>b.getAttribute('aria-label').split(' ').at(-1)))).map(h=>headings.indexOf(h));
      let solved=false;
      for(let code=0;code<27&&!solved;code++){
        const turns=[code%3,Math.floor(code/3)%3,Math.floor(code/9)];
        if(!state.every((v,i)=>(v+turns[i]+turns[(i+2)%3])%3===0)) continue;
        for(const [i,n] of turns.entries()) for(let t=0;t<n;t++) await board.locator('button').nth(i).click();
        solved=true;
      }
      assert.ok(solved);
    }
    assert.equal(await page.locator('#next-mission').innerText(),'Play again');
    if(round===0) await accessibility('mission');
    await page.locator('#next-mission').click();
  }
  assert.equal(new Set(missionNames).size,3);
  await page.keyboard.press('Escape');
  const consoleToy=page.locator('[data-toy="handheld"]');
  await consoleToy.focus();
  await page.keyboard.press('ArrowRight');
  assert.ok(await consoleToy.evaluate(el=>Boolean(el.style.translate)));
  await page.keyboard.press('Enter');
  await page.locator('#toy-handheld[open] .tile-ship').waitFor();
  let previousStart;
  for(let round=0;round<12;round++){
    const cells=await page.locator('#star-grid .tile').evaluateAll(tiles=>tiles.map(t=>t.classList[1]));
    let at=cells.indexOf('tile-ship');
    assert.notEqual(at,previousStart);previousStart=at;
    const stars=cells.flatMap((v,i)=>v==='tile-star'?[i]:[]);
    assert.equal(stars.length,3);
    for(const goal of stars){
      const search=[[at,[]]], visited=new Set([at]);
      let route;
      for(const [index,path] of search){
        if(index===goal){route=path;break;}
        const x=index%5,y=Math.floor(index/5);
        for(const [step,nx,ny] of [['Up',x,y-1],['Down',x,y+1],['Left',x-1,y],['Right',x+1,y]]){
          const next=ny*5+nx;
          if(nx<0||nx>=5||ny<0||ny>=5||visited.has(next)||cells[next]==='tile-rock') continue;
          visited.add(next);search.push([next,[...path,step]]);
        }
      }
      assert.ok(route,'every star must be reachable');
      if(round===0) for(const direction of route) await page.keyboard.press('Arrow'+direction);
      at=goal;
    }
    if(round===0) assert.match(await page.locator('#game-result').innerText(),/Delivery complete/);
    await page.locator('#restart-game').click();
  }
  await accessibility('arcade');
  await page.keyboard.press('Escape');
  await page.locator('[data-toy="typewriter"]').click();
  await page.locator('#desk-note').fill('An orbit on paper.');
  await page.locator('#desk-writer button').click();
  assert.equal(await page.locator('#typed-note').innerText(),'An orbit on paper.');
  assert.equal(await page.locator('#save-note').getAttribute('download'),'playroom-note.txt');
  await accessibility('typewriter');
  await page.keyboard.press('Escape');
  await page.route('https://formsubmit.co/ajax/**',route=>route.fulfill({json:{success:'true'}}));
  await page.getByLabel('Your name').fill('Local test');
  await page.getByLabel('Email address').fill('test@example.invalid');
  await page.getByLabel('Message',{exact:true}).fill('Simulated delivery');
  await page.locator('#contact-form button').click();
  await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('accepted'));
  assert.equal(await page.locator('.ribbon-track').evaluate(el=>getComputedStyle(el).animationName),'none');
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.locator('.ribbon-switch').click();
  assert.equal(await page.locator('.ribbon-track').evaluate(el=>getComputedStyle(el).animationPlayState),'paused');
  await page.locator('.ribbon-switch').click();
  assert.equal(await page.locator('.ribbon-track').evaluate(el=>getComputedStyle(el).animationPlayState),'running');
  await page.evaluate(()=>window.scrollTo(0,0));
  await page.mouse.move(25,100); await page.mouse.move(300,120);
  await page.waitForFunction(()=>document.querySelector('.jet-flame')?.transform.baseVal.consolidate()?.matrix.a>.40);
  await page.waitForFunction(()=>document.querySelector('.jet-flame')?.transform.baseVal.consolidate()?.matrix.a<.37);
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.cursor-rocket')?.hidden);
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
const command=path.join(process.env.AUDIT_PORTFOLIO,'node_modules/lighthouse/cli/index.js');
const status=spawnSync(process.execPath,[command,url,'--quiet','--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage','--only-categories=performance,accessibility,best-practices,seo','--output=json','--output-path=.audit/lighthouse.json'],{stdio:'inherit',env:{...process.env,CHROME_PATH:chromePath}});
if(status.status!==0)throw Error('Lighthouse failed to complete');
const report=JSON.parse(await fs.readFile('.audit/lighthouse.json','utf8'));
for(const [key,category] of Object.entries(report.categories)){console.log(key,Math.round(category.score*100));assert.ok(category.score>=.9,`${key} below 90`);}
