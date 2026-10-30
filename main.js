import { SITE_CONFIG } from './config.js';

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const toast = $('#toast');
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add('is-visible');
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3500);
}

function prettyAddress(address) {
  return address.length > 18 ? `${address.slice(0, 7)}…${address.slice(-6)}` : address;
}

function applyConfig() {
  const address = SITE_CONFIG.contractAddress.trim();
  $$('[data-ca-short]').forEach((el) => { el.textContent = address ? prettyAddress(address) : 'COMING SOON'; });
  $$('[data-ca-full]').forEach((el) => { el.textContent = address || 'NOT ANNOUNCED YET'; });
  $$('[data-chain]').forEach((el) => { el.textContent = `CHAIN: ${SITE_CONFIG.chain.toUpperCase()}`; });
  $$('[data-link]').forEach((el) => {
    const type = el.dataset.link;
    const link = SITE_CONFIG.links[type]?.trim();
    if (link && /^https:\/\//i.test(link)) {
      el.href = link;
      el.target = '_blank';
      el.rel = 'noopener noreferrer';
      el.removeAttribute('aria-disabled');
      el.title = `Open verified ${type} link`;
    } else {
      el.href = '#';
      el.setAttribute('aria-disabled', 'true');
      el.title = `${type} link has not been configured`;
      el.addEventListener('click', (event) => {
        event.preventDefault();
        showToast(`${type.toUpperCase()} link coming soon. Add the verified URL in src/config.js.`);
      });
    }
  });
}

async function copyContract() {
  const address = SITE_CONFIG.contractAddress.trim();
  if (!address) { showToast('Contract address coming soon. Only trust a verified announcement.'); return; }
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(address);
    showToast('Contract address copied. Double-check it before trading!');
  } catch {
    const input = document.createElement('textarea');
    input.value = address;
    input.style.position = 'fixed';
    input.style.opacity = '0';
    document.body.append(input);
    input.select();
    const copied = document.execCommand('copy');
    input.remove();
    showToast(copied ? 'Contract address copied!' : `Copy the address: ${address}`);
  }
}

function initTheme() {
  const toggle = $('#modeToggle');
  let saved = 'paper';
  try { saved = localStorage.getItem('safu-theme') || 'paper'; } catch {}
  function setTheme(theme) {
    const night = theme === 'night';
    document.documentElement.dataset.theme = night ? 'night' : 'paper';
    toggle.setAttribute('aria-pressed', String(night));
    toggle.setAttribute('aria-label', night ? 'Switch to paper mode' : 'Switch to night mode');
    toggle.querySelector('.mode-emoji').textContent = night ? '☀' : '☾';
    toggle.querySelector('.mode-label').textContent = night ? 'paper mode' : 'night mode';
    try { localStorage.setItem('safu-theme', night ? 'night' : 'paper'); } catch {}
  }
  setTheme(saved);
  toggle.addEventListener('click', () => setTheme(document.documentElement.dataset.theme === 'night' ? 'paper' : 'night'));
}

function initMobileNavigation() {
  const button = $('#menuButton');
  const nav = $('#navLinks');
  const close = () => {
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Open menu');
    nav.classList.remove('open');
  };
  button.addEventListener('click', () => {
    const expanded = button.getAttribute('aria-expanded') === 'true';
    button.setAttribute('aria-expanded', String(!expanded));
    button.setAttribute('aria-label', expanded ? 'Open menu' : 'Close menu');
    nav.classList.toggle('open', !expanded);
  });
  nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
  document.addEventListener('click', (event) => { if (!nav.contains(event.target) && !button.contains(event.target)) close(); });
}

const memes = [
  { src: './assets/gallery-01.webp', title: 'BAGS? CHECK. VIBES? IMMACULATE.', alt: 'CZ and Yi He inspired cartoon characters lounging on gold coins.' },
  { src: './assets/gallery-02.webp', title: 'NOT TODAY, HACKERS.', alt: 'Cartoon characters protecting a crypto vault from miniature hackers.' },
  { src: './assets/gallery-03.webp', title: 'CRAYONS TO THE MOON.', alt: 'Rocket spaceship with cartoon meme characters blasting through space.' },
  { src: './assets/gallery-04.webp', title: 'MAXIMUM CHILL MODE.', alt: 'Cartoon characters chilling on the couch with pizza and a sleepy dog.' },
];

function initLightbox() {
  const dialog = $('#lightbox');
  const image = $('#lightboxImage');
  const caption = $('#lightboxCaption');
  let index = 0;
  function display(i) {
    index = (i + memes.length) % memes.length;
    image.src = memes[index].src;
    image.alt = memes[index].alt;
    caption.textContent = `${String(index + 1).padStart(2, '0')} / ${String(memes.length).padStart(2, '0')} — ${memes[index].title}`;
  }
  $$('[data-gallery-index]').forEach((button) => button.addEventListener('click', () => {
    display(Number(button.dataset.galleryIndex));
    if (typeof dialog.showModal === 'function') dialog.showModal();
  }));
  $('#lightboxClose').addEventListener('click', () => dialog.close());
  $('#lightboxPrev').addEventListener('click', () => display(index - 1));
  $('#lightboxNext').addEventListener('click', () => display(index + 1));
  dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') display(index - 1);
    if (event.key === 'ArrowRight') display(index + 1);
  });
}

function initEffects() {
  document.documentElement.classList.add('has-js');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { entry.target.classList.add('is-in-view'); observer.unobserve(entry.target); }
      });
    }, { rootMargin: '0px 0px -45px 0px', threshold: 0.08 });
    $$('.reveal').forEach((item) => observer.observe(item));
  } else {
    $$('.reveal').forEach((item) => item.classList.add('is-in-view'));
  }
  let scheduled = false;
  const updateProgress = () => {
    scheduled = false;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    $('#readingProgress').style.transform = `scaleX(${Math.min(1, window.scrollY / maxScroll)})`;
    $('.site-header').classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; window.requestAnimationFrame(updateProgress); }
  }, { passive: true });
  updateProgress();
}

function init() {
  applyConfig();
  initTheme();
  initMobileNavigation();
  initLightbox();
  initEffects();
  $('#year').textContent = String(new Date().getFullYear());
  $('#heroContract').addEventListener('click', copyContract);
  $('#copyContract').addEventListener('click', copyContract);
}

init();
