document.getElementById('year').textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header on scroll ---------- */
const header = document.getElementById('header');
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 40);
  backToTop.classList.toggle('visible', y > 500);
}, { passive: true });

/* ---------- Mobile nav ---------- */
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');
navToggle.addEventListener('click', () => {
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => mainNav.classList.remove('open'));
});

/* ---------- Back to top ---------- */
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
});

/* ---------- Scroll cue jumps to next section ---------- */
const scrollCue = document.querySelector('.scroll-cue');
if (scrollCue) {
  scrollCue.addEventListener('click', () => {
    document.getElementById('tentang')?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
  });
}

/* ---------- Scroll reveal ---------- */
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal, .reveal-group').forEach((el) => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal, .reveal-group').forEach((el) => el.classList.add('in-view'));
}

/* ---------- Nav scroll-spy ---------- */
const navLinks = Array.from(mainNav.querySelectorAll('a[href^="#"]'));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

if ('IntersectionObserver' in window && sections.length) {
  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const link = navLinks.find((a) => a.getAttribute('href') === `#${entry.target.id}`);
      if (!link) return;
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

  sections.forEach((section) => spyObserver.observe(section));
}

/* ---------- Hero parallax ---------- */
const hero = document.querySelector('.hero');
if (hero && !reduceMotion) {
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const offset = Math.min(window.scrollY * 0.35, 200);
      hero.style.backgroundPositionY = `${offset}px`;
      ticking = false;
    });
  }, { passive: true });
}

/* ---------- Tilt-on-hover cards ---------- */
if (!reduceMotion && !('ontouchstart' in window)) {
  document.querySelectorAll('.tilt-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty('--ry', `${px * 10}deg`);
      card.style.setProperty('--rx', `${py * -10}deg`);
      card.style.setProperty('--tz', '6px');
    });
    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--tz', '0px');
    });
  });
}
