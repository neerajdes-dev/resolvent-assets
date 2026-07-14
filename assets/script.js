let deferredPrompt = null;

function shareCard(name){
  const data={
    title:`${name} - Resolvent IT Services`,
    text:`Connect with ${name} from Resolvent IT Services Pvt. Ltd.`,
    url:window.location.href
  };
  if(navigator.share){
    navigator.share(data).catch(()=>{});
    return;
  }
  navigator.clipboard.writeText(window.location.href).then(()=>{
    showNotice("Card link copied to clipboard.");
  });
}

function showNotice(message){
  const n=document.getElementById("share-notice");
  if(!n) return;
  n.style.display="block";
  n.textContent=message;
  setTimeout(()=>n.style.display="none",2500);
}

function applyTheme(theme){
  document.documentElement.setAttribute("data-theme",theme);
  localStorage.setItem("resolvent-theme",theme);
  const b=document.getElementById("theme-toggle");
  if(b) b.textContent=theme==="dark"?"☀️":"🌙";
}

function toggleTheme(){
  const current=document.documentElement.getAttribute("data-theme")||"light";
  applyTheme(current==="dark"?"light":"dark");
}

(function initTheme(){
  const saved=localStorage.getItem("resolvent-theme");
  const preferred=window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark":"light";
  applyTheme(saved||preferred);
})();

window.addEventListener("beforeinstallprompt",(event)=>{
  event.preventDefault();
  deferredPrompt=event;
  const banner=document.getElementById("install-banner");
  if(banner) banner.style.display="flex";
});

async function installApp(){
  if(!deferredPrompt){
    showNotice("Use your browser menu and select Add to Home Screen.");
    return;
  }
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt=null;
  const banner=document.getElementById("install-banner");
  if(banner) banner.style.display="none";
}

window.addEventListener("appinstalled",()=>{
  showNotice("Digital card installed successfully.");
});

if("serviceWorker" in navigator){
  window.addEventListener("load",()=>{
    navigator.serviceWorker.register("../service-worker.js").catch(console.error);
  });
}

function trackEvent(eventName, params={}){
  if(typeof gtag==="function"){
    gtag("event",eventName,params);
  }
}