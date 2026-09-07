import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {marked}=await import(process.env.MARKED_PATH || 'marked');
const root=new URL('../',import.meta.url);
const md=await readFile(new URL('docs/濟州小詩生日之旅.md',root),'utf8');
const chunks=md.split(/^## /m).slice(1).map(s=>({title:s.split('\n')[0],body:s.slice(s.indexOf('\n')+1).replace(/\n---\s*$/,'')}));
const icon=(kind)=>'<svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+(kind==='book'?'<path d="M12 5c-3-2-7-2-10-1v15c3-1 7-1 10 1 3-2 7-2 10-1V4c-3-1-7-1-10 1Z"/><path d="M12 5v15"/>':'<rect x="3" y="3" width="6" height="6" rx="1"/><rect x="15" y="3" width="6" height="6" rx="1"/><rect x="3" y="15" width="6" height="6" rx="1"/><rect x="15" y="15" width="6" height="6" rx="1"/>')+'</svg>';
const nav='<nav class="page-nav" aria-label="頁面導覽"><a href="index.html">'+icon('book')+'封面</a><a href="journal.html">'+icon('grid')+'旅行目錄</a></nav>';
const footer='<footer class="page-footer"><p>Good Drive, Good Days ♡</p></footer>';
const shell=(title,body)=>'<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#fffdf9"><title>'+title+'｜濟州小詩生日之旅</title><link rel="stylesheet" href="styles.css"><script src="journal.js" defer></script></head><body><main class="paper-page">'+nav+body+footer+'</main></body></html>';
const render=s=>marked.parse(s).replace(/<table>/g,'<div class="table-scroll" tabindex="0" role="region" aria-label="資料表，可左右滑動"><table>').replace(/<\/table>/g,'</table></div>').replace(/<input disabled="" type="checkbox">/g,'<input type="checkbox">');
const header=(title,sub)=>'<header class="journal-header"><p class="eyebrow">JEJU · 07—11 SEP 2026</p><h1>'+title+'</h1><p class="intro">'+sub+'</p></header>';
const write=(name,body)=>writeFile(new URL(name,root),body);
await write('opening.html',shell('小詩，生日快樂', '<section class="birthday"><p class="eyebrow">A LITTLE BIRTHDAY GETAWAY</p><div class="birthday-seal" aria-hidden="true">♡</div><p class="birthday-date">SEPTEMBER · 2026</p><h1>小詩，<br>生日快樂。</h1><p class="birthday-sub">陪伴小詩，到濟州慶祝生日</p><div class="wish"><p>把忙碌放下，<br>把這幾天，留給我們。</p><p>沿著海岸開車，看看海、吃點喜歡的，<br>累了就坐下，喜歡就多留一會。</p><p>願妳自在、幸福，常常笑。<br>這趟旅程，慢慢走，開心就好。</p></div><p class="relax">RELAX · DRIVE · CELEBRATE</p><a class="button" href="journal.html">一起出發</a></section>'));
const labels=['機場・涯月，慢慢開始','茶香、牧場與市場','海女文化・城山風景','石文化・釀酒・海邊','貝果、海風，再回家'];
let cards='';
for(let i=1;i<=5;i++){
 const part=chunks.find(c=>c.title.startsWith('Day '+i+'｜'));
 const title='Day '+i+' · 9月'+(6+i)+'日';
 let source=part.body;
 const tablePattern=/\| 方向 \| 地點 \| Google Maps \|\n\|---\|---\|---\|\n((?:\|[^\n]*\|\n)+)/;
 const match=source.match(tablePattern);
 let locations='';
 if(match){
   locations='<div class="location-list">'+match[1].trim().split('\n').map(row=>{
     const cols=row.split('|').slice(1,-1).map(x=>x.trim());
     return '<div class="location-card"><span class="direction-badge">'+cols[0]+'</span><div><strong>'+cols[1]+'</strong><div class="location-map">'+marked.parseInline(cols[2])+'</div></div></div>';
   }).join('')+'</div>';
   source=source.replace(tablePattern,'LOCATIONCARDS\n');
 }
 let body=render(source).replace('<p>LOCATIONCARDS</p>',locations);
 body=body.replace('<h3>本日地點速查｜方向＋Google Maps</h3>','<h3>本日地點 · 方向與地圖</h3><p class="direction-key">方位暫以濟州市廳為中心：N 北 · NE 東北 · E 東 · SE 東南 · S 南 · SW 西南 · W 西 · NW 西北；C 市中心附加標記，? 待確認。</p>');
 let n=0;body=body.replace(/<input type="checkbox">([^<]*)/g,(_,text)=>'<label class="practice"><input type="checkbox" data-save="day'+i+'-'+(++n)+'">'+text+'</label>');
 const pos=body.indexOf('<h3>地點、地圖與簡介</h3>');
 const end=body.indexOf('<h3>當日核心路線</h3>');
 if(pos>=0&&end>pos)body=body.slice(0,pos)+'<details class="places"><summary>地點介紹與 Google Maps</summary>'+body.slice(pos+ '<h3>地點、地圖與簡介</h3>'.length,end)+'</details>'+body.slice(end);
 await write('day'+i+'.html',shell(title,header(title,labels[i-1])+'<article class="journal-content itinerary">'+body+'<p class="save-note">勾選只儲存在目前瀏覽器，不會同步至其他裝置。</p><nav class="day-pager">'+(i>1?'<a href="day'+(i-1)+'.html">← 前一天</a>':'<a href="opening.html">← 生日祝福</a>')+(i<5?'<a href="day'+(i+1)+'.html">下一天 →</a>':'<a href="journal.html">回到目錄 →</a>')+'</nav></article>'));
 cards+='<a class="day-card" href="day'+i+'.html"><span class="day-number">0'+i+'</span><span><small>SEP '+(6+i)+'</small><strong>'+labels[i-1]+'</strong></span><span aria-hidden="true">↗</span></a>';
}
for(const [file,key,title,sub] of [['stay','酒店與租車','安心落腳，慢慢出發','四晚住宿 · 取車 9/7 07:30 · 還車 9/11 18:00'],['weather','五日天氣','帶一點晴，也留一點彈性','2026年9月6日預報快照 · 非即時天氣'],['food','想食清單','把喜歡的味道，記下來','美食願望清單 · 未排入固定餐次'],['notes','待補資料','出發前，再確認一下','尚待確認的安排']]){
 const part=chunks.find(c=>c.title.startsWith(key));
 await write(file+'.html',shell(title,header(title,sub)+'<article class="journal-content itinerary">'+render(part.body)+'</article>'));
}
await write('journal.html',shell('五日旅行手帳',header('把日子，留在濟州','陪伴小詩的五日四夜生日自駕之旅')+'<div class="journal-content"><a class="wish-link" href="opening.html">給小詩的生日祝福 ♡</a><p class="route-caption">9月7日—11日 · RELAX & ROAD TRIP</p><div class="day-list">'+cards+'</div><div class="quick-grid"><a href="cafes.html">☕<strong>母胎村・咖啡清單</strong><small>17 個地點・詳細介紹與地圖</small></a><a href="stay.html">⌂<strong>酒店・租車</strong><small>四晚住宿與出發時間</small></a><a href="weather.html">☀<strong>五日天氣</strong><small>出發前的預報快照</small></a><a href="food.html">♡<strong>想食清單</strong><small>喜歡的味道慢慢找</small></a><a href="notes.html">✎<strong>待確認事項</strong><small>集合點與行程小提醒</small></a></div><aside class="note"><h2>每天，留一點空白</h2><p>禪坐、寫感恩記、念幸福自在慈心禪。<br>不用固定時間，跟著當天的節奏就好。</p></aside></div>'));
