function initScreenshot() {
    const imageContainer = document.querySelector(".splide__list");
    const screenshots = [
        "screenshot1.png", "screenshot2.png", "screenshot3.png",
        "screenshot4.png", "screenshot5.png", "screenshot6.png",
        "screenshot7.png", "screenshot8.png", "screenshot9.png"
    ];
    screenshots.forEach((image) => {
        const li = document.createElement("li");
        li.classList.add("splide__slide");
        li.innerHTML = `<img src="img/${image}" alt="Screenshot" />`;
        imageContainer.appendChild(li);
    });
    new Splide("#image-carousel").mount();
}
