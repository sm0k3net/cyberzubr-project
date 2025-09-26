// Smooth navigation highlighting and scroll events
const navLinks = document.querySelectorAll('.nav-link');
const sections = [...navLinks].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);
const header = document.querySelector('.header');
const scrollTopBtn = document.getElementById('scrollTop');

function onScroll(){
  const y = window.scrollY;
  if(y>30) header.classList.add('scrolled'); else header.classList.remove('scrolled');
  if(y>600){scrollTopBtn.classList.add('visible'); scrollTopBtn.setAttribute('aria-hidden','false')} else {scrollTopBtn.classList.remove('visible'); scrollTopBtn.setAttribute('aria-hidden','true')}
  let currentId = null;
  sections.forEach(sec=>{ if(sec.offsetTop - 140 <= y && (sec.offsetTop + sec.offsetHeight - 180) > y) currentId=sec.id; });
  navLinks.forEach(l=>{ l.classList.toggle('active', l.getAttribute('href') === '#' + currentId); });
}
window.addEventListener('scroll', onScroll); onScroll();

scrollTopBtn?.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'smooth'})});

// Burger menu
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
if(burger){
  burger.addEventListener('click',()=>{ 
    const opened = nav.classList.toggle('open'); 
    burger.classList.toggle('open', opened); 
    document.body.classList.toggle('no-scroll', opened); 
  });
  navLinks.forEach(l=> l.addEventListener('click', ()=> {nav.classList.remove('open'); burger.classList.remove('open'); document.body.classList.remove('no-scroll');}));
}

// Slider
const slider = document.querySelector('.slider');
if(slider){
  const slides = slider.querySelectorAll('.slide');
  const prev = slider.querySelector('.prev');
  const next = slider.querySelector('.next');
  const dotsWrap = slider.querySelector('.dots');
  let index = 0; let autoTimer; const INTERVAL = 6200;
  function update(){
    slides.forEach((s,i)=>{ s.classList.toggle('active', i===index); });
    dotsWrap.querySelectorAll('button').forEach((b,i)=> b.classList.toggle('active', i===index));
  }
  function go(dir){ index = (index + dir + slides.length) % slides.length; update(); restart(); }
  function goTo(i){ index = i; update(); restart(); }
  function restart(){ clearInterval(autoTimer); autoTimer = setInterval(()=> go(1), INTERVAL); }
  slides.forEach((_,i)=>{ const b=document.createElement('button'); b.setAttribute('aria-label','Слайд '+(i+1)); b.addEventListener('click',()=>goTo(i)); dotsWrap.appendChild(b); });
  prev.addEventListener('click',()=>go(-1));
  next.addEventListener('click',()=>go(1));
  update(); restart();
}

// Intersection reveal
const observer = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target);} });
},{threshold:.18});

document.querySelectorAll('.reveal').forEach(el=> observer.observe(el));

// Counters
function animateNumbers(){
  const nums = document.querySelectorAll('.num');
  nums.forEach(n=>{
    const target = +n.dataset.target;
    let start = 0; const duration = 1400; const step =  Math.max(1, Math.round(target / (duration/16)));
    function tick(){ start += step; if(start>=target){ n.textContent=target; } else { n.textContent=start; requestAnimationFrame(tick);} }
    requestAnimationFrame(tick);
  });
}
const stats = document.querySelector('.stats');
if(stats){
  const io = new IntersectionObserver(es=>{ es.forEach(r=>{ if(r.isIntersecting){ animateNumbers(); io.disconnect(); } }); });
  io.observe(stats);
}

// Particles background
const canvas = document.getElementById('bg-particles');
if(canvas){
  const ctx = canvas.getContext('2d');
  let w,h; const particles=[]; const COUNT = 70;
  function resize(){ w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  function init(){
    for(let i=0;i<COUNT;i++) particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*2+0.5,vx:(Math.random()-.5)*0.3,vy:(Math.random()-.5)*0.3,alpha:Math.random()*0.6+0.2});
  }
  function step(){
    ctx.clearRect(0,0,w,h);
    ctx.fillStyle='#1e293b';
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0||p.x>w) p.vx*=-1; if(p.y<0||p.y>h) p.vy*=-1;
      ctx.beginPath(); ctx.globalAlpha=p.alpha; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fillStyle='rgba(99,102,241,.9)'; ctx.fill();
    });
    requestAnimationFrame(step);
  }
  init(); step();
}

// Modal system
const openers = document.querySelectorAll('.open-modal');
const body = document.body;
function openModal(id){
  const m = document.getElementById(id);
  if(!m) return;
  m.setAttribute('aria-hidden','false');
  m.querySelector('[data-close]')?.focus();
  body.style.overflow='hidden';
}
function closeModal(m){
  m.setAttribute('aria-hidden','true');
  body.style.overflow='';
}
openers.forEach(btn=> btn.addEventListener('click',()=> openModal(btn.dataset.modal)));

document.addEventListener('click',e=>{
  const closeBtn = e.target.closest('[data-close]');
  if(closeBtn){ const modal = closeBtn.closest('.modal'); modal && closeModal(modal); }
});
window.addEventListener('keydown',e=>{ if(e.key==='Escape'){ document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m=> closeModal(m)); }});

// Forms (demo submission)
function simulateSubmit(form, statusEl){
  form.addEventListener('submit',e=>{
    e.preventDefault();
    if(!form.checkValidity()){
      form.querySelectorAll(':invalid').forEach(inp=>{ const err=inp.parentElement.querySelector('.error'); if(err) err.textContent='Заполните поле'; });
      return;
    }
    statusEl.textContent='Отправка...';
    setTimeout(()=>{ statusEl.textContent='Заявка отправлена (демо). Мы свяжемся с вами.'; form.reset(); }, 1100);
  });
}
const contactForm = document.getElementById('contactForm');
if(contactForm){ 
  const consent = contactForm.querySelector('input[name="consent"]');
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  consent?.addEventListener('change',()=>{ submitBtn.disabled = !consent.checked; });
  simulateSubmit(contactForm, contactForm.querySelector('.form-status')); 
}
const auditForm = document.getElementById('auditForm');
if(auditForm){ 
  const consentMini = auditForm.querySelector('input[name="consent"]');
  const submitBtnMini = auditForm.querySelector('button[type="submit"]');
  consentMini?.addEventListener('change',()=>{ submitBtnMini.disabled = !consentMini.checked; });
  simulateSubmit(auditForm, auditForm.querySelector('.mini-status')); 
}

// Year
const yearEl = document.getElementById('year'); if(yearEl) yearEl.textContent = new Date().getFullYear();

// Parallax simple
const parallaxEls = document.querySelectorAll('.parallax');
if(window.matchMedia('(pointer:fine)').matches){
  window.addEventListener('mousemove', e=>{
    const cx = window.innerWidth/2; const cy = window.innerHeight/2;
    parallaxEls.forEach(el=>{
      const depth = parseFloat(el.dataset.depth||'0.2');
      const x = (e.clientX - cx) * depth; const y = (e.clientY - cy) * depth;
      el.style.transform = `translate(${x}px,${y}px)`;
    });
  });
}
