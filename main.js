document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile menu ---------- */
  const toggle = document.querySelector('.menu-toggle');
  if (toggle) {
    // close the menu when a link is tapped
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.addEventListener('click', () => { toggle.checked = false; });
    });
    // close the menu if the window is resized to desktop width
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) toggle.checked = false;
    });
  }

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Highlight the current page in the nav ---------- */
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = (link.getAttribute('href') || '').split('/').pop();
    link.classList.toggle('active', href === current);
  });

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    '.feature-card, .trainer-card, .news-card, .price-card, .testi-card, .icon-list li'
  );
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (revealTargets.length && 'IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealTargets.forEach(el => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  /* ---------- Helpers for forms ---------- */
  const isEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

  function showMessage(form, text, type) {
    let msg = form.parentElement.querySelector('.form-msg');
    if (!msg) {
      msg = document.createElement('p');
      msg.className = 'form-msg';
      form.insertAdjacentElement('afterend', msg);
    }
    msg.textContent = text;
    msg.className = 'form-msg ' + type;
  }

  /* ---------- Subscribe form (index) ---------- */
  const subForm = document.querySelector('form.sub-form');
  if (subForm) {
    subForm.setAttribute('novalidate', '');
    subForm.addEventListener('submit', e => {
      e.preventDefault();
      const input = subForm.querySelector('input');
      if (!isEmail(input.value)) {
        showMessage(subForm, 'Please enter a valid email address.', 'error');
        input.focus();
        return;
      }
      showMessage(subForm, 'Thanks for subscribing!', 'success');
      subForm.reset();
    });
  }

  /* ---------- Contact form (contact) ---------- */
  const contactForm = document.querySelector('.contact-form form');
  if (contactForm) {
    contactForm.setAttribute('novalidate', '');
    // only the fields marked "required" in the HTML are checked
    const fields = contactForm.querySelectorAll('[required]');

    fields.forEach(f => f.addEventListener('input', () => f.classList.remove('invalid')));

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      let firstBad = null;

      fields.forEach(f => {
        let ok = f.value.trim() !== '';
        if (ok && f.type === 'email') ok = isEmail(f.value);
        f.classList.toggle('invalid', !ok);
        if (!ok && !firstBad) firstBad = f;
      });

      if (firstBad) {
        showMessage(contactForm, 'Please fill in all fields correctly.', 'error');
        firstBad.focus();
        return;
      }

      // No backend yet: this is where you'd send the data (fetch / Formspree etc.)
      showMessage(contactForm, 'Thanks! Your message has been sent.', 'success');
      contactForm.reset();
    });
  }
});
