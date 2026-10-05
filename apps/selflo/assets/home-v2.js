const rail=document.querySelector('#screenRail');
document.querySelector('.rail-button.prev')?.addEventListener('click',()=>rail.scrollBy({left:-320,behavior:'smooth'}));
document.querySelector('.rail-button.next')?.addEventListener('click',()=>rail.scrollBy({left:320,behavior:'smooth'}));
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
if(reduced){document.querySelectorAll('.reveal').forEach(item=>item.classList.add('visible'))}else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});document.querySelectorAll('.reveal').forEach(item=>observer.observe(item))}
(()=>{const shell=document.createElement('script');shell.src=new URL('public-shell.js',document.currentScript.src).href;document.body.append(shell)})();
