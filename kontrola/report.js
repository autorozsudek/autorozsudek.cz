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
const paintParts=['Přední nárazník','Kapota','LP blatník','LP dveře','LZ dveře','LZ blatník','Víko kufru','Zadní nárazník','PZ blatník','PZ dveře','PP dveře','PP blatník','Střecha'];
const wheels=['LP','PP','LZ','PZ'];
const money=n=>new Intl.NumberFormat('cs-CZ').format(Number(n)||0)+' Kč';
const safe=v=>String(v??'—').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const badge=v=>'<span class="badge '+(v==='V POŘÁDKU'?'ok':v==='VÝHRADA'?'warn':v==='ZÁVADA / RIZIKO'?'bad':'neutral')+'">'+safe(v||'NEOVĚŘENO')+'</span>';
const field=(k,v)=>'<div class="field"><span>'+safe(k)+'</span><strong>'+safe(v||'—')+'</strong></div>';
const row=(title,status,note)=>'<div class="result"><div><b>'+safe(title)+'</b>'+(note?'<p>'+safe(note)+'</p>':'')+'</div>'+badge(status)+'</div>';
const point=(key,title)=>{const a=findings[key]||['NEOVĚŘENO',''];return row(title,a[0],a[1])};
const card=(id,num,title,body)=>'<section class="card" id="'+id+'"><h2><span class="num">'+num+'</span>'+safe(title)+'</h2>'+body+'</section>';
const gallery='<div class="empty-media"><b>Fotografie a videa konkrétního vozu</b><p>V této ukázce nejsou přiloženy skutečné fotografie. V ostrém reportu zde budou nahrané snímky a videa z kontroly.</p></div>';
const paint=paintParts.map((name,i)=>{const v=sample.paint[i]||{};return '<div class="paint-item"><b>'+(i+1)+'. '+safe(name)+'</b>'+field('MAX µm',v.um? v.um+' µm':'—')+field('Vyhodnocení',v.result||'NEOVĚŘENO')+(v.note?'<p>'+safe(v.note)+'</p>':'')+'</div>'}).join('');
const wheelItems=wheels.map((w,i)=>'<div class="wheel"><h3>'+w+'</h3><div class="fields">'+field('Rozměr pneumatiky','215/55 R17')+field('DOT',i<2?'2524':'1123')+field('Dezén mm',i<2?'5,4':'3,8')+'</div>'+row('Pneumatika',i<2?'V POŘÁDKU':'VÝHRADA',i<2?'Bez významného nálezu.':'Zohlednit opotřebení.')+row('Disk','V POŘÁDKU','Bez zjevného významného poškození.')+'</div>').join('');
const brakeItems=wheels.map((w,i)=>'<div class="wheel"><h3>'+w+'</h3>'+row('Brzdový kotouč',i<2?'VÝHRADA':'V POŘÁDKU',i<2?'Viditelné provozní opotřebení.':'Bez významného viditelného nálezu.')+row('Brzdová destička',i<2?'VÝHRADA':'V POŘÁDKU',i<2?'Doporučeno ověřit zbývající tloušťku.':'Bez významného viditelného nálezu.')+row('Třmen – pouze viditelná abnormalita','NEOVĚŘENO','Bez samostatně doloženého nálezu.')+'</div>').join('');
const sectionsHtml=[
card('vehicle',1,'Vozidlo a zakázka','<div class="fields">'+Object.entries({'Značka':sample.vehicle.make,'Model':sample.vehicle.model,'Rok výroby':sample.vehicle.year,'VIN':sample.vehicle.vin,'SPZ':sample.vehicle.plate,'Stav km':sample.vehicle.mileage,'Země původu':sample.vehicle.originCountry,'Platnost STK':'30. 6. 2027','Palivo':sample.vehicle.fuel,'Odkaz na inzerát':sample.order.adUrl,'Požadovaná cena':money(sample.order.askingPrice)}).map(([k,v])=>field(k,v)).join('')+'</div>'),
card('photos',2,'Fotografie a videa vozu',gallery),
card('body',3,'Karoserie, světla, skla a lak','<h3>3A · Vizuální stav karoserie, světel a skel</h3>'+point('body.visual','Karoserie – vizuální stav')+point('body.lights','Světla – pouze vizuální stav')+point('body.glass','Skla – vizuální stav')+'<h3>3B · Měření tloušťky laku</h3><p class="muted">Zaznamenána nejvyšší naměřená hodnota, nikoli průměr.</p><img class="bodymap" src="../assets/3b-approved-horizontal-map.png" alt="Schválená orientační mapa dílů karoserie"><div class="paint-grid">'+paint+'</div>'),
card('wheels',4,'Kola a pneumatiky','<div class="twocol">'+wheelItems+'</div>'),
card('brakes',5,'Brzdy','<div class="twocol">'+brakeItems+'</div>'),
card('engine',6,'Motorový prostor, motor a převodovka',['Motorový prostor – vizuální stav','Motorový olej – hladina a vizuální stav','Chladicí kapalina – hladina a vizuální stav','Brzdová kapalina – hladina a vizuální stav','Ostatní relevantní provozní kapaliny','Akumulátor – vizuální stav','Viditelné řemeny a příslušenství – pokud přístupné'].map((t,i)=>point('engine.'+['bay','oil','coolant','brakeFluid','otherFluids','battery','belts'][i],t)).join('')+'<div class="fields">'+field('Teplota motoru při příjezdu',sample.engine.arrivalTemp)+field('Studený start',sample.engine.coldStart)+'</div>'+point('engine.start','Start a chod motoru')+point('engine.gearboxVisual','Převodovka – pouze viditelný fyzický stav')+point('engine.warm','Kontrola po zahřátí')),
card('underbody',7,'Podvozek a nápravy',field('Způsob kontroly','Postupné přizvednutí jednotlivých částí vozidla pomocí mobilního zvedáku')+[['front','Přední náprava'],['rear','Zadní náprava'],['floor','Spodní část vozu / podlaha'],['exhaust','Výfuková soustava'],['drive','Pohon / 4×4 – viditelný fyzický stav'],['special','Specifické systémy dle výbavy']].map(([k,t])=>point('underbody.'+k,t)).join('')),
card('interior',8,'Interiér a výbava','<h3>8A · Vizuální stav interiéru</h3>'+point('interior.visual','Interiér – vizuální stav')+'<h3>8B · Funkčnost interiéru a výbavy</h3>'+[['info','Infotainment a konektivita'],['seats','Sedadla – funkčnost'],['lightsFunction','Osvětlení – funkčnost'],['cluster','Přístrojový štít a displeje'],['climate','Klimatizace, topení a ventilace'],['safety','Bezpečnostní a asistenční prvky'],['comfort','Ovládací a komfortní prvky']].map(([k,t])=>point('interior.'+k,t)).join('')),
card('documents',9,'Identifikace, dokumentace a servisní historie','<h3>9A · Identifikace vozidla</h3>'+row('VIN a identifikátory',sample.documents.identityResult,sample.documents.identityNote)+'<h3>9B · Relevantní technické údaje a schválené změny</h3>'+point('documents.tech','Relevantní technické údaje / registrované úpravy')+'<h3>9C · Servisní historie a dokumentace</h3>'+field('Stav doložení',sample.documents.history)+'<p>'+safe(sample.documents.historyNote)+'</p>'+gallery),
card('diagnostics',10,'Diagnostika','<div class="fields">'+field('Diagnostika provedena',sample.diagnostics.done)+field('Napětí akumulátoru při vypnutém motoru',sample.diagnostics.batteryVoltage)+'</div><p>'+safe(sample.diagnostics.note)+'</p><div class="empty-media">Diagnostický protokol a další přílohy budou dostupné zde.</div>'+point('diagnostics.significant','Významný diagnostický nález')),
card('drive',11,'Zkušební jízda',[['motor','Motor'],['gearbox','Převodovka / spojka / řazení'],['suspension','Podvozek'],['brakes','Brzdy + parkovací brzda'],['steering','Řízení'],['acceleration','Akcelerace'],['drivetrain','Pohon'],['assist','Asistenční systémy']].map(([k,t])=>point('drive.'+k,t)).join('')),
card('video-summary',12,'Video shrnutí kontroly','<p class="muted">Video technika shrnující pozitivní i negativní nálezy (doporučená délka 3–5 minut).</p><div class="empty-media"><b>▶ Video shrnutí</b><p>V ukázce není video přiloženo. V ostrém reportu se zde zobrazí přehrávač.</p></div>'),
card('investments',13,'Doporučený servis a očekávané investice',sample.investments.items.map(x=>'<div class="investment"><div><b>'+safe(x.title)+'</b><p>'+safe(x.note)+'</p></div><strong>'+money(x.min)+' – '+money(x.max)+'</strong></div>').join('')+'<div class="total">OČEKÁVANÉ INVESTICE CELKEM <strong>13 000 – 29 000 Kč</strong></div>'),
card('final',14,'Finální rozsudek','<div class="fields">'+field('Požadovaná cena prodávajícího',money(sample.order.askingPrice))+field('Očekávané investice','13 000 – 29 000 Kč')+'</div><div class="verdict">'+safe(sample.final.verdict)+'</div><h3>Celkové hodnocení technika</h3><p>'+safe(sample.final.summary)+'</p>'+field('Posouzení požadované ceny',sample.final.priceAssessment)+field('Komentář k ceně',sample.final.priceComment)+'<div class="signature">Kontrolu provedl: <strong>Lukáš Stehlík · AutoRozsudek.cz</strong></div>')
];
document.getElementById('nav').innerHTML=sections.map(([id,title],i)=>'<a href="#'+id+'"><span>'+(i+1)+'</span>'+safe(title)+'</a>').join('');
document.getElementById('report').innerHTML=sectionsHtml.join('');
