# LOADER: Spining Circles

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [spinning_circles.mp4](spinning_circles.mp4)



https://user-images.githubusercontent.com/22041360/149852473-1498d90c-938d-48ff-bef2-0a88e77ec04b.mp4



Original Source on Codepen: [https://codepen.io/dead_seagull/pen/jVqzbJ](https://codepen.io/dead_seagull/pen/jVqzbJ)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_inner">
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
    <div class="custom_loader_circle"></div>
  </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

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
  --cl-background: #111;
  
  /* 2. loader size */
  --cl-size: 70vmin;

  /* 3. spinner color */
  --cl-spinner-color: #fff;

  /* 4. border width */
  --cl-border-width: 2px;
  
  /* 5. animation speed */
  --cl-animation-duration: 16s;
}

.custom_loader_inner {
  position: relative;
  display: block;
  width: var(--cl-size);
  height: var(--cl-size);
  transform-style: preserve-3d;
  transform: perspective(500px) rotateX(90deg);
}

.custom_loader_circle:nth-child(1) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: 0;
  top: 0;
  width: var(--cl-size);
  height: var(--cl-size);
  animation: circle_spin var(--cl-animation-duration) infinite linear;
}

.custom_loader_circle:nth-child(2) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.0454545);
  top: calc(var(--cl-size) * 0.0454545);
  width: calc(var(--cl-size) * 0.909090);
  height: calc(var(--cl-size) * 0.909090);
  animation: circle_spin calc(var(--cl-animation-duration) * 2) infinite linear;
}

.custom_loader_circle:nth-child(3) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.090909);
  top: calc(var(--cl-size) * 0.090909);
  width: calc(var(--cl-size) * 0.818);
  height: calc(var(--cl-size) * 0.818);
  animation: circle_spin var(--cl-animation-duration) infinite linear;
}

.custom_loader_circle:nth-child(4) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.1363636);
  top: calc(var(--cl-size) * 0.1363636);
  width: calc(var(--cl-size) * 0.727272);
  height: calc(var(--cl-size) * 0.727272);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.666666) infinite linear;
}

.custom_loader_circle:nth-child(5) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.181818);
  top: calc(var(--cl-size) * 0.181818);
  width: calc(var(--cl-size) * 0.636363);
  height: calc(var(--cl-size) * 0.636363);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.5) infinite linear;
}

.custom_loader_circle:nth-child(6) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.2272727);
  top: calc(var(--cl-size) * 0.2272727);
  width: calc(var(--cl-size) * 0.545454);
  height: calc(var(--cl-size) * 0.545454);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.4) infinite linear;
}

.custom_loader_circle:nth-child(7) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.272727);
  top: calc(var(--cl-size) * 0.272727);
  width: calc(var(--cl-size) * 0.454545);
  height: calc(var(--cl-size) * 0.454545);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.333333) infinite linear;
}

.custom_loader_circle:nth-child(8) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.3181818);
  top: calc(var(--cl-size) * 0.3181818);
  width: calc(var(--cl-size) * 0.363636);
  height: calc(var(--cl-size) * 0.363636);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.285714) infinite linear;
}

.custom_loader_circle:nth-child(9) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.363636);
  top: calc(var(--cl-size) * 0.363636);
  width: calc(var(--cl-size) * 0.272727);
  height: calc(var(--cl-size) * 0.272727);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.25) infinite linear;
}

.custom_loader_circle:nth-child(10) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.4090909);
  top: calc(var(--cl-size) * 0.4090909);
  width: calc(var(--cl-size) * 0.181818);
  height: calc(var(--cl-size) * 0.181818);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.222222) infinite linear;
}

.custom_loader_circle:nth-child(11) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.454545);
  top: calc(var(--cl-size) * 0.454545);
  width: calc(var(--cl-size) * 0.090909);
  height: calc(var(--cl-size) * 0.090909);
  animation: circle_spin calc(var(--cl-animation-duration) * 0.2) infinite linear;
}

.custom_loader_circle:nth-child(12) {
  position: absolute;
  background: transparent;
  border: var(--cl-border-width) solid var(--cl-spinner-color);
  border-radius: 50%;
  left: calc(var(--cl-size) * 0.5 - var(--cl-border-width));
  top: calc(var(--cl-size) * 0.5 - var(--cl-border-width));
  width: 0vh;
  height: 0vh;
  animation: circle_spin calc(var(--cl-animation-duration) * 0.181818) infinite linear;
}

.custom_loader_circle:nth-child(2n) {
  border: var(--cl-border-width) dashed var(--cl-spinner-color);
}

@keyframes circle_spin {
  from {
    transform: rotateX(0deg);
  }
  to {
    transform: rotateX(360deg);
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
--cl-background: #111;

/* 2. loader size */
--cl-size: 70vmin;

/* 3. spinner color */
--cl-spinner-color: #fff;

/* 4. border width */
--cl-border-width: 2px;

/* 5. animation speed */
--cl-animation-duration: 16s;


```




