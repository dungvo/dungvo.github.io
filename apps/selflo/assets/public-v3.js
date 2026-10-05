(() => {
  const toggle = document.querySelector('.v3-menu-toggle');
  const nav = document.querySelector('.v3-nav');
  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => entry.target.classList.toggle('visible', entry.isIntersecting));
  }, { threshold: .08 });
  document.querySelectorAll('.v3-reveal').forEach(element => observer.observe(element));

  const query = document.querySelector('#supportSearch');
  query?.addEventListener('input', () => {
    const term = query.value.toLocaleLowerCase('vi');
    document.querySelectorAll('.v3-faq details').forEach(item => {
      item.hidden = term && !item.textContent.toLocaleLowerCase('vi').includes(term);
    });
  });
})();
