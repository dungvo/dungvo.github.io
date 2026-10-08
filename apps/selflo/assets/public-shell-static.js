(() => {
  const header = document.querySelector('.selflo-site-header');
  const toggle = header?.querySelector('.selflo-shell-toggle');
  const navigation = header?.querySelector('nav');
  if (!toggle || !navigation) return;
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!open));
    navigation.classList.toggle('open', !open);
  });
})();
