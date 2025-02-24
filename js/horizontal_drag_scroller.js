(function () {
  const requiredScripts = [
    "https://code.jquery.com/jquery-3.6.0.min.js",
  ];

  const loadScripts = (scripts, callback) => {
    let loadedScripts = 0;

    const loadScript = (src) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = false;
      script.onload = () => {
        loadedScripts += 1;
        if (loadedScripts === scripts.length) {
          callback();
        }
      };
      script.onerror = () => {
        console.error(`Failed to load script: ${src}`);
      };
      document.head.appendChild(script);
    };

    scripts.forEach(loadScript);
  };

  const initDragScroll = (containerSelector) => {
    const $ = window.jQuery;

    $(document).ready(function () {
      const $scrollContainer = $(containerSelector);
      let isDragging = false;
      let startX, scrollLeft;

      $scrollContainer
        .on("mousedown", function (e) {
          e.preventDefault();
          isDragging = true;
          startX = e.pageX - $scrollContainer.offset().left;
          scrollLeft = $scrollContainer.scrollLeft();
          $scrollContainer.addClass("dragging");
        })
        .on("mousemove", function (e) {
          if (!isDragging) return;
          e.preventDefault();
          const x = e.pageX - $scrollContainer.offset().left;
          const walk = (x - startX) * 2;
          $scrollContainer.scrollLeft(scrollLeft - walk);
        })
        .on("mouseup mouseleave", function () {
          isDragging = false;
          $scrollContainer.removeClass("dragging");
        });

      $scrollContainer.find("*").on("mousedown", function (e) {
        e.preventDefault();
      });

      $scrollContainer.on("wheel", function (e) {
        e.preventDefault();
        if (e.originalEvent.deltaY !== 0) {
          $scrollContainer.scrollLeft(
            $scrollContainer.scrollLeft() + e.originalEvent.deltaY
          );
        }
      });
    });
  };

  window.initDragScroll = (containerSelector) => {
    if (window.jQuery) {
      initDragScroll(containerSelector);
    } else {
      loadScripts(requiredScripts, () => initDragScroll(containerSelector));
    }
  };
})();