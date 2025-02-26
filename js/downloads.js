// js/downloads.js - Optimized version
document.addEventListener('DOMContentLoaded', function() {
    // Configuration
    const config = {
        imageBaseUrl: 'https://wiki.lineageos.org/images/devices/',
        fallbackImage: 'https://bluemoji.io/cdn-proxy/646218c67da47160c64a84d5/66b3ea6b437be789ded213fd_45.png',
        loadingClass: 'loading',
        activeFilterClass: 'active'
    };

    // Image loader with retry logic
    const loadDeviceImages = () => {
        document.querySelectorAll('.download-item').forEach(item => {
            const container = item.querySelector('.image-container');
            const img = item.querySelector('.device-image');
            const codenameElement = item.querySelector('.codename');
            
            if (!codenameElement) {
                console.error('Codename element missing in:', item);
                return;
            }

            const codename = codenameElement.textContent.trim().toLowerCase();
            container.classList.add(config.loadingClass);

            const testImage = new Image();
            testImage.src = `${config.imageBaseUrl}${codename}.png`;

            testImage.onload = () => {
                img.src = testImage.src;
                img.alt = `${item.querySelector('h3').textContent} device image`;
                container.classList.remove(config.loadingClass);
            };

            testImage.onerror = () => {
                img.src = config.fallbackImage;
                img.alt = 'Device image not available';
                container.classList.remove(config.loadingClass);
                console.warn(`Image not found for ${codename}, using fallback`);
            };
        });
    };

    // Enhanced filter system
    const initFilters = () => {
        const filterButtons = document.querySelectorAll('.filter-btn');
        const items = document.querySelectorAll('.download-item');

        const applyFilter = (filter) => {
            items.forEach(item => {
                const match = filter === 'all' || item.dataset.brand === filter;
                item.style.display = match ? 'grid' : 'none';
            });
        };

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove(config.activeFilterClass));
                btn.classList.add(config.activeFilterClass);
                applyFilter(btn.dataset.filter);
            });
        });

        // Initial filter
        applyFilter('all');
    };

    // Responsive adjustments
    const handleResponsive = () => {
        const updateGrid = () => {
            const grid = document.querySelector('.downloads-grid');
            const screenWidth = window.innerWidth;
            grid.style.gridTemplateColumns = screenWidth < 768 
                ? '1fr' 
                : 'repeat(auto-fit, minmax(300px, 1fr))';
        };

        window.addEventListener('resize', () => {
            requestAnimationFrame(updateGrid);
        });

        updateGrid();
    };

    // Initialize all components
    const init = () => {
        try {
            loadDeviceImages();
            initFilters();
            handleResponsive();
        } catch (error) {
            console.error('Initialization error:', error);
        }
    };

    // Start with slight delay to prioritize critical rendering
    setTimeout(init, 100);
});