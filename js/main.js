(function () {
  "use strict";

  const THEME_KEY = "hqpromo-theme";
  const passwordInput = document.getElementById("password");
  const passwordToggle = document.querySelector("[data-password-toggle]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.getElementById("mobileNav");
  const form = document.getElementById("signin");
  const themeToggles = document.querySelectorAll("[data-theme-toggle]");

  const applyTheme = (theme) => {
    const isDark = theme === "dark";
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("theme-dark", isDark);

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
  const initialTheme =
    storedTheme === "dark" || storedTheme === "light" ? storedTheme : "light";
  applyTheme(initialTheme);

  themeToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const next =
        document.documentElement.getAttribute("data-theme") === "dark"
          ? "light"
          : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  });

  if (passwordToggle && passwordInput) {
    passwordToggle.addEventListener("click", () => {
      const isHidden = passwordInput.type === "password";
      passwordInput.type = isHidden ? "text" : "password";
      passwordToggle.setAttribute("aria-pressed", String(isHidden));
      passwordToggle.setAttribute(
        "aria-label",
        isHidden ? "Hide password" : "Show password"
      );
      passwordToggle.classList.toggle("is-visible", isHidden);
    });
  }

  if (navToggle && mobileNav) {
    const setNavOpen = (open) => {
      navToggle.setAttribute("aria-expanded", String(open));
      mobileNav.hidden = !open;
      document.body.classList.toggle("is-nav-open", open);
    };

    navToggle.addEventListener("click", (event) => {
      event.stopPropagation();
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      setNavOpen(!expanded);
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
      if (mobileNav.hidden) return;
      if (
        mobileNav.contains(event.target) ||
        navToggle.contains(event.target)
      ) {
        return;
      }
      setNavOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 992px)").matches && !mobileNav.hidden) {
        setNavOpen(false);
      }
    });
  }

  if (form) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const username = form.querySelector("#username");
      const password = form.querySelector("#password");

      [username, password].forEach((field) => {
        if (!field) return;
        const wrap = field.closest(".auth-input");
        if (!field.value.trim()) {
          wrap?.classList.add("is-invalid");
        } else {
          wrap?.classList.remove("is-invalid");
        }
      });

      if (!username?.value.trim() || !password?.value.trim()) {
        return;
      }

      form.classList.add("is-submitted");
    });
  }

  const PLATFORM_METRICS = {
    twitter: ["followers", "Likes", "Retweets"],
    facebook: ["likes", "comments", "shares"],
    instagram: ["followers", "likes", "views"],
    youtube: ["subscribers", "likes", "views"],
    tiktok: ["followers", "likes", "views"],
    linkedin: ["followers", "likes", "comments"],
    telegram: ["members", "views", "reactions"],
    discord: ["members", "boosts", "reactions"],
    spotify: ["plays", "followers", "saves"],
    soundcloud: ["plays", "likes", "reposts"],
    snapchat: ["followers", "views", "shares"],
    traffic: ["visits", "minute avg", "Global traffic"],
  };

  const PLAN_TIERS = [
    {
      amounts: ["500", "500", "500"],
      price: "$189.95 per month",
      reviews: "(2,725)",
      popular: false,
    },
    {
      amounts: ["2,000", "2,000", "2,000"],
      price: "$189.95 per month",
      reviews: "(2,725)",
      popular: true,
    },
    {
      amounts: ["5,000", "5,000", "5,000"],
      price: "$189.95 per month",
      reviews: "(2,725)",
      popular: false,
    },
    {
      amounts: ["750", "750", "750"],
      price: "$199.95 per month",
      reviews: "(2,110)",
      popular: false,
    },
    {
      amounts: ["2,500", "2,500", "2,500"],
      price: "$229.95 per month",
      reviews: "(1,980)",
      popular: true,
    },
    {
      amounts: ["7,500", "7,500", "7,500"],
      price: "$279.95 per month",
      reviews: "(1,640)",
      popular: false,
    },
    {
      amounts: ["1,000", "1,000", "1,000"],
      price: "$209.95 per month",
      reviews: "(1,520)",
      popular: false,
    },
    {
      amounts: ["3,000", "3,000", "3,000"],
      price: "$249.95 per month",
      reviews: "(1,410)",
      popular: true,
    },
    {
      amounts: ["10,000", "10,000", "10,000"],
      price: "$319.95 per month",
      reviews: "(1,205)",
      popular: false,
    },
    {
      amounts: ["1,500", "1,500", "1,500"],
      price: "$219.95 per month",
      reviews: "(980)",
      popular: false,
    },
    {
      amounts: ["4,000", "4,000", "4,000"],
      price: "$269.95 per month",
      reviews: "(860)",
      popular: true,
    },
    {
      amounts: ["15,000", "15,000", "15,000"],
      price: "$349.95 per month",
      reviews: "(742)",
      popular: false,
    },
  ];

  const platformTabs = document.querySelector("[data-platform-tabs]");
  const plansWrapper = document.querySelector("[data-plans-wrapper]");
  const plansSwiperEl = document.querySelector("[data-plans-swiper]");
  let plansSwiper = null;

  function starsMarkup() {
    return `
      <div class="plan-card__stars" aria-hidden="true">
        <iconify-icon icon="mdi:star" width="20" height="20"></iconify-icon>
        <iconify-icon icon="mdi:star" width="20" height="20"></iconify-icon>
        <iconify-icon icon="mdi:star" width="20" height="20"></iconify-icon>
        <iconify-icon icon="mdi:star" width="20" height="20"></iconify-icon>
        <iconify-icon class="is-muted" icon="mdi:star" width="20" height="20"></iconify-icon>
      </div>
    `;
  }

  function featureLines(platform, amounts) {
    const metrics = PLATFORM_METRICS[platform] || PLATFORM_METRICS.twitter;

    if (platform === "traffic") {
      return [
        `${amounts[0]} visits`,
        `${amounts[0] === "500" ? "1" : amounts[0] === "750" ? "1" : "2"} minute avg`,
        "Global traffic",
      ];
    }

    if (platform === "discord" && metrics[1] === "boosts") {
      const boostMap = {
        500: "5",
        "2,000": "15",
        "5,000": "30",
        750: "8",
        "2,500": "18",
        "7,500": "40",
        "1,000": "10",
        "3,000": "20",
        "10,000": "50",
        "1,500": "12",
        "4,000": "25",
        "15,000": "60",
      };
      return [
        `${amounts[0]} ${metrics[0]}`,
        `${boostMap[amounts[0]] || "10"} ${metrics[1]}`,
        `${amounts[2]} ${metrics[2]}`,
      ];
    }

    return metrics.map((metric, index) => `${amounts[index]} ${metric}`);
  }

  function createPlanSlide(tier, platform, label, icon) {
    const features = featureLines(platform, tier.amounts)
      .map((item) => `<li>${item}</li>`)
      .join("");
    const popularClass = tier.popular ? " plan-card--popular" : "";
    const badge = tier.popular
      ? '<span class="plan-card__badge">Popular</span>'
      : "";

    return `
      <div class="swiper-slide">
        <article class="plan-card${popularClass}">
          ${badge}
          <div class="plan-card__noise" aria-hidden="true"></div>
          <div class="plan-card__body">
            <div class="plan-card__brand">
              <img
                class="plan-card__logo"
                src="${icon}"
                alt=""
                width="48"
                height="48"
                data-plan-icon
              />
              <h3 class="plan-card__name" data-plan-name>${label}</h3>
            </div>
            <div class="plan-card__meta">
              <div class="plan-card__rating">
                ${starsMarkup()}
                <span>${tier.reviews}</span>
              </div>
              <p class="plan-card__price">${tier.price}</p>
            </div>
            <ul class="plan-card__features" data-plan-features>
              ${features}
            </ul>
          </div>
          <a class="plan-card__cta" href="#">Buy now</a>
        </article>
      </div>
    `;
  }

  function initPlansSwiper() {
    if (!plansSwiperEl || typeof Swiper === "undefined") return null;

    return new Swiper(plansSwiperEl, {
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

  function renderPlans(platform, label, icon) {
    if (!plansWrapper) return;

    if (plansSwiper) {
      plansSwiper.destroy(true, true);
      plansSwiper = null;
    }

    plansWrapper.innerHTML = PLAN_TIERS.map((tier) =>
      createPlanSlide(tier, platform, label, icon)
    ).join("");

    plansSwiper = initPlansSwiper();
  }

  function setActivePlatform(tab) {
    if (!tab) return;

    const platform = tab.dataset.platform || "twitter";
    const label = tab.dataset.label || "Twitter";
    const icon = tab.dataset.icon || "assets/platforms/twitter-x.png";

    platformTabs?.querySelectorAll(".platform-tab").forEach((button) => {
      const active = button === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });

    renderPlans(platform, label, icon);
  }

  const defaultTab =
    platformTabs?.querySelector(".platform-tab.is-active") ||
    platformTabs?.querySelector('[data-platform="twitter"]');

  setActivePlatform(defaultTab);

  if (platformTabs) {
    platformTabs.addEventListener("click", (event) => {
      const tab = event.target.closest(".platform-tab");
      if (!tab || !platformTabs.contains(tab)) return;
      setActivePlatform(tab);
    });
  }

  const PLATFORM_PANELS = {
    facebook: {
      title: "Facebook SMM Panel",
      text: "Facebook is still the biggest social media platform in Bangladesh with millions of active users. Our Facebook SMM Panel helps you increase page likes, post engagement, and video views quickly. It is perfect for businesses, shops, and creators. You can grow your audience fast, get real attention, and improve your online presence with simple and effective services.",
      cta: "View Facebook Services",
    },
    instagram: {
      title: "Instagram SMM Panel",
      text: "Instagram remains one of the most powerful platforms for creators and brands. Our Instagram SMM Panel helps you grow followers, boost post reach, and increase story views with fast delivery. Perfect for influencers, shops, and agencies looking to strengthen their visual brand presence.",
      cta: "View Instagram Services",
    },
    twitter: {
      title: "Twitter SMM Panel",
      text: "X (Twitter) is essential for real-time engagement and brand visibility. Our Twitter SMM Panel helps you increase followers, likes, and retweets quickly. Ideal for creators, startups, and businesses that want stronger social proof and faster audience growth.",
      cta: "View Twitter Services",
    },
    youtube: {
      title: "YouTube SMM Panel",
      text: "YouTube is the leading video platform for long-term growth and monetization. Our YouTube SMM Panel helps you increase subscribers, video likes, and watch time. Great for creators, educators, and brands building authority through video content.",
      cta: "View YouTube Services",
    },
    tiktok: {
      title: "TikTok SMM Panel",
      text: "TikTok drives viral discovery for modern brands and creators. Our TikTok SMM Panel helps you grow followers, boost video views, and improve engagement rates. Perfect for short-form content creators and businesses targeting younger audiences.",
      cta: "View TikTok Services",
    },
    linkedin: {
      title: "LinkedIn SMM Panel",
      text: "LinkedIn is key for professional branding and B2B growth. Our LinkedIn SMM Panel helps you increase profile followers, post engagement, and visibility across your network. Ideal for agencies, consultants, and companies building credibility.",
      cta: "View LinkedIn Services",
    },
    telegram: {
      title: "Telegram SMM Panel",
      text: "Telegram communities are growing fast for brands, channels, and groups. Our Telegram SMM Panel helps you increase members, post views, and channel engagement. Perfect for communities, crypto projects, and digital publishers.",
      cta: "View Telegram Services",
    },
    discord: {
      title: "Discord SMM Panel",
      text: "Discord is central for gaming, communities, and online brands. Our Discord SMM Panel helps you grow server members, boost activity, and improve community engagement. Great for creators, gaming teams, and Web3 communities.",
      cta: "View Discord Services",
    },
    spotify: {
      title: "Spotify SMM Panel",
      text: "Spotify growth helps artists and labels reach more listeners worldwide. Our Spotify SMM Panel helps increase plays, followers, and playlist traction. Perfect for musicians, podcasters, and music marketers.",
      cta: "View Spotify Services",
    },
    soundcloud: {
      title: "SoundCloud SMM Panel",
      text: "SoundCloud is a top platform for independent artists and producers. Our SoundCloud SMM Panel helps you increase plays, likes, and reposts quickly. Ideal for emerging artists building momentum and social proof.",
      cta: "View SoundCloud Services",
    },
    snapchat: {
      title: "Snapchat SMM Panel",
      text: "Snapchat connects brands with highly engaged mobile audiences. Our Snapchat SMM Panel helps you grow followers, story views, and profile visibility. Great for lifestyle brands, creators, and youth-focused campaigns.",
      cta: "View Snapchat Services",
    },
    traffic: {
      title: "Website Traffic SMM Panel",
      text: "Website traffic services help you drive real visitors to your landing pages and offers. Our Website Traffic Panel supports global campaigns with flexible volume options. Perfect for businesses, affiliates, and marketers testing funnels.",
      cta: "View Website Traffic Services",
    },
  };

  const panelTabs = document.querySelector("[data-panel-tabs]");
  const panelTitle = document.querySelector("[data-panel-title]");
  const panelText = document.querySelector("[data-panel-text]");
  const panelCta = document.querySelector("[data-panel-cta]");

  function setActivePanel(tab) {
    if (!tab) return;

    const platform = tab.dataset.platform || "facebook";
    const label = tab.dataset.label || "Facebook";
    const panel = PLATFORM_PANELS[platform] || PLATFORM_PANELS.facebook;

    panelTabs?.querySelectorAll(".platform-tab").forEach((button) => {
      const active = button === tab;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", String(active));
    });

    if (panelTitle) panelTitle.textContent = panel.title;
    if (panelText) panelText.textContent = panel.text;
    if (panelCta) {
      const labelEl = panelCta.querySelector("span");
      if (labelEl) labelEl.textContent = panel.cta;
      panelCta.setAttribute("aria-label", panel.cta);
    }
  }

  const defaultPanelTab =
    panelTabs?.querySelector(".platform-tab.is-active") ||
    panelTabs?.querySelector('[data-platform="facebook"]');

  setActivePanel(defaultPanelTab);

  if (panelTabs) {
    panelTabs.addEventListener("click", (event) => {
      const tab = event.target.closest(".platform-tab");
      if (!tab || !panelTabs.contains(tab)) return;
      setActivePanel(tab);
    });
  }

  const CLIENT_REVIEWS = [
    {
      media: "assets/reviews/media-thumbs.png",
      avatar: "assets/reviews/avatar-glasses.png",
      name: "[Customer Name]",
      role: "[Role, City]",
      text: "Add a real customer testimonial here once available.",
      date: "January 18, 3:20 PM",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
    {
      media: "assets/reviews/media-office.png",
      avatar: "assets/reviews/avatar-office.png",
      name: "[Customer Name]",
      role: "[Role, City]",
      text: "Add a real customer testimonial here once available.",
      date: "January 25, 11:30 AM",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    },
    {
      media: "assets/reviews/media-suit.png",
      avatar: "assets/reviews/avatar-1.png",
      name: "[Customer Name]",
      role: "[Role, City]",
      text: "Add a real customer testimonial here once available.",
      date: "February 2, 4:15 PM",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    },
    {
      media: "assets/reviews/media-thumbs.png",
      avatar: "assets/reviews/avatar-2.png",
      name: "[Customer Name]",
      role: "[Role, City]",
      text: "Add a real customer testimonial here once available.",
      date: "February 10, 9:45 AM",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    },
    {
      media: "assets/reviews/media-office.png",
      avatar: "assets/reviews/avatar-glasses.png",
      name: "[Customer Name]",
      role: "[Role, City]",
      text: "Add a real customer testimonial here once available.",
      date: "February 18, 1:05 PM",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
    },
    {
      media: "assets/reviews/media-suit.png",
      avatar: "assets/reviews/avatar-office.png",
      name: "[Customer Name]",
      role: "[Role, City]",
      text: "Add a real customer testimonial here once available.",
      date: "March 1, 6:40 PM",
      video:
        "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    },
  ];

  function escapeAttr(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function buildReviewCard(review) {
    const stars = Array.from({ length: 5 })
      .map(
        () =>
          '<img src="assets/reviews/star.svg" alt="" width="16" height="16" />'
      )
      .join("");

    return `
      <article
        class="review-clip"
        data-review-video="${escapeAttr(review.video)}"
        data-review-poster="${escapeAttr(review.media)}"
        data-review-avatar="${escapeAttr(review.avatar)}"
        data-review-name="${escapeAttr(review.name)}"
        data-review-role="${escapeAttr(review.role)}"
        data-review-text="${escapeAttr(review.text)}"
      >
        <div class="review-clip__media">
          <img src="${escapeAttr(review.media)}" alt="" width="240" height="203" />
          <button class="review-clip__play" type="button" aria-label="Play customer review video">
            <img src="assets/reviews/play.svg" alt="" width="28" height="28" />
          </button>
        </div>
        <div class="review-clip__body">
          <img
            class="review-clip__quote"
            src="assets/reviews/quote.svg"
            alt=""
            width="85"
            height="74"
            aria-hidden="true"
          />
          <div class="review-clip__rating" aria-label="5 out of 5 stars">
            ${stars}
          </div>
          <p class="review-clip__text">${escapeAttr(review.text)}</p>
          <hr class="review-clip__divider" aria-hidden="true" />
          <div class="review-clip__footer">
            <div class="review-clip__author">
              <img
                class="review-clip__avatar"
                src="${escapeAttr(review.avatar)}"
                alt=""
                width="51"
                height="51"
              />
              <div class="review-clip__meta">
                <div class="review-clip__name-row">
                  <p class="review-clip__name">${escapeAttr(review.name)}</p>
                  <img
                    class="review-clip__verified"
                    src="assets/reviews/verified.svg"
                    alt=""
                    width="18"
                    height="18"
                  />
                </div>
                <p class="review-clip__role">${escapeAttr(review.role)}</p>
              </div>
            </div>
            <time class="review-clip__date">${escapeAttr(review.date)}</time>
          </div>
        </div>
      </article>
    `;
  }

  function fillReviewTrack(track, reviews) {
    if (!track) return;
    const sequence = reviews.map(buildReviewCard).join("");
    // Duplicate for seamless infinite scroll
    track.innerHTML = sequence + sequence;
  }

  const reviewsLtr = document.querySelector('[data-reviews-track="ltr"]');
  const reviewsRtl = document.querySelector('[data-reviews-track="rtl"]');

  fillReviewTrack(reviewsLtr, CLIENT_REVIEWS);
  // Offset bottom row so cards don't stack in a vertical column
  fillReviewTrack(reviewsRtl, [
    ...CLIENT_REVIEWS.slice(2),
    ...CLIENT_REVIEWS.slice(0, 2),
  ]);

  const servicesPlatformTabs = document.querySelector("[data-services-platform-tabs]");
  const serviceAccordion = document.querySelector("[data-service-accordion]");

  if (serviceAccordion) {
    serviceAccordion.querySelectorAll("[data-service-group]").forEach((group) => {
      const header = group.querySelector(".service-group__header");
      const panel = group.querySelector(".service-group__panel");
      if (!header || !panel) return;

      header.addEventListener("click", () => {
        const isOpen = group.classList.contains("is-open");

        if (isOpen) {
          group.classList.remove("is-open");
          header.setAttribute("aria-expanded", "false");
          panel.hidden = true;
          return;
        }

        group.classList.add("is-open");
        header.setAttribute("aria-expanded", "true");
        panel.hidden = false;
      });
    });
  }

  if (servicesPlatformTabs) {
    servicesPlatformTabs.addEventListener("click", (event) => {
      const tab = event.target.closest(".platform-tab");
      if (!tab || !servicesPlatformTabs.contains(tab)) return;

      servicesPlatformTabs.querySelectorAll(".platform-tab").forEach((button) => {
        const active = button === tab;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-selected", String(active));
      });

      const targetId = tab.dataset.target;
      if (!targetId) return;

      const targetGroup = document.getElementById(targetId);
      if (!targetGroup) return;

      targetGroup.classList.add("is-open");
      const header = targetGroup.querySelector(".service-group__header");
      const panel = targetGroup.querySelector(".service-group__panel");
      if (header) header.setAttribute("aria-expanded", "true");
      if (panel) panel.hidden = false;

      targetGroup.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const shortsModal = document.getElementById("shortsModal");
  const shortsVideo = document.getElementById("shortsVideo");
  const shortsAvatar = document.getElementById("shortsAvatar");
  const shortsTitle = document.getElementById("shortsModalTitle");
  const shortsRole = document.getElementById("shortsRole");
  const shortsQuote = document.getElementById("shortsQuote");
  const shortsProgress = document.getElementById("shortsProgress");
  const shortsMarquee = document.querySelector(".client-reviews__marquee");
  let shortsLastFocus = null;

  function setShortsPausedState(isPaused) {
    shortsModal?.classList.toggle("is-paused", isPaused);
  }

  function syncShortsProgress() {
    if (!shortsVideo || !shortsProgress || !shortsVideo.duration) {
      if (shortsProgress) shortsProgress.style.width = "0%";
      return;
    }
    const pct = (shortsVideo.currentTime / shortsVideo.duration) * 100;
    shortsProgress.style.width = `${Math.min(100, Math.max(0, pct))}%`;
  }

  function openShortsModal(card) {
    if (!shortsModal || !shortsVideo || !card) return;

    shortsLastFocus = document.activeElement;

    const videoSrc = card.dataset.reviewVideo || "";
    const poster = card.dataset.reviewPoster || "";
    const avatar = card.dataset.reviewAvatar || "";
    const name = card.dataset.reviewName || "[Customer Name]";
    const role = card.dataset.reviewRole || "[Role, City]";
    const text =
      card.dataset.reviewText ||
      "Add a real customer testimonial here once available.";

    if (shortsAvatar && avatar) shortsAvatar.src = avatar;
    if (shortsTitle) shortsTitle.textContent = name;
    if (shortsRole) shortsRole.textContent = role;
    if (shortsQuote) shortsQuote.textContent = text;

    shortsVideo.pause();
    shortsVideo.removeAttribute("src");
    shortsVideo.poster = poster;
    shortsVideo.src = videoSrc;
    shortsVideo.load();
    if (shortsProgress) shortsProgress.style.width = "0%";

    shortsModal.hidden = false;
    document.body.classList.add("is-shorts-open");
    setShortsPausedState(true);

    const playPromise = shortsVideo.play();
    if (playPromise && typeof playPromise.then === "function") {
      playPromise
        .then(() => setShortsPausedState(false))
        .catch(() => setShortsPausedState(true));
    }

    shortsModal.querySelector(".shorts-modal__close")?.focus();
  }

  function closeShortsModal() {
    if (!shortsModal || shortsModal.hidden) return;

    if (shortsVideo) {
      shortsVideo.pause();
      shortsVideo.removeAttribute("src");
      shortsVideo.load();
    }

    if (shortsProgress) shortsProgress.style.width = "0%";
    shortsModal.hidden = true;
    document.body.classList.remove("is-shorts-open");
    setShortsPausedState(true);

    if (shortsLastFocus && typeof shortsLastFocus.focus === "function") {
      shortsLastFocus.focus();
    }
  }

  function toggleShortsPlayback() {
    if (!shortsVideo) return;
    if (shortsVideo.paused) {
      const playPromise = shortsVideo.play();
      if (playPromise && typeof playPromise.then === "function") {
        playPromise
          .then(() => setShortsPausedState(false))
          .catch(() => setShortsPausedState(true));
      } else {
        setShortsPausedState(false);
      }
    } else {
      shortsVideo.pause();
      setShortsPausedState(true);
    }
  }

  if (shortsMarquee) {
    shortsMarquee.addEventListener("click", (event) => {
      const playBtn = event.target.closest(".review-clip__play");
      if (!playBtn) return;
      event.preventDefault();
      event.stopPropagation();
      const card = playBtn.closest(".review-clip");
      openShortsModal(card);
    });
  }

  shortsModal?.querySelectorAll("[data-shorts-close]").forEach((el) => {
    el.addEventListener("click", closeShortsModal);
  });

  shortsModal
    ?.querySelector("[data-shorts-toggle]")
    ?.addEventListener("click", toggleShortsPlayback);

  shortsVideo?.addEventListener("play", () => setShortsPausedState(false));
  shortsVideo?.addEventListener("pause", () => {
    if (!shortsModal?.hidden) setShortsPausedState(true);
  });
  shortsVideo?.addEventListener("ended", () => {
    setShortsPausedState(true);
    if (shortsProgress) shortsProgress.style.width = "100%";
  });
  shortsVideo?.addEventListener("timeupdate", syncShortsProgress);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeShortsModal();
    if (event.key === " " && shortsModal && !shortsModal.hidden) {
      const tag = (event.target && event.target.tagName) || "";
      if (tag === "BUTTON" || tag === "INPUT" || tag === "TEXTAREA") return;
      event.preventDefault();
      toggleShortsPlayback();
    }
  });

  const faqTabs = document.querySelector("[data-faq-tabs]");
  const faqPanels = document.querySelectorAll("[data-faq-panel]");

  function activateFaqTab(tab) {
    if (!faqTabs || !tab) return;
    const key = tab.dataset.faqTab;
    if (!key) return;

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
  }

  if (faqTabs) {
    faqTabs.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-faq-tab]");
      if (!tab || !faqTabs.contains(tab)) return;
      activateFaqTab(tab);
    });

    faqTabs.addEventListener("keydown", (event) => {
      const tabs = Array.from(faqTabs.querySelectorAll("[data-faq-tab]"));
      const current = document.activeElement?.closest?.("[data-faq-tab]");
      if (!current || !tabs.includes(current)) return;

      let index = tabs.indexOf(current);
      if (event.key === "ArrowRight" || event.key === "ArrowDown") {
        event.preventDefault();
        index = (index + 1) % tabs.length;
        tabs[index].focus();
        activateFaqTab(tabs[index]);
      } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
        event.preventDefault();
        index = (index - 1 + tabs.length) % tabs.length;
        tabs[index].focus();
        activateFaqTab(tabs[index]);
      } else if (event.key === "Home") {
        event.preventDefault();
        tabs[0].focus();
        activateFaqTab(tabs[0]);
      } else if (event.key === "End") {
        event.preventDefault();
        tabs[tabs.length - 1].focus();
        activateFaqTab(tabs[tabs.length - 1]);
      }
    });
  }
})();
