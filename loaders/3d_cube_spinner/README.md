# LOADER: 3D Cube Spinner

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [3d_cube_spinner_video.mp4](3d_cube_spinner_video.mp4)



https://user-images.githubusercontent.com/22041360/149851906-afe1bdca-9f83-47d1-b932-bc599c9861d0.mp4



Original Source on Codepen: [https://codepen.io/CompuIves/pen/Ojjdoj](https://codepen.io/CompuIves/pen/Ojjdoj)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_inner_wrap">
    <div class="custom_loader_cube">
      <div class="custom_loader_sides">
        <div class="cude_side cube_top"></div>
        <div class="cude_side cube_bottom"></div>
        <div class="cude_side cube_front"></div>
        <div class="cude_side cube_back"></div>
        <div class="cube_side cube_left"></div>
        <div class="cube_side cube_right"></div>
      </div>
    </div>
    <div class="custom_loader_text">
      BUNDLING DEPENDENCIES
    </div>
  </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

/* Custom styles starts here */
@import url('https://fonts.googleapis.com/css2?family=Lato:wght@600&display=swap');

* { box-sizing: border-box; }

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
  --cl-background: #FFD399;    

  /* 2. cube border color */
  --cl-cube-border-color: white; 

  /* 3. cube width, width from 15vmin to 30vmin will look great */
  --cl-cube-width: 25vmin; 

  /* 4. border width (1/10 of cube width) */
  --cl-cube-border-width: calc(var(--cl-cube-width) / 10); 

  /* 5. cube background color */
  --cl-cube-background: rgba(242, 119, 119, .5); 

  /* 6. text color */
  --cl-text-color: rgba(242, 119, 119, 1); 

  /* 7. text font size */
  --cl-text-font-size: 1rem; 

  /* 8. text font weight */
  --cl-text-font-weight: 600; 
}

.custom_loader_inner_wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.custom_loader_cube, 
.custom_loader_cube * {
  position: absolute;
  width: calc(var(--cl-cube-width) + 1px);
  height: calc(var(--cl-cube-width) + 1px);
}

.custom_loader_sides {
  transform-style: preserve-3d;
  transform: rotateX(-37.5deg) rotateY(45deg);
  animation: sides_rotate 3s ease infinite;
  animation-delay: 0.8s;
}

@keyframes sides_rotate {
  0% {
    transform: rotateX(-37.5deg) rotateY(45deg);
  }
  50% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
  100% {
    transform: rotateX(-37.5deg) rotateY(405deg);
  }
}

.custom_loader_sides * {
  background-color: var(--cl-cube-background);
  border: var(--cl-cube-border-width) solid var(--cl-cube-border-color);
  transform-origin: 50% 50%;
}

.custom_loader_text {
  margin-top: calc(var(--cl-cube-width) * 3.5);
  color: var(--cl-text-color);
  font-size: var(--cl-text-font-size);
  font-weight: var(--cl-text-font-weight);
  width: 100%;
  text-align: center;
}

.cube_top {
  --cube-animate-delay: 0;
  --cube-rotate-x: 90deg;
  --cube-rotate-y: 0;
  transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  animation: 3s ease infinite forwards cube_animate; 
  animation-delay: var(--cube-animate-delay); 
}

.cube_bottom {
  --cube-animate-delay: 0;
  --cube-rotate-x: -90deg;
  --cube-rotate-y: 0;
  transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  animation: 3s ease infinite forwards cube_animate;
  animation-delay: var(--cube-animate-delay);
}

.cube_front {
  --cube-animate-delay: 0.1s;
  --cube-rotate-y: 0deg;
  --cube-rotate-x: 0;
  transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  animation: 3s ease infinite forwards cube_animate;
  animation-delay: var(--cube-animate-delay);
}

.cube_back {
  --cube-animate-delay: 0.1s;
  --cube-rotate-y: -180deg;
  --cube-rotate-x: 0;
  transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  animation: 3s ease infinite forwards cube_animate;
  animation-delay: var(--cube-animate-delay);
}

.cube_left {
  --cube-animate-delay: 0.1s;
  --cube-rotate-y: -90deg;
  --cube-rotate-x: 0;
  transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  animation: 3s ease infinite forwards cube_animate;
  animation-delay: var(--cube-animate-delay);
}

.cube_right {
  --cube-animate-delay: 0.1s;
  --cube-rotate-y: 90deg;
  --cube-rotate-x: 0;
  transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  animation: 3s ease infinite forwards cube_animate;
  animation-delay: var(--cube-animate-delay);
}

@keyframes cube_animate {
  0% {
    opacity: 1;
    transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  }
  20% {
    opacity: 1;
    transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(calc(var(--cl-cube-width) / 2));
  }
  70% {
    opacity: 1;
    transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(calc(var(--cl-cube-width) / 2));
  }
  90% {
    opacity: 1;
    transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
  }
  100% {
    opacity: 1;
    transform: rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) translateZ(var(--cl-cube-width));
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
--cl-background: #FFD399;    

/* 2. cube border color */
--cl-cube-border-color: white; 

/* 3. cube width, width from 15vmin to 30vmin will look great */
--cl-cube-width: 25vmin; 

/* 4. border width (1/10 of cube width) */
--cl-cube-border-width: calc(var(--cl-cube-width) / 10); 

/* 5. cube background color */
--cl-cube-background: rgba(242, 119, 119, .5); 

/* 6. text color */
--cl-text-color: rgba(242, 119, 119, 1); 

/* 7. text font size */
--cl-text-font-size: 1rem; 

/* 8. text font weight */
--cl-text-font-weight: 600; 


```




