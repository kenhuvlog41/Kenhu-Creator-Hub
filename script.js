// KenhuVlog - Full JavaScript Logic - Hiwalay File
const scenesData = [
  { id:1, time:"0-2s", title:"Cute wave & smile", sub:"Hi! Tingnan mo to!", pose:"Smiling, hand wave to camera, friendly gesture", textOverlay:"Hi! Tingnan mo to!", voice:"Kumusta! Ipapakita ko sa'yo itong cool na item.", prompt:"UGC selfie video, cute filipina model waving at camera, friendly smile, holding portable LED mirror, bright natural lighting, iPhone quality, vertical 9:16, photorealistic, keep model face identity from reference" },
  { id:2, time:"2-4s", title:"Show product up close", sub:"Ang ganda ng details!", pose:"Hold product closer to camera, tilt to highlight details", textOverlay:"Ang ganda ng details!", voice:"Pansinin mo, ang linis at sleek ng design nito.", prompt:"Close up UGC shot, model holding product front view closer to camera, tilt to show details, clean background, natural light, keep product exactly same as reference" },
  { id:3, time:"4-6s", title:"Flip to back view", sub:"May back feature din siya!", pose:"Flip the product to show the back, point to feature", textOverlay:"May back feature din siya!", voice:"May non-slip at foldable sa likod, kaya super handy.", prompt:"UGC video model flipping product to show back side, pointing to foldable stand and non-slip feature, demonstrate, keep model identity" },
  { id:4, time:"6-8s", title:"Use it in real life", sub:"Perfect for daily use!", pose:"Use product naturally, as if daily use, smile", textOverlay:"Perfect for daily use!", voice:"Magaan, madaling dalhin, bagay sa araw-araw.", prompt:"Lifestyle UGC, model using LED makeup mirror naturally applying makeup, daily use scenario, bright room, iPhone video style, photorealistic" },
  { id:5, time:"8-10s", title:"Smile & CTA", sub:"Check out now!", pose:"Thumbs up, smiling, point down towards CTA", textOverlay:"Check out now!", voice:"Get yours now — nasa bio ang link! Salamat!", prompt:"UGC closing shot, model smiling thumbs up pointing down to CTA, cheerful, product visible, vertical video, call to action energy" }
];

let state = { category:"Beauty", modelImg:null, frontImg:null, backImg:null, sceneImgs:[null,null,null,null,null], avatarImg:null };

document.addEventListener("DOMContentLoaded", ()=>{
  initScenes(); initPills(); initUploads(); initAvatar(); initFLogo(); updateMasterPrompt();
});

function initScenes(){
  const grid=document.getElementById('storyGrid'); if(!grid) return; grid.innerHTML="";
  scenesData.forEach((s,i)=>{
    const d=document.createElement('div'); d.className='card';
    d.innerHTML=`<div class="card-head"><span class="badge bg-gray">Scene ${s.id}</span><span class="badge ${i%2==0?'bg-orange':'bg-yellow'}">${s.time}</span></div><div class="thumb" id="thumb-${i}">🖼️</div><div class="card-foot"><b>Scene ${i+1}: ${s.title}</b><i>${s.sub}</i><button class="copy-btn" onclick="copyScene(${i})">📋 Copy</button></div>`;
    grid.appendChild(d);
  });
}
function initPills(){
  document.querySelectorAll('.pill').forEach(p=>{
    p.addEventListener('click',()=>{
      document.querySelectorAll('.pill').forEach(x=>x.classList.remove('active'));
      p.classList.add('active'); state.category=p.innerText.trim(); updateMasterPrompt(); showToast(`Category: ${state.category}`);
    });
  });
}
function initAvatar(){
  const av=document.getElementById('av'), input=document.getElementById('avInput'); if(!av||!input) return;
  av.addEventListener('click',()=>input.click());
  input.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f) return; if(f.size>5*1024*1024){alert("Max 5MB");return;}
    const r=new FileReader(); r.onload=ev=>{ state.avatarImg=ev.target.result; av.innerHTML=`<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover">`; }; r.readAsDataURL(f);
  });
}
function initFLogo(){ const btn=document.getElementById('fBtn'); if(btn) btn.addEventListener('click',()=>window.open('https://www.facebook.com/share/1Fs7NZdE1F/','_blank')); }
function initUploads(){ bindUpload('u1',0,'modelImg',true); bindUpload('u2',1,'frontImg',false); bindUpload('u3',2,'backImg',false); }
function bindUpload(boxId, sceneIndex, stateKey, isModel){
  const box=document.getElementById(boxId); if(!box) return; const input=box.querySelector('input'), prev=box.querySelector('img.prev');
  box.addEventListener('click',()=>input.click());
  input.addEventListener('change',e=>{
    const file=e.target.files[0]; if(!file) return; if(file.size>5*1024*1024){alert("Max 5MB");return;}
    const reader=new FileReader(); reader.onload=ev=>{
      const url=ev.target.result; state[stateKey]=url; if(prev){prev.src=url; prev.hidden=false; box.classList.add('has');}
      if(isModel){ updateThumb(0,url); updateThumb(3,url); updateThumb(4,url); state.sceneImgs[0]=url; state.sceneImgs[3]=url; state.sceneImgs[4]=url; }
      else { updateThumb(sceneIndex,url); state.sceneImgs[sceneIndex]=url; }
      updateMasterPrompt(); showToast("Locked!");
      document.getElementById('status').innerText="● "+[state.modelImg,state.frontImg,state.backImg].filter(Boolean).length+"/3 Locked";
    }; reader.readAsDataURL(file);
  });
}
function updateThumb(i,url){ const el=document.getElementById(`thumb-${i}`); if(el) el.innerHTML=`<img src="${url}" style="width:100%;height:100%;object-fit:cover">`; }
function updateMasterPrompt(){
  const el=document.getElementById('masterPrompt'); if(!el) return;
  el.innerText=`Generate 5 UGC TikTok video scenes (2s each, 9:16, 1080x1920, 30fps, UGC Natural)

MODEL LOCK: ${state.modelImg?"LOCKED - Use uploaded model photo - keep face":"Upload model to lock"} 
PRODUCT FRONT LOCK: ${state.frontImg?"LOCKED":"Upload front"} 
PRODUCT BACK LOCK: ${state.backImg?"LOCKED":"Upload back"}

Category: ${state.category}

${scenesData.map(s=>`SCENE ${s.id} (${s.time}): ${s.pose}
- Text Overlay: "${s.textOverlay}"
- Voice Over (Female Tagalog): "${s.voice}"
- Prompt: "${s.prompt} - Category ${s.category} - keep model + product locked"
`).join('\n')}
Style: UGC Natural, iPhone, bright, Tagalog subtitles, no watermark, photorealistic, same size scenes, 3 boxes mobile layout preserved`;
}
function copyScene(i){
  const s=scenesData[i];
  const text=`Scene ${s.id} (${s.time}) - ${s.title}
Category: ${state.category}
Pose: ${s.pose}
Text Overlay: "${s.textOverlay}"
Voice Over: "${s.voice}"
Prompt for GPT/Gemini:
${s.prompt}
Locked: Model=${!!state.modelImg} Front=${!!state.frontImg} Back=${!!state.backImg}
Format: 9:16 vertical 1080x1920 same size cards`;
  navigator.clipboard.writeText(text).then(()=>showToast(`Scene ${i+1} Copied!`)).catch(()=>fallbackCopy(text));
}
function copyMaster(){
  const t=document.getElementById('masterPrompt'); if(!t) return;
  navigator.clipboard.writeText(t.innerText).then(()=>showToast("Master Prompt Copied! Paste to GPT/Gemini!")).catch(()=>fallbackCopy(t.innerText));
}
function fallbackCopy(text){ const ta=document.createElement('textarea'); ta.value=text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); showToast("Copied!"); }
function exportJSON(){
  const data={creator:"KenhuVlog",category:state.category,locked:{model:!!state.modelImg,front:!!state.frontImg,back:!!state.backImg},scenes:scenesData,videoDetails:{duration:"10s",aspect:"9:16 (1080x1920)",fps:30,style:"UGC Natural",format:"MP4"},generatedAt:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`kenhuvlog_${state.category}_${Date.now()}.json`; a.click(); URL.revokeObjectURL(url); showToast("JSON Exported!");
}
function generateStoryboard(){
  if(!state.modelImg||!state.frontImg){ showToast("⚠️ Upload Model + Front first!"); return; }
  showToast("Generating... Copying Master Prompt!"); copyMaster();
}
function showToast(msg){ let toast=document.getElementById('toast'); toast.innerText="✅ "+msg; toast.style.display='block'; setTimeout(()=>toast.style.display='none',3000); }
window.copyScene=copyScene; window.copyMaster=copyMaster; window.exportJSON=exportJSON; window.generateStoryboard=generateStoryboard;
