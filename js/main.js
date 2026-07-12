/* משה תקשורת · site behaviour (vanilla, dependency-free) */
(function () {
  'use strict';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  /* ---------- Header state ---------- */
  var header = $('[data-header]');
  var onScrollHeader = function () {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* ---------- Mobile navigation ---------- */
  var toggle = $('[data-nav-toggle]');
  var navList = $('[data-nav-list]');
  if (toggle && navList && header) {
    var closeNav = function (returnFocus) {
      header.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('nav-locked');
      if (returnFocus) toggle.focus();
    };
    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') === 'true';
      if (open) { closeNav(false); return; }
      header.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.classList.add('nav-locked');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') closeNav(true);
    });
    document.addEventListener('pointerdown', function (e) {
      if (toggle.getAttribute('aria-expanded') !== 'true') return;
      if (navList.contains(e.target) || toggle.contains(e.target)) return;
      closeNav(false);
    });
    $$('a', navList).forEach(function (a) {
      a.addEventListener('click', function () { closeNav(false); });
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealEls = $$('[data-reveal]');
  if (revealEls.length) {
    if (reducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) { el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
      revealEls.forEach(function (el) { io.observe(el); });
    }
  }

  /* ---------- Counters ---------- */
  var counters = $$('[data-count]');
  if (counters.length) {
    var runCounter = function (el) {
      var target = parseInt(el.getAttribute('data-count'), 10) || 0;
      var suffix = el.getAttribute('data-suffix') || '';
      if (reducedMotion) { el.textContent = target.toLocaleString('he-IL') + suffix; return; }
      var dur = 1400;
      var t0 = null;
      var tick = function (t) {
        if (!t0) t0 = t;
        var p = Math.min((t - t0) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased).toLocaleString('he-IL') + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window && !reducedMotion) {
      var cio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { runCounter(entry.target); cio.unobserve(entry.target); }
        });
      }, { threshold: 0.5 });
      counters.forEach(function (el) { cio.observe(el); });
    } else {
      counters.forEach(runCounter);
    }
  }

  /* ---------- Hero video: autoplay politely, pause off-screen ---------- */
  var heroVideo = $('[data-hero-video]');
  if (heroVideo) {
    var saveData = navigator.connection && navigator.connection.saveData;
    var ctrl = $('[data-video-ctrl]');
    var userPaused = false;

    var setCtrl = function (playing) {
      if (!ctrl) return;
      ctrl.setAttribute('data-state', playing ? 'playing' : 'paused');
      ctrl.setAttribute('aria-label', playing ? 'השהיית סרטון הרקע' : 'הפעלת סרטון הרקע');
    };

    var tryPlay = function () {
      var p = heroVideo.play();
      if (p && p.then) p.then(function () { setCtrl(true); }).catch(function () { setCtrl(false); });
      else setCtrl(true);
    };

    if (reducedMotion || saveData) {
      setCtrl(false);
    } else if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (userPaused) return;
          if (entry.isIntersecting) tryPlay();
          else heroVideo.pause();
        });
      }, { threshold: 0.15 });
      vio.observe(heroVideo);
    } else {
      tryPlay();
    }

    if (ctrl) {
      ctrl.addEventListener('click', function () {
        if (heroVideo.paused) { userPaused = false; tryPlay(); }
        else { userPaused = true; heroVideo.pause(); setCtrl(false); }
      });
    }
  }

  /* ---------- FAQ: keep a single item open ---------- */
  var faqs = $$('details.faq');
  faqs.forEach(function (d) {
    d.addEventListener('toggle', function () {
      if (d.open) faqs.forEach(function (o) { if (o !== d) o.open = false; });
    });
  });

  /* ---------- Services page scrollspy ---------- */
  var jumpLinks = $$('.jump-nav a');
  if (jumpLinks.length && 'IntersectionObserver' in window) {
    var byId = {};
    jumpLinks.forEach(function (a) {
      var id = (a.getAttribute('href') || '').replace('#', '');
      if (id) byId[id] = a;
    });
    var currentId = '';
    var setActive = function (id) {
      if (id === currentId) return;
      currentId = id;
      jumpLinks.forEach(function (a) { a.classList.remove('is-active'); });
      var link = byId[id];
      if (!link) return;
      link.classList.add('is-active');
      var strip = link.closest('ul');
      if (!strip || strip.scrollWidth <= strip.clientWidth) return;
      var delta = (link.getBoundingClientRect().left + link.offsetWidth / 2) -
                  (strip.getBoundingClientRect().left + strip.clientWidth / 2);
      if (strip.scrollBy) strip.scrollBy({ left: delta, behavior: reducedMotion ? 'auto' : 'smooth' });
      else strip.scrollLeft += delta;
    };
    var sio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-38% 0px -52% 0px' });
    Object.keys(byId).forEach(function (id) {
      var sec = document.getElementById(id);
      if (sec) sio.observe(sec);
    });
  }

  /* ---------- Sticky mobile call bar ---------- */
  var stickyBar = $('[data-sticky-call]');
  var waFloat = $('[data-wa-float]');
  if (stickyBar) {
    var onScrollBar = function () {
      var show = window.scrollY > 420;
      stickyBar.classList.toggle('is-visible', show);
      if (waFloat) waFloat.classList.toggle('bar-hidden', !show);
    };
    onScrollBar();
    window.addEventListener('scroll', onScrollBar, { passive: true });
  }

  /* ---------- Contact form → WhatsApp ---------- */
  var form = $('[data-wa-form]');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (form.reportValidity && !form.reportValidity()) return;
      var v = function (name) {
        var f = form.elements[name];
        return f && f.value ? f.value.trim() : '';
      };
      var lines = [
        'שלום, הגעתי דרך האתר של משה תקשורת ואשמח להצעת מחיר.',
        'שם: ' + v('name'),
        'טלפון: ' + v('phone'),
        'תחום: ' + v('topic')
      ];
      var msg = v('message');
      if (msg) lines.push('פרטים: ' + msg);
      var url = 'https://wa.me/972546742162?text=' + encodeURIComponent(lines.join('\n'));
      var win = window.open(url, '_blank');
      if (win) win.opener = null;
    });
  }

  /* ---------- Service card accordions ---------- */
  $$('.card-expand').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* ---------- Footer year ---------- */
  var yearEl = $('[data-year]');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
