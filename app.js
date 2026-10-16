(() => {
"use strict";
const {roots,legacy,minors,atlas,version,targetRoots}=window.Q4Q_DATA;
const $=(id)=>document.getElementById(id);
const safe=(v)=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const score=(s)=>8*s.T+4*s.A+2*s.R+s.M;
const format=(n)=>Number(n).toLocaleString("id-ID",{maximumFractionDigits:2});
const storageKey="hbd-allah-q4q-drafts-v3.9";
let drafts={};
try{const x=JSON.parse(localStorage.getItem(storageKey)||"{}");if(x&&typeof x==="object"&&!Array.isArray(x))drafts=x}catch(_){}
function validDraft(s){return s&&["T","A","R","M"].every(k=>Number.isInteger(s[k])&&s[k]>=0&&s[k]<=10)}
function legacyRange(root){const l=legacy[root.id];if(!l)return null;const min=(8*l[0]+4*l[1]+2*l[2])/10;return [min,min+10]}
function familyOptions(selectId){let opts=[...new Set(roots.map(x=>x.family))].sort((a,b)=>a.localeCompare(b)); $(selectId).insertAdjacentHTML("beforeend",opts.map(f=>`<option value="${safe(f)}">${safe(f)}</option>`).join(""))}
function route(view){if(!$(`view-${view}`))view="overview";document.querySelectorAll(".view").forEach(el=>el.classList.toggle("active",el.id===`view-${view}`));document.querySelectorAll(".nav-item").forEach(el=>el.classList.toggle("active",el.dataset.view===view));$("page-label").textContent=({overview:"Overview",scoreboard:"Q4Q Scoreboard",lineage:"Major / Minor",atlas:"Universe & Ruh",calculator:"Scoring Lab",methodology:"Methodology"})[view];$("sidebar").classList.remove("open");window.location.hash=view;window.scrollTo({top:0,behavior:"instant"});if(view==="scoreboard")renderBoard();if(view==="lineage")renderLineage();if(view==="atlas")renderAtlas()}
document.querySelectorAll("[data-view],[data-goto]").forEach(el=>el.addEventListener("click",()=>route(el.dataset.view||el.dataset.goto)));
$("mobile-menu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
const known=["overview","scoreboard","lineage","atlas","calculator","methodology"];
window.addEventListener("hashchange",()=>{const v=window.location.hash.slice(1);if(known.includes(v)&&!$(`view-${v}`).classList.contains("active"))route(v)});
$("metric-roots").textContent=roots.length;
$("metric-legacy").textContent=Object.keys(legacy).length;
familyOptions("family-filter");familyOptions("lineage-family");
function renderBoard(){
 const search=$("board-search").value.toLowerCase().trim(),filter=$("family-filter").value,sort=$("board-sort").value,showLegacy=$("show-legacy").checked;
 let rows=roots.filter(r=>(filter==="all"||r.family===filter)&&[r.name,r.family,r.divine,r.source,r.identity].some(s=>s.toLowerCase().includes(search)));
 rows.sort((a,b)=>sort==="legacy"?(legacyRange(b)?.[0]??-1)-(legacyRange(a)?.[0]??-1):sort==="family"?a.family.localeCompare(b.family)||a.name.localeCompare(b.name):a.name.localeCompare(b.name));
 $("board-count").textContent=`${rows.length} of ${roots.length} roots`;
 $("board-body").innerHTML=rows.map(r=>{
 let d=drafts[r.id], hasDraft=validDraft(d),l=legacy[r.id],bounds=legacyRange(r);
 let inputText=hasDraft?`${d.T} / ${d.A} / ${d.R} / ${d.M}`:showLegacy&&l?`${format(l[0])} / ${format(l[1])} / ${format(l[2])} / — <span class="cell-sub">Legacy scale: 0–100</span>`:"— / — / — / —";
 let pointText=hasDraft?`${score(d)} <small>/ 150</small>`:showLegacy&&bounds?`${format(bounds[0])}–${format(bounds[1])} <small>/ 150</small>`:"PENDING";
 let type=hasDraft?"DRAFT":showLegacy&&l?"LEGACY":"PENDING";
 return `<tr><td><button class="table-link" data-detail="${safe(r.id)}">${safe(r.name)}</button><span class="cell-sub">${safe(r.id)} · Major root</span></td><td>${safe(r.family)}</td><td><span class="pill">${safe(r.identity)}</span></td><td>${inputText}</td><td><span class="table-score">${pointText}</span></td><td><span class="pill ${type==="DRAFT"?"draft":"pending"}">${type}</span></td></tr>`
 }).join("")||'<tr><td class="empty" colspan="6">No traditions found. Try another filter.</td></tr>';
 $("board-body").querySelectorAll("[data-detail]").forEach(el=>el.addEventListener("click",()=>openDetail(el.dataset.detail)));
}
function getRoot(id){let m=minors.find(x=>x.id===id);return m?getRoot(m.parentId):id}
function renderLineage(){
 const search=$("lineage-search").value.toLowerCase(),filter=$("lineage-family").value;
 const filtered=roots.filter(r=>{
 let children=minors.filter(m=>getRoot(m.id)===r.id);
 return (filter==="all"||r.family===filter)&&([r.name,r.family,r.divine,...children.map(x=>x.name)].some(x=>x.toLowerCase().includes(search)));
 });
 $("lineage-list").innerHTML=filtered.map(r=>{
 const children=minors.filter(m=>getRoot(m.id)===r.id);
 const childrenHtml=children.length?children.map(m=>{
 const parent=m.parentId===r.id?"ROOT":minors.find(v=>v.id===m.parentId)?.name||"ROOT";
 return `<div class="lineage-child"><span>${m.parentId!==r.id?"↳ ":"└ "}${safe(m.name)} <small>· ${safe(m.kind)}</small></span><span>Parent: ${safe(parent)}</span></div>`
 }).join(""):'<p class="lineage-notice">No branch details mapped yet. Major root remains independently registered.</p>';
 return `<article class="lineage-group ${search?"expanded":""}"><button class="lineage-head" aria-expanded="${search?"true":"false"}"><span class="folder-icon">⌘</span><span><strong>${safe(r.name)}</strong><small>${safe(r.family)} · ${children.length} descendant nodes</small></span><span class="chevron">⌄</span></button><div class="lineage-children">${childrenHtml}</div></article>`
 }).join("")||'<p class="lineage-notice">No matching lineages.</p>';
 $("lineage-list").querySelectorAll(".lineage-head").forEach(b=>b.addEventListener("click",()=>{const parent=b.closest(".lineage-group");const open=parent.classList.toggle("expanded");b.setAttribute("aria-expanded",String(open))}));
}
function renderAtlas(){
 const filter=$("atlas-filter").value,search=$("atlas-search").value.toLowerCase();
 const rows=roots.filter(r=>(r.name+" "+atlas[r.id].u+" "+atlas[r.id].ru).toLowerCase().includes(search));
 $("atlas-body").innerHTML=rows.map(r=>{
 const a=atlas[r.id];const highlightedU=r.id==="taoism",highlightedR=r.id==="shinto"||r.id==="spiritism";
 return `<tr><td><button class="table-link" data-detail="${safe(r.id)}">${safe(r.name)}</button></td><td>${filter!=="ruh"?`<span class="${highlightedU?"tag-yes":""}">${safe(a.u)}</span>`:"—"}</td><td>${filter!=="universe"?`<span class="${highlightedR?"tag-yes":""}">${safe(a.ru)}</span>`:"—"}</td><td>${safe(a.note)}</td></tr>`
 }).join("");
 $("atlas-body").querySelectorAll("[data-detail]").forEach(el=>el.addEventListener("click",()=>openDetail(el.dataset.detail)));
}
function openDetail(id){
 const r=roots.find(x=>x.id===id);if(!r)return;
 const children=minors.filter(x=>getRoot(x.id)===id);
 const a=atlas[id],l=legacy[id],d=drafts[id],bounds=legacyRange(r);
 $("detail-content").innerHTML=`<h2 class="detail-name">${safe(r.name)}</h2><p class="detail-meta">Major root · ${safe(r.family)}</p>
 <div class="detail-tags"><span class="pill">${safe(r.identity)}</span><span class="pill pending">Assessment pending</span></div>
 <div class="detail-grid">
 <div class="detail-cell"><small>Divine concept</small><b>${safe(r.divine)}</b></div>
 <div class="detail-cell"><small>Primary source registry</small><b>${safe(r.source)}</b></div>
 <div class="detail-cell"><small>Q4Q points / 150</small><b>${validDraft(d)?score(d)+" (LOCAL DRAFT)":bounds?format(bounds[0])+"–"+format(bounds[1])+" (LEGACY RANGE)":"PENDING"}</b></div>
 <div class="detail-cell"><small>Nested descendants</small><b>${children.length} entries</b></div>
 <div class="detail-cell"><small>Universe concept</small><b>${safe(a.u)}</b></div>
 <div class="detail-cell"><small>Ruh / spirit concept</small><b>${safe(a.ru)}</b></div>
 </div><p class="detail-notes"><b>Lineage:</b> ${safe(r.lineage)}<br><b>Research note:</b> ${safe(r.note)}<br><b>Domain note:</b> ${safe(a.note)}</p>
 <button id="detail-go-lab" class="btn btn-primary detail-dismiss">Open in scoring lab ↗</button>`;
 $("detail-go-lab").addEventListener("click",()=>{$("detail-dialog").close();$("lab-tradition").value=id;loadLab();route("calculator")});
 $("detail-dialog").showModal();
}
$("close-detail").addEventListener("click",()=>$("detail-dialog").close());
$("detail-dialog").addEventListener("click",e=>{if(e.target===$("detail-dialog"))$("detail-dialog").close()});
for(const id of ["board-search","family-filter","board-sort","show-legacy"])$(id).addEventListener("input",renderBoard);
for(const id of ["lineage-search","lineage-family"])$(id).addEventListener("input",renderLineage);
for(const id of ["atlas-filter","atlas-search"])$(id).addEventListener("input",renderAtlas);
$("lab-tradition").innerHTML=roots.map(r=>`<option value="${safe(r.id)}">${safe(r.name)}</option>`).join("");
const dims=[{k:"T",name:"Tauhid / YME",weight:8,hint:"Ontology and divine unity · maximum 80 points"},{k:"A",name:"Asma Concept",weight:4,hint:"Divine attribute parallels · maximum 40 points"},{k:"R",name:"Sacred Sources",weight:2,hint:"Traceability of authoritative sources · maximum 20 points"},{k:"M",name:"Mythology",weight:1,hint:"Sacred narrative parallels · maximum 10 points"}];
$("sliders").innerHTML=dims.map(d=>`<div class="slider-row"><div class="slider-title"><label for="slider-${d.k}">${d.k} — ${d.name}</label><strong id="value-${d.k}">0 / 10</strong></div><input id="slider-${d.k}" type="range" min="0" max="10" step="1" value="0"><div class="slider-note">×${d.weight} · ${d.hint}</div></div>`).join("");
function labValues(){return Object.fromEntries(dims.map(d=>[d.k,Number($(`slider-${d.k}`).value)]))}
function setLab(s){dims.forEach(d=>{$(`slider-${d.k}`).value=s?.[d.k]??0});updateLab()}
function updateLab(){const vals=labValues();$("lab-score").textContent=score(vals);dims.forEach(d=>{$(`value-${d.k}`).textContent=`${vals[d.k]} / 10`});$("lab-breakdown").innerHTML=dims.map(d=>`<div class="breakdown-row"><span>${d.k} · ${d.name} (×${d.weight})</span><strong>${vals[d.k]*d.weight} pts</strong></div>`).join("");}
function loadLab(){const id=$("lab-tradition").value;setLab(validDraft(drafts[id])?drafts[id]:null);$("lab-feedback").textContent=validDraft(drafts[id])?"Existing local draft loaded.":"No draft saved for this tradition."}
$("lab-tradition").addEventListener("change",loadLab);
dims.forEach(d=>$(`slider-${d.k}`).addEventListener("input",updateLab));
$("lab-save").addEventListener("click",()=>{
 const id=$("lab-tradition").value;drafts[id]=labValues();
 try{localStorage.setItem(storageKey,JSON.stringify(drafts));$("lab-feedback").textContent="Local draft saved in this browser. Not reviewed or published."}catch(_){$("lab-feedback").textContent="Browser storage unavailable: draft cannot be retained."}
});
$("lab-clear").addEventListener("click",()=>{setLab(null);$("lab-feedback").textContent="Inputs reset; previously saved draft is unchanged."});
$("export-json").addEventListener("click",()=>{
 const dump={schema:"rocksoul-q4q-v3.9",exportedAt:new Date().toISOString(),notice:"Legacy scores are unreviewed; local drafts are not validated.",roots,legacy,minors,atlas,drafts};
 const blob=new Blob([JSON.stringify(dump,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="rocksoul-q4q-v3.9-export.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000)
});
renderBoard();renderLineage();renderAtlas();loadLab();
const initial=location.hash.slice(1);if(known.includes(initial))route(initial);
})();