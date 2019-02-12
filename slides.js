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
  if (!localStorage.getItem("settings") && !localStorage.getItem("slides")) {
    var xhr = new XMLHttpRequest();
    xhr.overrideMimeType("application/json");
    xhr.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 200) {
          var responseJson = JSON.parse(xhr.responseText);
          localStorage.setObject("settings", responseJson.settings);
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
        appendSlideElements();
      }
    }
    imgs[i].src = url;
  });
}

function appendSlideElements() {
  var mainBody = document.getElementById("slide-area");
  console.log(mainBody);
  localStorage.getObject("slides").forEach(function (slide, index) {
    var newSlide = document.createElement("div");
    newSlide.id = "slide-" + (index+1);
    newSlide.className = "slide-content";
    if (index === 0) {
      newSlide.classList.add("active-slide");
    }
    newSlide.setAttribute("data-url", slide.img);
    newSlide.setAttribute("data-index", index);
    newSlide.setAttribute("data-caption", slide.caption);
    newSlide.setAttribute("data-fit", slide.fit);
    newSlide.setAttribute("title", slide.caption);
    newSlide.style.backgroundImage = "url('" + slide.img + "')"
    newSlide.style.backgroundPosition = "center center";
    newSlide.style.backgroundSize = slide.fit;

    var newCaption = document.createElement("div");
    newCaption.className = "slide-caption";
    newCaption.textContent = slide.caption;
    newSlide.appendChild(newCaption);

    mainBody.appendChild(newSlide);
  });
}



window.addEventListener("load", init);