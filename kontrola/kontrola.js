const STORAGE_KEY='autorozsudek-kontrola-v1';
const STATUS=[['V POŘÁDKU','ok'],['VÝHRADA','warn'],['ZÁVADA / RIZIKO','bad'],['NEOVĚŘENO','unknown'],['NERELEVANTNÍ','na']];
const navItems=[['vehicle','Vozidlo a zakázka'],['photos','Fotografie vozu'],['body','Karoserie, světla, skla a lak'],['wheels','Kola a pneumatiky'],['brakes','Brzdy'],['engine','Motorový prostor, motor a převodovka'],['underbody','Podvozek a nápravy'],['interior','Interiér a výbava'],['documents','Identifikace, dokumentace a servisní historie'],['diagnostics','Diagnostika'],['drive','Zkušební jízda'],['investments','Doporučený servis a očekávané investice'],['final','Finální rozsudek']];
let state=load();
function load(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY))||{}}catch{return {}}}
function get(p){return p.split('.').reduce((o,k)=>o?.[k],state)}
function set(p,v){const k=p.split('.');let o=state;k.slice(0,-1).forEach(x=>o=o[x]??={});o[k.at(-1)]=v;save();updateInvestmentTotal();updateFinalSummary()}
let saveTimer;
function save(){const s=document.querySelector('#saveState');if(s)s.textContent='Ukládám…';clearTimeout(saveTimer);saveTimer=setTimeout(()=>{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));if(s)s.textContent='Uloženo v zařízení'},180)}
function esc(s=''){return String(s).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]))}
function status(path,allowNA=true){const opts=allowNA?STATUS:STATUS.filter(x=>x[0]!=='NERELEVANTNÍ');return '<div class="status-row" data-choice="'+path+'">'+opts.map(([v,c])=>'<button type="button" class="'+c+'" data-value="'+v+'">'+v+'</button>').join('')+'</div>'}
function note(path,ph='Konkrétní zjištění…'){return '<label>Poznámka / diktování<textarea data-field="'+path+'" rows="2" placeholder="'+ph+'"></textarea></label>'}
function media(path,label='＋ Přidat foto'){return '<div class="finding-media"><label class="mini-upload"><input type="file" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" multiple data-media="'+path+'"><span>'+label+'</span></label><div class="media-files" data-media-list="'+path+'"></div></div>'}
function point(key,title,extra='',withMedia=true){return '<div class="check-point"><h3>'+title+'</h3>'+status('sections.'+key+'.status')+extra+note('sections.'+key+'.note')+(withMedia?media('sections.'+key+'.photos'):'')+'</div>'}
function nav(){document.querySelector('#sectionNav').innerHTML=navItems.map((x,i)=>'<a href="#'+x[0]+'"><span class="nav-num">'+(i+1)+'</span>'+x[1]+'</a>').join('')}
function card(id,num,title,body){return '<section class="card" id="'+id+'"><div class="section-heading"><div><span class="step">'+num+'</span><h2>'+title+'</h2></div></div>'+body+'</section>'}

function bodyMap(parts){const legend=['Přední nárazník','Kapota','Levý přední blatník|LP blatník','Levé přední dveře|LP dveře','Levé zadní dveře|LZ dveře','Levý zadní blatník|LZ blatník','Víko kufru|zadní dveře','Zadní nárazník','Pravý zadní blatník|PZ blatník','Pravé zadní dveře|PZ dveře','Pravé přední dveře|PP dveře','Pravý přední blatník|PP blatník','Střecha'];return '<div class="body-map-wrap body-map-approved-final"><div class="body-map-sharp-layout"><div class="body-map-approved-car"><img class="body-map-approved-final-img" src="../assets/3b-approved-horizontal-map.png" alt="Orientační mapa karoserie – přední část vozu vpravo"></div><div class="body-map-sharp-legend">'+legend.map((x,i)=>{const a=x.split('|');return '<div class="body-map-sharp-row"><b>'+(i+1)+'</b><span>'+a[0]+(a[1]?'<small>('+a[1]+')</small>':'')+'</span></div>'}).join('')+'<div class="body-map-sharp-note">ⓘ Technický půdorys slouží k rychlé orientaci mezi jednotlivými karosářskými díly. Čísla odpovídají položkám měření níže.</div></div></div></div>';}
function bodySection(){const parts=['Přední nárazník','Kapota','LP blatník','LP dveře','LZ dveře','LZ blatník','Víko kufru','Zadní nárazník','PZ blatník','PZ dveře','PP dveře','PP blatník','Střecha'];return card('body','3','Karoserie, světla, skla a lak','<div class="subhead"><b>3A · Vizuální stav karoserie, světel a skel</b><span>Světla zde pouze vizuálně – funkčnost patří do bodu 8.</span></div>'+point('body.visual','Karoserie – vizuální stav')+point('body.lights','Světla – pouze vizuální stav', '<p class="muted small">Praskliny, zamlžení, poškození, stav krytů a těles. Funkci světel zde nehodnotit.</p>')+point('body.glass','Skla – vizuální stav')+'<div class="subhead"><b>3B · Měření tloušťky laku</b><span>Zapisuje se nejvyšší naměřená hodnota, nikdy průměr.</span></div>'+bodyMap(parts)+'<div class="paint-grid">'+parts.map((p,i)=>'<div class="paint-part"><b>'+(i+1)+'. '+p+'</b><div class="paint-fields"><label>MAX µm<input data-field="paint.'+i+'.um" inputmode="numeric" placeholder="—"></label><label>Vyhodnocení<select data-field="paint.'+i+'.result"><option value="">Vyberte…</option><option>Původní / bez podezření</option><option>Lakováno</option><option>Podezření na větší opravu</option><option>PLAST</option><option>Nelze změřit</option></select></label></div>'+note('paint.'+i+'.note','Volitelné…')+media('paint.'+i+'.photos')+'</div>').join('')+'</div>')}

function wheels(){const ps=['LP','PP','LZ','PZ'];return card('wheels','4','Kola a pneumatiky','<p class="muted">Model pneumatiky ani rozměr/ET disku se rutinně nezapisují. Pneumatika a disk jsou samostatné kontrolní body. Fotografie slouží jako reálná dokumentace konkrétního kola.</p><div class="wheel-grid">'+ps.map(pos=>'<div class="wheel"><h3>'+pos+'</h3><div class="grid cols-3"><label>Rozměr pneumatiky<input data-field="wheels.'+pos+'.size" placeholder="215/55 R17">'+(pos==='LP'?'<button type="button" class="copy-tire-size">Použít rozměr pro všechna kola</button>':'')+'</label><label>DOT<input data-field="wheels.'+pos+'.dot" placeholder="2524"></label><label>Dezén mm<input data-field="wheels.'+pos+'.tread" inputmode="decimal" placeholder="5,4"></label></div>'+media('wheels.'+pos+'.photos','＋ Přidat fotografie kola')+'<div class="component-block"><h4>Pneumatika</h4>'+status('wheels.'+pos+'.tire.status',false)+note('wheels.'+pos+'.tire.note','Pouze relevantní nález na pneumatice…')+'</div><div class="component-block"><h4>Disk</h4>'+status('wheels.'+pos+'.rim.status',false)+note('wheels.'+pos+'.rim.note','Poškození, deformace, prasklina, oprava / svar…')+'</div></div>').join('')+'</div>')}

function brakes(){const ps=['LP','PP','LZ','PZ'];return card('brakes','5','Brzdy','<p class="muted">Staticky hodnotíme pouze to, co je skutečně viditelné. Kotouč a destička jsou samostatné kontrolní body. Pokud destičku nelze spolehlivě vidět, použijte NEOVĚŘENO. Viditelný únik, hadice nebo vedení se zapíše jako konkrétní nález u daného kola. Funkční chování brzd patří do zkušební jízdy.</p><div class="wheel-grid">'+ps.map(pos=>'<div class="wheel"><h3>'+pos+'</h3>'+media('brakes.'+pos+'.photos','＋ Přidat fotografie brzdy')+'<div class="component-block"><h4>Brzdový kotouč</h4>'+status('brakes.'+pos+'.disc.status',false)+note('brakes.'+pos+'.disc.note','Nález na kotouči, případně viditelný únik / vedení…')+'</div><div class="component-block"><h4>Brzdová destička</h4>'+status('brakes.'+pos+'.pad.status',false)+note('brakes.'+pos+'.pad.note','Nález na destičce…')+'</div><div class="component-block"><h4>Třmen – pouze viditelná abnormalita</h4>'+note('brakes.'+pos+'.caliper.note','Jen pokud je vidět koroze, poškození, únik nebo jiná abnormalita…')+'</div></div>').join('')+'</div>')}

function engine(){return card('engine','6','Motorový prostor, motor a převodovka',point('engine.bay','Motorový prostor – vizuální stav')+point('engine.oil','Motorový olej – hladina a vizuální stav')+point('engine.coolant','Chladicí kapalina – hladina a vizuální stav')+point('engine.brakeFluid','Brzdová kapalina – hladina a vizuální stav')+point('engine.otherFluids','Ostatní relevantní provozní kapaliny')+point('engine.battery','Akumulátor – vizuální stav')+point('engine.belts','Viditelné řemeny a příslušenství – pokud přístupné')+'<div class="grid cols-2"><label>Teplota motoru při příjezdu<select data-field="engine.arrivalTemp"><option value="">Vyberte…</option><option>Studený</option><option>Částečně zahřátý</option><option>Zahřátý</option></select></label><label>Studený start<select data-field="engine.coldStart"><option value="">Vyberte…</option><option>Ověřen</option><option>Neověřen</option></select></label></div>'+point('engine.start','Start a chod motoru')+point('engine.gearboxVisual','Převodovka – pouze viditelný fyzický stav')+point('engine.warm','Kontrola po zahřátí'))}

function underbody(){return card('underbody','7','Podvozek a nápravy','<label>Způsob kontroly<select data-field="underbody.method"><option value="">Vyberte…</option><option>Postupné přizvednutí jednotlivých částí vozidla pomocí mobilního zvedáku</option><option>Ze země / bez přizvednutí</option><option>Jiný způsob</option></select></label><p class="muted">Hodnotí se pouze skutečně viditelné a přístupné části bez demontáže. Skryté nebo nepřístupné části označte NEOVĚŘENO.</p>'+point('underbody.front','Přední náprava','<p class="muted small">Pořiďte alespoň 2 celkové dokumentační fotografie – levou a pravou stranu nápravy. Přístupné prvky řízení lze uvést jako konkrétní nález zde; celou soustavu řízení staticky nehodnotíme.</p>')+point('underbody.rear','Zadní náprava','<p class="muted small">Pořiďte alespoň 2 celkové dokumentační fotografie – levou a pravou stranu nápravy.</p>')+point('underbody.floor','Spodní část vozu / podlaha')+point('underbody.exhaust','Výfuková soustava')+point('underbody.drive','Pohon / 4×4 – viditelný fyzický stav')+point('underbody.special','Specifické systémy dle výbavy'))}

function interior(){const groups=[['info','Infotainment a konektivita'],['seats','Sedadla – funkčnost'],['lightsFunction','Osvětlení – funkčnost'],['cluster','Přístrojový štít a displeje'],['climate','Klimatizace, topení a ventilace'],['safety','Bezpečnostní a asistenční prvky'],['comfort','Ovládací a komfortní prvky']];return card('interior','8','Interiér a výbava','<div class="subhead"><b>8A · Vizuální stav interiéru</b></div>'+point('interior.visual','Interiér – vizuální stav')+'<div class="subhead"><b>8B · Funkčnost interiéru a výbavy</b><span>Hodnotí se přítomná výbava v širokých logických skupinách.</span></div>'+groups.map(([k,t])=>point('interior.'+k,t)).join(''))}

function documents(){return card('documents','9','Identifikace, dokumentace a servisní historie','<div class="subhead"><b>9A · Identifikace vozidla</b></div><div class="check-point"><h3>VIN a identifikátory</h3><p class="muted small">VIN se přebírá z bodu 1. V klientském reportu se automaticky nemaskuje; vložená fotografie zůstává v původní podobě.</p><label>Výsledek kontroly<select data-field="documents.identityResult"><option value="">Vyberte…</option><option>SOUHLASÍ</option><option>NESOULAD</option><option>NEOVĚŘENO</option></select></label>'+note('documents.identityNote','Poznámka pouze pokud je relevantní…')+media('documents.identityPhotos')+'</div><div class="subhead"><b>9B · Relevantní technické údaje a schválené změny</b></div>'+point('documents.tech','Relevantní technické údaje / registrované úpravy')+'<div class="subhead"><b>9C · Servisní historie a dokumentace</b></div><label>Stav doložení<select data-field="documents.history"><option value="">Vyberte…</option><option>Doložená</option><option>Částečně doložená</option><option>Nedoložená</option><option>Nebyla předložena</option></select></label>'+note('documents.historyNote','Stručné zhodnocení historie, např. pravidelnost, poslední doložený servis, chybějící důležitý doklad…')+media('documents.photos','＋ Přidat fotografie dokumentace')+'<label class="upload-box small"><input id="docsInput" type="file" multiple><strong>+ Přidat dokument / soubor</strong><span>Servisní kniha, faktury nebo jiné podklady</span></label><div id="docsList" class="photo-list"></div>')}

function diagnostics(){return card('diagnostics','10','Diagnostika','<label>Diagnostika provedena<select data-field="diagnostics.done"><option value="">Vyberte…</option><option>ANO</option><option>NE</option><option>NEBYLO MOŽNÉ PROVÉST</option></select></label><label>Napětí akumulátoru při vypnutém motoru<input data-field="diagnostics.batteryVoltage" inputmode="decimal" placeholder="např. 12,6 V"></label>'+note('diagnostics.note','Vyhodnocení diagnostiky / komentář technika…')+media('diagnostics.photos','＋ Přidat foto')+'<label class="upload-box small"><input id="diagInput" type="file" multiple><strong>+ Přidat diagnostický protokol / soubor</strong><span>Více souborů; originální protokol zůstává přílohou klientského reportu</span></label><div id="diagList" class="photo-list"></div><div class="check-point"><h3>Významný diagnostický nález</h3><p class="muted small">Použijte pouze tehdy, když je konkrétní nález důležitý pro rozhodnutí o koupi.</p>'+status('diagnostics.significant.status')+note('diagnostics.significant.note','Konkrétní významný nález…')+media('diagnostics.significant.media')+'</div>')}

function drive(){const items=[['motor','Motor'],['gearbox','Převodovka / spojka'],['suspension','Podvozek'],['brakes','Brzdy + parkovací brzda'],['steering','Řízení'],['acceleration','Akcelerace'],['drivetrain','Pohon'],['assist','Asistenční systémy']];return card('drive','11','Zkušební jízda','<div class="safety-note"><strong>Zjištění zapisujte až po zastavení vozidla.</strong><span>Přílohy přidávejte pouze bezpečně po zastavení.</span></div>'+items.map(([k,t])=>'<div class="check-point"><h3>'+t+'</h3>'+status('sections.drive.'+k+'.status')+note('sections.drive.'+k+'.note')+media('sections.drive.'+k+'.media')+'</div>').join(''))}

function investments(){return card('investments','12','Doporučený servis a očekávané investice','<p class="muted">Přidávejte pouze položky, které sami považujete za doporučený servis nebo očekávanou investici. Částky zadává technik; systém je pouze sečte. Jde o orientační odhad, nikoli cenovou nabídku servisu.</p><div id="investmentRows"></div><button type="button" class="ghost" id="addInvestment">+ Přidat položku</button><div class="total-box"><span>OČEKÁVANÉ INVESTICE CELKEM</span><strong id="investmentTotal">0 – 0 Kč</strong></div>')}

function render(){nav();document.querySelector('#dynamicSections').innerHTML=[bodySection(),wheels(),brakes(),engine(),underbody(),interior(),documents(),diagnostics(),drive(),investments()].join('');renderInvestments();bind();restore();document.querySelector('#inspectionId').textContent=state.meta?.id||makeId();renderFiles();updateInvestmentTotal();updateFinalSummary();addDictationButtons()}
function makeId(){const id='AR-'+new Date().getFullYear()+'-00001';set('meta.id',id);return id}
function bind(){document.querySelectorAll('[data-field]').forEach(el=>{const p=el.dataset.field;if(el.type==='checkbox'){el.checked=!!get(p);el.onchange=()=>set(p,el.checked)}else{el.value=get(p)??'';el.oninput=()=>set(p,el.value);el.onchange=()=>set(p,el.value)}});document.querySelectorAll('[data-choice] button').forEach(btn=>btn.onclick=()=>{const row=btn.closest('[data-choice]');set(row.dataset.choice,btn.dataset.value);row.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b===btn))});document.querySelectorAll('[data-media]').forEach(inp=>inp.onchange=e=>{appendFiles(inp.dataset.media,e.target.files);renderMedia()});document.querySelectorAll('.copy-tire-size').forEach(btn=>btn.onclick=()=>{const size=get('wheels.LP.size')||'';if(!size)return;['PP','LZ','PZ'].forEach(pos=>set('wheels.'+pos+'.size',size));['PP','LZ','PZ'].forEach(pos=>{const el=document.querySelector('[data-field="wheels.'+pos+'.size"]');if(el)el.value=size})});document.querySelectorAll('.verdict-picker button').forEach(btn=>btn.onclick=()=>{set('final.verdict',btn.dataset.value);restore()});const add=document.querySelector('#addInvestment');if(add)add.onclick=()=>{const a=get('investments.items')||[];a.push({title:'',note:'',min:'',max:''});set('investments.items',a);renderInvestments();bind();restore();addDictationButtons()};const d=document.querySelector('#diagInput');if(d)d.onchange=e=>{appendFiles('diagnostics.files',e.target.files);renderFiles()};const docs=document.querySelector('#docsInput');if(docs)docs.onchange=e=>{appendFiles('documents.files',e.target.files);renderFiles()};renderMedia();addDictationButtons();updateFinalSummary()}
function restore(){document.querySelectorAll('[data-choice]').forEach(row=>{const v=get(row.dataset.choice);row.querySelectorAll('button').forEach(b=>b.classList.toggle('active',b.dataset.value===v))});const v=get('final.verdict');document.querySelectorAll('.verdict-picker button').forEach(b=>b.classList.toggle('active',b.dataset.value===v))}
const previewFiles={};
function fileMeta(f){return {name:f.name,type:f.type||'',size:f.size||0}}
function fileName(x){return typeof x==='string'?x:(x?.name||'Soubor')}
function appendFiles(path,files){const incoming=[...files];if(!incoming.length)return;const current=get(path)||[];set(path,current.concat(incoming.map(fileMeta)));const existing=previewFiles[path]||[];previewFiles[path]=existing.concat(incoming.map(f=>({file:f,url:URL.createObjectURL(f)})))}
function removeFile(path,index){const a=get(path)||[];a.splice(index,1);set(path,a);const p=previewFiles[path]||[];const removed=p.splice(index,1)[0];if(removed?.url)URL.revokeObjectURL(removed.url);previewFiles[path]=p;renderMedia();renderFiles()}
function fileCard(meta,preview,path,index){const name=fileName(meta),type=(typeof meta==='object'&&meta?.type)||preview?.file?.type||'',url=preview?.url||'',del='<button type="button" class="file-remove" data-remove-path="'+esc(path)+'" data-remove-index="'+index+'" aria-label="Odstranit soubor">×</button>';if(url&&type.startsWith('image/'))return '<div class="file-preview-card">'+del+'<img src="'+url+'" alt=""><span>'+esc(name)+'</span></div>';if(url&&type.startsWith('video/'))return '<div class="file-preview-card">'+del+'<video src="'+url+'" preload="metadata" muted playsinline></video><b class="video-badge">▶ VIDEO</b><span>'+esc(name)+'</span></div>';const ext=(name.split('.').pop()||'SOUBOR').toUpperCase();return '<div class="file-preview-card document-preview">'+del+'<b>'+esc(ext)+'</b><span>'+esc(name)+'</span></div>'}
function prepareVideoPreviews(){document.querySelectorAll('.file-preview-card video').forEach(v=>{const showFrame=()=>{try{if(v.duration&&isFinite(v.duration)){const t=Math.min(.25,Math.max(.01,v.duration*.05));if(Math.abs(v.currentTime-t)>.01)v.currentTime=t}}catch(e){}};if(v.readyState>=1)showFrame();else v.addEventListener('loadedmetadata',showFrame,{once:true});v.addEventListener('seeked',()=>v.pause(),{once:true})})}
function bindFileRemove(){document.querySelectorAll('.file-remove').forEach(b=>b.onclick=()=>removeFile(b.dataset.removePath,+b.dataset.removeIndex));prepareVideoPreviews()}
function renderMedia(){document.querySelectorAll('[data-media-list]').forEach(el=>{const path=el.dataset.mediaList,a=get(path)||[],p=previewFiles[path]||[];el.innerHTML=a.map((m,i)=>fileCard(m,p[i],path,i)).join('')});bindFileRemove()}
function renderInvestments(){const el=document.querySelector('#investmentRows');if(!el)return;const a=get('investments.items')||[];el.innerHTML=a.map((x,i)=>'<div class="investment-row"><label>Nález / doporučený servis<input data-field="investments.items.'+i+'.title" placeholder="Např. přední brzdové kotouče + destičky"></label>'+note('investments.items.'+i+'.note','Doporučení / stručný komentář…')+'<div class="grid cols-2"><label>Od Kč<input data-field="investments.items.'+i+'.min" inputmode="numeric"></label><label>Do Kč<input data-field="investments.items.'+i+'.max" inputmode="numeric"></label></div><button type="button" class="remove-investment" data-i="'+i+'">Odstranit</button></div>').join('');el.querySelectorAll('.remove-investment').forEach(b=>b.onclick=()=>{const a=get('investments.items')||[];a.splice(+b.dataset.i,1);set('investments.items',a);renderInvestments();bind();restore()});updateInvestmentTotal()}
function money(v){return Number(String(v||'').replace(/\D/g,''))||0}
function formatMoney(v){const n=money(v);return n?n.toLocaleString('cs-CZ')+' Kč':'—'}
function updateFinalSummary(){const p=document.querySelector('#finalAskingPrice');if(p)p.textContent=formatMoney(get('order.askingPrice'))}
function addDictationButtons(){
  document.querySelectorAll('textarea[data-field]').forEach(area=>{
    if(area.parentElement.querySelector('.dictate-btn'))return;
    const b=document.createElement('button');b.type='button';b.className='dictate-btn';b.innerHTML='🎙 Diktovat';b.setAttribute('aria-label','Diktovat text');

    const reset=()=>{b.classList.remove('listening');b.innerHTML='🎙 Diktovat'};
    const insertText=text=>{
      const spoken=String(text||'').trim();
      if(!spoken)return;
      const start=area.selectionStart??area.value.length;
      const end=area.selectionEnd??area.value.length;
      const before=area.value.slice(0,start);
      const after=area.value.slice(end);
      const lead=before && !/\\s$/.test(before)?' ':'';
      area.value=before+lead+spoken+after;
      area.selectionStart=area.selectionEnd=(before+lead+spoken).length;
      area.dispatchEvent(new Event('input',{bubbles:true}));
      area.dispatchEvent(new Event('change',{bubbles:true}));
      area.focus();
    };

    b.onclick=()=>{
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SR){
        area.focus();
        alert('Tento prohlížeč neposkytuje webu přímé rozpoznávání řeči. Kurzor je připraven v poznámce – použijte mikrofon/diktování klávesnice zařízení.');
        return;
      }

      let gotResult=false;
      let r;
      try{
        r=new SR();
        r.lang='cs-CZ';
        r.interimResults=true;
        r.continuous=false;
        r.maxAlternatives=1;
      }catch(e){
        area.focus();
        alert('Diktování se v tomto prohlížeči nepodařilo spustit. Použijte mikrofon/diktování klávesnice zařízení.');
        return;
      }

      b.classList.add('listening');b.textContent='● Poslouchám…';
      r.onresult=e=>{
        let finalText='';
        for(let i=e.resultIndex;i<e.results.length;i++){
          if(e.results[i].isFinal)finalText+=e.results[i][0].transcript+' ';
        }
        if(finalText.trim()){gotResult=true;insertText(finalText)}
      };
      r.onerror=e=>{
        reset();
        if(e.error==='not-allowed'||e.error==='service-not-allowed'){
          area.focus();
          alert('Pro diktování povolte této stránce přístup k mikrofonu. Pokud prohlížeč rozpoznávání řeči nepodporuje, použijte mikrofon/diktování klávesnice zařízení.');
        }else if(e.error!=='no-speech'&&e.error!=='aborted'){
          area.focus();
          alert('Rozpoznávání řeči se nepodařilo dokončit. Zkuste diktování znovu nebo použijte mikrofon klávesnice zařízení.');
        }
      };
      r.onend=()=>{reset();if(gotResult)area.dispatchEvent(new Event('input',{bubbles:true}))};
      try{r.start()}catch(e){reset();area.focus();alert('Diktování se nepodařilo spustit. Zkuste jej znovu nebo použijte mikrofon/diktování klávesnice zařízení.')}
    };
    area.insertAdjacentElement('afterend',b);
  });
}
function updateInvestmentTotal(){const a=get('investments.items')||[];let min=0,max=0;a.forEach(x=>{min+=money(x.min);max+=money(x.max)});const txt=min.toLocaleString('cs-CZ')+' – '+max.toLocaleString('cs-CZ')+' Kč';const e=document.querySelector('#investmentTotal');if(e)e.textContent=txt;const f=document.querySelector('#finalInvestmentTotal');if(f)f.textContent=txt}
function renderFiles(){[['#photoList','photos.names'],['#diagList','diagnostics.files'],['#docsList','documents.files']].forEach(([sel,path])=>{const el=document.querySelector(sel);if(!el)return;const a=get(path)||[],p=previewFiles[path]||[];el.innerHTML=a.map((m,i)=>fileCard(m,p[i],path,i)).join('')});bindFileRemove()}
function validate(){const missing=[];[['vehicle.make','Značka vozidla'],['vehicle.model','Model vozidla'],['vehicle.vin','VIN'],['vehicle.mileage','Stav km'],['vehicle.originCountry','Země původu'],['final.verdict','Finální rozsudek'],['final.summary','Celkové hodnocení technika']].forEach(([p,n])=>{if(!get(p))missing.push(n)});const el=document.querySelector('#validationResult');if(!el)return;if(missing.length){el.innerHTML='<div class="validation warnbox"><strong>Před vytvořením reportu zkontrolujte:</strong><ul>'+missing.map(x=>'<li>'+x+'</li>').join('')+'</ul><span>NEOVĚŘENO a NERELEVANTNÍ se nepovažují za chybu.</span></div>'}else{el.innerHTML='<div class="validation okbox"><strong>Základní kontrola je kompletní.</strong><span>V produkční verzi by nyní následovalo vytvoření klientského reportu.</span></div>'}}
document.querySelector('#photoInput').onchange=e=>{appendFiles('photos.names',e.target.files);renderFiles()};
document.querySelector('#resetBtn').onclick=()=>{if(confirm('Opravdu vymazat celý lokálně uložený koncept této kontroly?')){localStorage.removeItem(STORAGE_KEY);location.reload()}};
document.querySelector('#reportBtn').onclick=validate;
render();