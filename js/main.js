document.querySelector(".logo").addEventListener("click", function (e) {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("DOMContentLoaded", function () {
  initScreenshot();
  document.querySelectorAll('.changelog-item h3').forEach(item => {
    item.addEventListener('click', () => {
      item.parentNode.classList.toggle('active');
    });
  });
});