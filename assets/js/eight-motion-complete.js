/* Resolvent eight-motion completion. No employee or contact logic changed. */
(function(){
 const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
 const hover=matchMedia("(hover:hover) and (pointer:fine)").matches;
 function init(){
  const profile=document.querySelector(".profile-card");
  if(profile&&hover&&!reduce){
   profile.addEventListener("pointermove",e=>{
    const rect=profile.getBoundingClientRect();
    profile.style.setProperty("--rv-px",((e.clientX-rect.left)/rect.width-.5)*8+"px");
    profile.style.setProperty("--rv-py",((e.clientY-rect.top)/rect.height-.5)*8+"px");
   },{passive:true});
   profile.addEventListener("pointerleave",()=>{profile.style.setProperty("--rv-px","0px");profile.style.setProperty("--rv-py","0px")});
  }
  const sections=[...document.querySelectorAll(".section.reveal")];
  const stagger=section=>section.querySelectorAll(".grid > *, .highlights > *, .testimonial-grid > *").forEach((item,i)=>item.style.setProperty("--rv-index",i));
  sections.forEach(stagger);
  const services=document.getElementById("services");
  const stats=document.getElementById("stats");
  const testimonials=document.getElementById("testimonials");
  const tech=document.getElementById("technologies");
  const dynamic=new MutationObserver(()=>{[services,stats,testimonials].forEach(node=>{if(node)stagger(node.parentElement)})});
  [services,stats,testimonials].forEach(node=>{if(node)dynamic.observe(node,{childList:true})});
  if(!tech||reduce)return;
  function makeMarquee(){
   if(tech.classList.contains("rv-marquee"))return;
   const chips=[...tech.children];
   if(chips.length<2)return;
   const group=document.createElement("div");group.className="rv-tech-group";
   chips.forEach(chip=>group.appendChild(chip));
   const clone=group.cloneNode(true);clone.setAttribute("aria-hidden","true");
   const track=document.createElement("div");track.className="rv-tech-track";
   track.append(group,clone);tech.append(track);tech.classList.add("rv-marquee");
  }
  makeMarquee();
  new MutationObserver(makeMarquee).observe(tech,{childList:true});
 }
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init,{once:true});else init();
})();
