const header = document.getElementById("navbar");
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav-link");
const revealItems = document.querySelectorAll(".reveal-up, .reveal-scale");
const filterButtons = document.querySelectorAll(".filter-button");
const portfolioCards = document.querySelectorAll(".portfolio-card");

const closeMenu = () => {
  if (!menuToggle || !navMenu) return;

  menuToggle.classList.remove("active");
  navMenu.classList.remove("active");
  menuToggle.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
};

if (menuToggle && navMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.classList.toggle("active");
    navMenu.classList.toggle("active", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeMenu();
  }
});

document.addEventListener("click", (event) => {
  if (!menuToggle || !navMenu) return;

  const target = event.target;
  if (!(target instanceof Node)) return;

  if (!navMenu.contains(target) && !menuToggle.contains(target)) {
    closeMenu();
  }
});

const updateHeaderState = () => {
  if (!header) return;

  header.classList.toggle("scrolled", window.scrollY > 18);
};

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
      }
    });
  },
  {
    threshold: 0.18,
    rootMargin: "0px 0px -48px 0px",
  }
);

revealItems.forEach((item) => {
  sectionObserver.observe(item);
});

const sections = document.querySelectorAll("section[id]");

const highlightNav = () => {
  const scrollPosition = window.scrollY + 140;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute("id");

    if (scrollPosition >= top && scrollPosition < top + height) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    }
  });
};

window.addEventListener("scroll", () => {
  updateHeaderState();
  highlightNav();
});

updateHeaderState();
highlightNav();

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");

    portfolioCards.forEach((card) => {
      const group = card.dataset.filterGroup;
      const shouldShow = filter === "all" || group === filter;
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});
