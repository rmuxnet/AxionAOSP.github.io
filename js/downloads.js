// downloads.js - Dynamic Image Loader
document.addEventListener('DOMContentLoaded', function() {
    // Load device images
    const loadDeviceImages = () => {
        document.querySelectorAll('.download-item').forEach(item => {
            const codename = item.querySelector('p strong:contains("Codename:") + br + span').textContent.trim().toLowerCase();
            const img = item.querySelector('img');
            
            // Set loading state
            img.classList.add('loading');
            
            // Try LineageOS image first
            const lineageUrl = `https://wiki.lineageos.org/images/devices/${codename}.png`;
            const fallbackUrl = 'img/fallback-device.png';
            
            // Create new image to test load
            const testImage = new Image();
            testImage.src = lineageUrl;
            
            testImage.onload = () => {
                img.src = lineageUrl;
                img.classList.remove('loading');
            };
            
            testImage.onerror = () => {
                img.src = fallbackUrl;
                img.classList.remove('loading');
            };
        });
    };

    // Initialize filter functionality
    const initFilters = () => {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                
                document.querySelectorAll('.download-item').forEach(item => {
                    item.style.display = (filter === 'all' || item.dataset.brand === filter) ? 'block' : 'none';
                });
            });
        });
    };

    // Initialize functions
    loadDeviceImages();
    initFilters();
});

// Contains polyfill for older browsers
Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector;