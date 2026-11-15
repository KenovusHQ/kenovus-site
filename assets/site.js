const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
const card=document.getElementById('formcard'),label=card.querySelector('.cta-label');
let selectedRole='individual';
function mode(m){selectedRole=m==='clinic'?'clinic':'individual';card.classList.toggle('mode-clinic',m==='clinic');card.querySelectorAll('.tabs button').forEach(b=>b.classList.toggle('on',b.dataset.tab===m));label.textContent=m==='clinic'?'Join the clinic waitlist':'Get early access'}
card.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>mode(b.dataset.tab));
document.querySelectorAll('[data-mode="clinic"]').forEach(a=>a.addEventListener('click',()=>mode('clinic')));
const form=document.getElementById('leadform'),status=form.querySelector('[role="status"]'),submit=form.querySelector('[type="submit"]');
function done(){form.hidden=true;card.querySelector('.tabs').hidden=true;card.querySelector('.form-done').hidden=false}
form.addEventListener('submit',async e=>{
  e.preventDefault();
  if(submit.disabled)return;
  if(form.elements.website.value){done();return}
  form.elements.name.value=form.elements.name.value.trim();
  form.elements.email.value=form.elements.email.value.trim();
  if(!form.reportValidity())return;
  submit.disabled=true;status.classList.remove('error');status.textContent='Saving your spot…';
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),15000);
  try{
    // This is a PUBLIC publishable API key, not a secret. The RLS-protected table
    // permits anonymous INSERT of name/email/role only, never SELECT/UPDATE/DELETE.
    const response=await fetch('https://gixqbbnvoigocxlobbci.supabase.co/rest/v1/website_leads',{
      method:'POST',signal:controller.signal,
      headers:{'apikey':'sb_publishable_PRM6s38qNlNQe0K9sZF0Pw_Xx-D4kus','Content-Type':'application/json','Prefer':'return=minimal'},
      body:JSON.stringify({name:form.elements.name.value,email:form.elements.email.value,role:selectedRole})
    });
    if(!response.ok)throw new Error('Unable to save');
    done();
  }catch(_){status.classList.add('error');status.textContent='Sorry, we couldn’t save your spot just now. Please try again, or email lance@kenovus.com.'}
  finally{clearTimeout(timer);submit.disabled=false}
});

// Orbit hero: respect reduced motion, and pause the SMIL animation when off-screen.
(function(){const s=document.getElementById('orbit-svg');if(!s||!s.pauseAnimations)return;
const mq=window.matchMedia('(prefers-reduced-motion: reduce)');let vis=true;
function sync(){if(mq.matches){s.setCurrentTime(1.6);s.pauseAnimations()}else if(vis){s.unpauseAnimations()}else{s.pauseAnimations()}}
if('IntersectionObserver' in window)new IntersectionObserver(es=>{vis=es[0].isIntersecting;sync()}).observe(s);
mq.addEventListener?mq.addEventListener('change',sync):mq.addListener(sync);sync()})();
