/**
 * AURELIA — Desktop Horizontal Scrollytelling
 * Converts vertical scroll into horizontal panel navigation
 */

(function () {
  'use strict';

  const MQ = window.matchMedia('(min-width: 1024px)');
  if (!MQ.matches) return;

  const container = document.querySelector('.desk-scroll-container');
  const panels = document.querySelectorAll('.desk-panel');
  const progressBar = document.querySelector('.desk-progress-bar');
  const nav = document.querySelector('.desk-nav');
  const navLinks = document.querySelectorAll('.desk-nav-links a');
  const experience = document.getElementById('desktop-experience');

  if (!container || !panels.length) return;

  experience.setAttribute('aria-hidden', 'false');

  const totalPanels = panels.length;
  let currentPanel = 0;
  let isScrolling = false;
  let scrollTimeout;

  function getPanelWidth() {
    return window.innerWidth;
  }

  function goToPanel(index, smooth = true) {
    index = Math.max(0, Math.min(index, totalPanels - 1));
    currentPanel = index;

    const offset = -index * getPanelWidth();
    container.style.transition = smooth ? 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)' : 'none';
    container.style.transform = `translateX(${offset}px)`;

    updateProgress();
    updateNav();
    revealPanelContent(panels[index]);
  }

  function updateProgress() {
    const progress = ((currentPanel + 1) / totalPanels) * 100;
    if (progressBar) progressBar.style.width = `${progress}%`;
  }

  function updateNav() {
    navLinks.forEach((link, i) => {
      link.classList.toggle('active', i === currentPanel);
    });
    if (nav) nav.classList.toggle('scrolled', currentPanel > 0);
  }

  function revealPanelContent(panel) {
    const reveals = panel.querySelectorAll('.reveal');
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
      el.classList.add('visible');
    });
  }

  function handleWheel(e) {
    e.preventDefault();
    if (isScrolling) return;

    const delta = e.deltaY || e.deltaX;
    if (Math.abs(delta) < 10) return;

    isScrolling = true;
    clearTimeout(scrollTimeout);

    if (delta > 0 && currentPanel < totalPanels - 1) {
      goToPanel(currentPanel + 1);
    } else if (delta < 0 && currentPanel > 0) {
      goToPanel(currentPanel - 1);
    }

    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 900);
  }

  function handleKeydown(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      goToPanel(currentPanel + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      goToPanel(currentPanel - 1);
    }
  }

  let touchStartY = 0;
  let touchStartX = 0;

  function handleTouchStart(e) {
    touchStartY = e.touches[0].clientY;
    touchStartX = e.touches[0].clientX;
  }

  function handleTouchEnd(e) {
    const touchEndY = e.changedTouches[0].clientY;
    const touchEndX = e.changedTouches[0].clientX;
    const deltaY = touchStartY - touchEndY;
    const deltaX = touchStartX - touchEndX;

    if (Math.abs(deltaY) > 50 || Math.abs(deltaX) > 50) {
      if (deltaY > 0 || deltaX > 0) {
        goToPanel(currentPanel + 1);
      } else {
        goToPanel(currentPanel - 1);
      }
    }
  }

  navLinks.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      goToPanel(i);
    });
  });

  document.querySelectorAll('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = parseInt(btn.dataset.scroll, 10);
      goToPanel(target);
    });
  });

  experience.addEventListener('wheel', handleWheel, { passive: false });
  document.addEventListener('keydown', handleKeydown);
  experience.addEventListener('touchstart', handleTouchStart, { passive: true });
  experience.addEventListener('touchend', handleTouchEnd, { passive: true });

  window.addEventListener('resize', () => {
    goToPanel(currentPanel, false);
  });

  goToPanel(0, false);
  setTimeout(() => revealPanelContent(panels[0]), 300);
})();
