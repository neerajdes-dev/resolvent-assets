/* Phase 2: count numeric highlights when scrolled into view */
(function(){
  function start(){
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) return;
    const stats=document.getElementById("stats");
    if(!stats) return;
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(({target,isIntersecting})=>{
        if(!isIntersecting) return;
        observer.unobserve(target);
        const original=target.textContent.trim();
        if(!/^\d[\d,]*(?:\.\d+)?\+?$/.test(original)) return;
        const number=Number(original.replace(/[, +]/g,""));
        const suffix=original.endsWith("+")?"+":"";
        const decimals=(original.replace("+","").split(".")[1]||"").length;
        const begin=performance.now();
        function tick(now){
          const p=Math.min(1,(now-begin)/1100);
          target.textContent=(number*(1-Math.pow(1-p,3))).toFixed(decimals)+suffix;
          if(p<1) requestAnimationFrame(tick);
          else target.textContent=original;
        }
        requestAnimationFrame(tick);
      });
    },{threshold:.45});
    const attach=()=>stats.querySelectorAll(".highlight strong").forEach(el=>{
      if(el.dataset.phase2Observed) return;
      el.dataset.phase2Observed="1";
      observer.observe(el);
    });
    attach();
    new MutationObserver(attach).observe(stats,{childList:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();
})();
