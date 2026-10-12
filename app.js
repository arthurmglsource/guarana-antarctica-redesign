(() => {
  const q = s => document.querySelector(s);
  document.querySelectorAll('[data-copy]').forEach(el => { el.textContent = window.GUARANA_CONTENT?.[el.dataset.copy] || ''; });
  const story=q('.story'), stage=q('.stage'), origin=q('.origin-scene');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  let motion, enter, timeline, mm, active=false;
  const setActive=value=>{
    if(active===value)return;
    active=value; origin.inert=!value;origin.classList.toggle('is-active',value);q('.header').classList.toggle('on-origin',value);
    q('.hero-bottom').inert=value;
    q('.chapter-number').textContent=value?'02':'01';
    q('.chapter-name').textContent=value?'DA ORIGEM AO SABOR':'ORIGINAL DO BRASIL';
  };
  const staticMode=()=>{
    document.body.classList.add('static-mode');origin.inert=false;origin.classList.add('is-active');
  };
  function build(){
    if(reduced.matches||!window.gsap||!window.ScrollTrigger){staticMode();return;}
    document.body.classList.remove('static-mode');
    gsap.registerPlugin(ScrollTrigger);
    mm=gsap.matchMedia();
    mm.add({mobile:'(max-width: 760px)',desktop:'(min-width: 761px)'},ctx=>{
      const mobile=ctx.conditions.mobile;
      enter=gsap.timeline({defaults:{ease:'power3.out'}})
        .from('.halo',{opacity:0,duration:.55},0)
        .from('.hero-title>span',{y:55,opacity:0,duration:1.05,stagger:.12},.15)
        .from('.product-parallax',{y:65,scale:.94,opacity:0,duration:1.15},.35)
        .from('.sprig',{y:30,opacity:0,duration:1.15,stagger:.1},.55)
        .from('.header,.hero-kicker,.hero-bottom,.product-note,.chapter-ui',{opacity:0,duration:.7,stagger:.04},.65);
      timeline=gsap.timeline({defaults:{ease:'none'},scrollTrigger:{
        trigger:story,start:'top top',end:()=>`+=${innerHeight*(mobile?1.85:2.45)}`,
        pin:stage,scrub:mobile?.4:.65,anticipatePin:1,invalidateOnRefresh:true,
        onUpdate:self=>{q('.chapter-line i').style.width=`${self.progress*100}%`;setActive(self.progress>.63);}
      }});
      timeline.to('.title-original',{y:-140,opacity:0,duration:.8},0)
        .to('.title-brasil',{y:160,opacity:0,duration:.8},0)
        .to('.hero-kicker,.hero-bottom,.product-note',{opacity:0,y:20,duration:.4},0)
        .to('.sprig-left',{x:-160,y:100,rotation:-55,opacity:0,duration:.85},0)
        .to('.sprig-right',{x:160,y:-100,rotation:170,opacity:0,duration:.85},0)
        .to('.product-wrap',{scale:mobile?5.7:7.7,rotation:0,duration:1.25,ease:'power2.in'},.1)
        .to('.green-bridge',{opacity:1,duration:.4},.85)
        .to('.origin-scene',{clipPath:'circle(145% at 50% 48%)',duration:1.05,ease:'power2.inOut'},1.1)
        .fromTo('.origin-image',{scale:1.22},{scale:1,duration:1.7,ease:'power2.out'},1.15)
        .fromTo('.origin-content>*',{y:40,opacity:0},{y:0,opacity:1,duration:.6,stagger:.13,ease:'power2.out'},1.8)
        .fromTo('.origin-caption',{opacity:0},{opacity:1,duration:.4},2.2)
        .to({}, {duration:.55},2.65);
      motion=timeline.scrollTrigger;
      return()=>{enter?.kill();timeline?.kill();};
    });
    if(matchMedia('(pointer: fine)').matches){
      const x=gsap.quickTo('.product-parallax','x',{duration:.7,ease:'power2.out'}),y=gsap.quickTo('.product-parallax','y',{duration:.7,ease:'power2.out'});
      stage.addEventListener('pointermove',e=>{if(motion?.progress>.02)return;x((e.clientX/innerWidth-.5)*10);y((e.clientY/innerHeight-.5)*8);});
      stage.addEventListener('pointerleave',()=>{x(0);y(0);});
    }
    document.fonts.ready.then(()=>ScrollTrigger.refresh());
    window.addEventListener('pageshow',()=>ScrollTrigger.refresh());
  }
  document.querySelectorAll('[data-origin],.skip-link').forEach(link=>link.addEventListener('click',e=>{
    e.preventDefault();enter?.progress(1);
    if(motion&&!reduced.matches){window.scrollTo({top:motion.end,behavior:'auto'});timeline.progress(1);setActive(true);}
    else origin.scrollIntoView({behavior:'auto'});
    origin.focus({preventScroll:true});history.replaceState(null,'','#origem');
  }));
  document.querySelectorAll('a[href="#inicio"]').forEach(link=>link.addEventListener('click',e=>{e.preventDefault();window.scrollTo({top:0,behavior:'auto'});history.replaceState(null,'',location.pathname);q('.brand').focus({preventScroll:true});}));
  build();
  reduced.addEventListener('change',()=>{mm?.revert();active=false;build();});
  if(location.hash==='#origem')requestAnimationFrame(()=>document.querySelector('[data-origin]').click());
})();
