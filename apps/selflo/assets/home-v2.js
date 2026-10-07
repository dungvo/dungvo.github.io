const rail=document.querySelector('#screenRail');
document.querySelector('.rail-button.prev')?.addEventListener('click',()=>rail.scrollBy({left:-320,behavior:'smooth'}));
document.querySelector('.rail-button.next')?.addEventListener('click',()=>rail.scrollBy({left:320,behavior:'smooth'}));
