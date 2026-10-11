(() => {
  const toggle = document.querySelector('.selflo-shell-toggle');
  const nav = document.querySelector('.selflo-site-header nav');
  toggle?.addEventListener('click', () => { const open = toggle.getAttribute('aria-expanded') === 'true'; toggle.setAttribute('aria-expanded', String(!open)); nav?.classList.toggle('open', !open); });
  document.querySelectorAll('.faq-list details').forEach(item => item.addEventListener('toggle', () => { item.querySelector('summary b').textContent = item.open ? '−' : '＋'; }));
  const search = document.querySelector('#supportSearch');
  search?.addEventListener('input', event => {
    const normalize = value => value.toLocaleLowerCase('vi').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const query = normalize(event.target.value);
    let visible = 0;
    document.querySelectorAll('.faq-list details').forEach(item => { const match = !query || normalize(`${item.textContent} ${item.dataset.search}`).includes(query); item.hidden = !match; if (match) visible += 1; });
    document.querySelector('.no-results').hidden = visible > 0;
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.target.classList.toggle('is-visible', entry.isIntersecting)), {threshold:.08,rootMargin:'0px 0px -5%'});
  document.querySelectorAll('.support-hero,.support-cards a,.privacy-main,.privacy-features article,.faq,.contact-grid,.support-cta').forEach(element => { element.classList.add('selflo-scroll-reveal'); observer.observe(element); });
})();
