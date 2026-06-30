/**
 * AURELIA — Main entry
 * Handles experience switching on resize and initial load
 */

(function () {
  'use strict';

  const DESKTOP_BP = 1024;

  function setExperience() {
    const isDesktop = window.innerWidth >= DESKTOP_BP;
    const desktop = document.getElementById('desktop-experience');
    const mobile = document.getElementById('mobile-experience');

    if (desktop) desktop.setAttribute('aria-hidden', isDesktop ? 'false' : 'true');
    if (mobile) mobile.setAttribute('aria-hidden', isDesktop ? 'true' : 'false');
  }

  setExperience();

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const wasDesktop = document.getElementById('desktop-experience')?.getAttribute('aria-hidden') === 'false';
      const isDesktop = window.innerWidth >= DESKTOP_BP;
      if (wasDesktop !== isDesktop) {
        window.location.reload();
      }
    }, 300);
  });
})();
