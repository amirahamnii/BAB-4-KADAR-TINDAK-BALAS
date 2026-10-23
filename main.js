import * as THREE from 'three';
const $=id=>document.getElementById(id), root=$('world');
const zones=[
 {name:'Dataran Tindak Balas',short:'Cepat & Perlahan',x:0,z:-14,color:0x49e5f0,info:'Tindak balas cepat mempunyai kadar tinggi dan mengambil masa singkat; tindak balas perlahan mempunyai kadar rendah.',q:"Dua tindak balas menghasilkan isipadu gas yang sama. P selesai dalam 20 s dan Q dalam 80 s. Nisbah kadar purata P:Q ialah?",opts:["1:4","4:1","1:1"],a:1,why:'Gunakan konsep kadar tindak balas dan perlanggaran berkesan.'},
 {name:'Lembah Pengiraan',short:'Kadar Purata',x:18,z:-2,color:0xf2c66b,info:'Kadar tindak balas = perubahan kuantiti bahan tindak balas atau hasil tindak balas ÷ masa. Unit bergantung pada kuantiti yang diukur.',q:"Isipadu gas meningkat daripada 12 cm³ kepada 42 cm³ antara saat ke-30 dan saat ke-90. Kadar purata bagi selang itu?",opts:["0.25 cm³ s⁻¹","0.50 cm³ s⁻¹","1.00 cm³ s⁻¹"],a:1,why:'Gunakan konsep kadar tindak balas dan perlanggaran berkesan.'},
 {name:'Hutan Lima Faktor',short:'Lima Faktor',x:18,z:18,color:0x8ff3ac,info:'Lima faktor ialah suhu, kepekatan, saiz pepejal, kehadiran mangkin dan tekanan bagi tindak balas melibatkan bahan tindak balas gas.',q:"Jisim marmar dan kepekatan asid sama. Mengapakah serbuk marmar bertindak balas lebih cepat daripada ketulan besar?",opts:["Jumlah luas permukaan lebih besar menyebabkan lebih banyak perlanggaran berkesan","Tenaga pengaktifan meningkat","Jisim marmar bertambah apabila dihancurkan"],a:0,why:'Gunakan konsep kadar tindak balas dan perlanggaran berkesan.'},
 {name:'Makmal Eksperimen Maya',short:'Eksperimen Maya',x:-17,z:17,color:0xcba3ff,info:'Eksperimen 4.1–4.4 membandingkan suhu, kepekatan, saiz pepejal dan kehadiran mangkin. Ubah satu pemboleh ubah pada satu masa.',q:"Suhu larutan dinaikkan, kepekatan dikekalkan. Mengapakah masa tindak balas berkurang?",opts:["Zarah kehilangan tenaga kinetik","Lebih banyak zarah mempunyai tenaga mencukupi untuk perlanggaran berkesan","Bilangan zarah meningkat dua kali ganda"],a:1,why:'Gunakan konsep kadar tindak balas dan perlanggaran berkesan.'},
 {name:'Menara Industri',short:'Haber & Sentuh',x:-18,z:-4,color:0xff9ba2,info:'Proses Haber menggunakan serbuk ferum sebagai mangkin pada tekanan sekitar 200 atm; Proses Sentuh menggunakan vanadium(V) oksida sebagai mangkin.',q:"Apakah fungsi mangkin ferum dalam Proses Haber?",opts:["Mengubah kedudukan keseimbangan ammonia","Menurunkan tenaga pengaktifan dan mempercepat kadar mencapai keseimbangan","Menjadi bahan tindak balas untuk menghasilkan ammonia"],a:1,why:'Gunakan konsep kadar tindak balas dan perlanggaran berkesan.'}
];
let completed=JSON.parse(localStorage.getItem('reactoria-progress')||'[]');if(!Array.isArray(completed))completed=[];
let answers=JSON.parse(localStorage.getItem('reactoria-answers')||'{}');if(!answers||typeof answers!=='object'||Array.isArray(answers))answers={};
function actualScore(){return zones.reduce((n,z,i)=>n+(answers[i]===z.a?20:0),0)}
function saveAnswers(){localStorage.setItem('reactoria-answers',JSON.stringify(answers))}
let player,scene,camera,renderer,beacons=[],keys=new Set(),active=false,modal=false,near=-1,angle=0,clock=new THREE.Clock();
try{renderer=new THREE.WebGLRenderer({canvas:root,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=THREE.SRGBColorSpace;scene=new THREE.Scene();scene.background=new THREE.Color(0x091536);scene.fog=new THREE.FogExp2(0x091536,.008);camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,.1,250);scene.add(new THREE.HemisphereLight(0xb4eaff,0x19372a,2.2));let sun=new THREE.DirectionalLight(0xffe4b3,2.5);sun.position.set(12,30,10);scene.add(sun);
const ground=new THREE.Mesh(new THREE.PlaneGeometry(130,130),new THREE.MeshStandardMaterial({color:0x112d52,roughness:.35,metalness:.45}));ground.rotation.x=-Math.PI/2;scene.add(ground);const grid=new THREE.GridHelper(130,65,0x31b9ee,0x254977);grid.position.y=.025;scene.add(grid);
const cylinder=(r1,r2,h,color,x,y,z)=>{let m=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,8),new THREE.MeshStandardMaterial({color,roughness:.55,metalness:.15}));m.position.set(x,y,z);scene.add(m);return m};
for(let i=0;i<85;i++){let x=Math.sin(i*43.71)*53,z=Math.cos(i*13.17)*53;if(Math.hypot(x,z)<29)continue;cylinder(.5,.8,2.8,0x345c48,x,1.4,z);let crown=new THREE.Mesh(new THREE.ConeGeometry(2,5,7),new THREE.MeshStandardMaterial({color:i%2?0x20735f:0x2a826a}));crown.position.set(x,5,z);scene.add(crown)}
for(let i=0;i<5;i++){let z=zones[i];cylinder(3.1,3.7,.45,0x24495c,z.x,.22,z.z);cylinder(1.1,1.3,2,0x39566a,z.x,1.35,z.z);let crystal=new THREE.Mesh(new THREE.OctahedronGeometry(1.6),new THREE.MeshStandardMaterial({color:z.color,emissive:z.color,emissiveIntensity:.55,metalness:.25,roughness:.2}));crystal.position.set(z.x,3.6,z.z);scene.add(crystal);let light=new THREE.PointLight(z.color,20,12);light.position.set(z.x,4,z.z);scene.add(light);beacons.push(crystal)}
player=new THREE.Group();
const student=new THREE.Group();player.add(student);
const mat=(color,emissive=0)=>new THREE.MeshStandardMaterial({color,emissive,emissiveIntensity:.45,roughness:.48});
const part=(geo,m,x,y,z,parent=student)=>{let o=new THREE.Mesh(geo,m);o.position.set(x,y,z);parent.add(o);return o};
const skin=mat(0xe9b58d),white=mat(0xdff6ff),navy=mat(0x17325c),hair=mat(0x18233b),glow=mat(0x36eaff,0x00baff);
part(new THREE.CapsuleGeometry(.34,.62,5,12),white,0,1.48,0);
part(new THREE.SphereGeometry(.34,20,16),skin,0,2.28,0);
part(new THREE.SphereGeometry(.345,18,12,0,Math.PI*2,0,Math.PI*.55),hair,0,2.41,0);
part(new THREE.BoxGeometry(.65,.76,.22),navy,0,1.45,.34);
part(new THREE.BoxGeometry(.39,.09,.05),glow,0,1.6,.47);
const limbs=[new THREE.Group(),new THREE.Group(),new THREE.Group(),new THREE.Group()];
limbs.forEach((g,i)=>{g.position.set(i%2? .43:-.43,i<2?1.88:1.06,0);if(i>1)g.position.x=(i%2?.18:-.18);student.add(g);
part(new THREE.CapsuleGeometry(i<2?.12:.15,i<2?.48:.57,5,10),i<2?white:navy,0,-.36,0,g);
if(i>1)part(new THREE.BoxGeometry(.29,.14,.43),navy,0,-.82,-.12,g)});
// Watak pelajar 3D: perincian ekspresi, uniform sekolah dan robot teman
const eyeWhite=mat(0xffffff),iris=mat(0x152849),mouthMat=mat(0x9f6471),skinDetail=mat(0xe9b58d);
for(const x of [-.13,.13]) {
  part(new THREE.SphereGeometry(.067,12,10),eyeWhite,x,2.31,-.307);
  part(new THREE.SphereGeometry(.035,10,9),iris,x,2.31,-.359);
  part(new THREE.SphereGeometry(.012,8,8),eyeWhite,x-.011,2.327,-.387);
  part(new THREE.SphereGeometry(.072,10,8),skinDetail,x*1.5,2.18,-.29);
}
const smile=part(new THREE.TorusGeometry(.085,.013,6,20,Math.PI),mouthMat,0,2.155,-.335);
smile.rotation.z=Math.PI;
const collar=mat(0x42eaff,0x0088cc);
for (const x of [-.16,.16]) {
  const lapel=part(new THREE.BoxGeometry(.14,.21,.04),collar,x,1.84,-.293);
  lapel.rotation.z=x>0?-.38:.38;
}
part(new THREE.BoxGeometry(.14,.17,.05),mat(0xffd36a,0xb77800),0,1.59,-.352);
for(const x of [-.15,.15]) part(new THREE.SphereGeometry(.075,10,8),mat(0x23456b),x,2.07,.07);
const hairTuft=part(new THREE.ConeGeometry(.14,.27,9),hair,-.2,2.69,-.06);hairTuft.rotation.z=-.5;
const backpackHalo=new THREE.Mesh(new THREE.TorusGeometry(.28,.03,8,24),glow);
backpackHalo.position.set(0,1.53,.47);student.add(backpackHalo);
const avatarShadow=new THREE.Mesh(new THREE.CircleGeometry(.52,32),new THREE.MeshBasicMaterial({color:0x00ddff,transparent:true,opacity:.18,depthWrite:false}));
avatarShadow.rotation.x=-Math.PI/2;avatarShadow.position.y=.07;player.add(avatarShadow);
const bot=new THREE.Group();scene.add(bot);
const botBody=new THREE.Mesh(new THREE.SphereGeometry(.38,16,12),new THREE.MeshStandardMaterial({color:0xebf9ff,metalness:.48,roughness:.18,emissive:0x12556b,emissiveIntensity:.3}));bot.add(botBody);
const botFace=new THREE.Mesh(new THREE.BoxGeometry(.49,.25,.10),new THREE.MeshStandardMaterial({color:0x062a4b,emissive:0x006799,emissiveIntensity:.48}));botFace.position.z=-.29;bot.add(botFace);
for(const x of [-.11,.11]) {
  const led=new THREE.Mesh(new THREE.SphereGeometry(.042,10,9),new THREE.MeshBasicMaterial({color:0x72fff1}));led.position.set(x,.025,-.345);bot.add(led);
}
const botRing=new THREE.Mesh(new THREE.TorusGeometry(.5,.024,8,36),glow);botRing.rotation.x=.5;bot.add(botRing);
player.userData.bot=bot;

player.userData={student,limbs};scene.add(player);
const neon=new THREE.MeshStandardMaterial({color:0x19bce9,emissive:0x0aabff,emissiveIntensity:1.6,metalness:.6});
for(let i=0;i<5;i++){let z=zones[i],len=Math.hypot(z.x,z.z),a=Math.atan2(z.x,z.z);
let road=new THREE.Mesh(new THREE.BoxGeometry(3.7,.08,len),new THREE.MeshStandardMaterial({color:0x1b3865,metalness:.8,roughness:.25}));road.position.set(z.x/2,.07,z.z/2);road.rotation.y=a;scene.add(road);
for(let side of [-1,1]){let rail=new THREE.Mesh(new THREE.BoxGeometry(.1,.15,len),neon);rail.position.set(z.x/2+Math.cos(a)*side*1.75,.17,z.z/2-Math.sin(a)*side*1.75);rail.rotation.y=a;scene.add(rail)}
for(let k=0;k<3;k++){let h=4+k*2,xx=z.x+(k-1)*5,zz=z.z+8;let tower=new THREE.Mesh(new THREE.CylinderGeometry(.35,.6,h,6),new THREE.MeshStandardMaterial({color:0x274d82,metalness:.8}));tower.position.set(xx,h/2,zz);scene.add(tower);let cap=new THREE.Mesh(new THREE.OctahedronGeometry(.55),neon);cap.position.set(xx,h+.45,zz);scene.add(cap)}}
let ring=new THREE.Mesh(new THREE.TorusGeometry(4,.11,9,90),neon);ring.rotation.x=Math.PI/2;ring.position.y=.2;scene.add(ring);
const pts=[];for(let i=0;i<650;i++)pts.push((Math.random()-.5)*125,3+Math.random()*45,(Math.random()-.5)*125);
const stars=new THREE.BufferGeometry();stars.setAttribute('position',new THREE.Float32BufferAttribute(pts,3));scene.add(new THREE.Points(stars,new THREE.PointsMaterial({color:0x88eaff,size:.13})));

}catch(e){$('loadError').hidden=false;console.error(e)}
function refresh(){let n=completed.length;$('xp').textContent=n*100;$('level').textContent=1+Math.floor(n/2);$('missions').textContent=n+'/5';$('progressBar').style.width=(n*20)+'%';$('questList').innerHTML=zones.map((z,i)=>`<div class="quest-item ${completed.includes(i)?'done':''}"><div class="quest-icon">${completed.includes(i)?'✓':'◇'}</div><div><strong>${z.short}</strong><small>${completed.includes(i)?'Selesai · +100 XP':'Belum selesai'}</small></div></div>`).join('')}
refresh();
function openMission(i){if(i<0)return;modal=true;keys.clear();let z=zones[i];$('modalBackdrop').classList.remove('hidden');$('modalContent').innerHTML=`<div class="mission-header"><div class="eyebrow">MISI ${i+1} / 5</div><h2>${z.name}</h2><p>${z.info}</p></div><div class="mission-visual"><strong>📚 Nota Sains</strong><p>${z.info}</p></div>${i===3?`<div class="mission-card"><h3>🔬 Simulasi Maya: Kesan Suhu</h3><p>Laraskan suhu. Masa yang ditunjukkan ialah <b>data simulasi ilustratif</b>, bukan bacaan eksperimen sebenar.</p><div class="factor-grid"><label>Suhu larutan <output id="tempValue">30°C</output><input id="tempSlider" type="range" min="25" max="50" step="5" value="30"></label><div class="lab-status" id="labReadout">Anggaran masa simulasi: 80 s</div></div></div>`:''}<div class="mission-card"><h3>Cabaran Pengetahuan</h3><div class="question"><h4>${z.q}</h4><div class="options">${z.opts.map((o,j)=>`<button class="opt" data-answer="${j}">${String.fromCharCode(65+j)}. ${o}</button>`).join('')}</div><div id="answerFeedback"></div></div></div><div class="action-row"><button id="leaveMission" class="outline-btn">Kembali ke Dunia</button></div>`;
$('leaveMission').onclick=closeMission;if(i===3){$('tempSlider').oninput=e=>{let t=+e.target.value;$('tempValue').textContent=t+'°C';$('labReadout').textContent='Anggaran masa simulasi: '+Math.round(80*Math.pow(.76,(t-30)/5))+' s';}}
document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{
 if(Object.prototype.hasOwnProperty.call(answers,i))return;
 const selected=Number(b.dataset.answer),ok=selected===z.a;
 answers[i]=selected;saveAnswers();
 if(!completed.includes(i)){completed.push(i);localStorage.setItem('reactoria-progress',JSON.stringify(completed))}
 refresh();
 document.querySelectorAll('[data-answer]').forEach(v=>{v.disabled=true;if(Number(v.dataset.answer)===selected)v.classList.add('selected')});
 $('answerFeedback').innerHTML='<div class="feedback '+(ok?'good':'bad')+'">'+(ok?'✓ Jawapan direkod. +20 markah.':'Jawapan direkod. 0 markah. Tiada percubaan kedua.')+'</div><p>Markah: '+actualScore()+'/100. Jawapan tidak boleh diubah.</p>';
 if(completed.length===5)$('answerFeedback').innerHTML+='<p class="final-note">Semua soalan telah dijawab. Tekan HANTAR KEPUTUSAN di panel kiri.</p>';
});
if(Object.prototype.hasOwnProperty.call(answers,i)){
 document.querySelectorAll('[data-answer]').forEach(v=>{v.disabled=true;if(Number(v.dataset.answer)===answers[i])v.classList.add('selected')});
 $('answerFeedback').innerHTML='<div class="feedback">Misi sudah dijawab. Jawapan dikunci. Markah keseluruhan: '+actualScore()+'/100.</div>';
};$('missionModal').focus()}
function closeMission(){modal=false;$('modalBackdrop').classList.add('hidden')}
$('closeModal').onclick=closeMission;$('modalBackdrop').addEventListener('click',e=>{if(e.target===$('modalBackdrop'))closeMission()});$('startBtn').onclick=()=>{if(!renderer)return;const nama=$('studentName').value.trim(),kelas=$('studentClass').value.trim();if(!nama||!kelas){alert('Sila masukkan nama penuh dan kelas sebelum mula.');return;}const id=nama.toLowerCase()+'|'+kelas.toLowerCase();const prev=localStorage.getItem('reactoria-student-id');if(prev!==id){completed=[];answers={};saveAnswers();localStorage.setItem('reactoria-progress','[]');localStorage.setItem('reactoria-student-id',id);refresh();}sessionStorage.setItem('reactoria-student',JSON.stringify({nama,kelas}));$('studentSummary').textContent=nama+' · '+kelas;$('startScreen').classList.add('hidden');['hud','questPanel','minimapPanel','controlsHint','mobileControls'].forEach(id=>$(id).classList.remove('hidden'));active=true};$('interactBtn').onclick=()=>openMission(near);$('mobileInteract').onclick=()=>openMission(near);$('helpBtn').onclick=()=>{modal=true;$('modalBackdrop').classList.remove('hidden');$('modalContent').innerHTML='<div class="mission-header"><h2>Panduan Pengembara</h2><p>Gunakan W A S D atau anak panah untuk bergerak. Tekan Q/R untuk memutar kamera. Dekati kristal dan tekan E untuk memulakan misi. Pada telefon, gunakan butang arah dan INTERAKSI. Jawab semua lima misi untuk mendapat 500 XP.</p></div><button class="accent-btn" id="okHelp">Faham</button>';$('okHelp').onclick=closeMission};$('soundBtn').onclick=()=>{let b=$('soundBtn');b.textContent=b.textContent==='♫'?'♪̸':'♫'};
addEventListener('keydown',e=>{if(e.key==='Escape'&&modal)closeMission();if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault();keys.add(e.key.toLowerCase());if(e.key.toLowerCase()==='e'&&active&&!modal)openMission(near)});addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));document.querySelectorAll('[data-move]').forEach(b=>{let k={forward:'w',back:'s',left:'a',right:'d'}[b.dataset.move];b.addEventListener('pointerdown',e=>{e.preventDefault();keys.add(k);b.setPointerCapture(e.pointerId)});for(let ev of ['pointerup','pointercancel','lostpointercapture'])b.addEventListener(ev,()=>keys.delete(k))});addEventListener('resize',()=>{if(renderer){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)}});
function map(){let c=$('minimap'),ctx=c.getContext('2d'),w=c.width,h=c.height;ctx.clearRect(0,0,w,h);ctx.fillStyle='#082734';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#36717a';for(let n=20;n<w;n+=30){ctx.beginPath();ctx.moveTo(n,0);ctx.lineTo(n,h);ctx.moveTo(0,n);ctx.lineTo(w,n);ctx.stroke()}let pos=(x,z)=>[w/2+x*3.1,h/2+z*3.1];zones.forEach((z,i)=>{let [x,y]=pos(z.x,z.z);ctx.fillStyle=completed.includes(i)?'#85f6ac':'#f8cc79';ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill()});let [x,y]=pos(player.position.x,player.position.z);ctx.fillStyle='#5ce9ff';ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill()}
function frame(){requestAnimationFrame(frame);if(!renderer)return;let dt=Math.min(clock.getDelta(),.05);if(active&&!modal){let dx=0,dz=0;if(keys.has('w')||keys.has('arrowup'))dz-=1;if(keys.has('s')||keys.has('arrowdown'))dz+=1;if(keys.has('a')||keys.has('arrowleft'))dx-=1;if(keys.has('d')||keys.has('arrowright'))dx+=1;if(keys.has('q'))angle+=dt;if(keys.has('r'))angle-=dt;let mag=Math.hypot(dx,dz);if(mag){dx/=mag;dz/=mag;player.position.x=THREE.MathUtils.clamp(player.position.x+dx*dt*8,-58,58);player.position.z=THREE.MathUtils.clamp(player.position.z+dz*dt*8,-58,58);player.rotation.y=Math.atan2(-dx,-dz)}if(player.userData.limbs){let t=performance.now()*.009,v=mag?1:0;player.userData.limbs.forEach((g,i)=>g.rotation.x=Math.sin(t+(i%2?Math.PI:0))*(i<2?.35:.55)*v);player.userData.student.position.y=Math.abs(Math.sin(t))*.08*v;player.userData.student.rotation.z=Math.sin(t*.5)*.025*v;player.userData.student.rotation.x=-.045*v}near=-1;let dmin=5;zones.forEach((z,i)=>{let d=Math.hypot(player.position.x-z.x,player.position.z-z.z);if(d<dmin){dmin=d;near=i}});$('interaction').classList.toggle('hidden',near<0);if(near>=0){$('interactionTitle').textContent=zones[near].name;$('interactionDistance').textContent='Tekan E untuk berinteraksi'}$('locationBanner').classList.toggle('hidden',near<0);if(near>=0)$('locationBanner').textContent=zones[near].name;map()}
if(player&&player.userData.bot){let t=performance.now()*.0015;player.userData.bot.position.set(player.position.x+1.35+Math.cos(t)*.25,2.55+Math.sin(t*2)*.2,player.position.z+.75+Math.sin(t)*.25);player.userData.bot.rotation.y=t;}
beacons.forEach((b,i)=>{b.rotation.y+=dt*.8;b.position.y=3.6+Math.sin(performance.now()/600+i)*.3});let target=new THREE.Vector3(player.position.x+Math.sin(angle)*13,13,player.position.z+Math.cos(angle)*13);camera.position.lerp(target,.07);camera.lookAt(player.position.x,1.1,player.position.z);renderer.render(scene,camera)}frame();

// Bunyi sintesis ringkas tanpa fail audio luaran; aktif selepas interaksi pengguna.
let audioCtx;function sfx(freq=550,duration=.13,type='sine'){try{audioCtx ||=new (window.AudioContext||window.webkitAudioContext)();let o=audioCtx.createOscillator(),g=audioCtx.createGain();o.type=type;o.frequency.setValueAtTime(freq,audioCtx.currentTime);o.frequency.exponentialRampToValueAtTime(freq*1.35,audioCtx.currentTime+duration);g.gain.setValueAtTime(.045,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.001,audioCtx.currentTime+duration);o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+duration)}catch(e){}}
document.addEventListener('click',e=>{if(e.target.closest('button'))sfx(510,.09,'triangle')});

const REACTORIA_SHEETS_ENDPOINT='https://script.google.com/macros/s/AKfycbyduHHcqdYYdv1rIn8yvGl-YycqSd6kGmsei40cymOhQh27_aiR9uvu9qy6F6EOKDvbYA/exec';
const TOPIK_REACTORIA='Sains Tingkatan 5 - Bab 4: Kadar Tindak Balas';
(function initializeStudentRecord(){
  const saved=sessionStorage.getItem('reactoria-student');
  if(saved){try{const p=JSON.parse(saved);$('studentName').value=p.nama||'';$('studentClass').value=p.kelas||'';}catch(e){}}
  const btn=$('submitResultBtn'),status=$('recordStatus');
  btn.addEventListener('click',async()=>{
    const nama=$('studentName').value.trim(),kelas=$('studentClass').value.trim();
    if(!nama||!kelas){status.textContent='Sila isi nama dan kelas pada halaman mula.';return;}
    if(Object.keys(answers).length!==5){status.textContent='Jawab kelima-lima soalan dahulu.';return;}
    const markah=actualScore();
    const payload=new URLSearchParams({
      nama,kelas,topik:TOPIK_REACTORIA,markah:String(markah),
      misi:String(completed.length),tarikh:new Date().toISOString(),
      sumber:'REACTORIA_RPG_3D'
    });
    btn.disabled=true;status.textContent='Menghantar rekod ke Google Sheets…';
    try{
      // Apps Script Web Apps do not normally provide CORS headers for cross-origin reads.
      // An opaque response means the browser cannot confirm that a row was saved.
      await fetch(REACTORIA_SHEETS_ENDPOINT,{method:'POST',mode:'no-cors',body:payload,redirect:'follow'});
      status.textContent='Permintaan telah dihantar. Sila minta guru semak Google Sheets untuk mengesahkan rekod disimpan.';
      localStorage.setItem('reactoria-last-submission',JSON.stringify({nama,kelas,topik:TOPIK_REACTORIA,markah,at:new Date().toISOString()}));
    }catch(error){
      status.textContent='Penghantaran gagal. Semak internet, tetapan Apps Script dan cuba lagi.';
      console.error('REACTORIA Sheets submission',error);
    }finally{btn.disabled=false;}
  });
})();

let musicCtx,musicOn=false,musicLoop,musicStep=0;
function musicNote(freq,at,duration=.3,vol=.012){const o=musicCtx.createOscillator(),g=musicCtx.createGain();o.type='sine';o.frequency.value=freq;g.gain.setValueAtTime(.0001,at);g.gain.exponentialRampToValueAtTime(vol,at+.025);g.gain.exponentialRampToValueAtTime(.0001,at+duration);o.connect(g);g.connect(musicCtx.destination);o.start(at);o.stop(at+duration+.02)}
function toggleMusic(){try{if(musicOn){musicOn=false;clearInterval(musicLoop);$('soundBtn').textContent='♪̸';return}musicCtx ||=new(window.AudioContext||window.webkitAudioContext)();musicCtx.resume();musicOn=true;$('soundBtn').textContent='♫';const melody=[261.63,329.63,392,523.25,440,392,329.63,293.66,261.63,329.63,440,392,349.23,329.63,293.66,261.63];const play=()=>{if(!musicOn)return;const t=musicCtx.currentTime+.02;musicNote(melody[musicStep%melody.length],t);if(musicStep%4===0)musicNote(130.81,t,.65,.006);musicStep++};play();musicLoop=setInterval(play,410)}catch(err){console.warn('Audio unavailable',err)}}
$('soundBtn').onclick=toggleMusic;
