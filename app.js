(() => {
 'use strict';
 const q=s=>document.querySelector(s), all=s=>[...document.querySelectorAll(s)];
 const data=window.GUARANA_CONTENT, reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const sceneIds={hero:'hero',brand:'produtos',culture:'coisa-nossa',final:'escolha'};
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const makePose=(x=0,y=0,s=1,rz=0,ry=0,z=0)=>({x,y,s,rz,ry,z});
 const stage=q('.stage');
 let master=null, intro=null, mode='desktop', media=null, activeScene='hero';

 // One product system, two authentic packshots, shared scroll and interaction states.
 class ProductExperience {
  constructor(){
   this.rig=q('.product-rig');this.rig.removeAttribute('aria-hidden');this.nodes=Object.fromEntries(all('[data-can]').map(el=>[el.dataset.can,el]));
   for(const [id,node] of Object.entries(this.nodes))node.querySelector('img').alt=`${data.products[id].name}, lata de 350 ml`;
   this.poses={original:makePose(0,0,1,-8),zero:makePose(1.15,-.1,.72,25,-8,-60)};
   this.state={currentProduct:'original',previousProduct:null,transitioning:false,scrollProgress:0};
   this.manual=null;this.switchTimeline=null;this.serial=0;this.dragOffset=0;this.pageStart=0;this.pageLimit=0;
   this.render=this.render.bind(this);this.measure();
  }
  measure(){this.pageStart=stage.getBoundingClientRect().top+scrollY;this.pageLimit=Math.max(0,stage.scrollHeight-q('.hero-scene').clientHeight);}
  render(){
   if(mode==='static')return;
   const w=innerWidth,h=Math.max(innerHeight,mode==='mobile'?700:0), poses=this.manual||this.poses;
   if(mode==='mobile')this.rig.style.transform=`translateY(${clamp(scrollY-this.pageStart,0,this.pageLimit)}px)`;
   else this.rig.style.transform='';
   for(const [id,p] of Object.entries(poses)){
    const drag=this.state.currentProduct===id?this.dragOffset:0;
    this.nodes[id].style.transform=`translate(-50%,-50%) translate3d(${p.x*w+drag}px,${p.y*h}px,${p.z}px) rotateY(${p.ry}deg) rotateZ(${p.rz+drag*.05}deg) scale(${p.s})`;
    this.nodes[id].setAttribute('aria-hidden',String(Math.abs(p.x)>.7));
   }
  }
  updateUI(id,announce=true){
   all('[data-product]').filter(el=>el.tagName==='BUTTON').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.product===id)));
   q('.final-scene').dataset.selected=id;q('[data-product-link]').href=data.products[id].url;
   if(announce)q('[data-product-status]').textContent=`${data.products[id].name} selecionado.`;
  }
  reset(){
   this.switchTimeline?.kill();this.manual=null;this.dragOffset=0;this.serial++;
   this.state.currentProduct='original';this.state.previousProduct=null;this.state.transitioning=false;this.updateUI('original');this.render();
  }
  select(id){
   if(mode!=='static')syncScroll();
   if(!data.products[id]||activeScene!=='final')return;
   if(mode==='static'){this.state.currentProduct=id;this.updateUI(id);return;}
   if(id===this.state.currentProduct&&!this.state.transitioning){this.dragOffset=0;this.render();return;}
   this.switchTimeline?.kill();
   if(!this.manual)this.manual=Object.fromEntries(Object.entries(this.poses).map(([key,p])=>[key,makePose(p.x,p.y,p.s,p.rz,p.ry,p.z)]));
   this.dragOffset=0;const outgoing=id==='zero'?'original':'zero',direction=id==='zero'?1:-1;
   this.state.previousProduct=outgoing;this.state.currentProduct=id;this.state.transitioning=true;this.updateUI(id,false);
   const token=++this.serial;
   this.switchTimeline=gsap.timeline({onUpdate:this.render,onComplete:()=>{if(token!==this.serial)return;this.state.transitioning=false;this.updateUI(id);}})
    .to(this.manual[outgoing],{x:-1.15*direction,y:.06,s:.68,rz:-28*direction,ry:-12*direction,z:-70,duration:.85,ease:'power3.inOut'},0)
    .to(this.manual[id],{x:0,y:mode==='mobile'?.025:0,s:mode==='mobile'?.88:.86,rz:0,ry:0,z:0,duration:.95,ease:'power3.inOut'},.08);
  }
  staticImage(id){const img=new Image();img.src=data.products[id].asset;img.alt=data.products[id].name;img.className='static-can';img.dataset.product=id;img.draggable=false;return img;}
  staticFallback(){
   all('.static-can').forEach(x=>x.remove());
   for(const scene of all('.scene')){
    scene.append(this.staticImage('original'));
    if(scene.matches('.brand-scene,.final-scene'))scene.append(this.staticImage('zero'));
   }
  }
 }
 const product=new ProductExperience();

 class CampaignGallery {
  constructor(){this.current=0;this.manual=false;this.animation=null;this.images=all('[data-photo]');}
  select(index,manual=false){
   this.manual=manual||this.manual;index=clamp(index,0,data.campaigns.length-1);if(index===this.current)return;
   this.animation?.kill();const previous=this.current, direction=index>previous?1:-1;this.current=index;
   const copy=data.campaigns[index];q('[data-campaign-title]').textContent=copy.title;q('[data-campaign-copy]').textContent=copy.copy;q('[data-campaign-link]').href=copy.url;
   all('[data-campaign]').forEach(el=>el.setAttribute('aria-pressed',String(+el.dataset.campaign===index)));
   this.images.forEach((el,i)=>{el.classList.toggle('is-active',i===index);el.setAttribute('aria-hidden',String(i!==index));});
   if(mode==='static'||reduced.matches)return;
   gsap.set(this.images,{visibility:'hidden',xPercent:100});
   gsap.set(this.images[previous],{visibility:'visible',xPercent:0,zIndex:1});
   gsap.set(this.images[index],{visibility:'visible',xPercent:100*direction,zIndex:2});
   this.animation=gsap.timeline({onComplete:()=>gsap.set(this.images[previous],{visibility:'hidden'})})
    .to(this.images[previous],{xPercent:-25*direction,duration:.65,ease:'power3.inOut'},0)
    .to(this.images[index],{xPercent:0,duration:.65,ease:'power3.inOut'},0);
  }
 }
 const gallery=new CampaignGallery();
 function setScene(name){
  if(activeScene!==name){
   if(activeScene==='final')product.reset();
   if(activeScene==='culture')gallery.manual=false;
   activeScene=name;
  }
  document.body.dataset.scene=name;
  if(mode==='desktop')all('.scene').forEach(el=>{const on=el.id===sceneIds[name];el.inert=!on;el.setAttribute('aria-hidden',String(!on));});
  else all('.scene').forEach(el=>{el.inert=false;el.removeAttribute('aria-hidden');});
  all('.header [data-scene]').forEach(el=>{if(el.dataset.scene===name)el.setAttribute('aria-current','location');else el.removeAttribute('aria-current');});
 }
 function onMasterUpdate(){
  if(!master)return;const t=master.time();product.state.scrollProgress=master.progress();
  if(mode==='desktop'){
   setScene(t<3.4?'hero':t<5.15?'brand':t<8.05?'culture':'final');
   if(activeScene==='culture'&&!gallery.manual)gallery.select(t<6.4?0:t<7?1:2);
  }else{
   setScene(t<.85?'hero':t<1.75?'brand':t<2.8?'culture':'final');
   if(activeScene==='culture'&&!gallery.manual)gallery.select(t<2.15?0:t<2.5?1:2);
  }
  product.render();
 }
 function syncScroll(){
  if(!master||mode==='static')return;
  ScrollTrigger.update();master.scrollTrigger.getTween()?.progress(1);onMasterUpdate();
 }
 function afterRefresh(){product.measure();requestAnimationFrame(syncScroll);}
 function desktopTimeline(){
  const p=product.poses;
  const tl=gsap.timeline({defaults:{ease:'none'},onUpdate:onMasterUpdate,scrollTrigger:{trigger:'.experience',start:'top top',end:()=>`+=${innerHeight*5.4}`,pin:stage,scrub:.5,anticipatePin:1,invalidateOnRefresh:true,onRefresh:afterRefresh}});
  tl.to({}, {duration:1},0)
   .to('.hero-title span:first-child',{y:-85,autoAlpha:0,duration:.75,ease:'power2.in'},1)
   .to('.hero-title span:last-child',{y:95,autoAlpha:0,duration:.75,ease:'power2.in'},1)
   .to('.hero-action',{autoAlpha:0,duration:.4},1)
   .to(p.original,{x:-.08,y:-.02,s:1.06,rz:-18,ry:7,z:35,duration:.75,ease:'power2.inOut'},1)
   .to(p.original,{x:-1.18,y:.1,s:.72,rz:-32,ry:-12,z:-90,duration:1,ease:'power3.inOut'},1.75)
   .to(p.zero,{x:0,y:0,s:1,rz:7,ry:0,z:0,duration:1.12,ease:'power3.inOut'},1.85)
   .to('.hero-background',{backgroundColor:'#005331',duration:1},1.85)
   .fromTo('.zero-title',{y:75,autoAlpha:0},{y:0,autoAlpha:1,duration:.75,ease:'power3.out',immediateRender:false},2.15)
   .to('.zero-title',{y:-80,autoAlpha:0,duration:.7,ease:'power2.in'},3.15)
   .fromTo('.brand-scene',{yPercent:100,y:0},{yPercent:0,y:0,duration:1.05,ease:'power3.inOut',immediateRender:false},3.1)
   .to(p.original,{x:.07,y:.05,s:.61,rz:-6,ry:0,z:0,duration:1.1,ease:'power3.inOut'},3.25)
   .to(p.zero,{x:.3,y:-.025,s:.78,rz:7,ry:0,z:0,duration:1.1,ease:'power3.inOut'},3.25)
   .fromTo('.brand-copy',{y:40,autoAlpha:0},{y:0,autoAlpha:1,duration:.75,ease:'power3.out',immediateRender:false},3.65)
   .fromTo('.product-caption',{y:25,autoAlpha:0},{y:0,autoAlpha:1,duration:.65,stagger:.1,ease:'power3.out',immediateRender:false},3.95)
   .to({}, {duration:.7},4.45)
   .to('.culture-scene',{clipPath:'inset(0 0% 0 0)',duration:1,ease:'power3.inOut'},5.05)
   .to(p.original,{x:-.12,y:.18,s:.53,rz:-11,ry:-5,z:0,duration:1.05,ease:'power3.inOut'},5.05)
   .to(p.zero,{x:1.2,y:-.1,s:.62,rz:24,ry:12,z:-70,duration:1.05,ease:'power3.inOut'},5.05)
   .fromTo('.culture-copy',{y:35,autoAlpha:0},{y:0,autoAlpha:1,duration:.65,ease:'power3.out',immediateRender:false},5.5)
   .fromTo('.campaign-gallery',{y:65,scale:1.04},{y:0,scale:1,duration:.95,ease:'power3.out',immediateRender:false},5.3)
   .to({}, {duration:1.1},6.1)
   .to('.final-scene',{clipPath:'inset(0% 0 0 0)',duration:1,ease:'power3.inOut'},7.45)
   .to(p.original,{x:0,y:0,s:.86,rz:0,ry:0,z:0,duration:1.05,ease:'power3.inOut'},7.45)
   .fromTo('.final-scene h2,.product-controls,.final-link',{y:25,autoAlpha:0},{y:0,autoAlpha:1,duration:.7,stagger:.1,ease:'power3.out',immediateRender:false},8.1)
   .to({}, {duration:1.15},8.85);
  return tl;
 }
 function mobileTimeline(){
  const p=product.poses;
  const tl=gsap.timeline({defaults:{ease:'none'},onUpdate:onMasterUpdate,scrollTrigger:{trigger:stage,start:'top top',end:()=>`+=${stage.scrollHeight-q('.hero-scene').clientHeight}`,scrub:.22,invalidateOnRefresh:true,onRefresh:afterRefresh}});
  tl.to(p.original,{x:-1.2,y:.07,s:.7,rz:-25,ry:-8,z:-45,duration:.4,ease:'power2.inOut'},.25)
   .to(p.zero,{x:0,y:.08,s:.93,rz:8,ry:0,z:0,duration:.4,ease:'power2.inOut'},.3)
   .to(p.original,{x:-.20,y:.17,s:.50,rz:-5,ry:0,z:0,duration:.35,ease:'power2.inOut'},.68)
   .to(p.zero,{x:.20,y:.12,s:.63,rz:5,ry:0,z:0,duration:.35,ease:'power2.inOut'},.68)
   .to(p.original,{x:.28,y:.2,s:.45,rz:-10,ry:0,z:0,duration:.4,ease:'power2.inOut'},1.58)
   .to(p.zero,{x:1.2,y:.04,s:.6,rz:20,ry:8,z:-45,duration:.4,ease:'power2.inOut'},1.58)
   .to(p.original,{x:0,y:.025,s:.88,rz:0,ry:0,z:0,duration:.5,ease:'power2.inOut'},2.45)
   .to({}, {duration:.05},2.95);
  return tl;
 }
 function build(){
  media?.revert();intro?.kill();master=null;product.reset();all('.static-can').forEach(el=>el.remove());
  const staticMode=reduced.matches||!window.gsap||!window.ScrollTrigger;
  document.body.classList.toggle('static-mode',staticMode);
  if(staticMode){mode='static';product.staticFallback();all('.scene').forEach(el=>{el.inert=false;el.removeAttribute('aria-hidden');});setScene('hero');return;}
  gsap.registerPlugin(ScrollTrigger);media=gsap.matchMedia();
  media.add({mobile:'(max-width:760px)',desktop:'(min-width:761px)'},context=>{
   mode=context.conditions.mobile?'mobile':'desktop';product.reset();product.poses.original=makePose(0,mode==='mobile'?.06:0,1,-8);product.poses.zero=makePose(1.15,-.1,.72,25,-8,-60);product.measure();product.render();
   master=mode==='desktop'?desktopTimeline():mobileTimeline();
   intro=gsap.timeline({defaults:{ease:'power3.out'}})
    .from('.hero-background',{opacity:0,duration:.45},0)
    .from('.hero-title span',{y:45,opacity:0,duration:.8,stagger:.1},.25)
    .from('.product-float',{y:55,scale:.96,opacity:0,duration:1},.45)
    .from('.header,.hero-action',{opacity:0,duration:.5,stagger:.15},.6);
   if(scrollY>30)intro.progress(1);
   onMasterUpdate();
   return()=>{master?.kill();intro?.kill();product.switchTimeline?.kill();product.rig.style.transform='';};
  });
  document.fonts.ready.then(()=>ScrollTrigger.refresh());
 }
 all('[data-scene]').forEach(link=>link.addEventListener('click',e=>{
  const scene=link.dataset.scene,target=q('#'+sceneIds[scene]);if(!target)return;e.preventDefault();intro?.progress(1);
  if(mode==='desktop'&&master){const times={hero:0,brand:4.5,culture:6.1,final:8.85};const t=times[scene];window.scrollTo({top:master.scrollTrigger.start+(t/10)*(master.scrollTrigger.end-master.scrollTrigger.start),behavior:'auto'});ScrollTrigger.update();master.scrollTrigger.getTween()?.progress(1);master.time(t);onMasterUpdate();}
  else{target.scrollIntoView({behavior:'auto',block:'start'});if(master){ScrollTrigger.update();master.scrollTrigger.getTween()?.progress(1);onMasterUpdate();}setScene(scene);}
  if(scene!=='hero')target.focus({preventScroll:true});history.replaceState(null,'',scene==='hero'?location.pathname:'#'+sceneIds[scene]);
 }));
 all('[data-product]').filter(el=>el.tagName==='BUTTON').forEach(button=>button.addEventListener('click',()=>product.select(button.dataset.product)));
 all('[data-campaign]').forEach(button=>button.addEventListener('click',()=>gallery.select(+button.dataset.campaign,true)));
 const dragArea=q('.product-interaction');let pointer=null;
 dragArea.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();product.select(e.key==='ArrowRight'?'zero':'original');}});
 dragArea.addEventListener('pointerdown',e=>{if(activeScene!=='final'||mode==='static'||e.button>0)return;pointer={id:e.pointerId,x:e.clientX,y:e.clientY,horizontal:false};});
 dragArea.addEventListener('pointermove',e=>{if(!pointer||pointer.id!==e.pointerId)return;const dx=e.clientX-pointer.x,dy=e.clientY-pointer.y;if(!pointer.horizontal&&Math.abs(dy)>Math.abs(dx)+8){pointer=null;return;}if(Math.abs(dx)>10){pointer.horizontal=true;dragArea.setPointerCapture(e.pointerId);product.dragOffset=clamp(dx,-95,95);product.render();}});
 const finishDrag=e=>{if(!pointer||pointer.id!==e.pointerId)return;const delta=e.clientX-pointer.x;const changed=pointer.horizontal&&Math.abs(delta)>45;pointer=null;product.dragOffset=0;if(changed)product.select(delta<0?'zero':'original');else product.render();};
 dragArea.addEventListener('pointerup',finishDrag);dragArea.addEventListener('pointercancel',()=>{pointer=null;product.dragOffset=0;product.render();});
 let renderQueued=false;
 window.addEventListener('scroll',()=>{
  if(mode==='static'){
   const visible=all('.scene').reduce((best,el)=>Math.abs(el.getBoundingClientRect().top)<Math.abs(best.getBoundingClientRect().top)?el:best);setScene(Object.keys(sceneIds).find(k=>sceneIds[k]===visible.id));return;
  }
  if(mode!=='mobile'||renderQueued)return;renderQueued=true;requestAnimationFrame(()=>{renderQueued=false;product.render();});
 },{passive:true});
 window.addEventListener('pageshow',()=>{if(window.ScrollTrigger&&!reduced.matches)ScrollTrigger.refresh();});
 reduced.addEventListener('change',build);
 build();
 const entry=Object.keys(sceneIds).find(k=>sceneIds[k]===location.hash.slice(1));
 if(entry&&entry!=='hero')document.fonts.ready.then(()=>requestAnimationFrame(()=>q(`a[data-scene="${entry}"]`)?.click()));
})();
