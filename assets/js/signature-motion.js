/* Resolvent Signature interactions: progressive enhancement only */
(function(){
 const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const progress=document.createElement("div");
 progress.className="rv-progress";progress.setAttribute("aria-hidden","true");document.body.appendChild(progress);
 let pending=false;
 function updateProgress(){pending=false;const max=document.documentElement.scrollHeight-innerHeight;progress.style.transform="scaleX("+(max>0?Math.max(0,Math.min(1,scrollY/max)):0)+")"}
 addEventListener("scroll",()=>{if(!pending){pending=true;requestAnimationFrame(updateProgress)}},{passive:true});
 addEventListener("resize",updateProgress,{passive:true});updateProgress();
 if(reduced)return;
 const observer=("IntersectionObserver" in window)?new IntersectionObserver(entries=>{for(const e of entries){if(!e.isIntersecting)continue;e.target.classList.add("rv-seen");if(e.target.id==="actions"){e.target.querySelectorAll(".btn.primary").forEach(b=>b.classList.add("rv-sweep"))}observer.unobserve(e.target)}},{threshold:.18}):null;
 function attach(){
  const actions=document.getElementById("actions");
  const tech=document.getElementById("technologies");
  if(observer){if(actions)observer.observe(actions);if(tech)observer.observe(tech)}
  else{actions?.querySelectorAll(".btn.primary").forEach(b=>b.classList.add("rv-sweep"));tech?.classList.add("rv-seen")}
 }
 attach();
 const watch=new MutationObserver(attach);
 const actions=document.getElementById("actions");
 if(actions)watch.observe(actions,{childList:true});
 const tech=document.getElementById("technologies");
 if(tech)watch.observe(tech,{childList:true});
 const canHover=matchMedia("(hover:hover) and (pointer:fine)").matches;
 if(!canHover)return;
 document.addEventListener("pointermove",event=>{
  const tile=event.target.closest(".actions .btn,.feature,.service,.model");
  if(!tile)return;
  const r=tile.getBoundingClientRect();
  const x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;
  tile.style.setProperty("--rv-x",(x*100)+"%");tile.style.setProperty("--rv-y",(y*100)+"%");
  if(tile.matches(".actions .btn"))tile.style.transform="perspective(700px) rotateX("+((.5-y)*5)+"deg) rotateY("+((x-.5)*5)+"deg) translateY(-2px)";
 },{passive:true});
 document.addEventListener("pointerout",event=>{
  const tile=event.target.closest(".actions .btn");
  if(tile&&!tile.contains(event.relatedTarget))tile.style.transform="";
 });
})();
