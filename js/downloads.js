// js/downloads.js - Fixed version
document.addEventListener('DOMContentLoaded', function() {
    // Load device images from LineageOS wiki
    const loadDeviceImages = () => {
        document.querySelectorAll('.download-item').forEach(item => {
            const codenameElement = item.querySelector('p strong:contains("Codename:")').nextSibling;
            const codename = codenameElement.textContent.trim().toLowerCase();
            const img = item.querySelector('.device-image');
            
            // Set loading state
            img.classList.add('loading');
            
            // Try to load device image
            const testImage = new Image();
            testImage.src = `https://wiki.lineageos.org/images/devices/${codename}.png`;
            
            testImage.onload = () => {
                img.src = testImage.src;
                img.alt = `${item.querySelector('h3').textContent} device image`;
                img.classList.remove('loading');
            };
            
            testImage.onerror = () => {
                img.src = 'img/fallback-device.png';
                img.alt = 'Device image not available';
                img.classList.remove('loading');
                console.warn(`Image not found for ${codename}`);
            };
        });
    };

    // Initialize brand filters
    const initFilters = () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                
                // Set active state
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                
                // Filter devices
                document.querySelectorAll('.download-item').forEach(item => {
                    item.style.display = (filter === 'all' || item.dataset.brand === filter) 
                        ? 'block' 
                        : 'none';
                });
            });
        });
    };

    // Initialize functions
    loadDeviceImages();
    initFilters();

    // Add contains selector support
    document.querySelectorAll = function(selector) {
        const [base, text] = selector.split(':contains("');
        return Array.prototype.filter.call(
            document.querySelectorAll(base),
            element => element.textContent.includes(text.replace('")', ''))
        );
    };
});