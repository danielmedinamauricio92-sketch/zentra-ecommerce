(() => {
  const slides = [...document.querySelectorAll('.cloud-slide')];
  const counter = document.getElementById('slide-count');
  let current = 0;
  function show(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach((slide, position) => {
      slide.hidden = position !== current;
      slide.classList.toggle('is-active', position === current);
    });
    counter.textContent = `${current + 1} / ${slides.length}`;
  }
  document.getElementById('slide-prev').addEventListener('click', () => show(current - 1));
  document.getElementById('slide-next').addEventListener('click', () => show(current + 1));
})();
