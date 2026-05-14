

(function () {
  'use strict';

  /* ─── DOM READY ─── */
  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    initScrollAnimations();
    initCounters();
    initTestimonials();
    initBackToTop();
    initCourseImages();
    initCourseTabs();
  });

  /* ═══════════════════════════════════════════════════
     NAVBAR — sticky + mobile toggle
  ═══════════════════════════════════════════════════ */
  function initNavbar() {
    var nav       = document.getElementById('mainNav');
    var toggle    = document.getElementById('navToggle');
    var navLinks  = document.getElementById('navLinks');

    /* Scroll class */
    window.addEventListener('scroll', function () {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }, { passive: true });

    /* Mobile toggle */
    if (toggle && navLinks) {
      toggle.addEventListener('click', function () {
        var isOpen = navLinks.classList.toggle('open');
        toggle.classList.toggle('open', isOpen);
        toggle.setAttribute('aria-expanded', isOpen);
      });

      /* Close on link click */
      var links = navLinks.querySelectorAll('a');
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
        });
      });

      /* Close on outside click */
      document.addEventListener('click', function (e) {
        if (!nav.contains(e.target)) {
          navLinks.classList.remove('open');
          toggle.classList.remove('open');
        }
      });
    }

    /* Active link highlight on scroll */
    var sections = document.querySelectorAll('section[id], footer[id]');
    window.addEventListener('scroll', function () {
      var scrollY = window.scrollY + 90;
      sections.forEach(function (section) {
        var top    = section.offsetTop;
        var height = section.offsetHeight;
        var id     = section.getAttribute('id');
        var link   = navLinks ? navLinks.querySelector('a[href="#' + id + '"]') : null;
        if (link) {
          if (scrollY >= top && scrollY < top + height) {
            link.style.color = 'var(--ri-teal)';
          } else {
            link.style.color = '';
          }
        }
      });
    }, { passive: true });
  }

  /* ═══════════════════════════════════════════════════
     SCROLL ANIMATIONS — IntersectionObserver
  ═══════════════════════════════════════════════════ */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('[data-animate]');

    if (!elements.length) return;

    /* Apply animation delay from data-delay attribute */
    elements.forEach(function (el) {
      var delay = el.getAttribute('data-delay');
      if (delay) {
        el.style.transitionDelay = delay + 'ms';
      }
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  function initCounters() {
    var counters = document.querySelectorAll('.ri-stat-num[data-target]');
    if (!counters.length) return;

    var hasStarted = false;

    function startCounting() {
      if (hasStarted) return;
      var statsSection = document.getElementById('stats');
      if (!statsSection) return;

      var rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.85) {
        hasStarted = true;
        counters.forEach(function (counter) {
          animateCounter(counter);
        });
      }
    }

    window.addEventListener('scroll', startCounting, { passive: true });
    startCounting(); /* Run once on load in case already visible */
  }

  function animateCounter(el) {
    var target   = parseInt(el.getAttribute('data-target'), 10);
    var suffix   = el.getAttribute('data-suffix') || '';
    var duration = 2000; /* ms */
    var start    = 0;
    var startTime = null;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var elapsed  = timestamp - startTime;
      var progress = Math.min(elapsed / duration, 1);
      var eased    = easeOutCubic(progress);
      var current  = Math.floor(eased * target);

      el.textContent = current.toLocaleString('en-IN') + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target.toLocaleString('en-IN') + suffix;
      }
    }

    requestAnimationFrame(step);
  }


  function initTestimonials() {
    var cards    = document.querySelectorAll('.ri-testimonial-card');
    var dots     = document.querySelectorAll('.ri-dot');
    var prevBtn  = document.getElementById('testiPrev');
    var nextBtn  = document.getElementById('testiNext');

    if (!cards.length) return;

    var current = 0;
    var total   = cards.length;
    var autoTimer;

    function showSlide(index) {
      cards.forEach(function (card, i) {
        card.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
      current = index;
    }

    function nextSlide() {
      showSlide((current + 1) % total);
    }

    function prevSlide() {
      showSlide((current - 1 + total) % total);
    }

    function startAuto() {
      autoTimer = setInterval(nextSlide, 5000);
    }

    function resetAuto() {
      clearInterval(autoTimer);
      startAuto();
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        nextSlide();
        resetAuto();
      });
    }
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        prevSlide();
        resetAuto();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        showSlide(i);
        resetAuto();
      });
    });

    startAuto();
  }

 
  function initCourseImages() {
    var imageMap = {
      'physiotherapy':       './images/courses/Physiotherapy.jpg',
      'paramedical':         './images/courses/Paramedical.jpg',
      'nursing':             './images/courses/Nursing.jpg',
      'management':          './images/courses/Management.jpg',
      'occupational-therapy':'./images/courses/Occupational%20Therapy.jpg'
    };

    var cards = document.querySelectorAll('#coursesGrid .ri-course-card[data-category]');
    cards.forEach(function (card) {
      var src = imageMap[card.getAttribute('data-category')];
      if (!src) return;
      var wrap = card.querySelector('.ri-course-img-wrap');
      if (wrap) wrap.innerHTML = '<img src="' + src + '" alt="" loading="lazy">';
    });
  }

  function initCourseTabs() {
    var tabs  = document.querySelectorAll('.ri-tab');
    var cards = document.querySelectorAll('#coursesGrid .ri-course-card');

    if (!tabs.length) return;

    var isMobile = window.innerWidth <= 767;

    function updateCourseCards(filter) {
      cards.forEach(function (card) {
        var cat   = card.getAttribute('data-category');
        var isCta = card.classList.contains('ri-course-card--cta');
        var show  = filter === 'all' || isCta || cat === filter;
        card.style.display = show ? 'flex' : 'none';
      });
    }

    /* On mobile default to Nursing so the section isn’t blank */
    if (isMobile) {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      var nursingTab = document.querySelector('.ri-tab[data-filter="nursing"]');
      if (nursingTab) {
        nursingTab.classList.add('active');
        updateCourseCards('nursing');
      }
    }

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var filter = tab.getAttribute('data-filter');

        tabs.forEach(function (t) { t.classList.remove('active'); });
        tab.classList.add('active');

        updateCourseCards(filter);
      });
    });
  }

  function initBackToTop() {
    var btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

})();