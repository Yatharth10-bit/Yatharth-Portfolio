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
  await accessibility('dark');
  await page.locator('[data-theme-toggle]').click();
  await page.reload();
  assert.equal(await page.locator('html').getAttribute('data-theme'),'light');
  await accessibility('light');
  await page.keyboard.press('Control+k');
  await accessibility('palette');
  await page.locator('#query').fill('OrbytMax');
  await page.keyboard.press('Enter');
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
  await page.locator('#tune').click();
  assert.equal(await page.locator('#instrument-title').innerText(),'Phase shift');
  await page.route('https://formsubmit.co/ajax/**',route=>route.fulfill({json:{success:'true'}}));
  await page.getByLabel('Your name').fill('Local test');
  await page.getByLabel('Email address').fill('test@example.invalid');
  await page.getByLabel('Message',{exact:true}).fill('Simulated delivery');
  await page.locator('#contact-form button').click();
  await page.waitForFunction(()=>document.querySelector('#form-status').textContent.includes('accepted'));
  assert.deepEqual(errors,[]);
}finally{await browser.close();}
const command=path.join(process.env.AUDIT_PORTFOLIO,'node_modules/lighthouse/cli/index.js');
const status=spawnSync(process.execPath,[command,url,'--quiet','--chrome-flags=--headless --no-sandbox --disable-dev-shm-usage','--only-categories=performance,accessibility,best-practices,seo','--output=json','--output-path=.audit/lighthouse.json'],{stdio:'inherit',env:{...process.env,CHROME_PATH:chromePath}});
if(status.status!==0)throw Error('Lighthouse failed to complete');
const report=JSON.parse(await fs.readFile('.audit/lighthouse.json','utf8'));
for(const [key,category] of Object.entries(report.categories)){console.log(key,Math.round(category.score*100));assert.ok(category.score>=.9,`${key} below 90`);}

