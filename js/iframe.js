function loadPage(e) {
    e.preventDefault();
    const url = e.currentTarget.href;
    document.getElementById('contentFrame').src = url;
}