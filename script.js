// СК Митева — общи скриптове v2

function animateCount(el){
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || "";
  const duration = 1100;
  const start = performance.now();
  function tick(now){
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if(p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

function initCarousel(root){
  const slides = [...root.querySelectorAll(".slide")];
  const dots = [...root.querySelectorAll(".carousel-dots button")];
  let i = 0, timer;
  function show(n){
    slides[i].classList.remove("active");
    dots[i].classList.remove("active");
    i = (n + slides.length) % slides.length;
    slides[i].classList.add("active");
    dots[i].classList.add("active");
  }
  dots.forEach((d, idx) => d.addEventListener("click", () => { show(idx); restart(); }));
  function restart(){
    clearInterval(timer);
    timer = setInterval(() => show(i + 1), 5000);
  }
  restart();
}

document.addEventListener("DOMContentLoaded", () => {

  // Активна страница в менюто
  const here = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-menu a").forEach(a => {
    if(a.getAttribute("href") === here) a.classList.add("active");
  });

  // Слайдшоута
  document.querySelectorAll(".carousel").forEach(initCarousel);

  // Преброяване на статистики + reveal анимации при скрол
  const toReveal = document.querySelectorAll(".reveal");
  const toCount = document.querySelectorAll("[data-count]");

  if("IntersectionObserver" in window){
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add("in-view");
          revealIO.unobserve(entry.target);
        }
      });
    }, {threshold: 0.15});
    toReveal.forEach(el => revealIO.observe(el));

    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateCount(entry.target);
          countIO.unobserve(entry.target);
        }
      });
    }, {threshold: 0.4});
    toCount.forEach(el => countIO.observe(el));
  } else {
    toReveal.forEach(el => el.classList.add("in-view"));
    toCount.forEach(animateCount);
  }
});
