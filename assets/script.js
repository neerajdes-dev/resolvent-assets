function shareCard(name){
  const data={title:`${name} - Resolvent IT Services`,text:`Connect with ${name} from Resolvent IT Services Pvt. Ltd.`,url:window.location.href};
  if(navigator.share){navigator.share(data).catch(()=>{});return;}
  navigator.clipboard.writeText(window.location.href).then(()=>{
    const n=document.getElementById('share-notice');
    if(n){n.style.display='block';n.textContent='Card link copied to clipboard.';setTimeout(()=>n.style.display='none',2500);}
  });
}