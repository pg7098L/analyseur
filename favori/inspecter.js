(async()=>{
if(window.__inspRunning&&Date.now()-window.__inspRunning<120000)return;window.__inspRunning=Date.now();
const MAX=500,out=[],D=document.documentElement,sx0=scrollX,sy0=scrollY,hash0=location.hash;
const W=Math.max(D.scrollWidth,innerWidth),H=Math.max(D.scrollHeight,document.body.scrollHeight);
const tr=c=>!c||c==='transparent'||/rgba\([^)]*,\s*0\)$/.test(c);
const hex=c=>{const m=c&&c.match(/rgba?\(([^)]+)\)/);if(!m)return null;const p=m[1].split(',').map(s=>parseFloat(s));if(p.length>3&&p[3]===0)return null;return '#'+p.slice(0,3).map(v=>Math.round(v).toString(16).padStart(2,'0')).join('')};
const ebg=el=>{let e=el;while(e&&e.nodeType===1){const cs=getComputedStyle(e);if(cs.backgroundImage!=='none')return 'image';if(!tr(cs.backgroundColor))return hex(cs.backgroundColor);e=e.parentElement}return '#ffffff'};
const own=el=>{let t='';for(const n of el.childNodes)if(n.nodeType===3)t+=' '+n.textContent;return t.replace(/[ \t\n\r]+/g,' ').trim()};
const vis=el=>{if(!el)return false;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity!==0};
const shown=el=>{if(!el||!el.isConnected)return false;const r=el.getBoundingClientRect();if(r.width<2||r.height<2)return false;const cs=getComputedStyle(el);return cs.display!=='none'&&cs.visibility!=='hidden'&&+cs.opacity>0.05};
const bx=el=>{const r=el.getBoundingClientRect();return{x:Math.round(r.left+scrollX),y:Math.round(r.top+scrollY),w:Math.round(r.width),h:Math.round(r.height)}};
const tech=el=>el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+(typeof el.className==='string'&&el.className.trim()?'.'+el.className.trim().split(/\s+/).slice(0,3).join('.'):'');
const P=document.createElement('div');
P.style.cssText='position:fixed;z-index:2147483647;top:16px;right:16px;width:340px;background:#1A1A1F;color:#fff;font:14px/1.45 system-ui,sans-serif;padding:14px 16px;border-radius:12px;box-shadow:0 10px 40px rgba(0,0,0,.35);text-align:left;pointer-events:none';
P.innerHTML='<b>Inspecteur de page</b><div data-s style="margin-top:6px;opacity:.85">Mesure de la page…</div>';
document.body.appendChild(P);
const S=t=>{const e=P.querySelector('[data-s]');if(e)e.textContent=t};
const mine=el=>el===P||P.contains(el);
const wait=ms=>new Promise(r=>setTimeout(r,ms));
await wait(30);

/* Lames Drupal */
const LRX=[/(?:^|\s)paragraph--type--([\w-]+)/,/(?:^|\s)block-(?!content(?:\s|$))([\w-]+)/];
const lames=[],lmap=new Map();
const hasMedia=e=>!!e.querySelector('img,video,iframe,svg,picture,canvas,object,embed,input,select,textarea,form')||[e,...e.querySelectorAll('*')].slice(0,300).some(x=>getComputedStyle(x).backgroundImage!=='none');
const reg=e=>{if(lmap.has(e))return;const c=typeof e.className==='string'?e.className:'';let m=null;for(const rx of LRX){m=c.match(rx);if(m)break}if(!m&&e.dataset&&e.dataset.blockPluginId)m=[0,e.dataset.blockPluginId];if(!m)return;const k=lames.length,txt=(e.innerText||'').trim();lames.push(Object.assign({k,type:m[1].replace(/[_:]+/g,'-'),empty:!txt&&!hasMedia(e)?1:0,vis:vis(e)?1:0,tech:tech(e)},bx(e)));lmap.set(e,k)};
document.querySelectorAll('[class*="paragraph--type--"],[class*="block-"],[data-block-plugin-id]').forEach(e=>{if(!mine(e))reg(e)});
const lameOf=el=>{let e=el;while(e&&e!==document.body){if(lmap.has(e))return lmap.get(e);e=e.parentElement}return null};
const WYS='.text-formatted,[class*="field--type-text"],.ck-content,.wysiwyg,.field--name-body';

/* Éléments visibles */
let id=0;
for(const el of document.body.querySelectorAll('*')){
if(out.length>=MAX)break;
if(mine(el))continue;
const tag=el.tagName.toLowerCase();
if(/^(script|style|noscript|template|meta|link|br|path|g|defs|use|symbol|clippath|mask|lineargradient|stop)$/.test(tag))continue;
const r=el.getBoundingClientRect();if(r.width<2||r.height<2)continue;
const cs=getComputedStyle(el);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity===0)continue;
const tx=own(el),box=!tr(cs.backgroundColor)||cs.backgroundImage!=='none'||parseFloat(cs.borderTopWidth)>0||cs.boxShadow!=='none';
const media=/^(img|svg|video|canvas|iframe|input|button|select|textarea|picture)$/.test(tag);
if(!tx&&!box&&!media)continue;
const o={i:id++,t:tag,x:Math.round(r.left+scrollX),y:Math.round(r.top+scrollY),w:Math.round(r.width),h:Math.round(r.height)};
const lm=lameOf(el);if(lm!=null)o.lm=lm;
if(tx){o.tx=tx.slice(0,160);if(cs.display==='inline'){let pb=el.parentElement;while(pb&&pb!==document.body&&getComputedStyle(pb).display==='inline')pb=pb.parentElement;if(pb&&own(pb))o.sk=1}else{const ft=(el.innerText||'').replace(/[ \t\n\r]+/g,' ').trim();if(ft.length>tx.length+1&&!el.querySelector('div,p,li,h1,h2,h3,h4,h5,h6,section,article,ul,ol,table,button'))o.ft=ft.slice(0,400)}o.f=cs.fontFamily.split(',')[0].replace(/["']/g,'').trim();o.s=Math.round(parseFloat(cs.fontSize));o.wt=parseInt(cs.fontWeight)||400;if(cs.fontStyle==='italic')o.it=1;o.c=hex(cs.color);o.bg=ebg(el);o.ta=cs.textAlign;if(cs.lineHeight!=='normal')o.lh=Math.round(parseFloat(cs.lineHeight));if(el.closest(WYS))o.wys=1;let s=el;while(s&&s!==document.body){const st=s.getAttribute&&s.getAttribute('style');if(st&&/(color|font|background|text-align)/i.test(st)){o.st=1;break}if(s.matches&&s.matches(WYS))break;s=s.parentElement}}
if(box||media){const b=hex(cs.backgroundColor);if(b)o.fill=b;if(cs.backgroundImage!=='none')o.grad=1;const rad=parseFloat(cs.borderTopLeftRadius);if(rad)o.r=Math.round(Math.min(rad,999));if(parseFloat(cs.borderTopWidth)>0)o.bd=hex(cs.borderTopColor);if(media)o.m=1;const pl=parseFloat(cs.paddingLeft);if(pl)o.pl=Math.round(pl)}
out.push(o)}

/* Titres (y compris ceux masqués visuellement pour les lecteurs d'écran) */
const heads=[...document.querySelectorAll('h1,h2,h3,h4,h5,h6')].filter(h=>{if(mine(h))return false;const cs=getComputedStyle(h);return cs.display!=='none'&&cs.visibility!=='hidden'&&h.getClientRects().length>0}).slice(0,80).map(h=>Object.assign({l:+h.tagName[1],tx:(h.innerText||h.textContent||'').trim().slice(0,120),lm:lameOf(h),wys:h.closest(WYS)?1:0,hid:vis(h)?0:1,tech:tech(h)},bx(h)));

/* Liens : seulement les liens internes réellement cassés et les liens en http.
   Les liens « # » (vers la page elle-même) ne sont jamais signalés. */
const links=[],seenHref=new Map();
document.querySelectorAll('a[href]').forEach(a=>{if(mine(a)||!vis(a))return;const href=(a.getAttribute('href')||'').trim();if(!href||href.startsWith('#')||/^(mailto|tel|sms|javascript):/i.test(href))return;
const o=Object.assign({tx:((a.innerText||'').trim()||a.getAttribute('aria-label')||a.getAttribute('title')||'').slice(0,80),href:href.slice(0,160),lm:lameOf(a),tech:tech(a)},bx(a));
if(/^http:\/\//i.test(href)&&location.protocol==='https:'){o.pb='http';links.push(o);return}
try{const u=new URL(href,location.href);u.hash='';if(u.origin===location.origin&&u.href!==location.href.split('#')[0]&&!seenHref.has(u.href)&&seenHref.size<80)seenHref.set(u.href,o)}catch(e){}});
const hrefs=[...seenHref.entries()];
for(let n=0;n<hrefs.length;n+=8){S('Vérification des liens internes '+Math.min(n+8,hrefs.length)+'/'+hrefs.length+'…');await Promise.all(hrefs.slice(n,n+8).map(async([u,o])=>{try{const ctl=new AbortController(),tm=setTimeout(()=>ctl.abort(),8000);let r=await fetch(u,{method:'HEAD',credentials:'same-origin',redirect:'follow',signal:ctl.signal});if(r.status===405||r.status===501||r.status===403)r=await fetch(u,{method:'GET',credentials:'same-origin',redirect:'follow',signal:ctl.signal});clearTimeout(tm);if(r.status===404||r.status===410||r.status>=500){o.pb='mort';o.code=r.status;links.push(o)}}catch(e){}}))}

/* Questions, accordéons, menus dépliants : test au plus près d'un vrai clic.
   Règle de prudence : on ne conclut « ne s'ouvre pas » que si la page n'a réagi d'AUCUNE façon
   et que le contenu visé est toujours masqué. Dans le doute : « incertain » (jamais signalé comme erreur). */
const TRIG='details>summary,[aria-expanded],[aria-controls],[data-bs-toggle="collapse"],[data-toggle="collapse"],[role="tab"],.ckeditor-accordion-toggler,[class*="accordion"] button,[class*="accordion"] [role="button"],[class*="faq"] button,[class*="faq"] [role="button"],[class*="faq"] dt,[class*="toggle"]';
let cands=[...new Set(document.querySelectorAll(TRIG))].filter(e=>!mine(e)&&vis(e)&&!e.closest('nav,header,footer,[role="navigation"],.toolbar,#toolbar-administration,form')&&!(e.tagName==='A'&&!e.hasAttribute('aria-expanded')&&!e.hasAttribute('aria-controls')&&!(e.getAttribute('href')||'#').startsWith('#')));
cands=cands.filter(e=>!cands.some(o=>o!==e&&e.contains(o))).slice(0,40);
const itemOf=t=>{if(t.tagName==='SUMMARY')return t.parentElement;let it=t.parentElement,d=0;while(it&&it.parentElement&&it.parentElement!==document.body&&d<6){const p=it.parentElement;if(cands.some(c=>c!==t&&p.contains(c)))break;it=p;d++}return it||t};
const stopNav=e=>{const a=e.target&&e.target.closest&&e.target.closest('a[href]');if(a&&!mine(a)){const h=a.getAttribute('href')||'';if(h&&!h.startsWith('#'))e.preventDefault()}};
const stopSubmit=e=>e.preventDefault();
document.addEventListener('click',stopNav,true);document.addEventListener('submit',stopSubmit,true);
const press=async t=>{t.scrollIntoView({block:'center',inline:'nearest'});await wait(80);const r=t.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+Math.min(r.height/2,30);let hit=document.elementFromPoint(x,y);if(!hit||mine(hit)||!(t.contains(hit)||hit.contains(t)))hit=t;if(hit.contains(t)&&hit!==t)hit=t;const o={bubbles:true,cancelable:true,composed:true,clientX:x,clientY:y,view:window,button:0,buttons:1};const fire=(type,P)=>{try{hit.dispatchEvent(new P(type,Object.assign({},o,P===window.PointerEvent?{pointerId:1,pointerType:'mouse',isPrimary:true}:{})))}catch(e){}};const PE=window.PointerEvent||MouseEvent;try{t.focus({preventScroll:true})}catch(e){}
fire('pointerover',PE);fire('mouseover',MouseEvent);fire('pointerdown',PE);fire('mousedown',MouseEvent);fire('pointerup',PE);fire('mouseup',MouseEvent);try{hit.click()}catch(e){}};
const settle=async(regs,ms)=>{const h=()=>regs.reduce((s,e)=>s+(e.isConnected?e.getBoundingClientRect().height:0),0);let last=h(),stable=0,moved=false;const t0=performance.now();while(performance.now()-t0<ms){await wait(100);const v=h();if(Math.abs(v-last)>0.5){moved=true;stable=0}else if(moved&&++stable>=4)break;last=v}return last};
const isOpen=t=>{const id=(t.getAttribute('aria-controls')||'').split(/\s+/)[0];return t.getAttribute('aria-expanded')==='true'||(t.tagName==='SUMMARY'&&t.parentElement.open)||(!!id&&shown(document.getElementById(id)))};
const init=cands.map(isOpen);
const inter=[];
for(let n=0;n<cands.length;n++){
const t=cands[n];S('Test des questions et menus dépliants '+(n+1)+'/'+cands.length+'…');
const r0=bx(t),isTab=t.getAttribute('role')==='tab',q=(own(t)||(t.innerText||'')).trim().slice(0,140),base=Object.assign({q,kind:t.tagName==='SUMMARY'?'details':isTab?'onglet':'accordeon',lm:lameOf(t),tech:tech(t)},r0);
if(isTab&&t.getAttribute('aria-selected')==='true'){inter.push(Object.assign(base,{res:'ok',ans:'',why:'onglet déjà actif'}));continue}
const ctlId=(t.getAttribute('aria-controls')||'').split(/\s+/)[0],tgt=ctlId?document.getElementById(ctlId):(t.tagName==='SUMMARY'?t.parentElement:null);
const item=itemOf(t),regs=tgt&&!item.contains(tgt)?[item,tgt]:[item];
const all=()=>[...new Set(regs.flatMap(r=>r.isConnected?[r,...r.querySelectorAll('*')]:[]))].filter(e=>!t.contains(e)&&!e.contains(t)).slice(0,600);
const before=new Set(all().filter(shown)),h0=regs.reduce((s,e)=>s+e.getBoundingClientRect().height,0),tgtWas=shown(tgt);
const wasOpen=t.getAttribute('aria-expanded')==='true'||(t.tagName==='SUMMARY'&&t.parentElement.open)||(tgt&&tgtWas&&!!ctlId);
let muts=0;const mo=new MutationObserver(l=>{for(const m of l)if(!mine(m.target))muts++});mo.observe(document.body,{subtree:true,childList:true,attributes:true,characterData:true});
await press(t);
const h1=await settle(regs,2500);
mo.disconnect();
const newly=all().filter(e=>shown(e)&&!before.has(e)),outer=newly.filter(e=>!newly.some(o=>o!==e&&o.contains(e)));
const grew=h1-h0,tgtNow=shown(tgt),hashMoved=location.hash!==hash0;
let res,ans='',why='';
if(wasOpen){res=(Math.abs(grew)>2||muts>0)?'ok':'incertain';why=res==='ok'?'élément déjà ouvert, il se referme au clic':'élément déjà ouvert, aucune réaction mesurable'}
else if(grew>8||(tgt&&tgtNow&&!tgtWas)){
const area=(tgt&&tgtNow&&!tgtWas)?[tgt]:outer;
ans=area.map(e=>(e.innerText||'').trim()).join(' ').replace(/\s+/g,' ').trim();
const media=area.some(e=>e.matches('img,video,iframe,picture,canvas,object')||e.querySelector('img,video,iframe,picture,canvas,object,table,ul,ol,a'));
const areaH=area.reduce((s,e)=>s+e.getBoundingClientRect().height,0);
if(area.length&&ans.replace(/\s/g,'').length<3&&!media&&areaH>=8&&grew>8){res='vide';why='la zone de réponse s’ouvre ('+Math.round(grew)+' px) mais ne contient aucun texte'}
else{res='ok';why='la réponse s’affiche ('+Math.round(grew)+' px)'}}
else if(muts===0&&!hashMoved&&!newly.length&&Math.abs(grew)<=2&&((tgt&&!tgtNow)||(t.tagName==='SUMMARY'&&!t.parentElement.open))){res='rien';why='après clic et 2,5 s d’attente : aucune réaction de la page, '+(ctlId?'#'+ctlId:'le contenu')+' toujours masqué'}
else{res='incertain';why=muts||newly.length||hashMoved?'la page réagit mais aucune réponse n’est apparue de façon mesurable (ouverture au survol, animation ou affichage particulier)':'aucun contenu associé identifiable'}
inter.push(Object.assign(base,{res,ans:ans.slice(0,600),why}));
if(!isTab&&((res==='ok'||res==='vide')&&!wasOpen||(wasOpen&&res==='ok'))){await press(t);await settle(regs,1500)}
}
for(let n=0;n<cands.length;n++){const t=cands[n];if(init[n]&&!isOpen(t)&&t.getAttribute('role')!=='tab'){S('Remise en état de la page…');await press(t);await settle([itemOf(t)],1500)}}
document.removeEventListener('click',stopNav,true);document.removeEventListener('submit',stopSubmit,true);
window.scrollTo(sx0,sy0);
const drupal=!!document.querySelector('[data-drupal-selector],[data-drupal-link-system-path],[data-history-node-id]')||/drupal/i.test((document.querySelector('meta[name="Generator"],meta[name="generator"]')||{}).content||'');
const data={v:3,url:location.href,title:document.title,vw:innerWidth,W,H,drupal,text:document.body.innerText.replace(P.innerText,'').slice(0,20000),el:out,lames,heads,imgs:[],links,inter};
const s='INSPECTEUR:'+JSON.stringify(data);
window.__inspecteur=s;window.__inspRunning=0;
const c=k=>inter.filter(x=>x.res===k).length,ko=c('rien')+c('vide'),unc=c('incertain');
P.style.pointerEvents='auto';
P.innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;gap:8px"><b>Inspecteur de page</b><button data-x style="background:none;border:none;color:#fff;font-size:20px;cursor:pointer;line-height:1">×</button></div><div style="margin:6px 0 12px;opacity:.85">'+out.length+' éléments · '+lames.length+' lames · '+inter.length+' questions ou menus testés'+(inter.length?' : '+c('ok')+' OK'+(ko?', <b style="color:#FF8A8A">'+ko+' en échec</b>':'')+(unc?', '+unc+' à vérifier à la main':''):'')+'</div><button data-c style="width:100%;background:#fff;color:#1A1A1F;border:none;border-radius:999px;padding:10px 14px;font:600 14px system-ui,sans-serif;cursor:pointer">Copier les mesures</button><div data-m style="margin-top:8px;font-size:13px;opacity:.85">Puis colle-les dans l’Inspecteur de page.</div>';
P.querySelector('[data-x]').onclick=()=>P.remove();
P.querySelector('[data-c]').onclick=()=>{const m=P.querySelector('[data-m]');const fb=()=>{let t=P.querySelector('textarea');if(!t){t=document.createElement('textarea');t.style.cssText='width:100%;height:90px;margin-top:8px;font:11px monospace';t.value=s;P.appendChild(t)}t.focus();t.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}m.textContent=ok?'Copié ! Colle-les dans l’Inspecteur de page.':'Copie le texte ci-dessous avec Ctrl+C.'};if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(s).then(()=>{m.textContent='Copié ! Colle-les dans l’Inspecteur de page.'},fb);else fb()};
})();
