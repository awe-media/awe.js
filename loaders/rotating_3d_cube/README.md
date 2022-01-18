# LOADER: Rotating 3D Cube

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [rotating_3d_cube.mp4](rotating_3d_cube.mp4)



https://user-images.githubusercontent.com/22041360/149852328-a3325666-245e-48f4-8354-b798d50a629a.mp4



Original Source on Codepen: [https://codepen.io/wiseoldman/pen/xgJzoQ](https://codepen.io/wiseoldman/pen/xgJzoQ)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_inner_wrap">
    <div class="custom_loader_cube">
      <div class="cude_side cube_front"></div>
      <div class="cude_side cube_back"></div>
      <div class="cube_side cube_left"></div>
      <div class="cube_side cube_right"></div>
      <div class="cude_side cube_top"></div>
      <div class="cude_side cube_bottom"></div>
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
  --cl-background: #15171c;  

  /* 2. cube width */
  --cl-cube-width: 15vmin;

  /* 3. cube front side background color */
  --cl-cube-bg-front: #3498db;

  /* 4. cube back side background color */
  --cl-cube-bg-back: #5ec6ce;

  /* 5. cube right side background color */
  --cl-cube-bg-right: #9b59b6;

  /* 6. cube left side background color */
  --cl-cube-bg-left: #e74c3c;

  /* 7. cube top side background color */
  --cl-cube-bg-top: #2ecc71;

  /* 8. cube bottom side background color */
  --cl-cube-bg-bottom: #f1c40f;

  /* 9. cube animation duration */
  --cl-cube-animation: 6s;

}

.custom_loader_inner_wrap {
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  position: relative;
  perspective: 1000px;
}

.custom_loader_cube {
  position: absolute;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  animation: cube_animation var(--cl-cube-animation) ease infinite;
}

.cube_front {
  position: absolute;
  background: var(--cl-cube-bg-front);
  transform: translateZ(calc(var(--cl-cube-width) * 0.9));
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  border-radius: var(--cl-cube-width);
}

.cube_back {
  position: absolute;
  background: var(--cl-cube-bg-back);
  transform: rotateX(-180deg) translateZ(calc(var(--cl-cube-width) * 0.9));
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  border-radius: var(--cl-cube-width);
}

.cube_right {
  position: absolute;
  background: var(--cl-cube-bg-right);
  transform: rotateY(90deg) translateZ(calc(var(--cl-cube-width) * 0.9));
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  border-radius: var(--cl-cube-width);
}

.cube_left {
  position: absolute;
  background: var(--cl-cube-bg-left);
  transform: rotateY(-90deg) translateZ(calc(var(--cl-cube-width) * 0.9));
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  border-radius: var(--cl-cube-width);
}

.cube_top { 
  position: absolute;
  background: var(--cl-cube-bg-top);
  transform: rotateX(90deg) translateZ(calc(var(--cl-cube-width) * 0.9));
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  border-radius: var(--cl-cube-width);
}

.cube_bottom {
  position: absolute;
  background: var(--cl-cube-bg-bottom);
  transform: rotateX(-90deg) translateZ(calc(var(--cl-cube-width) * 0.9));
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  border-radius: var(--cl-cube-width);
}

@keyframes cube_animation {
  16.5% {
    transform: translateZ(var(--cl-cube-width)) rotateX(-90deg);
  }
  33% {
    transform: translateZ(var(--cl-cube-width)) rotateX(90deg);
  }
  49.5% {
    transform: translateZ(var(--cl-cube-width)) rotateY(-90deg);
  }
  66% {
    transform: translateZ(var(--cl-cube-width)) rotateY(90deg);
  }
  82% {
    transform: translateZ(var(--cl-cube-width)) rotateX(-180deg);
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
--cl-background: #15171c;  

/* 2. cube width */
--cl-cube-width: 15vmin;

/* 3. cube front side background color */
--cl-cube-bg-front: #3498db;

/* 4. cube back side background color */
--cl-cube-bg-back: #5ec6ce;

/* 5. cube right side background color */
--cl-cube-bg-right: #9b59b6;

/* 6. cube left side background color */
--cl-cube-bg-left: #e74c3c;

/* 7. cube top side background color */
--cl-cube-bg-top: #2ecc71;

/* 8. cube bottom side background color */
--cl-cube-bg-bottom: #f1c40f;

/* 9. cube animation duration */
--cl-cube-animation: 6s;


```




