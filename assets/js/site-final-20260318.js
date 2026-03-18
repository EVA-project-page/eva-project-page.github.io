const revealObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    }
  },
  {
    threshold: 0.16,
  }
);

document.querySelectorAll(".reveal").forEach((node) => {
  revealObserver.observe(node);
});

const videoObserver = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      const video = entry.target;
      if (entry.isIntersecting) {
        const playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === "function") {
          playAttempt.catch(() => {});
        }
      } else {
        video.pause();
      }
    }
  },
  {
    threshold: 0.55,
  }
);

document.querySelectorAll("[data-inline-video], [data-hover-controls]").forEach((video) => {
  video.muted = true;
  video.playsInline = true;
  videoObserver.observe(video);
});

document.querySelectorAll("[data-hover-controls]").forEach((video) => {
  video.controls = true;
});

const nav = document.querySelector(".top-nav");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sectionNavLinks = navLinks.filter((link) => link.getAttribute("href")?.startsWith("#"));

if (nav && sectionNavLinks.length > 0) {
  const sectionMap = new Map(
    sectionNavLinks.map((link) => [link.getAttribute("href").slice(1), link])
  );

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = sectionMap.get(entry.target.id);
        if (!link) {
          return;
        }

        if (entry.isIntersecting) {
          sectionNavLinks.forEach((item) => item.classList.remove("is-active"));
          link.classList.add("is-active");
        }
      });
    },
    {
      rootMargin: "-35% 0px -50% 0px",
      threshold: 0.01,
    }
  );

  document.querySelectorAll("main section[id]").forEach((section) => {
    sectionObserver.observe(section);
  });

  window.addEventListener(
    "scroll",
    () => {
      nav.classList.toggle("is-compact", window.scrollY > 20);
    },
    { passive: true }
  );
}

const carousels = [...document.querySelectorAll("[data-carousel]")];

carousels.forEach((carousel) => {
  const slides = [...carousel.querySelectorAll(".carousel-slide")];
  const dotsContainer = carousel.nextElementSibling?.classList.contains("carousel-dots")
    ? carousel.nextElementSibling
    : null;
  const dots = dotsContainer ? [...dotsContainer.querySelectorAll(".carousel-dot")] : [];
  const prevButton = carousel.querySelector(".carousel-prev");
  const nextButton = carousel.querySelector(".carousel-next");

  if (slides.length === 0) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("is-active"));
  if (activeIndex < 0) {
    activeIndex = 0;
    slides[0].classList.add("is-active");
  }

  const setActiveSlide = (nextIndex) => {
    slides.forEach((slide, index) => {
      const isActive = index === nextIndex;
      slide.classList.toggle("is-active", isActive);
      const video = slide.querySelector("video");
      if (video && !isActive) {
        video.pause();
      }
    });

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === nextIndex);
    });

    activeIndex = nextIndex;
  };

  prevButton?.addEventListener("click", () => {
    const nextIndex = (activeIndex - 1 + slides.length) % slides.length;
    setActiveSlide(nextIndex);
  });

  nextButton?.addEventListener("click", () => {
    const nextIndex = (activeIndex + 1) % slides.length;
    setActiveSlide(nextIndex);
  });

  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      setActiveSlide(index);
    });
  });
});
