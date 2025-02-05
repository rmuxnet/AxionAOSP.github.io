const mobileNav = document.querySelector(".mobile-nav");
const navLinks = document.querySelector(".nav-links");

mobileNav.addEventListener("click", () => {
    if (navLinks.style.display === "flex") {
        navLinks.style.display = "none";
    } else {
        navLinks.style.display = "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.background = "rgba(0, 0, 0, 0.9)";
        navLinks.style.position = "absolute";
        navLinks.style.top = "60px";
        navLinks.style.right = "20px";
        navLinks.style.padding = "10px";
        navLinks.style.borderRadius = "10px";
    }
});