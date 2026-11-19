// Samostatná, pouze čtecí ukázka klientského reportu. Žádná data z interního formuláře se nečtou ani nemění.
const sections=[['vehicle','Vozidlo a zakázka'],['photos','Fotografie vozu'],['body','Karoserie, světla, skla a lak'],['wheels','Kola a pneumatiky'],['brakes','Brzdy'],['engine','Motorový prostor, motor a převodovka'],['underbody','Podvozek a nápravy'],['interior','Interiér a výbava'],['documents','Identifikace, dokumentace a servisní historie'],['diagnostics','Diagnostika'],['drive','Zkušební jízda'],['video-summary','Video shrnutí kontroly'],['investments','Doporučený servis a očekávané investice'],['final','Finální rozsudek']];
const labels=['V POŘÁDKU','VÝHRADA','ZÁVADA / RIZIKO','NEOVĚŘENO','NERELEVANTNÍ'];
const sample={
 vehicle:{make:'Volkswagen',model:'Passat',year:'2022',vin:'DEMO – VIN není skutečné',plate:'—',mileage:'142 360',originCountry:'Česká republika',stkValidUntil:'2027-06-30',fuel:'Nafta'},
 order:{adUrl:'—',askingPrice:'429000',priceNote:'—'},
 engine:{arrivalTemp:'Studený',coldStart:'Ověřen'},
 diagnostics:{done:'ANO',batteryVoltage:'12,5 V',note:'Diagnostika provedena. Protokol je součástí příloh v ostré verzi.'},
 documents:{identityResult:'SOUHLASÍ',identityNote:'Identifikační údaje odpovídají předloženým podkladům.',history:'Částečně doložená',historyNote:'K dispozici je část servisních záznamů.'},
 final:{verdict:'DOPORUČUJEME S VÝHRADAMI',summary:'Vozidlo působí zachovale a při zkušební jízdě nevykazuje zásadní problémy. Byly zjištěny dílčí nedostatky na pneumatikách a brzdách a některé servisní úkony je vhodné ověřit. Doporučujeme před koupí zohlednit očekávané investice.',priceAssessment:'Cena je vzhledem ke zjištěnému stavu vyšší',priceComment:'Zohlednit servisní náklady.'},
 investments:{items:[{title:'Přední brzdové destičky',note:'Doporučena výměna dle skutečného opotřebení.',min:'3000',max:'6000'},{title:'Pneumatiky',note:'Zohlednit stav a stáří pneumatik.',min:'10000',max:'23000'}]},
 paint:{3:{um:'115',result:'Původní / bez podezření'},4:{um:'220',result:'Lakováno',note:'Zvýšená hodnota laku na levých zadních dveřích.'}}
};
const findings={
 'body.visual':['V POŘÁDKU','Vizuálně odpovídá běžnému používání.'],
 'body.lights':['V POŘÁDKU','Bez zjevného poškození krytů.'],
 'body.glass':['V POŘÁDKU','Bez významného viditelného poškození.'],
 'engine.bay':['V POŘÁDKU','Bez výrazných vizuálních abnormalit.'],
 'engine.oil':['V POŘÁDKU','Hladina v kontrolovaném rozsahu.'],
 'engine.coolant':['V POŘÁDKU','Bez zjevného nedostatku.'],
 'engine.brakeFluid':['V POŘÁDKU','Hladina odpovídá kontrole.'],
 'engine.otherFluids':['NEOVĚŘENO','Ne všechny kapaliny byly přístupné.'],
 'engine.battery':['V POŘÁDKU','Bez viditelného poškození.'],
 'engine.belts':['NEOVĚŘENO','Přístup omezený.'],
 'engine.start':['V POŘÁDKU','Start bez zjevné abnormality.'],
 'engine.gearboxVisual':['V POŘÁDKU','Bez zjevného viditelného úniku.'],
 'engine.warm':['V POŘÁDKU','Po zkušební jízdě bez nově zjištěné abnormality.'],
 'underbody.front':['VÝHRADA','Drobné známky provozního opotřebení.'],
 'underbody.rear':['V POŘÁDKU','Bez významného viditelného nálezu.'],
 'underbody.floor':['V POŘÁDKU','Bez zjevného zásadního poškození.'],
 'underbody.exhaust':['V POŘÁDKU','Bez významného viditelného nálezu.'],
 'underbody.drive':['NERELEVANTNÍ','Vozidlo nemá pohon 4×4.'],
 'underbody.special':['NERELEVANTNÍ','Bez specifického systému k posouzení.'],
 'interior.visual':['V POŘÁDKU','Běžné opotřebení odpovídající nájezdu.'],
 'interior.info':['V POŘÁDKU','Základní funkce ověřeny.'],
 'interior.seats':['V POŘÁDKU','Funkce ověřeny v dostupném rozsahu.'],
 'interior.lightsFunction':['V POŘÁDKU','Funkce světel ověřena.'],
 'interior.cluster':['V POŘÁDKU','Bez zjevné abnormality.'],
 'interior.climate':['V POŘÁDKU','Funkce ověřena.'],
 'interior.safety':['NEOVĚŘENO','Některé asistenty nebylo možné bezpečně vyzkoušet.'],
 'interior.comfort':['V POŘÁDKU','Základní komfortní prvky funkční.'],
 'documents.tech':['V POŘÁDKU','Bez zjevného nesouladu.'],
 'diagnostics.significant':['VÝHRADA','Jednotlivý nález doporučen k ověření.'],
 'drive.motor':['V POŘÁDKU','Chod a odezva motoru bez zjevné abnormality.'],
 'drive.gearbox':['V POŘÁDKU','Řazení při jízdě bez zjevné abnormality.'],
 'drive.suspension':['VÝHRADA','Při přejezdu nerovností mírný hluk.'],
 'drive.brakes':['V POŘÁDKU','Brzdný účinek bez zjevné abnormality.'],
 'drive.steering':['V POŘÁDKU','Řízení bez zjevné abnormality.'],
 'drive.acceleration':['V POŘÁDKU','Akcelerace plynulá.'],
 'drive.drivetrain':['V POŘÁDKU','Bez zjevné abnormality.'],
 'drive.assist':['NEOVĚŘENO','Ne všechny asistenty bylo možné ověřit.']
};

// Lokální náhled skutečně vyplněné kontroly; bez serverového uložení či sdílení.
const liveDraft=(()=>{try{const raw=sessionStorage.getItem('autorozsudek-report-preview-v1');return raw?JSON.parse(raw):null}catch{return null}})();
const readPath=(root,path)=>path.split('.').reduce((v,k)=>v?.[k],root);
if(liveDraft){
  for(const key of ['vehicle','order','engine','diagnostics','documents','final']){for(const k of Object.keys(sample[key]||{}))sample[key][k]=''}
  sample.investments.items=[];
  sample.paint={};
  for(const key of ['vehicle','order','engine','diagnostics','documents','final','investments','paint']){
    if(liveDraft[key]&&typeof liveDraft[key]==='object')Object.assign(sample[key]??={},liveDraft[key]);
  }
  for(const key of Object.keys(findings)){
    const entry=readPath(liveDraft,'sections.'+key);
    if(entry)findings[key]=[entry.status||'NEOVĚŘENO',entry.note||''];
    else findings[key]=['NEOVĚŘENO',''];
  }
  const photoItems=readPath(liveDraft,'photos.names')||[];
  
}
const paintParts=['Přední nárazník','Kapota','LP blatník','LP dveře','LZ dveře','LZ blatník','Víko kufru','Zadní nárazník','PZ blatník','PZ dveře','PP dveře','PP blatník','L sloupek','P sloupek','Střecha'];
const wheels=['LP','PP','LZ','PZ'];
const money=n=>new Intl.NumberFormat('cs-CZ').format(Number(n)||0)+' Kč';
const safe=v=>String(v??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badge=v=>'<span class="badge '+(v==='V POŘÁDKU'?'ok':v==='VÝHRADA'?'warn':v==='ZÁVADA / RIZIKO'?'bad':'neutral')+'">'+safe(v||'NEOVĚŘENO')+'</span>';
const field=(k,v)=>'<div class="field"><span>'+safe(k)+'</span><strong>'+safe(v||'—')+'</strong></div>';
const row=(title,status,note)=>'<div class="result"><div><b>'+safe(title)+'</b>'+(note?'<p>'+safe(note)+'</p>':'')+'</div>'+badge(status)+'</div>';
const point=(key,title)=>{const a=findings[key]||['NEOVĚŘENO',''];return row(title,a[0],a[1])};
const card=(id,num,title,body)=>'<section class="card" id="'+id+'"><h2><span class="num">'+num+'</span>'+safe(title)+'</h2>'+body+'</section>';
const gallery='<div class="empty-media"><b>Fotografie a videa konkrétního vozu</b><p>V této ukázce nejsou přiloženy skutečné fotografie. V ostrém reportu zde budou nahrané snímky a videa z kontroly.</p></div>';
const paint=paintParts.map((name,i)=>{const v=sample.paint[i]||readPath(liveDraft||{},'paint.'+i)||{};return '<div class="paint-item"><b>'+(i+1)+'. '+safe(name)+'</b>'+field('MAX µm',v.um? v.um+' µm':'—')+field('Vyhodnocení',v.result||'NEOVĚŘENO')+(v.note?'<p>'+safe(v.note)+'</p>':'')+'</div>'}).join('');
const wheelItems=wheels.map((w,i)=>{const v=readPath(liveDraft||{},'wheels.'+w)||{};return '<div class="wheel"><h3>'+w+'</h3><div class="fields">'+field('Rozměr pneumatiky',liveDraft?v.size:'215/55 R17')+field('DOT',liveDraft?v.dot:(i<2?'2524':'1123'))+field('Dezén mm',liveDraft?v.tread:(i<2?'5,4':'3,8'))+'</div>'+row('Pneumatika',liveDraft?v.tire?.status:(i<2?'V POŘÁDKU':'VÝHRADA'),liveDraft?v.tire?.note:(i<2?'Bez významného nálezu.':'Zohlednit opotřebení.'))+row('Disk',liveDraft?v.rim?.status:'V POŘÁDKU',liveDraft?v.rim?.note:'Bez zjevného významného poškození.')+'</div>'}).join('');
const brakeItems=wheels.map((w,i)=>{const v=readPath(liveDraft||{},'brakes.'+w)||{};return '<div class="wheel"><h3>'+w+'</h3>'+row('Brzdový kotouč',liveDraft?v.disc?.status:(i<2?'VÝHRADA':'V POŘÁDKU'),liveDraft?v.disc?.note:(i<2?'Viditelné provozní opotřebení.':'Bez významného viditelného nálezu.'))+row('Brzdová destička',liveDraft?v.pad?.status:(i<2?'VÝHRADA':'V POŘÁDKU'),liveDraft?v.pad?.note:(i<2?'Doporučeno ověřit zbývající tloušťku.':'Bez významného viditelného nálezu.'))+row('Třmen – pouze viditelná abnormalita', 'NEOVĚŘENO',liveDraft?v.caliper?.note:'Bez samostatně doloženého nálezu.')+'</div>'}).join('');
const investmentItems=Array.isArray(sample.investments.items)?sample.investments.items:[];
const investmentTotal=investmentItems.reduce((a,x)=>[a[0]+(Number(String(x.min||0).replace(/[^0-9]/g,''))||0),a[1]+(Number(String(x.max||0).replace(/[^0-9]/g,''))||0)],[0,0]);
const investmentLabel=money(investmentTotal[0])+' – '+money(investmentTotal[1]);
const sectionsHtml=[
card('vehicle',1,'Vozidlo a zakázka','<div class="fields">'+Object.entries({'Značka':sample.vehicle.make,'Model':sample.vehicle.model,'Rok výroby':sample.vehicle.year,'VIN':sample.vehicle.vin,'SPZ':sample.vehicle.plate,'Stav km':sample.vehicle.mileage,'Země původu':sample.vehicle.originCountry,'Platnost STK':liveDraft?(sample.vehicle.stkValidUntil||'—'):'30. 6. 2027','Palivo':sample.vehicle.fuel,'Odkaz na inzerát':sample.order.adUrl,'Požadovaná cena':money(sample.order.askingPrice)}).map(([k,v])=>field(k,v)).join('')+'</div>'),
card('photos',2,'Fotografie a videa vozu',gallery),
card('body',3,'Karoserie, světla, skla a lak','<h3>3A · Vizuální stav karoserie, světel a skel</h3>'+point('body.visual','Karoserie – vizuální stav')+point('body.lights','Světla – pouze vizuální stav')+point('body.glass','Skla – vizuální stav')+'<h3>3B · Měření tloušťky laku</h3><p class="muted">Zaznamenána nejvyšší naměřená hodnota, nikoli průměr.</p><div class="paint-map-v2"><img src="../assets/3b-approved-horizontal-map.png" alt="Orientační mapa karoserie, 15 kontrolních míst"><span class="paint-map-v2-number paint-map-v2-13">13</span><span class="paint-map-v2-number paint-map-v2-14">14</span><span class="paint-map-v2-number paint-map-v2-15">15</span><div class="paint-map-v2-legend"><div class="paint-map-legend-row"><b>1</b><span>Přední nárazník</span></div><div class="paint-map-legend-row"><b>2</b><span>Kapota</span></div><div class="paint-map-legend-row"><b>3</b><span>Levý přední blatník (LP blatník)</span></div><div class="paint-map-legend-row"><b>4</b><span>Levé přední dveře (LP dveře)</span></div><div class="paint-map-legend-row"><b>5</b><span>Levé zadní dveře (LZ dveře)</span></div><div class="paint-map-legend-row"><b>6</b><span>Levý zadní blatník (LZ blatník)</span></div><div class="paint-map-legend-row"><b>7</b><span>Víko kufru (zadní dveře)</span></div><div class="paint-map-legend-row"><b>8</b><span>Zadní nárazník</span></div><div class="paint-map-legend-row"><b>9</b><span>Pravý zadní blatník (PZ blatník)</span></div><div class="paint-map-legend-row"><b>10</b><span>Pravé zadní dveře (PZ dveře)</span></div><div class="paint-map-legend-row"><b>11</b><span>Pravé přední dveře (PP dveře)</span></div><div class="paint-map-legend-row"><b>12</b><span>Pravý přední blatník (PP blatník)</span></div><div class="paint-map-legend-row"><b>13</b><span>L sloupek</span></div><div class="paint-map-legend-row"><b>14</b><span>P sloupek</span></div><div class="paint-map-legend-row"><b>15</b><span>Střecha</span></div></div></div><div class="paint-grid">'+paint+'</div>'),
card('wheels',4,'Kola a pneumatiky','<div class="twocol">'+wheelItems+'</div>'),
card('brakes',5,'Brzdy','<div class="twocol">'+brakeItems+'</div>'),
card('engine',6,'Motorový prostor, motor a převodovka',['Motorový prostor – vizuální stav','Motorový olej – hladina a vizuální stav','Chladicí kapalina – hladina a vizuální stav','Brzdová kapalina – hladina a vizuální stav','Ostatní relevantní provozní kapaliny','Akumulátor – vizuální stav','Viditelné řemeny a příslušenství – pokud přístupné'].map((t,i)=>point('engine.'+['bay','oil','coolant','brakeFluid','otherFluids','battery','belts'][i],t)).join('')+'<div class="fields">'+field('Teplota motoru při příjezdu',sample.engine.arrivalTemp)+field('Studený start',sample.engine.coldStart)+'</div>'+point('engine.start','Start a chod motoru')+point('engine.gearboxVisual','Převodovka – pouze viditelný fyzický stav')+point('engine.warm','Kontrola po zahřátí')),
card('underbody',7,'Podvozek a nápravy',field('Způsob kontroly',liveDraft?(readPath(liveDraft,'underbody.method')||'—'):'Postupné přizvednutí jednotlivých částí vozidla pomocí mobilního zvedáku')+[['front','Přední náprava'],['rear','Zadní náprava'],['floor','Spodní část vozu / podlaha'],['exhaust','Výfuková soustava'],['drive','Pohon / 4×4 – viditelný fyzický stav'],['special','Specifické systémy dle výbavy']].map(([k,t])=>point('underbody.'+k,t)).join('')),
card('interior',8,'Interiér a výbava','<h3>8A · Vizuální stav interiéru</h3>'+point('interior.visual','Interiér – vizuální stav')+'<h3>8B · Funkčnost interiéru a výbavy</h3>'+[['info','Infotainment a konektivita'],['seats','Sedadla – funkčnost'],['lightsFunction','Osvětlení – funkčnost'],['cluster','Přístrojový štít a displeje'],['climate','Klimatizace, topení a ventilace'],['safety','Bezpečnostní a asistenční prvky'],['comfort','Ovládací a komfortní prvky']].map(([k,t])=>point('interior.'+k,t)).join('')),
card('documents',9,'Identifikace, dokumentace a servisní historie','<h3>9A · Identifikace vozidla</h3>'+row('VIN a identifikátory',sample.documents.identityResult,sample.documents.identityNote)+'<h3>9B · Relevantní technické údaje a schválené změny</h3>'+point('documents.tech','Relevantní technické údaje / registrované úpravy')+'<h3>9C · Servisní historie a dokumentace</h3>'+field('Stav doložení',sample.documents.history)+'<p>'+safe(sample.documents.historyNote)+'</p>'+gallery),
card('diagnostics',10,'Diagnostika','<div class="fields">'+field('Diagnostika provedena',sample.diagnostics.done)+field('Napětí akumulátoru při vypnutém motoru',sample.diagnostics.batteryVoltage)+'</div><p>'+safe(sample.diagnostics.note)+'</p><div class="empty-media">Diagnostický protokol a další přílohy budou dostupné zde.</div>'+point('diagnostics.significant','Významný diagnostický nález')),
card('drive',11,'Zkušební jízda',[['motor','Motor'],['gearbox','Převodovka / spojka / řazení'],['suspension','Podvozek'],['brakes','Brzdy + parkovací brzda'],['steering','Řízení'],['acceleration','Akcelerace'],['drivetrain','Pohon'],['assist','Asistenční systémy']].map(([k,t])=>point('drive.'+k,t)).join('')),
card('video-summary',12,'Video shrnutí kontroly','<p class="muted">Video technika shrnující pozitivní i negativní nálezy (doporučená délka 3–5 minut).</p><div class="empty-media"><b>▶ Video shrnutí</b><p>V ukázce není video přiloženo. V ostrém reportu se zde zobrazí přehrávač.</p></div>'),
card('investments',13,'Doporučený servis a očekávané investice',investmentItems.map(x=>'<div class="investment"><div><b>'+safe(x.title)+'</b><p>'+safe(x.note)+'</p></div><strong>'+money(x.min)+' – '+money(x.max)+'</strong></div>').join('')+'<div class="total">OČEKÁVANÉ INVESTICE CELKEM <strong>'+investmentLabel+'</strong></div>'),
card('final',14,'Finální rozsudek','<div class="fields">'+field('Požadovaná cena prodávajícího',money(sample.order.askingPrice))+field('Očekávané investice',investmentLabel)+'</div><div class="verdict">'+safe(sample.final.verdict)+'</div><h3>Celkové hodnocení technika</h3><p>'+safe(sample.final.summary)+'</p>'+field('Posouzení požadované ceny',sample.final.priceAssessment)+field('Komentář k ceně',sample.final.priceComment)+'<div class="signature">Kontrolu provedl: <strong>Lukáš Stehlík · AutoRozsudek.cz</strong></div>')
];
if(liveDraft){
 // Další pole, která jsou v interním formuláři, ale nejsou v pevné šabloně reportu.
 const extraFields=[...document.querySelectorAll('[data-field]')];
 const included=new Set(['vehicle.make','vehicle.model','vehicle.year','vehicle.vin','vehicle.plate','vehicle.mileage','vehicle.originCountry','vehicle.stkValidUntil','vehicle.fuel','order.adUrl','order.askingPrice']);
 const block=document.createElement('div');
 block.id='reportAdditionalData';
 const extras=[];
 const walk=(v,p)=>{if(!v||typeof v!=='object')return;if(Array.isArray(v)){v.forEach((x,i)=>walk(x,p+'.'+i));return;}for(const [k,x] of Object.entries(v)){const path=p?p+'.'+k:k;if(path==='meta'||path.startsWith('photos.')||path.endsWith('.photos')||path.endsWith('.media')||path.endsWith('.video')||path.endsWith('.files')||path.startsWith('investments.')||path.startsWith('paint.')||path.startsWith('sections.')||path.startsWith('wheels.')||path.startsWith('brakes.'))continue;if(x&&typeof x==='object')walk(x,path);else if(x!==''&&x!==null&&x!==undefined&&!included.has(path))extras.push(field(path,x));}};
 walk(liveDraft,'');
 if(extras.length){const target=sectionsHtml.findIndex(x=>x.includes('id="vehicle"'));if(target>=0)sectionsHtml[target]=sectionsHtml[target].replace('</section>','<h3>Další zaznamenané údaje</h3><div class="fields">'+extras.join('')+'</div></section>');}
 const intro=document.querySelector('.intro');
 if(intro)intro.querySelector('p').textContent='Lokální náhled z vyplněné kontroly. Zatím nejde o odeslaný ani bezpečně sdílený report; fotografie a videa jsou dostupné jen v tomto prohlížeči, pokud jsou stále uložené.';
 const title=document.querySelector('.top span');if(title)title.textContent='LOKÁLNÍ NÁHLED REPORTU';
 const navtitle=document.querySelector('.navtitle strong');if(navtitle)navtitle.textContent=safe(liveDraft.meta?.id||'KONTROLA');
}
document.getElementById('nav').innerHTML=sections.map(([id,title],i)=>'<a href="#'+id+'"><span>'+(i+1)+'</span>'+safe(title)+'</a>').join('');
document.getElementById('report').innerHTML=sectionsHtml.join('');

if(liveDraft){
 const renderAttachments=async()=>{
  const requests=[];
  const walk=(v,p)=>{if(!v||typeof v!=='object')return;if(Array.isArray(v)){if(v.length&&v.every(x=>x&&typeof x==='object'&&'name'in x)){requests.push({path:p,items:v});return;}v.forEach((x,i)=>walk(x,p+'.'+i));return;}for(const [k,x]of Object.entries(v))walk(x,p?p+'.'+k:k)};
  walk(liveDraft,'');
  let db=null;try{db=await new Promise((resolve,reject)=>{const q=indexedDB.open('autorozsudek-preview-media',1);q.onupgradeneeded=()=>q.result.createObjectStore('files');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)})}catch(e){}
  const sectionFor=path=>path.startsWith('paint.')||path.startsWith('sections.body.')?'body':path.startsWith('wheels.')?'wheels':path.startsWith('brakes.')?'brakes':path.startsWith('sections.')?path.split('.')[1]:path.startsWith('documents.')?'documents':path.startsWith('diagnostics.')?'diagnostics':path.startsWith('videoSummary.')?'video-summary':'photos';
  for(const req of requests){
   const section=document.getElementById(sectionFor(req.path));if(!section)continue;
   const group=document.createElement('div');group.className='empty-media';group.style.marginTop='12px';
   const title=document.createElement('b');title.textContent='Přílohy: '+req.path;group.append(title);
   for(let i=0;i<req.items.length;i++){
    const item=req.items[i];let file=null;
    if(db)try{file=await new Promise((resolve,reject)=>{const tx=db.transaction('files','readonly');const q=tx.objectStore('files').get(req.path+'::'+i);q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)})}catch(e){}
    const wrap=document.createElement('div');wrap.style.margin='10px 0';
    const caption=document.createElement('div');caption.textContent=item.name||'Příloha';wrap.append(caption);
    if(file){const url=URL.createObjectURL(file);let el;if(file.type.startsWith('image/')){el=document.createElement('img');el.style.cssText='max-width:100%;max-height:360px;border-radius:8px';el.alt=item.name||'Fotografie'}else if(file.type.startsWith('video/')){el=document.createElement('video');el.controls=true;el.style.cssText='max-width:100%;max-height:360px'}else{el=document.createElement('a');el.textContent='Otevřít přílohu';el.download=item.name||'soubor'}el.src=url;if(el.tagName==='A')el.href=url;wrap.append(el)}
    else{const note=document.createElement('small');note.textContent='Soubor není v tomto prohlížeči dostupný.';wrap.append(note)}
    group.append(wrap);
   }
   section.append(group);
  }
  if(db)db.close();
  for(const id of ['photos','documents','diagnostics','video-summary']){const el=document.querySelector('#'+id+' .empty-media');if(el&&el.textContent.includes('V této ukázce')||el&&el.textContent.includes('V ostrém reportu')||el&&el.textContent.includes('V ukázce není video'))el.remove()}
 };
 renderAttachments();
}
