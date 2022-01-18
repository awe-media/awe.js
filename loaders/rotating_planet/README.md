# LOADER: Rotating Planet

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [rotating_planet.mp4](rotating_planet.mp4)



https://user-images.githubusercontent.com/22041360/149852441-f99ee3c0-8ce3-426f-9b27-56de17ba6745.mp4



Original Source on Codepen: [https://codepen.io/rafaelavlucas/pen/wbrdez](https://codepen.io/rafaelavlucas/pen/wbrdez)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_content">
    <div class="custom_loader_planet">
        <div class="custom_loader_ring"></div>
        <div class="custom_loader_cover_ring"></div>
        <div class="custom_loader_spots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
    </div>
    <p class="custom_loader_text">loading</p>
  </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

@import url("https://fonts.googleapis.com/css?family=Roboto+Mono&display=swap");

* {
  box-sizing: border-box;
}
.custom_loader_wrap {
  overflow: auto; /* location bar hack */
  overflow-x: hidden;
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  user-select: none;
  -webkit-user-select: none;
  pointer-events: all;
  box-sizing: border-box;
  font-family: 'Lato', sans-serif;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--cl-background);

  /*
  ** You can modify these custom properties to change how the loader looks on the front end.
  ** And if the style you're looking for is not listed here, 
  ** or, if you require a completely different custom loader,
  ** you can always contact us at support@awe.media
  */

  /* 1. page background color */
  --cl-background: #3c4359;
  
  /* 2. loader size */
  --cl-size: 300px;

  /* 3. planet color */
  --cl-planet-color: #546c8c;

  /* 4. ring color */
  --cl-ring-color: #bacbd9;

  /* 5. ring color (a bit darker) */
  --cl-ring-color-darkder: #7ea1bf;

  /* 6. spot color */
  --cl-spot-color: #3c4359;
  
  /* 7. animation duration */
  --cl-animation-duration: 3s;

  /* 8. text animation duration */
  --cl-text-animation-duration: 4s;
}

.custom_loader_content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: var(--cl-size);
  height: var(--cl-size);
}

.custom_loader_planet {
  width: 65%;
  height: 65%;
  background-color: var(--cl-planet-color);
  border-radius: 100%;
  position: absolute;
  display: flex;
  align-items: center;
  transform-origin: center center;
  box-shadow: inset 2px -10px 0px rgba(0, 0, 0, 0.1);
  animation: planet calc(var(--cl-animation-duration) / 0.6) ease infinite alternate;
}

@keyframes planet {
  0% {
    transform: rotate(10deg);
  }
  100% {
    transform: rotate(-10deg);
  }
}

.custom_loader_ring {
  position: absolute;
  width: var(--cl-size);
  height: var(--cl-size);
  border-radius: 100%;
  background-color: var(--cl-ring-color);
  display: flex;
  align-items: center;
  justify-content: center;
  transform-origin: 33% center;
  box-shadow: 2px -10px 0px rgba(0, 0, 0, 0.1), inset -5px -10px 0px rgba(0, 0, 0, 0.1);
  animation: ring var(--cl-animation-duration) ease infinite;
}

@keyframes ring {
  0% {
    transform: rotateX(110deg) rotateZ(0deg) translate(-50px, 5px);
  }
  100% {
    transform: rotateX(110deg) rotateZ(360deg) translate(-50px, 5px);
  }
}

.custom_loader_ring::before {
  content: "";
  position: absolute;
  width: calc(var(--cl-size) / 30);
  height: calc(var(--cl-size) / 10);
  border-radius: 100%;
  background-color: var(--cl-ring-color-darkder);
  z-index: 2;
  left: calc(0px - 5px);
  box-shadow: inset -3px 3px 0px rgba(0, 0, 0, 0.2);
}

.custom_loader_ring::after {
  content: "";
  position: absolute;
  width: calc(var(--cl-size) * 0.8);
  height: calc(var(--cl-size) * 0.8);
  border-radius: 100%;
  background-color: var(--cl-ring-color-darkder);
  box-shadow: inset 2px -10px 0px rgba(0, 0, 0, 0.1);
}

.custom_loader_cover_ring {
  position: absolute;
  width: 100%;
  height: 50%;
  border-bottom-left-radius: 80%;
  border-bottom-right-radius: 80%;
  border-top-left-radius: 100px;
  border-top-right-radius: 100px;
  transform: translate(0px, -17px);
  background-color: var(--cl-planet-color);
  z-index: 2;
  box-shadow: inset 0px -2px 0px rgba(0, 0, 0, 0.1);
}

.custom_loader_spots {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  z-index: 2;
}

.custom_loader_spots span {
  width: calc(var(--cl-size) / 10);
  height: calc(var(--cl-size) / 10);
  background-color: var(--cl-spot-color);
  position: absolute;
  border-radius: 100%;
  box-shadow: inset -2px 3px 0px rgba(0, 0, 0, 0.3);
  animation: dots calc(var(--cl-animation-duration) / 0.6) ease infinite alternate;
}

@keyframes dots {
  0% {
    box-shadow: inset -3px 3px 0px rgba(0, 0, 0, 0.3);
  }
  100% {
    box-shadow: inset 3px 3px 0px rgba(0, 0, 0, 0.3);
  }
}

.custom_loader_spots span:nth-child(1) {
  top: calc(var(--cl-size) / 15);
  right: calc(var(--cl-size) / 6);
}

.custom_loader_spots span:nth-child(2) {
  top: calc(var(--cl-size) / 7.5);
  left: calc(var(--cl-size) / 6);
  width: calc(var(--cl-size) / 20);
  height: calc(var(--cl-size) / 20);
}

.custom_loader_spots span:nth-child(3) {
  top: calc(var(--cl-size) / 3.75);
  left: calc(var(--cl-size) / 15);
  width: calc(var(--cl-size) / 12);
  height: calc(var(--cl-size) / 12);
}

.custom_loader_spots span:nth-child(4) {
  top: calc(var(--cl-size) / 3.75);
  left: calc(var(--cl-size) * 0.3);
  width: calc(var(--cl-size) / 7.5);
  height: calc(var(--cl-size) / 7.5);
}

.custom_loader_spots span:nth-child(5) {
  top: calc(var(--cl-size) / 1.875);
  left: calc(var(--cl-size) * 70 / 300);
  width: calc(var(--cl-size) / 20);
  height: calc(var(--cl-size) / 20);
}

.custom_loader_spots span:nth-child(6) {
  top: calc(var(--cl-size) * 165 / 300);
  left: calc(var(--cl-size) / 2.4);
  width: calc(var(--cl-size) / 30);
  height: calc(var(--cl-size) / 30);
}

.custom_loader_spots span:nth-child(7) {
  top: calc(var(--cl-size) * 0.3);
  left: calc(var(--cl-size) / 2);
  width: calc(var(--cl-size) / 20);
  height: calc(var(--cl-size) / 20);
}

.custom_loader_text {
  color: var(--cl-ring-color);
  font-size: 14px;
  z-index: 2;
  position: absolute;
  bottom: -20px;
  font-family: "Roboto Mono", monospace;
  animation: text var(--cl-text-animation-duration) ease infinite;
  width: 100px;
  text-align: center;
}

@keyframes text {
  0% {
    transform: translateX(-30px);
    letter-spacing: 0px;
    color: var(--cl-ring-color);
  }
  25% {
    letter-spacing: 3px;
    color: var(--cl-ring-color-darkder);
  }
  50% {
    transform: translateX(30px);
    letter-spacing: 0px;
    color: var(--cl-ring-color);
  }
  75% {
    letter-spacing: 3px;
    color: var(--cl-ring-color-darkder);
  }
  100% {
    transform: translateX(-30px);
    letter-spacing: 0px;
    color: var(--cl-ring-color);
  }
}


```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you shoud clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.querySelector('.custom_loader_wrap').style.display = 'none'; 
})();


```

## Customization

You can modify these custom properties inside `.custom_loader_wrap` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

/* 1. page background color */
--cl-background: #3c4359;

/* 2. loader size */
--cl-size: 300px;

/* 3. planet color */
--cl-planet-color: #546c8c;

/* 4. ring color */
--cl-ring-color: #bacbd9;

/* 5. ring color (a bit darker) */
--cl-ring-color-darkder: #7ea1bf;

/* 6. spot color */
--cl-spot-color: #3c4359;

/* 7. animation duration */
--cl-animation-duration: 3s;

/* 8. text animation duration */
--cl-text-animation-duration: 4s;


```




