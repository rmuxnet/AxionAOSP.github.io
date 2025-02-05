document.querySelectorAll(".faq-item h3").forEach((item) => {
    item.addEventListener("click", () => {
        item.parentNode.classList.toggle("active");
    });
});

function expandFaqItem(id) {
    const faqItem = document.getElementById(id);
    if (faqItem) {
        faqItem.classList.add("active");
        faqItem.scrollIntoView({ behavior: "smooth", block: "center" });
    }
}