
const CONFIG={
  GOOGLE_SCRIPT_URL:"https://script.google.com/macros/s/AKfycbyeqB0CTIMciLBG1B1_lm2cvlsr77Tts3ceJ725bTh1uPlJdbFcrnEuFgE-0nvrgfVSvw/exec",
  GA_MEASUREMENT_ID:""
};

async function load(path){
  const response=await fetch(path,{cache:"no-store"});
  if(!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
}

function employeeId(){
  return new URLSearchParams(location.search).get("id")||"neeraj-desai";
}

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme",theme);
  localStorage.setItem("resolvent-theme",theme);
  const button=document.getElementById("theme-toggle");
  if(button) button.textContent=theme==="dark"?"☀️":"🌙";
}

function toggleTheme(){
  const current=document.documentElement.getAttribute("data-theme")||"light";
  applyTheme(current==="dark"?"light":"dark");
}

function trackEvent(name,params={}){
  if(typeof gtag==="function") gtag("event",name,params);
}

async function shareCard(name){
  const data={
    title:`${name} - Resolvent IT Services`,
    text:`Connect with ${name} from Resolvent IT Services Pvt. Ltd.`,
    url:location.href
  };
  if(navigator.share){
    try{await navigator.share(data);trackEvent("share_card",{employee:name});}catch{}
    return;
  }
  await navigator.clipboard.writeText(location.href);
  alert("Card link copied.");
}

function showStatus(type,message){
  const box=document.getElementById("form-status");
  box.className=`status ${type}`;
  box.textContent=message;
}


function modelCard(model){
  if(typeof model==="string"){
    return `<div class="model"><strong>✓ ${model}</strong></div>`;
  }
  return `<div class="model"><strong>✓ ${model.title}</strong><span>${model.description||""}</span></div>`;
}

async function submitLead(event,employee){
  event.preventDefault();

  const form=event.target;
  const button=form.querySelector('button[type="submit"]');

  const payload={
    submittedAt:new Date().toISOString(),
    employeeId:employee.id,
    employeeName:employee.name,
    employeeEmail:employee.notificationEmail,
    name:form.name.value.trim(),
    company:form.company.value.trim(),
    email:form.email.value.trim(),
    phone:form.phone.value.trim(),
    service:form.service.value,
    requirement:form.requirement.value.trim(),
    source:form.source.value,
    pageUrl:location.href
  };

  if(CONFIG.GOOGLE_SCRIPT_URL.includes("PASTE_YOUR")){
    showStatus("error","Add your Google Apps Script Web App URL in assets/js/app.js.");
    return;
  }

  button.disabled=true;
  button.textContent="Submitting...";
  showStatus("success","Submitting your request...");

  try{
    await fetch(CONFIG.GOOGLE_SCRIPT_URL,{
      method:"POST",
      mode:"no-cors",
      headers:{"Content-Type":"text/plain;charset=utf-8"},
      body:JSON.stringify(payload)
    });

    form.reset();
    showStatus("success","Thank you. Your request has been received and our team will contact you shortly.");
    trackEvent("callback_request",{employee:employee.name,service:payload.service,source:payload.source});
  }catch(error){
    console.error(error);
    showStatus("error","Unable to submit the request. Please contact us using WhatsApp or phone.");
  }finally{
    button.disabled=false;
    button.textContent="Submit Request";
  }
}

function setupReveal(){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.12});

  document.querySelectorAll(".reveal").forEach(element=>observer.observe(element));
}

function updateMeta(employee,company){
  const description=`Connect with ${employee.name}, ${employee.designation} at ${company.name}.`;
  document.title=`${employee.name} | ${employee.designation} | Resolvent`;
  document.getElementById("meta-description").content=description;
  document.getElementById("og-title").content=`${employee.name} | ${company.name}`;
  document.getElementById("og-description").content=description;
  document.getElementById("og-url").content=location.href;
  document.getElementById("og-image").content=new URL(employee.photo,location.href).href;

  const schema={
    "@context":"https://schema.org",
    "@type":"Person",
    "name":employee.name,
    "jobTitle":employee.designation,
    "email":employee.email,
    "telephone":employee.mobileDisplay,
    "image":new URL(employee.photo,location.href).href,
    "worksFor":{"@type":"Organization","name":company.name,"url":company.website}
  };
  const script=document.createElement("script");
  script.type="application/ld+json";
  script.textContent=JSON.stringify(schema);
  document.head.appendChild(script);
}

function openContactCard(vcfUrl){
  if(!vcfUrl){
    alert("Contact file is not available.");
    return;
  }

  const absoluteUrl=new URL(vcfUrl,window.location.href).href;

  trackEvent("save_contact",{
    vcf_url:absoluteUrl
  });

  window.location.href=absoluteUrl;
}

async function init(){
  const [
  employees,
  company,
  services,
  industries,
  technologies,
  models,
  stats,
  testimonials,
  clients
] = await Promise.all([
  load("data/employees.json"),
  load("data/company.json"),
  load("data/services.json"),
  load("data/industries.json"),
  load("data/technologies.json"),
  load("data/engagement-models.json"),
  load("data/stats.json"),
  load("data/testimonials.json"),
  load("data/clients.json")
]);

  const employee=employees.find(item=>item.id===employeeId())||employees[0];
  updateMeta(employee,company);

  document.getElementById("profile-photo").src=employee.photo;
  document.getElementById("profile-photo").alt=employee.name;
  document.getElementById("employee-name").textContent=employee.name;
  document.getElementById("designation").textContent=employee.designation;
  document.getElementById("company-name").textContent=company.name;
  document.getElementById("employee-intro").textContent=employee.intro||"";
  document.getElementById("hero-focus").innerHTML=employee.focus.map(item=>`<span>${item}</span>`).join("");
  document.getElementById("about").textContent=company.about;

  document.getElementById("actions").innerHTML=`
    <a class="btn" href="tel:+${employee.mobileDigits}" data-action="call">📞 Call</a>
    <a class="btn" href="https://wa.me/${employee.mobileDigits}" target="_blank" rel="noopener" data-action="whatsapp">💬 WhatsApp</a>
    <a class="btn" href="mailto:${employee.email}" data-action="email">✉️ Email</a>
    <a class="btn" href="${company.website}" target="_blank" rel="noopener" data-action="website">🌐 Website</a>
    <a class="btn" href="${employee.linkedin}" target="_blank" rel="noopener" data-action="linkedin">💼 LinkedIn</a>
    <a class="btn" href="${company.maps}" target="_blank" rel="noopener" data-action="location">📍 Location</a>
    ${employee.meeting?.enabled && employee.meeting?.url
      ? `<a class="btn" href="${employee.meeting.url}" target="_blank" rel="noopener" data-action="meeting">📅 Book Meeting</a>`
      : ""}
    <button id="save-contact" class="btn primary" type="button" data-action="save_contact">👤 Save Contact</button>
    <button id="share-card" class="btn primary" type="button">📤 Share Contact</button>
  `;

  document.getElementById("share-card").onclick=()=>shareCard(employee.name);

 const saveContactButton = document.getElementById("save-contact");

if (saveContactButton) {
    saveContactButton.addEventListener("click", saveContact);
}

async function saveContact() {

    // If a VCF URL already exists in your JSON, use it.
    if (employee.vcf) {

        try {

            const response = await fetch(employee.vcf);
            const blob = await response.blob();

            const file = new File(
                [blob],
                `${employee.id}.vcf`,
                { type: "text/vcard" }
            );

            // Native Share (Android / iPhone)
            if (
                navigator.canShare &&
                navigator.canShare({ files: [file] })
            ) {

                await navigator.share({
                    title: employee.name,
                    text: "Save Contact",
                    files: [file]
                });

                return;
            }

        } catch (e) {
            console.log(e);
        }

        // Fallback download
        const link = document.createElement("a");
        link.href = employee.vcf;
        link.download = `${employee.id}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}



  document.querySelectorAll("[data-action]").forEach(link=>{
    link.addEventListener("click",()=>trackEvent("contact_action",{action:link.dataset.action,employee:employee.name}));
  });

  document.getElementById("services").innerHTML=services.map(item=>
    `<div class="service"><strong>${item.icon} ${item.title}</strong><span>${item.description}</span></div>`
  ).join("");

  document.getElementById("stats").innerHTML=stats.map(item=>
    `<div class="highlight"><strong>${item.value}</strong><span>${item.label}</span></div>`
  ).join("");

  document.getElementById("industries").innerHTML=industries.map(item=>`<span class="chip">${item}</span>`).join("");
  document.getElementById("technologies").innerHTML=technologies.map(item=>`<span class="chip">${item}</span>`).join("");
  document.getElementById("models").innerHTML=models.map(modelCard).join("");

  document.getElementById("testimonials").innerHTML=testimonials.map(item=>
    `<article class="testimonial"><blockquote>“${item.quote}”</blockquote><strong>${item.name}</strong><small>${item.company}</small></article>`
  ).join("");

  const clientItems = clients.map(client => `
  <div class="client-logo-card">
    <img
      src="${client.logo}"
      alt="${client.name}"
      loading="lazy"
    >
  </div>
`).join("");

  const clientTrack = document.getElementById("client-track");

  if (clientTrack) {
    clientTrack.innerHTML = clientItems + clientItems;
  }
  document.getElementById("office-address").textContent=company.address;
  document.getElementById("map-link").href=company.maps;
  document.getElementById("brochure-view").href="assets/images/Resolvent_Company_Profile.pdf";
  document.getElementById("brochure-download").href="assets/images/Resolvent_Company_Profile.pdf";
  document.getElementById("callback-form").onsubmit=event=>submitLead(event,employee);

  document.getElementById("mobile-call").href=`tel:+${employee.mobileDigits}`;
  document.getElementById("mobile-whatsapp").href=`https://wa.me/${employee.mobileDigits}`;
  document.getElementById("mobile-email").href=`mailto:${employee.email}`;
  const meetingLink=document.getElementById("mobile-calendar");
  const meetingEnabled=employee.meeting?.enabled===true && Boolean(employee.meeting?.url);

  if(meetingEnabled){
    meetingLink.href=employee.meeting.url;
    meetingLink.style.display="";
    meetingLink.dataset.provider=employee.meeting.provider||"custom";
  }else{
    meetingLink.removeAttribute("href");
    meetingLink.style.display="none";
  }

  setupReveal();

  if("serviceWorker" in navigator){
    navigator.serviceWorker.register("service-worker.js").catch(console.error);
  }
}

applyTheme(
  localStorage.getItem("resolvent-theme")||
  (matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light")
);

init().catch(error=>{
  console.error(error);
  document.body.innerHTML="<p style='padding:30px'>Unable to load the digital card. Please check the uploaded files and paths.</p>";
});
