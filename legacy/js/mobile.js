/**
 * AURELIA — Mobile Vertical Scrollytelling
 * Snap-scroll chapters with progress dots and drawer nav
 */

(function () {
  'use strict';

  const MQ = window.matchMedia('(max-width: 1023px)');
  if (!MQ.matches) return;

  const scrollContainer = document.querySelector('.mob-scroll-container');
  const chapters = document.querySelectorAll('.mob-chapter');
  const dots = document.querySelectorAll('.mob-progress-dots span');
  const header = document.querySelector('.mob-header');
  const menuBtn = document.querySelector('.mob-menu-btn');
  const drawer = document.querySelector('.mob-drawer');
  const drawerClose = document.querySelector('.mob-drawer-close');
  const drawerLinks = document.querySelectorAll('.mob-drawer a');

  if (!scrollContainer || !chapters.length) return;

  let currentChapter = 0;

  function getActiveChapter() {
    const scrollTop = scrollContainer.scrollTop;
    const viewportHeight = scrollContainer.clientHeight;
    const index = Math.round(scrollTop / viewportHeight);
    return Math.max(0, Math.min(index, chapters.length - 1));
  }

  function updateUI() {
    const active = getActiveChapter();
    if (active === currentChapter) return;
    currentChapter = active;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentChapter);
    });

    if (header) {
      header.classList.toggle('scrolled', currentChapter > 0);
    }
  }

  function observeChapters() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            entry.target.classList.add('in-view');
          }
        });
      },
      {
        root: scrollContainer,
        threshold: [0.5],
      }
    );

    chapters.forEach((chapter) => observer.observe(chapter));
  }

  function openDrawer() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    menuBtn.classList.add('active');
    menuBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    menuBtn.classList.remove('active');
    menuBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  }

  function scrollToChapter(index) {
    const chapter = chapters[index];
    if (chapter) {
      chapter.scrollIntoView({ behavior: 'smooth' });
    }
  }

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const href = link.getAttribute('href');
      const target = document.querySelector(href);
      closeDrawer();
      if (target) {
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' });
        }, 400);
      }
    });
  });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => scrollToChapter(i));
  });

  let scrollRaf;
  scrollContainer.addEventListener('scroll', () => {
    cancelAnimationFrame(scrollRaf);
    scrollRaf = requestAnimationFrame(updateUI);
  }, { passive: true });

  observeChapters();
  chapters[0].classList.add('in-view');
  if (dots[0]) dots[0].classList.add('active');
})();
