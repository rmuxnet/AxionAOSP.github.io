document.addEventListener('DOMContentLoaded', function () {
    const featuresContent = document.getElementById('features-content');
    const rawUrl = 'https://raw.githubusercontent.com/AxionAOSP/axion_features/lineage-22.1/README.md';

    const renderer = new marked.Renderer();
    renderer.heading = (text, level) => {
        if (text.includes("Credits")) return '';
        if (level === 1) return '';
        if (level === 2) return `<div class="feature-item"><h3>${text}</h3>`;
        return '';
    };

    renderer.list = (body, ordered) => body;

    renderer.listitem = (text) => {
        const parsedText = marked.parseInline(text);
        const isNested = text.startsWith('  ');
        const margin = isNested ? 'style="margin-left: 20px"' : '';
        return `<p ${margin}>- ${parsedText}</p>`;
    };

    marked.setOptions({
        renderer,
        breaks: false,
        gfm: true,
        smartypants: true,
        smartLists: true
    });

    fetch(rawUrl)
        .then(response => response.text())
        .then(md => {
            const cleanedMd = md
                .replace(/^#.*?\n/, '')
                .replace(/\n\s+-/g, '\n-')
                .replace(/\n{2,}/g, '\n');
            let html = marked.parse(cleanedMd);
            html = html.replace(/<div class="feature-item">/g, '</div><div class="feature-item">');
            html = html.replace(/<\/div><div/, '<div');
            html = html.replace(/<\/div>\s*$/, '');
            featuresContent.innerHTML = html;
            document.querySelectorAll('.feature-item h3').forEach(item => {
                item.addEventListener('click', () => {
                    item.parentNode.classList.toggle('active');
                });
            });
        })
        .catch(error => console.error(error));
});