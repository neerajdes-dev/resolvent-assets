
const CONFIG={GOOGLE_SCRIPT_URL:"https://script.google.com/macros/s/AKfycbyeqB0CTIMciLBG1B1_lm2cvlsr77Tts3ceJ725bTh1uPlJdbFcrnEuFgE-0nvrgfVSvw/exec"};
async function load(path){const r=await fetch(path,{cache:"no-store"});if(!r.ok)throw new Error(path);return r.json()}
function id(){return new URLSearchParams(location.search).get("id")||"neeraj-desai"}
function applyTheme(t){document.documentElement.setAttribute("data-theme",t);localStorage.setItem("resolvent-theme",t);const b=document.getElementById("theme-toggle");if(b)b.textContent=t==="dark"?"☀️":"🌙"}
function toggleTheme(){applyTheme((document.documentElement.getAttribute("data-theme")||"light")==="dark"?"light":"dark")}
async function shareCard(name){const d={title:`${name} - Resolvent IT Services`,text:`Connect with ${name}`,url:location.href};if(navigator.share){try{await navigator.share(d)}catch{};return}await navigator.clipboard.writeText(location.href);alert("Card link copied.")}
function status(type,msg){const x=document.getElementById("form-status");x.className=`status ${type}`;x.textContent=msg}
function teamCard(e){return `<div class="team-card"><img src="${e.photo}" alt="${e.name}"><h3>${e.name}</h3><p>${e.designation}</p><div class="chips" style="justify-content:center">${e.focus.map(x=>`<span class="chip">${x}</span>`).join("")}</div><a class="btn" href="employee.html?id=${e.id}">View Card</a></div>`}
async function submitLead(ev,employee){
  ev.preventDefault();
  const f=ev.target,b=f.querySelector("button[type=submit]");
  const p={submittedAt:new Date().toISOString(),employeeId:employee.id,employeeName:employee.name,employeeEmail:employee.notificationEmail,name:f.name.value.trim(),company:f.company.value.trim(),email:f.email.value.trim(),phone:f.phone.value.trim(),service:f.service.value,requirement:f.requirement.value.trim(),source:f.source.value,pageUrl:location.href};
  if(CONFIG.GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")){status("error","Add the Google Apps Script URL in assets/js/app.js.");return}
  b.disabled=true;b.textContent="Submitting...";status("success","Submitting your request...");
  try{
    await fetch(CONFIG.GOOGLE_SCRIPT_URL,{method:"POST",mode:"no-cors",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(p)});
    f.reset();status("success","Thank you. Your request has been received.");
  }catch(e){console.error(e);status("error","Unable to submit. Please use WhatsApp or call us.");}
  finally{b.disabled=false;b.textContent="Submit Request";}
}
async function init(){
  const [emps,c,s,inds,tech,models]=await Promise.all([load("data/employees.json"),load("data/company.json"),load("data/services.json"),load("data/industries.json"),load("data/technologies.json"),load("data/engagement-models.json")]);
  const e=emps.find(x=>x.id===id())||emps[0];
  document.title=`${e.name} | Resolvent IT Services`;
  document.getElementById("profile-photo").src=e.photo;
  document.getElementById("employee-name").textContent=e.name;
  document.getElementById("designation").textContent=e.designation;
  document.getElementById("company-name").textContent=c.name;
  document.getElementById("about").textContent=c.about;
  document.getElementById("actions").innerHTML=`<a class="btn" href="tel:+${e.mobileDigits}">📞 Call</a><a class="btn" href="https://wa.me/${e.mobileDigits}" target="_blank">💬 WhatsApp</a><a class="btn" href="mailto:${e.email}">✉️ Email</a><a class="btn" href="${c.website}" target="_blank">🌐 Website</a><a class="btn" href="${e.linkedin}" target="_blank">💼 LinkedIn</a><a class="btn" href="${c.maps}" target="_blank">📍 Location</a><a class="btn primary" href="${e.vcf}" download>⬇ Save Contact</a><button id="share" class="btn primary">📤 Share Contact</button>`;
  document.getElementById("share").onclick=()=>shareCard(e.name);
  document.getElementById("services").innerHTML=s.map(x=>`<div class="service"><strong>${x.icon} ${x.title}</strong><span>${x.description}</span></div>`).join("");
  document.getElementById("industries").innerHTML=inds.map(x=>`<span class="chip">${x}</span>`).join("");
  document.getElementById("technologies").innerHTML=tech.map(x=>`<span class="chip">${x}</span>`).join("");
  document.getElementById("models").innerHTML=models.map(x=>`<div class="model"><strong>✓ ${model.title}</strong><span>${model.description}</span></div>`).join("");
  document.getElementById("team").innerHTML=emps.map(teamCard).join("");
  document.getElementById("office-address").textContent=c.address;
  document.getElementById("map-link").href=c.maps;
  document.getElementById("brochure-view").href="assets/images/Resolvent_Company_Profile.pdf";
  document.getElementById("brochure-download").href="assets/images/Resolvent_Company_Profile.pdf";
  document.getElementById("callback-form").onsubmit=ev=>submitLead(ev,e);
  document.getElementById("floating-whatsapp").href=`https://wa.me/${e.mobileDigits}`;
}
applyTheme(localStorage.getItem("resolvent-theme")||(matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light"));
init().catch(err=>{console.error(err);document.body.innerHTML="<p style='padding:30px'>Unable to load the page. Check file paths.</p>"});
