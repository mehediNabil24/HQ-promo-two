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
      slidesPerView: 1,
      spaceBetween: 24,
      slidesPerGroup: 1,
      speed: 500,
      watchOverflow: true,
      pagination: {
        el: ".plans-swiper__pagination",
        clickable: true,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          slidesPerGroup: 2,
          spaceBetween: 24,
        },
        1200: {
          slidesPerView: 3,
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
})();
