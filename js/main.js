(function () {
  "use strict";

  const passwordInput = document.getElementById("password");
  const passwordToggle = document.querySelector("[data-password-toggle]");
  const navToggle = document.querySelector("[data-nav-toggle]");
  const mobileNav = document.getElementById("mobileNav");
  const form = document.getElementById("signin");

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
    navToggle.addEventListener("click", () => {
      const expanded = navToggle.getAttribute("aria-expanded") === "true";
      navToggle.setAttribute("aria-expanded", String(!expanded));
      mobileNav.hidden = expanded;
    });

    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navToggle.setAttribute("aria-expanded", "false");
        mobileNav.hidden = true;
      });
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
      slidesPerView: "auto",
      spaceBetween: 24,
      slidesPerGroup: 1,
      speed: 500,
      watchOverflow: true,
      centeredSlides: false,
      pagination: {
        el: ".plans-swiper__pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: "auto",
          slidesPerGroup: 2,
          spaceBetween: 24,
        },
        1200: {
          slidesPerView: "auto",
          slidesPerGroup: 3,
          spaceBetween: 32,
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
})();
