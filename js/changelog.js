document.addEventListener('DOMContentLoaded', function () {
  const changelogList = document.getElementById('changelog-list');
  const rawUrl = 'https://raw.githubusercontent.com/AxionAOSP/axion_changelogs/refs/heads/lineage-22.1/README.md';

  const renderer = new marked.Renderer();
  renderer.heading = (text, level) => {
    if (level === 2) return `<div class="changelog-item"><h3>${text}</h3>`;
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
        .split(/##\s*🔄\s*Previous Releases/i)[0]
        .replace(/^#.*?\n/, '')
        .replace(/\n\s+-/g, '\n-')
        .replace(/\n{2,}/g, '\n');

      let html = marked.parse(cleanedMd);
      html = html.replace(/<div class="changelog-item">/g, '</div><div class="changelog-item">');
      html = html.replace(/<\/div><div/, '<div');
      html = html.replace(/<\/div>\s*$/, '');
      changelogList.innerHTML = html;
    })
    .catch(error => console.error(error));
});