(()=>{
  if(window.__selfloPublicShell)return;window.__selfloPublicShell=true;
  const script=document.currentScript;
  const root=new URL('../',script.src);
  const asset=name=>new URL(`assets/${name}`,root).href;
  const page=name=>new URL(name,root).href;
  const css=document.createElement('link');css.rel='stylesheet';css.href=asset('public-shell.css');document.head.append(css);
  const path=location.pathname.replace(/index\.html$/,'');
  if(/\/about\/?$/.test(path)){location.replace(`${page('')}#ve-selflo`);return}
  const active=/\/perspectives\//.test(path)?'perspectives':/\/privacy\//.test(path)?'privacy':/\/support\//.test(path)?'support':'home';
  const link=(key,label,href)=>`<a class="${active===key?'active':''}" data-shell-route="${key}" href="${href}">${label}</a>`;
  const header=document.createElement('header');header.className='selflo-site-header';header.innerHTML=`<a class="selflo-shell-brand" href="${page('')}" aria-label="Selflo — Trang chủ"><img src="${page('assets/images/public/selflo-leaf-mark.svg')}" alt=""><span>Selflo</span></a><button class="selflo-shell-toggle" type="button" aria-label="Mở điều hướng" aria-expanded="false">☰</button><nav aria-label="Điều hướng chính">${link('home','Trang chủ',page(''))}${link('perspectives','Góc nhìn',page('perspectives/'))}${link('support','Hỗ trợ',page('support/'))}${link('privacy','Quyền riêng tư',page('privacy/'))}</nav><span class="selflo-store"> &nbsp; App Store · Sắp ra mắt</span>`;
  const oldHeader=document.body.querySelector(':scope > header');if(oldHeader)oldHeader.replaceWith(header);else document.body.prepend(header);
  const footer=document.createElement('footer');footer.className='selflo-site-footer';footer.innerHTML=`<div><a class="selflo-shell-brand" href="${page('')}"><img src="${page('assets/images/public/selflo-leaf-mark.svg')}" alt=""><span>Selflo</span></a><small>Lắng nghe chính mình.</small></div><nav><a href="${page('')}">Trang chủ</a><a href="${page('perspectives/')}">Góc nhìn</a><a href="${page('support/')}">Hỗ trợ</a><a href="${page('privacy/')}">Quyền riêng tư</a><a href="https://www.facebook.com/profile.php?id=61595002766763">Facebook</a></nav>`;
  const oldFooter=document.body.querySelector(':scope > footer');if(oldFooter)oldFooter.replaceWith(footer);else document.body.append(footer);
  const toggle=header.querySelector('.selflo-shell-toggle');toggle.addEventListener('click',()=>{const open=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!open));header.querySelector('nav').classList.toggle('open',!open)});
  const aboutSection=document.querySelector('.promise');if(aboutSection&&!aboutSection.id)aboutSection.id='ve-selflo';
  const heroCard=document.querySelector('.hero .perspective-card');if(heroCard){heroCard.className='selflo-phone-hero';heroCard.innerHTML=`<img src="${page('assets/images/public/selflo-phone-hero.svg')}" alt="Selflo trên iPhone">`}
})();
