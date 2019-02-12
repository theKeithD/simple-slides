// Prototype extensions to make working with objects in localStorage simpler
// Taken from https://stackoverflow.com/a/3146971 (and countless other places)
Storage.prototype.setObject = function(key, value) {
    this.setItem(key, JSON.stringify(value));
}
Storage.prototype.getObject = function(key) {
    var value = this.getItem(key);
    return value && JSON.parse(value);
}

// on first load, load data from localStorage
// if localStorage hasn't yet been populated, pull from default.json
function init() {
  if (!localStorage.getItem("slides")) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var responseJson = JSON.parse(xhr.responseText);
          localStorage.setObject("slides", responseJson.slides)
          preloadImages();
        } else {
          console.error("Could not find default.json! No data has been loaded.");
        }
      }
    };
    xhr.open("GET", "default.json", true);
    xhr.send();
  } else {
    preloadImages();
  }
  if (!localStorage.getItem("showSidebar")) {
    localStorage.setItem("showSidebar", true);
    document.getElementById("sidebar").className = "open";
  } else {
    var sidebar = document.getElementById("sidebar")
    if (JSON.parse(localStorage.showSidebar) === true) { 
      sidebar.className = "open";
    } else { 
      sidebar.className = "closed";
    }
  }
  addNavEventHandlers();
}

// called whenever we load a new batch of images (initLoad, import)
// assumes localStorage is populated
function preloadImages() {
  var imgUrls = localStorage.getObject("slides").map(function (slide) {
    return slide.img;
  });
  var imgsToLoad = imgUrls.length;

  var imgs = new Array();
  imgUrls.forEach(function (url, i) {
    imgs[i] = new Image();
    imgs[i].onload = function() {
      --imgsToLoad;
      if (imgsToLoad <= 0) {
        populateSidebar();
        appendSlideElements();
      }
    }
    imgs[i].src = url;
  });
}

// add slides to main slide body
function appendSlideElements() {
  var mainBody = document.getElementById("slide-area");
  localStorage.getObject("slides").forEach(function (slide, index) {
    var newSlide = document.createElement("div");
    newSlide.id = "slide-" + (index+1);
    newSlide.className = "slide-content";

    newSlide.setAttribute("data-url", slide.img);
    newSlide.setAttribute("data-index", (index+1));
    newSlide.setAttribute("data-caption", slide.caption);
    newSlide.setAttribute("data-fit", slide.fit);
    newSlide.setAttribute("title", slide.caption);
    newSlide.style.backgroundImage = "url('" + slide.img + "')"
    newSlide.style.backgroundPosition = "center center";
    newSlide.style.backgroundSize = slide.fit || "contain";

    var newCaption = document.createElement("div");
    newCaption.className = "slide-caption";
    newCaption.textContent = slide.caption;
    newSlide.appendChild(newCaption);

    mainBody.appendChild(newSlide);
  });

  determineDefaultSlide();
}

function populateSidebar() {
  var sidebar = document.getElementById("sidebar-list")
  localStorage.getObject("slides").forEach(function (slide, index) {
    var newSlide = document.createElement("div");
    newSlide.id = "slide-sidebar-" + (index+1);
    newSlide.className = "slide-sidebar-item";

    newSlide.setAttribute("data-url", slide.img);
    newSlide.setAttribute("data-index", (index+1));
    newSlide.setAttribute("data-caption", slide.caption);
    newSlide.setAttribute("data-fit", slide.fit);
    newSlide.setAttribute("title", slide.caption);

    var newSlideImage = document.createElement("div");
    newSlideImage.className = "sidebar-image";
    newSlideImage.style.backgroundImage = "url('" + slide.img + "')"
    newSlideImage.style.backgroundPosition = "center center";
    newSlideImage.style.backgroundSize = slide.fit || "contain";
    newSlide.appendChild(newSlideImage);

    var newSlideCount = document.createElement("div");
    newSlideCount.className = "sidebar-count";
    newSlideCount.textContent = (index+1);
    newSlideImage.appendChild(newSlideCount);

    newSlide.addEventListener('click', function() {
      jumpToSlideFromSidebar(index+1)
    });

    sidebar.appendChild(newSlide);
  });
}

// check location hash, then check localStorage.settings, otherwise fall back to 1
function determineDefaultSlide() {
  if (location.hash && !isNaN(parseInt(location.hash.substring(1), 10))) {
    setActiveSlide(parseInt(location.hash.substring(1), 10));
  } else if (localStorage.currentSlide) {
    setActiveSlide(localStorage.currentSlide);
  } else {
    setActiveSlide(1);
  }
}

// set currently visible slide to given index
// if out of bounds, set to the first/last possible slide
// this will update localStorage, so the last-viewed slide should appear on reload
function setActiveSlide(index) {
  function clampSlideNumber(num) {
    if (num <= 0) {
      return 1;
    } else if (num >= localStorage.getObject("slides").length) {
      return localStorage.getObject("slides").length;
    } else {
      return num;
    }
  }

  var targetSlide = clampSlideNumber(index);
  var active = document.querySelector(".active-slide");

  // no active slides
  if (!active) {
    document.getElementById("slide-" + targetSlide).classList.add("active-slide");
    document.getElementById("slide-sidebar-" + targetSlide).classList.add("active-slide");
    localStorage.currentSlide = targetSlide;
  // active slide exists, check if this is actually a change
  } else if (active && active.getAttribute("data-index") !== targetSlide) {
    document.getElementById("slide-" + active.getAttribute("data-index")).classList.remove("active-slide");
    document.getElementById("slide-sidebar-" + active.getAttribute("data-index")).classList.remove("active-slide");
    document.getElementById("slide-" + targetSlide).classList.add("active-slide");
    document.getElementById("slide-sidebar-" + targetSlide).classList.add("active-slide");
    localStorage.currentSlide = targetSlide;
  }
}

// event handlers for navigation
function nextSlide() {
  setActiveSlide(parseInt(localStorage.currentSlide, 10) + 1);
}
function prevSlide() {
  setActiveSlide(parseInt(localStorage.currentSlide, 10) - 1);
}
function jumpToSlideFromSidebar(slide) {
  setActiveSlide(slide);

  // if on a tall device, we automatically close the sidebar
  var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  if (w < h) {
    var sidebar = document.getElementById("sidebar");
    sidebar.classList.remove("open");
    sidebar.classList.add("closed");
    localStorage.showSidebar = false;
  }
}
function toggleSidebar() {
  var sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
  sidebar.classList.toggle("closed");
  localStorage.showSidebar = !JSON.parse(localStorage.showSidebar);
}
function addNavEventHandlers() {
  // toggle visibility of sidebar
  var sidebarToggle = document.getElementById("sidebar-toggle");
  sidebarToggle.addEventListener('click', toggleSidebar);

  // click for left/right
  var nextArrow = document.getElementById("next-arrow");
  nextArrow.addEventListener('click', nextSlide);

  var prevArrow = document.getElementById("prev-arrow");
  prevArrow.addEventListener('click', prevSlide);

  // keyboard shortcuts for prev/next
  document.onkeyup = function(e) {
    var key = e.keyCode ? e.keyCode : e.which;

    if (key === 37) {           // left
      prevSlide();
    } else if (key === 39) {    // right
      nextSlide();
    } else if (key === 221) {   // ]
      toggleSidebar();
    } 
  }
}




window.addEventListener("load", init);