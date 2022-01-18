# LOADER: 3D Cube Scale

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [3d_cube_scale.mp4](3d_cube_scale.mp4)

Original Source on Codepen: [https://codepen.io/Rplus/pen/yXzaoW](https://codepen.io/Rplus/pen/yXzaoW)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_box">
    <div class="custom_loader_item">
      <div class="item_scale"></div>
      <div class="item_scale"></div>
      <div class="item_scale"></div>
      <div class="item_scale"></div>
    </div>
    <div class="custom_loader_item">
      <div class="item_scale"></div>
      <div class="item_scale"></div>
      <div class="item_scale"></div>
      <div class="item_scale"></div>
    </div>
    <div class="custom_loader_item">
      <div class="item_scale"></div>
      <div class="item_scale"></div>
      <div class="item_scale"></div>
      <div class="item_scale"></div>
    </div>
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
  --cl-background: #ccc;
  
  /* 2. items container size */
  --cl-size: 30vmin;

  /* 2. item top side color */
  --cl-item-color: #7f8084;

  /* 3. item left side color */
  --cl-item-left-side: #3a343c;

  /* 4. item left side color */
  --cl-item-right-side: #3a343c;
}

.custom_loader_box {
  width: calc(var(--cl-size) * 2);
  height: calc(var(--cl-size) * 2);
  margin: auto;
  transform-style: preserve-3d;
  transform: rotateX(60deg) rotateZ(45deg);
}

.custom_loader_item {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  width: var(--cl-size);
  height: var(--cl-size);
  transform-style: preserve-3d;
  animation: animate_move 2s var(--animate-delay) linear infinite;
}

.custom_loader_item:nth-of-type(1) {
  --animate-delay: -2s;
}

.custom_loader_item:nth-of-type(2) {
  --animate-delay: -1.33333s;
}

.custom_loader_item:nth-of-type(3) {
  --animate-delay: -0.66667s;
}

@keyframes animate_move {
  0%, 100% {
    transform: translateZ(calc(var(--cl-size) / 2));
  }
  10% {
    transform: translateZ(0px);
  }
  20% {
    transform: translateZ(calc(var(--cl-size) / -2));
  }
}

.item_scale {
  position: absolute;
  top: 0;
  right: 50%;
  width: calc(var(--cl-size) / 5);
  height: 100%;
  color: var(--cl-item-color);
  background-color: currentColor;
  transform-origin: 100% 50%;
  transform-style: preserve-3d;
  animation: inherit;
  animation-name: animate_scale;
}

@keyframes animate_scale {
  0%,
  100%,
  5% {
    transform: rotate(var(--item-rotate, 0deg)) translateX(calc(var(--cl-size) * 0.1)) scaleY(0.2);
  }
  20% {
    transform: rotate(var(--item-rotate, 0deg)) translateX(calc(var(--cl-size) * 0.25)) scaleY(0.5);
  }
  30% {
    transform: rotate(var(--item-rotate, 0deg)) translateX(calc(var(--cl-size) * 0.5)) scaleY(1);
  }
  60% {
    transform: rotate(var(--item-rotate, 0deg)) translateX(calc(var(--cl-size) * 0.4)) scaleY(0.8);
  }
}

.item_scale::before {
  content: "";
  position: absolute;
  top: 0;
  left: calc(100% * var(--d, 1));
  bottom: 0;
  width: 100%;
  background-color: var(--color-dl, #2d282e);
  transform-origin: 0% 50%;
  transform: rotateY(90deg);
}

.item_scale:nth-of-type(2) {
  --color-dl: var(--cl-item-left-side);
  --item-rotate: 90deg;
}

.item_scale:nth-of-type(3) {
  --d: 0;
  --item-rotate: 180deg;
}

.item_scale:nth-of-type(4) {
  --color-dl: var(--cl-item-right-side);
  --d: 0;
  --item-rotate: 270deg;
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
--cl-background: #ccc;

/* 2. items container size */
--cl-size: 30vmin;

/* 2. item top side color */
--cl-item-color: #7f8084;

/* 3. item left side color */
--cl-item-left-side: #3a343c;

/* 4. item left side color */
--cl-item-right-side: #3a343c;


```




