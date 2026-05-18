(function () {
  "use strict";

  var header = document.getElementById("site-top");
  var navToggle = document.getElementById("navToggle");
  var navLinks = document.querySelectorAll("[data-nav]");

  var sectionIds = ["summary", "competencies", "experience", "achievements", "credentials", "roles"];
  var sections = sectionIds
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);

  /* 내비 클릭 후 smooth scroll 동안 IO가 이웃 섹션을 골라 is-active 가 옮겨가는 현상 방지 */
  var navJumpLock = false;
  var navJumpTimer = null;
  var navJumpScrollEndHandler = null;

  function releaseNavJumpLock() {
    navJumpLock = false;
    if (navJumpTimer) {
      clearTimeout(navJumpTimer);
      navJumpTimer = null;
    }
    if (navJumpScrollEndHandler) {
      window.removeEventListener("scrollend", navJumpScrollEndHandler);
      navJumpScrollEndHandler = null;
    }
  }

  function armNavJumpLock() {
    releaseNavJumpLock();
    navJumpLock = true;
    navJumpScrollEndHandler = function () {
      releaseNavJumpLock();
    };
    window.addEventListener("scrollend", navJumpScrollEndHandler, { passive: true });
    navJumpTimer = setTimeout(releaseNavJumpLock, 2000);
  }

  function setNavOpen(open) {
    if (!header || !navToggle) return;
    header.classList.toggle("is-nav-open", open);
    navToggle.setAttribute("aria-expanded", open ? "true" : "false");
    navToggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
  }

  if (navToggle && header) {
    navToggle.addEventListener("click", function () {
      var open = !header.classList.contains("is-nav-open");
      setNavOpen(open);
    });
  }

  function closeMobileNav() {
    if (window.matchMedia("(max-width: 56rem)").matches) {
      setNavOpen(false);
    }
  }

  navLinks.forEach(function (link) {
    link.addEventListener("click", function (e) {
      var href = link.getAttribute("href");
      if (!href || href.charAt(0) !== "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var id = href.slice(1);
      if (sectionIds.indexOf(id) !== -1) {
        setActiveNav(id);
        armNavJumpLock();
      }
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMobileNav();
      history.pushState(null, "", href);
    });
  });

  /* 맨 위로: #top 은 일부 브라우저에서 예약된 프래그먼트로 취급될 수 있어 #site-top + 스크롤 보강 */
  function scrollToPageTop(e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var reduceMotion =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var behavior = reduceMotion ? "auto" : "smooth";
    window.scrollTo({ top: 0, left: 0, behavior: behavior });
    closeMobileNav();
    try {
      history.pushState(null, "", "#site-top");
    } catch (err) {
      try {
        location.hash = "#site-top";
      } catch (err2) {
        /* file:// 등에서 해시 설정이 막힐 수 있음 — 스크롤만으로 충분 */
      }
    }
  }

  var scrollTopLink = document.getElementById("scroll-to-top-link");
  if (scrollTopLink) {
    scrollTopLink.addEventListener("click", scrollToPageTop, true);
  }

  function setActiveNav(id) {
    navLinks.forEach(function (link) {
      var href = link.getAttribute("href");
      if (href === "#" + id) {
        link.classList.add("is-active");
      } else {
        link.classList.remove("is-active");
      }
    });
  }

  if ("IntersectionObserver" in window && sections.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        if (navJumpLock) return;
        var visible = entries
          .filter(function (en) {
            return en.isIntersecting;
          })
          .sort(function (a, b) {
            return b.intersectionRatio - a.intersectionRatio;
          });
        if (visible.length && visible[0].target.id) {
          setActiveNav(visible[0].target.id);
        }
      },
      {
        root: null,
        rootMargin: "-20% 0px -55% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach(function (sec) {
      observer.observe(sec);
    });
  }

  setActiveNav("summary");

  /* scroll reveal */
  var revealGroups = document.querySelectorAll(".reveal-group");
  if ("IntersectionObserver" in window && revealGroups.length) {
    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inview");
            obs.unobserve(entry.target);
          }
        });
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealGroups.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealGroups.forEach(function (el) {
      el.classList.add("is-inview");
    });
  }

  /* hero visible on load */
  var hero = document.querySelector(".hero.reveal-group");
  if (hero) {
    hero.classList.add("is-inview");
  }
})();
