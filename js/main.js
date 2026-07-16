(function () {
  "use strict";

  const THEME_KEY = "hqpromo-theme";
  const PROCESS_POLYGON_ACTIVE = "assets/process/polygon-active.svg";
  const PROCESS_POLYGON_ACTIVE_DARK = "assets/process/polygon-active-dark.svg";

  const isDarkTheme = () =>
    document.documentElement.getAttribute("data-theme") === "dark";

  const syncPlatformPolygons = () => {
    const dark = isDarkTheme();
    document.querySelectorAll(".platform-tab").forEach((tab) => {
      const img = tab.querySelector(".platform-tab__polygon");
      if (!img) return;
      const current = img.getAttribute("src") || "";
      const dir = current.slice(0, current.lastIndexOf("/") + 1);
      img.src =
        dir +
        (!dark || tab.classList.contains("is-active")
          ? "polygon.svg"
          : "polygon-dark.svg");
    });
  };

  const syncProcessPolygons = () => {
    const src = isDarkTheme()
      ? PROCESS_POLYGON_ACTIVE_DARK
      : PROCESS_POLYGON_ACTIVE;
    document.querySelectorAll(".process__icon-bg--active").forEach((img) => {
      img.src = src;
    });
  };

  /* Set active state among sibling tabs and refresh polygons */
  const setActiveTab = (tabsRoot, activeTab, selector = ".platform-tab") => {
    if (!tabsRoot || !activeTab) return;
    tabsRoot.querySelectorAll(selector).forEach((button) => {
      const active = button === activeTab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });
    syncPlatformPolygons();
  };

  /* Theme */
  const themeToggles = document.querySelectorAll("[data-theme-toggle]");

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("theme-dark", isDark);
    syncPlatformPolygons();
    syncProcessPolygons();

    themeToggles.forEach((toggle) => {
      const label = toggle.querySelector("[data-theme-label]");
      toggle.classList.toggle("is-dark", isDark);
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light theme" : "Switch to dark theme"
      );
      if (label) label.textContent = isDark ? "Dark" : "Light";
    });
  };

  const storedTheme = localStorage.getItem(THEME_KEY);
  applyTheme(
    storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light"
  );

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const next = isDarkTheme() ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  });

  /* Password show / hide */
  document.querySelectorAll("[data-password-toggle]").forEach((passwordToggle) => {
    const wrap = passwordToggle.closest(
      ".sign-in-field__input-wrap, .auth-input"
    );
    const passwordInput = wrap
      ? wrap.querySelector('input[type="password"], input[type="text"]')
      : document.getElementById("password");
    if (!passwordInput) return;

    const eyeIcons = passwordToggle.querySelectorAll("[data-eye-icon], img");

    passwordToggle.addEventListener("click", () => {
      const show = passwordInput.type === "password";
      passwordInput.type = show ? "text" : "password";
      passwordToggle.setAttribute("aria-pressed", String(show));
      passwordToggle.setAttribute(
        "aria-label",
        show ? "Hide password" : "Show password"
      );
      passwordToggle.classList.toggle("is-visible", show);

      eyeIcons.forEach((eyeIcon) => {
        const current = eyeIcon.getAttribute("src") || "";
        if (!/eye(-off)?(-light)?\.svg/i.test(current)) return;
        eyeIcon.src = show
          ? current
              .replace(/eye-off-light\.svg$/i, "eye-light.svg")
              .replace(/eye-off\.svg$/i, "eye.svg")
          : current
              .replace(/eye-light\.svg$/i, "eye-off-light.svg")
              .replace(/eye\.svg$/i, "eye-off.svg");
      });
    });
  });

  /* Mobile nav */
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.getElementById("mobileNav");

  if (navToggle && mobileNav) {
    const setNavOpen = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      mobileNav.hidden = !open;
      document.body.classList.toggle("is-nav-open", open);
    };

    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      setNavOpen(navToggle.getAttribute("aria-expanded") !== "true");
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !mobileNav.hidden) {
        setNavOpen(false);
        navToggle.focus();
      }
    });

    document.addEventListener("click", (event) => {
      if (
        mobileNav.hidden ||
        mobileNav.contains(event.target) ||
        navToggle.contains(event.target)
      ) {
        return;
      }
      setNavOpen(false);
    });

    window.addEventListener("resize", () => {
      if (
        window.matchMedia("(min-width: 992px)").matches &&
        !mobileNav.hidden
      ) {
        setNavOpen(false);
      }
    });
  }

  /* Sign-in form (client-side empty check only) */
  const form = document.getElementById("signin");
  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = form.querySelector("#username");
      const password = form.querySelector("#password");

      [username, password].forEach((field) => {
        if (!field) return;
        field
          .closest(".auth-input")
          ?.classList.toggle("is-invalid", !field.value.trim());
      });

      if (username?.value.trim() && password?.value.trim()) {
        form.classList.add("is-submitted");
      }
    });
  }

  /* Plans swiper + platform tabs (card HTML is static) */
  const platformTabs = document.querySelector("[data-platform-tabs]");
  const plansWrapper = document.querySelector("[data-plans-wrapper]");
  const plansSwiperEl = document.querySelector("[data-plans-swiper]");

  if (plansSwiperEl && typeof Swiper !== "undefined") {
    new Swiper(plansSwiperEl, {
      slidesPerView: 1.15,
      spaceBetween: 16,
      slidesPerGroup: 1,
      speed: 500,
      watchOverflow: true,
      centeredSlides: true,
      centeredSlidesBounds: true,
      pagination: {
        el: ".plans-swiper__pagination",
        clickable: true,
      },
      breakpoints: {
        576: {
          slidesPerView: 1.2,
          spaceBetween: 16,
          centeredSlides: true,
          centeredSlidesBounds: true,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
          centeredSlides: false,
          centeredSlidesBounds: false,
        },
        1200: {
          slidesPerView: 3,
          spaceBetween: 32,
          centeredSlides: false,
          centeredSlidesBounds: false,
        },
      },
    });
  }

  platformTabs?.addEventListener("click", (event) => {
    const tab = event.target.closest(".platform-tab");
    if (!tab || !platformTabs.contains(tab)) return;

    setActiveTab(platformTabs, tab);

    const label = tab.dataset.label || "Twitter";
    const icon = tab.dataset.icon || "assets/platforms/twitter-x.png";
    plansWrapper?.querySelectorAll("[data-plan-name]").forEach((el) => {
      el.textContent = label;
    });
    plansWrapper?.querySelectorAll("[data-plan-icon]").forEach((el) => {
      el.setAttribute("src", icon);
    });
  });

  /* Platform panel tabs — panel HTML is static; JS only shows/hides */
  const panelTabs = document.querySelector("[data-panel-tabs]");
  const platformPanels = document.querySelectorAll("[data-platform-panel]");

  panelTabs?.addEventListener("click", (event) => {
    const tab = event.target.closest(".platform-tab");
    if (!tab || !panelTabs.contains(tab)) return;

    setActiveTab(panelTabs, tab);

    const platform = tab.dataset.platform || "";
    platformPanels.forEach((panel) => {
      panel.hidden = panel.dataset.platformPanel !== platform;
    });
  });

  /* Services accordion / filter / search */
  const servicesPlatformTabs = document.querySelector(
    "[data-services-platform-tabs]"
  );
  const serviceAccordion = document.querySelector("[data-service-accordion]");
  const filterDropdown = document.querySelector("[data-filter-dropdown]");
  const servicesSearch = document.querySelector("[data-services-search]");

  const setServiceGroupOpen = (group, open) => {
    if (!group) return;
    const header = group.querySelector(".service-group__header");
    group.classList.toggle("is-open", open);
    header?.setAttribute("aria-expanded", String(open));
  };

  serviceAccordion
    ?.querySelectorAll("[data-service-group]")
    .forEach((group) => {
      const header = group.querySelector(".service-group__header");
      header?.addEventListener("click", () => {
        setServiceGroupOpen(group, !group.classList.contains("is-open"));
      });
    });

  servicesPlatformTabs?.addEventListener("click", (event) => {
    const tab = event.target.closest(".platform-tab");
    if (!tab || !servicesPlatformTabs.contains(tab)) return;

    setActiveTab(servicesPlatformTabs, tab);

    const targetGroup = document.getElementById(tab.dataset.target || "");
    if (!targetGroup) return;
    setServiceGroupOpen(targetGroup, true);
    targetGroup.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  if (filterDropdown) {
    const filterToggle = filterDropdown.querySelector("[data-filter-toggle]");
    const filterMenu = filterDropdown.querySelector("[data-filter-menu]");
    const filterLabel = filterDropdown.querySelector("[data-filter-label]");

    const closeFilterMenu = () => {
      filterToggle?.setAttribute("aria-expanded", "false");
      if (filterMenu) filterMenu.hidden = true;
    };

    filterToggle?.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = filterToggle.getAttribute("aria-expanded") === "true";
      filterToggle.setAttribute("aria-expanded", String(!open));
      if (filterMenu) filterMenu.hidden = open;
    });

    filterMenu?.addEventListener("click", (event) => {
      const option = event.target.closest("[data-filter]");
      if (!option || !filterMenu.contains(option)) return;

      const filter = option.dataset.filter || "all";
      filterMenu.querySelectorAll("[data-filter]").forEach((item) => {
        item.classList.toggle("is-active", item === option);
      });

      if (filterLabel) {
        filterLabel.textContent =
          filter === "all" ? "Filter Categories" : option.textContent.trim();
      }

      serviceAccordion
        ?.querySelectorAll("[data-service-group]")
        .forEach((group) => {
          const match =
            filter === "all" || group.dataset.platform === filter;
          group.classList.toggle("is-filtered-out", !match);
          if (match && filter !== "all") setServiceGroupOpen(group, true);
        });

      servicesPlatformTabs?.querySelectorAll(".platform-tab").forEach((button) => {
        const active =
          filter !== "all" && button.dataset.platform === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });
      syncPlatformPolygons();
      closeFilterMenu();
    });

    document.addEventListener("click", (event) => {
      if (!filterDropdown.contains(event.target)) closeFilterMenu();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeFilterMenu();
    });
  }

  if (servicesSearch && serviceAccordion) {
    servicesSearch.addEventListener("input", () => {
      const query = servicesSearch.value.trim().toLowerCase();
      serviceAccordion
        .querySelectorAll("[data-service-group]")
        .forEach((group) => {
          const title =
            group.querySelector(".service-group__title")?.textContent || "";
          group.classList.toggle(
            "is-filtered-out",
            Boolean(query) && !title.toLowerCase().includes(query)
          );
        });
    });
  }

  /* Client reviews → shorts modal */
  const shortsModal = document.getElementById("shortsModal");
  const shortsVideo = document.getElementById("shortsVideo");
  const shortsAvatar = document.getElementById("shortsAvatar");
  const shortsTitle = document.getElementById("shortsModalTitle");
  const shortsRole = document.getElementById("shortsRole");
  const shortsQuote = document.getElementById("shortsQuote");
  const shortsProgress = document.getElementById("shortsProgress");
  let shortsLastFocus = null;

  const setShortsPaused = (paused) => {
    shortsModal?.classList.toggle("is-paused", paused);
  };

  const tryPlayShorts = () => {
    if (!shortsVideo) return;
    const playPromise = shortsVideo.play();
    if (playPromise?.then) {
      playPromise
        .then(() => setShortsPaused(false))
        .catch(() => setShortsPaused(true));
    } else {
      setShortsPaused(false);
    }
  };

  const openShortsModal = (card) => {
    if (!shortsModal || !shortsVideo || !card) return;

    shortsLastFocus = document.activeElement;

    if (shortsAvatar && card.dataset.reviewAvatar) {
      shortsAvatar.src = card.dataset.reviewAvatar;
    }
    if (shortsTitle) {
      shortsTitle.textContent = card.dataset.reviewName || "[Customer Name]";
    }
    if (shortsRole) {
      shortsRole.textContent = card.dataset.reviewRole || "[Role, City]";
    }
    if (shortsQuote) {
      shortsQuote.textContent =
        card.dataset.reviewText ||
        "Add a real customer testimonial here once available.";
    }

    shortsVideo.pause();
    shortsVideo.removeAttribute("src");
    shortsVideo.poster = card.dataset.reviewPoster || "";
    shortsVideo.src = card.dataset.reviewVideo || "";
    shortsVideo.load();
    if (shortsProgress) shortsProgress.style.width = "0%";

    shortsModal.hidden = false;
    document.body.classList.add("is-shorts-open");
    setShortsPaused(true);
    tryPlayShorts();
    shortsModal.querySelector(".shorts-modal__close")?.focus();
  };

  const closeShortsModal = () => {
    if (!shortsModal || shortsModal.hidden) return;

    if (shortsVideo) {
      shortsVideo.pause();
      shortsVideo.removeAttribute("src");
      shortsVideo.load();
    }
    if (shortsProgress) shortsProgress.style.width = "0%";

    shortsModal.hidden = true;
    document.body.classList.remove("is-shorts-open");
    setShortsPaused(true);
    shortsLastFocus?.focus?.();
  };

  const toggleShortsPlayback = () => {
    if (!shortsVideo) return;
    if (shortsVideo.paused) tryPlayShorts();
    else {
      shortsVideo.pause();
      setShortsPaused(true);
    }
  };

  document
    .querySelector(".client-reviews__marquee")
    ?.addEventListener("click", (event) => {
      const playBtn = event.target.closest(".review-clip__play");
      if (!playBtn) return;
      event.preventDefault();
      openShortsModal(playBtn.closest(".review-clip"));
    });

  shortsModal?.querySelectorAll("[data-shorts-close]").forEach((el) => {
    el.addEventListener("click", closeShortsModal);
  });
  shortsModal
    ?.querySelector("[data-shorts-toggle]")
    ?.addEventListener("click", toggleShortsPlayback);

  shortsVideo?.addEventListener("play", () => setShortsPaused(false));
  shortsVideo?.addEventListener("pause", () => {
    if (!shortsModal?.hidden) setShortsPaused(true);
  });
  shortsVideo?.addEventListener("ended", () => {
    setShortsPaused(true);
    if (shortsProgress) shortsProgress.style.width = "100%";
  });
  shortsVideo?.addEventListener("timeupdate", () => {
    if (!shortsVideo || !shortsProgress || !shortsVideo.duration) {
      if (shortsProgress) shortsProgress.style.width = "0%";
      return;
    }
    const pct = (shortsVideo.currentTime / shortsVideo.duration) * 100;
    shortsProgress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeShortsModal();
    if (event.key !== " " || !shortsModal || shortsModal.hidden) return;
    const tag = event.target?.tagName || "";
    if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
    event.preventDefault();
    toggleShortsPlayback();
  });

  /* FAQ tabs */
  const faqTabs = document.querySelector("[data-faq-tabs]");
  const faqPanels = document.querySelectorAll("[data-faq-panel]");

  const activateFaqTab = (tab) => {
    if (!faqTabs || !tab?.dataset.faqTab) return;
    const key = tab.dataset.faqTab;

    faqTabs.querySelectorAll("[data-faq-tab]").forEach((btn) => {
      const active = btn === tab;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-selected", String(active));
      btn.tabIndex = active ? 0 : -1;
    });

    faqPanels.forEach((panel) => {
      const match = panel.dataset.faqPanel === key;
      panel.classList.toggle("is-active", match);
      panel.hidden = !match;
    });
  };

  if (faqTabs) {
    faqTabs.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-faq-tab]");
      if (tab && faqTabs.contains(tab)) activateFaqTab(tab);
    });

    faqTabs.addEventListener("keydown", (event) => {
      const tabs = Array.from(faqTabs.querySelectorAll("[data-faq-tab]"));
      const current = document.activeElement?.closest?.("[data-faq-tab]");
      if (!current || !tabs.includes(current)) return;

      let index = tabs.indexOf(current);
      const keys = {
        ArrowRight: 1,
        ArrowDown: 1,
        ArrowLeft: -1,
        ArrowUp: -1,
      };

      if (event.key in keys) {
        event.preventDefault();
        index = (index + keys[event.key] + tabs.length) % tabs.length;
      } else if (event.key === "Home") {
        event.preventDefault();
        index = 0;
      } else if (event.key === "End") {
        event.preventDefault();
        index = tabs.length - 1;
      } else {
        return;
      }

      tabs[index].focus();
      activateFaqTab(tabs[index]);
    });
  }

  /* Diff deck cards */
  const diffDeck = document.querySelector("[data-diff-deck]");
  if (diffDeck) {
    const diffCards = Array.from(diffDeck.querySelectorAll("[data-diff-card]"));
    let diffActive = 0;

    const renderDiffDeck = () => {
      diffCards.forEach((card, index) => {
        const offset =
          (index - diffActive + diffCards.length) % diffCards.length;
        card.dataset.stack = String(offset);
        card.classList.toggle("is-front", offset === 0);
        card.hidden = false;
        card.setAttribute("aria-hidden", offset === 0 ? "false" : "true");
      });
    };

    diffDeck.querySelector("[data-diff-next]")?.addEventListener("click", () => {
      diffActive = (diffActive + 1) % diffCards.length;
      renderDiffDeck();
    });
    renderDiffDeck();
  }

  /* Dashboard: shared active-button group */
  const bindActiveGroup = (rootSelector, itemSelector, withAria = false) => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    root.addEventListener("click", (event) => {
      const btn = event.target.closest(itemSelector);
      if (!btn || !root.contains(btn)) return;
      root.querySelectorAll(itemSelector).forEach((item) => {
        const active = item === btn;
        item.classList.toggle("is-active", active);
        if (withAria) item.setAttribute("aria-selected", String(active));
      });
      if (withAria) syncPlatformPolygons();
    });
  };

  bindActiveGroup("[data-dash-platform-tabs]", ".platform-tab", true);
  bindActiveGroup("[data-order-type-toggle]", "[data-order-type]");
  bindActiveGroup("[data-ticket-filter-toggle]", "[data-ticket-filter]");

  const ticketPagination = document.querySelector("[data-ticket-pagination]");
  ticketPagination?.addEventListener("click", (event) => {
    const pageBtn = event.target.closest("[data-ticket-page]");
    if (!pageBtn || !ticketPagination.contains(pageBtn)) return;
    ticketPagination.querySelectorAll("[data-ticket-page]").forEach((item) => {
      item.classList.toggle("is-active", item === pageBtn);
      item.toggleAttribute("aria-current", item === pageBtn);
    });
  });

  /* Dashboard sidebar */
  const dashSidebarToggle = document.querySelector("[data-dash-sidebar-toggle]");
  const dashSidebarEdgeToggle = document.querySelector(
    "[data-dash-sidebar-edge-toggle]"
  );
  const dashSidebarBackdrop = document.querySelector(
    "[data-dash-sidebar-backdrop]"
  );
  const dashPage = document.querySelector(".dash-page");
  const desktopSidebarMq = window.matchMedia("(min-width: 992px)");

  const setDashSidebarOpen = (open) => {
    if (!dashPage) return;
    dashPage.classList.toggle("is-sidebar-open", open);
    if (dashSidebarBackdrop) dashSidebarBackdrop.hidden = !open;
    dashSidebarToggle?.setAttribute("aria-expanded", String(open));
  };

  const setDashSidebarCollapsed = (collapsed) => {
    if (!dashPage) return;
    dashPage.classList.toggle("is-sidebar-collapsed", collapsed);
    dashSidebarEdgeToggle?.setAttribute("aria-expanded", String(!collapsed));
    try {
      localStorage.setItem("dash-sidebar-collapsed", collapsed ? "1" : "0");
    } catch (_) {
      /* ignore */
    }
  };

  dashSidebarToggle?.addEventListener("click", () => {
    setDashSidebarOpen(!dashPage?.classList.contains("is-sidebar-open"));
  });

  dashSidebarEdgeToggle?.addEventListener("click", () => {
    if (!desktopSidebarMq.matches) return;
    setDashSidebarCollapsed(
      !dashPage?.classList.contains("is-sidebar-collapsed")
    );
  });

  if (dashPage && desktopSidebarMq.matches) {
    try {
      if (localStorage.getItem("dash-sidebar-collapsed") === "1") {
        setDashSidebarCollapsed(true);
      }
    } catch (_) {
      /* ignore */
    }
  }

  desktopSidebarMq.addEventListener("change", (event) => {
    if (!dashPage) return;
    if (!event.matches) {
      dashPage.classList.remove("is-sidebar-collapsed");
      return;
    }
    try {
      setDashSidebarCollapsed(
        localStorage.getItem("dash-sidebar-collapsed") === "1"
      );
    } catch (_) {
      /* ignore */
    }
  });

  dashSidebarBackdrop?.addEventListener("click", () =>
    setDashSidebarOpen(false)
  );

  document.addEventListener("keydown", (event) => {
    if (
      event.key === "Escape" &&
      dashPage?.classList.contains("is-sidebar-open")
    ) {
      setDashSidebarOpen(false);
    }
  });

  /* Dashboard currency (visual only) */
  document.querySelectorAll("[data-dash-currency]").forEach((option) => {
    option.addEventListener("click", () => {
      document.querySelectorAll("[data-dash-currency]").forEach((item) => {
        item.classList.toggle("is-accent", item === option);
      });
    });
  });

  /* Dashboard Select2 */
  if (typeof jQuery !== "undefined" && typeof jQuery.fn.select2 === "function") {
    const $ = jQuery;
    const $dashSelects = $("[data-dash-select2]");

    if ($dashSelects.length) {
      const escapeHtml = (value) =>
        String(value)
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;");

      const formatCategoryOption = (option) => {
        if (!option.id) return option.text;
        const icon = $(option.element).data("icon");
        if (!icon) return option.text;
        return $(
          `<span class="dash-select2-option">
            <img class="dash-select2-option__icon" src="${escapeHtml(icon)}" alt="" width="32" height="32" />
            <span class="dash-select2-option__text">${escapeHtml(option.text)}</span>
          </span>`
        );
      };

      const formatServiceOption = (option) => {
        if (!option.id) return option.text;
        return $(
          `<span class="dash-select2-option">
            <span class="dash-select2-option__badge">${escapeHtml(option.id)}</span>
            <span class="dash-select2-option__text">${escapeHtml(option.text)}</span>
          </span>`
        );
      };

      $dashSelects.each(function () {
        const $select = $(this);
        const $wrap = $select.closest(".dash-select-wrap");
        const options = {
          width: "100%",
          dropdownParent: $wrap.length ? $wrap : $(document.body),
          minimumResultsForSearch: Infinity,
        };

        if ($select.is("[data-dash-select2-icon]")) {
          options.templateResult = formatCategoryOption;
          options.templateSelection = formatCategoryOption;
          options.escapeMarkup = (markup) => markup;
        }

        if ($select.is("[data-dash-select2-service]")) {
          options.templateResult = formatServiceOption;
          options.templateSelection = formatServiceOption;
          options.escapeMarkup = (markup) => markup;
        }

        $select.select2(options);
      });
    }
  }

  /* Process steps hover */
  const processSteps = document.querySelectorAll(".process__step");
  processSteps.forEach((step) => {
    step.addEventListener("mouseenter", () => {
      processSteps.forEach((s) => s.classList.remove("process__step--active"));
      step.classList.add("process__step--active");
    });
  });
  document
    .querySelector(".process__steps")
    ?.addEventListener("mouseleave", () => {
      processSteps.forEach((s) => s.classList.remove("process__step--active"));
      processSteps[0]?.classList.add("process__step--active");
    });
})();
