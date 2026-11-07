/* ===== Agent 学习空间 · 全站脚本 ===== */

/* ---------- 课程结构 ---------- */
const COURSE=[
 {p:'开始',items:[
   {id:'index',f:'index.html',n:'00',t:'学习地图与使用说明'}
 ]},
 {p:'第零幕 · 它到底是什么',items:[
   {id:'old',f:'a01-old.html',n:'0.1',t:'Agent 这个词，比大模型老三十多年'},
   {id:'vs',f:'a02-vs.html',n:'0.2',t:'它和另外三样东西差在哪'},
   {id:'holes',f:'a03-holes.html',n:'0.3',t:'大模型自己缺的六样东西'},
   {id:'def',f:'a04-def.html',n:'0.4',t:'两个定义，一个分水岭'}
 ]},
 {p:'第一部分 · 它由什么拼成',items:[
   {id:'blocks',f:'a05-blocks.html',n:'01',t:'六块积木，模型只占一块'},
   {id:'shapes',f:'a06-shapes.html',n:'02',t:'结构就三种，按三个问题分'},
   {id:'harness',f:'a07-harness.html',n:'03',t:'harness：套在模型外面的那层'}
 ]},
 {p:'第二部分 · 从会说话到会动手',items:[
   {id:'cot',f:'a08-cot.html',n:'04',t:'先让模型把话说完：CoT 与自洽'},
   {id:'tools',f:'a09-tools.html',n:'05',t:'让它学会用工具'},
   {id:'react',f:'a10-react.html',n:'06',t:'让思考接上行动：ReAct'},
   {id:'reflect',f:'a11-reflect.html',n:'07',t:'让失败变成经验'},
   {id:'memory',f:'a12-memory.html',n:'08',t:'给它一段能记住的人生'},
   {id:'search',f:'a13-search.html',n:'09',t:'把一条线走成一张图'},
   {id:'four',f:'a14-four.html',n:'10',t:'四个模块，一把尺子'}
 ]},
 {p:'第三部分 · 一个 Agent 不够用',items:[
   {id:'multi',f:'a15-multi.html',n:'11',t:'一次一问，撑不住真实任务'},
   {id:'collab',f:'a16-collab.html',n:'12',t:'多角色协作的三种形态'},
   {id:'cost',f:'a17-cost.html',n:'13',t:'每多一个角色，就多一份开销'}
 ]},
 {p:'第四部分 · 动手与选型',items:[
   {id:'build',f:'a18-build.html',n:'14',t:'真要动手做，四个阶段'},
   {id:'stack',f:'a19-stack.html',n:'15',t:'LangChain 与 LangGraph'},
   {id:'platform',f:'a20-platform.html',n:'16',t:'五个平台，各站一个位置'}
 ]},
 {p:'第五部分 · 论文地图',items:[
   {id:'papers',f:'a21-papers.html',n:'A',t:'十三篇，按问题索引'}
 ]},
 {p:'附录',items:[
   {id:'gloss',f:'a22-glossary.html',n:'B',t:'术语表'}
 ]}
];

const FLAT=COURSE.flatMap(g=>g.items);

(function(){
  const html=document.documentElement;
  const pageId=html.dataset.page||'index';
  const idx=FLAT.findIndex(x=>x.id===pageId);
  const cur=FLAT[idx]||FLAT[0];
  const doc=document.getElementById('doc');
  if(!doc) return;

  /* 主题 */
  let theme='light';
  try{theme=localStorage.getItem('agent-theme')||'light'}catch(e){}
  html.setAttribute('data-theme',theme);
  function setTheme(t){
    theme=t; html.setAttribute('data-theme',t);
    try{localStorage.setItem('agent-theme',t)}catch(e){}
    const tx=document.getElementById('themeTxt'); if(tx) tx.textContent=t==='dark'?'浅色':'深色';
    const ic=document.getElementById('themeIcon');
    if(ic) ic.innerHTML = t==='dark'
      ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>'
      : '<path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/>';
  }

  /* 已完成 */
  let done=new Set();
  try{done=new Set(JSON.parse(localStorage.getItem('agent-done')||'[]'))}catch(e){}
  const saveDone=()=>{try{localStorage.setItem('agent-done',JSON.stringify([...done]))}catch(e){}};
  const pct=Math.round(done.size/FLAT.length*100);

  /* 顶栏 */
  const bar=document.createElement('header');
  bar.className='topbar';
  bar.innerHTML=`<div class="topbar-in">
    <button class="tbtn menu-btn" id="menuBtn" aria-label="目录">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>
    <div class="brand">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="5" r="2.4"/><circle cx="5" cy="17" r="2.4"/><circle cx="19" cy="17" r="2.4"/>
        <path d="M10.7 6.9L6.4 14.8M13.3 6.9l4.3 7.9M7.4 17h9.2"/></svg>
      <span>Agent 学习空间</span><small>· 从会说话到会行动</small>
    </div>
    <div class="sp"></div>
    <span class="prog-mini">${done.size}/${FLAT.length} · ${pct}%</span>
    <button class="tbtn" id="themeBtn"><svg id="themeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M20 14.5A8.5 8.5 0 019.5 4a8.5 8.5 0 1010.5 10.5z"/></svg><span id="themeTxt">深色</span></button>
  </div>`;
  document.body.prepend(bar);

  /* 侧栏 */
  const side=document.createElement('aside');
  side.className='side'; side.id='side';
  let navHTML='<div class="side-prog"><div class="bar"><i id="pbar" style="width:'+pct+'%"></i></div>'+
    '<div class="txt"><span>学习进度</span><span id="ptxt">'+done.size+' / '+FLAT.length+'</span></div></div>';
  COURSE.forEach(g=>{
    navHTML+='<div class="part">'+g.p+'</div><nav class="nav">';
    g.items.forEach(it=>{
      navHTML+='<a href="'+it.f+'" class="'+(it.id===pageId?'on':'')+(done.has(it.id)?' done':'')+'">'+
        '<em>'+it.n+'</em><span class="t">'+it.t+'</span><span class="dot"></span></a>';
    });
    navHTML+='</nav>';
  });
  side.innerHTML=navHTML;

  const scrim=document.createElement('div'); scrim.className='scrim'; scrim.id='scrim';

  const layout=document.createElement('div');
  layout.className='layout';
  doc.parentNode.insertBefore(layout,doc);
  layout.appendChild(side); layout.appendChild(doc);
  document.body.appendChild(scrim);

  document.getElementById('menuBtn').onclick=()=>{side.classList.toggle('open');scrim.classList.toggle('on')};
  scrim.onclick=()=>{side.classList.remove('open');scrim.classList.remove('on')};
  document.getElementById('themeBtn').onclick=()=>setTheme(theme==='dark'?'light':'dark');
  setTheme(theme);

  /* 翻页 + 完成 */
  const prev=FLAT[idx-1], next=FLAT[idx+1];
  const pager=document.createElement('div');
  pager.className='pager';
  pager.innerHTML=
    (prev?'<a href="'+prev.f+'"><div class="k">← 上一页 · '+prev.n+'</div><div class="v">'+prev.t+'</div></a>':'')+
    (next?'<a href="'+next.f+'" class="next"><div class="k">下一页 · '+next.n+' →</div><div class="v">'+next.t+'</div></a>':'');
  const isDone=done.has(pageId);
  const donebar=document.createElement('div');
  donebar.className='donebar';
  donebar.innerHTML='<button class="ctl '+(isDone?'on':'')+'" id="doneBtn">'+(isDone?'✓ 已标记学完':'标记本页为学完')+'</button>'+
    '<span class="done-tip" id="doneTip">进度保存在本地浏览器</span>';
  doc.appendChild(donebar);
  doc.appendChild(pager);
  donebar.querySelector('#doneBtn').onclick=function(){
    if(done.has(pageId)){done.delete(pageId)}else{done.add(pageId)}
    saveDone();
    const on=done.has(pageId);
    this.classList.toggle('on',on);
    this.textContent=on?'✓ 已标记学完':'标记本页为学完';
    const p=Math.round(done.size/FLAT.length*100);
    const pb=document.getElementById('pbar'), pt=document.getElementById('ptxt');
    if(pb)pb.style.width=p+'%'; if(pt)pt.textContent=done.size+' / '+FLAT.length;
    const a=side.querySelector('a.on'); if(a)a.classList.toggle('done',on);
    const pm=document.querySelector('.prog-mini'); if(pm)pm.textContent=done.size+'/'+FLAT.length+' · '+p+'%';
    document.getElementById('doneTip').textContent=on?'已完成 · 进度已更新':'已取消标记';
  };

  /* 页内小节导航 */
  const h2s=[...doc.querySelectorAll('h2')];
  if(h2s.length>2){
    h2s.forEach((h,i)=>{ if(!h.id) h.id='s'+(i+1); });
    const toc=document.createElement('nav');
    toc.className='pagetoc';
    toc.style.cssText='display:flex;flex-wrap:wrap;gap:6px;margin-top:20px';
    toc.innerHTML=h2s.map(h=>'<a href="#'+h.id+'" style="border:1px solid var(--line);background:var(--surface);padding:4px 10px;border-radius:20px;font-size:11.5px;color:var(--ink-2);text-decoration:none;border-bottom:1px solid var(--line)">'+h.textContent.replace(/^\d+\s*/,'')+'</a>').join('');
    const head=doc.querySelector('.lesson-head');
    if(head) head.appendChild(toc);
  }

  /* ---------- 自测交互 ---------- */
  document.querySelectorAll('.qz').forEach(function(qz,i){
    qz.querySelectorAll('.opt').forEach(function(btn){
      btn.addEventListener('click',function(){
        if(qz.dataset.done) return;
        qz.dataset.done='1';
        const right=btn.hasAttribute('data-ok');
        btn.classList.add(right?'ok':'no');
        if(!right){
          const t=qz.querySelector('.opt[data-ok]'); if(t) t.classList.add('ok');
        }
        const ex=qz.querySelector('.ex'); if(ex) ex.classList.add('on');
        try{
          localStorage.setItem('agent-quiz:'+(html.dataset.page||'x')+':'+i, right?'1':'0');
        }catch(e){}
      });
    });
  });

  /* 键位：← → 翻页 */
  document.addEventListener('keydown',function(e){
    if(e.target.matches('input,textarea')) return;
    if(e.key==='ArrowLeft'&&prev){location.href=prev.f}
    if(e.key==='ArrowRight'&&next){location.href=next.f}
  });
})();
