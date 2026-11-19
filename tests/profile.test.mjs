import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile,access } from 'node:fs/promises';
import { collect,renderStats,renderCalendar,replaceActivity } from '../scripts/refresh.mjs';

const now=new Date('2025-02-05T12:00:00Z');
const owner='example';
const entry={owner:{login:'EXAMPLE'},name:'demo',private:false,fork:false,pushed_at:'2025-02-05T12:00:00Z',default_branch:'main',size:10};
function sha(number){return number.toString(16).padStart(40,'0');}
function commit(number,date){return {sha:sha(number),commit:{committer:{date}}};}

test('Paginates both endpoints, avoids private and fork data, deduplicates commits and clips the window',async()=>{
  const requests=[];
  const request=async path=>{
    requests.push(path);
    const url=new URL(path,'https://api.github.com');
    const page=url.searchParams.get('page');
    if(url.pathname.startsWith('/users/')) return page==='1'?
      [...Array(96).fill({...entry,private:true}),{...entry,fork:true},{...entry,owner:{login:'another'}},{...entry,name:owner},entry]:
      [{...entry,name:'z_other',archived:true}];
    if(url.pathname.endsWith('/languages')) return {'<unsafe>':90,HTML:10};
    if(url.pathname.includes('/demo/commits')) return page==='1'?
      Array.from({length:100},(_,i)=>commit(i,'2025-02-04T23:59:59Z')):
      [commit(100,'2025-02-03T23:00:00Z'),commit(101,'2020-01-01T00:00:00Z')];
    return [commit(100,'2025-02-03T23:00:00Z')];
  };
  const data=await collect(owner,request,now);
  assert.equal(data.total,101);assert.equal(data.streak,2);
  assert.deepEqual(data.ranked,[['<unsafe>',180],['HTML',20]]);
  assert.equal(data.days.size,2);assert.deepEqual(data.latest.map(x=>x.name),['demo']);
  assert.equal(requests.filter(p=>p.includes('/languages')).length,2);
  assert.ok(requests.some(p=>p.includes('/commits?')&&p.endsWith('&page=2')));
  assert.ok(requests.some(p=>p.includes('/users/')&&p.endsWith('&page=2')));
  assert.ok(renderStats(data).includes('&lt;unsafe&gt;'));
  assert.ok(!renderStats(data).includes('<unsafe>'));
  assert.equal((renderCalendar(data).match(/ commits<\/title>/g)||[]).length,365);
});
test('Set boundaries for streaks, empty history and projects with dots or underscores',async()=>{
  const sample=async dates=>collect(owner,async path=>{
    if(path.startsWith('/users/'))return [{...entry,name:'repo_test.com'}];
    if(path.endsWith('/languages'))return {};
    return dates.map((d,i)=>commit(i,d+'T10:00:00Z'));
  },now);
  const data=await sample(['2025-02-05','2025-02-04','2025-02-02']);
  assert.equal(data.streak,2);
  assert.equal((await sample([])).streak,0);
  assert.equal((await sample(['2025-02-03'])).streak,0);
  const markdown='Title\n<!-- signal:recent:start -->\nstale\n<!-- signal:recent:end -->\nFooter';
  const fresh=replaceActivity(markdown,data);
  assert.equal(replaceActivity(fresh,data),fresh);
  assert.ok(fresh.includes('repo\\_test\\.com'));assert.ok(fresh.endsWith('Footer'));
  assert.throws(()=>replaceActivity('no markers',data),/markers/);
  assert.throws(()=>replaceActivity(markdown+markdown,data),/markers/);
});
test('Errors propagate without treating API failures as empty activity',async()=>{
  await assert.rejects(()=>collect(owner,async()=>{throw new Error('simulated failure');},now),/simulated failure/);
  await assert.rejects(()=>collect('x/y',async()=>[],now),/Invalid owner/);
});
test('All README images and both banner variants exist and include a title or accessible name',async()=>{
  const root=new URL('../',import.meta.url);
  const readme=await readFile(new URL('README.md',root),'utf8');
  const paths=[...new Set(readme.match(/assets\/[\w/-]+\.svg/g))];
  assert.equal(paths.length,8);
  for(const path of paths) {
    await access(new URL(path,root));
    assert.match(await readFile(new URL(path,root),'utf8'),/<title[ >]|aria-label="/);
  }
  for(const file of ['dark','light']){
    const banner=await readFile(new URL('assets/banner-'+file+'.svg',root),'utf8');
    assert.match(banner,/prefers-reduced-motion:no-preference/);
  }
});

