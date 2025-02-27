document.addEventListener('DOMContentLoaded', async () => {
    const grid = document.querySelector('.downloads-grid');
    const loading = document.querySelector('.loading-state');
  
    try {
      loading.style.display = 'flex';
  
      // Cache optimization - implement local storage caching
      const CACHE_EXPIRY = 1; // 1 hour in milliseconds
      const cachedData = checkCache('device_data');
  
      let devices, imagesData;
  
      if (cachedData) {
        // Use cached data
        ({ devices, imagesData } = cachedData);
      } else {
        // Fetch device data
        const [devicesRes, imagesRes] = await Promise.all([
          fetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/README.md'),
          fetch('https://raw.githubusercontent.com/AxionAOSP/official_devices/refs/heads/main/OTA/device_images.json')
        ]);
  
        const [devicesText, images] = await Promise.all([
          devicesRes.text(),
          imagesRes.json()
        ]);
  
        // Process devices
        devices = processDevices(devicesText);
        imagesData = images;
  
        // Cache the results
        saveToCache('device_data', { devices, imagesData });
      }
  
      // Use document fragment to avoid multiple reflows
      const fragment = document.createDocumentFragment();
      const deviceElements = await createDeviceElements(devices, imagesData);
  
      deviceElements.forEach((element) => {
        fragment.appendChild(element);
      });
  
      // Clear and append in a single operation
      grid.innerHTML = '';
      grid.appendChild(fragment);
  
      initFilters();
      initModalLogic();
    } catch (error) {
      console.error('Error:', error);
      grid.innerHTML = `
        <div class="error">
          <i class="fas fa-exclamation-triangle"></i>
          <p>Failed to load devices. Please check the 
             <a href="https://github.com/AxionAOSP/official_devices" target="_blank">official repository</a>.
          </p>
        </div>
      `;
    } finally {
      loading.style.display = 'none';
    }
  });
  
  // Cache management functions
  function checkCache(key) {
    const cached = localStorage.getItem(key);
    if (!cached) return null;
  
    try {
      const { timestamp, data } = JSON.parse(cached);
      // CACHE_EXPIRY must match what's in your main function
      const CACHE_EXPIRY = 1;
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        return data;
      }
    } catch (e) {
      return null;
    }
  
    return null;
  }
  
  function saveToCache(key, data) {
    try {
      localStorage.setItem(
        key,
        JSON.stringify({
          timestamp: Date.now(),
          data,
        })
      );
    } catch (e) {
      console.warn('Failed to cache data:', e);
    }
  }
  
  function processDevices(text) {
    try {
      const tableSection = text
        .split('# 📱 Supported Devices')[1]
        .split('## 👤 Maintainers')[0];
      return tableSection
        .split('\n')
        .filter((line) => line.startsWith('|') && !line.includes('--'))
        .slice(2)
        .map((line) => {
          const [, name, codename] = line.split('|').map((c) => c.trim());
          return {
            name: name.replace(/\*\*/g, ''),
            codename: codename.replace(/`/g, ''),
            brand: getDeviceBrand(name),
          };
        });
    } catch (error) {
      console.error('Error processing devices:', error);
      return [];
    }
  }
  
  // Improved image loading with lazy loading
  function createDeviceElements(devices, imagesData) {
    // Batch processing to improve UI responsiveness
    return Promise.all(
      devices.map(async (device) => {
        const element = document.createElement('div');
        element.className = 'device-card';
        element.dataset.brand = device.brand;
  
        const [gms, vanilla] = await Promise.all([
          fetchFlavorDataWithCache(device.codename, 'GMS'),
          fetchFlavorDataWithCache(device.codename, 'VANILLA'),
        ]);
  
        const imageInfo = imagesData.devices.find(
          (d) => d.codename === device.codename
        );
        const imageUrl = imageInfo?.imageUrl || 'images/fallback.png';
  
        // Build the HTML for the flavor details (which we'll show in a modal)
        const flavorHtml = `
          ${gms ? renderFlavor('GMS', gms) : ''}
          ${vanilla ? renderFlavor('Vanilla', vanilla) : ''}
        `;
  
        // We store the flavor HTML in a data attribute so we can open it in a modal on click
        element.innerHTML = `
          <div class="device-header">
            <img 
              src="${imageUrl}"
              class="device-thumb"
              alt="${device.name}"
              loading="lazy"
              onerror="this.src='images/fallback.png'"
            />
            <div class="device-info">
              <div class="device-name">${device.name}</div>
              <div class="codename">${device.codename}</div>
            </div>
            <button class="toggle-btn" data-flavors="${encodeURIComponent(flavorHtml)}">
              <i class="fas fa-chevron-down"></i>
            </button>
          </div>
        `;
  
        return element;
      })
    );
  }
  
  // Cache flavor data to reduce API calls
  const flavorCache = new Map();
  
  async function fetchFlavorDataWithCache(codename, type) {
    const cacheKey = `${codename}_${type}`;
  
    if (flavorCache.has(cacheKey)) {
      return flavorCache.get(cacheKey);
    }
  
    try {
      const res = await fetch(
        `https://raw.githubusercontent.com/AxionAOSP/official_devices/main/OTA/${type}/${codename.toLowerCase()}.json`
      );
      if (!res.ok) return null;
      const data = await res.json();
      const result = data.response[0] || null;
  
      flavorCache.set(cacheKey, result);
      return result;
    } catch {
      flavorCache.set(cacheKey, null);
      return null;
    }
  }
  
  function renderFlavor(type, data) {
    if (!data) return '';
  
    // Precompute values to avoid recalculations in the template
    const sizeMB = (data.size / 1024 / 1024).toFixed(1);
    const buildDate = new Date(data.datetime * 1000).toLocaleDateString();
  
    return `
      <div class="flavor-card">
        <div class="flavor-header">
          <div class="flavor-title">${type}</div>
          <a href="${data.url}" class="download-btn" download>
            <i class="fas fa-download"></i> ${sizeMB}MB
          </a>
        </div>
        <div class="version-info">
          <div>Version: ${data.version}</div>
          <div>Build Date: ${buildDate}</div>
          <div>File: ${data.filename}</div>
        </div>
      </div>
    `;
  }
  
  // === Modal Logic ===
  function initModalLogic() {
    const modalOverlay = document.getElementById('modalOverlay');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
  
    // Open modal on device-header arrow click
    document.querySelector('.downloads-grid').addEventListener('click', (event) => {
      const toggleBtn = event.target.closest('.toggle-btn');
      if (!toggleBtn) return;
  
      // Grab the stored HTML
      const flavorsHtml = decodeURIComponent(toggleBtn.dataset.flavors);
  
      // Insert into modal & show
      modalBody.innerHTML = flavorsHtml;
      modalOverlay.classList.add('active');
    });
  
    // Close modal
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
      modalBody.innerHTML = '';
    });
  
    // Optional: close modal by clicking outside content
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
        modalBody.innerHTML = '';
      }
    });
  }
  
  // Filter implementation
  function initFilters() {
    const filterContainer = document.querySelector('.filter-container');
    if (!filterContainer) return;
  
    filterContainer.addEventListener('click', (event) => {
      const btn = event.target.closest('.filter-btn');
      if (!btn) return;
  
      document
        .querySelectorAll('.filter-btn')
        .forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
  
      const filter = btn.dataset.filter;
      const cards = document.querySelectorAll('.device-card');
  
      // Use requestAnimationFrame for smoother UI updates
      requestAnimationFrame(() => {
        cards.forEach((card) => {
          card.style.display =
            filter === 'all' || card.dataset.brand === filter
              ? 'block'
              : 'none';
        });
      });
    });
  }
  
  // Memoized device brand detection
  const brandCache = new Map();
  
  function getDeviceBrand(deviceName) {
    if (brandCache.has(deviceName)) {
      return brandCache.get(deviceName);
    }
  
    const brands = {
      google: /Google Pixel/i,
      samsung: /Galaxy/i,
      poco: /POCO/i,
      xiaomi: /Xiaomi|Redmi/i,
      tecno: /TECNO/i,
      motorola: /Motorola/i,
    };
  
    const brand =
      Object.entries(brands).find(([_, regex]) => regex.test(deviceName))?.[0] ||
      'other';
    brandCache.set(deviceName, brand);
    return brand;
  }
  
