# LOADER: Rotating 3D Cube with Shadow

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [rotating_3d_cube_with_shadow.mp4](rotating_3d_cube_with_shadow.mp4)



https://user-images.githubusercontent.com/22041360/149852349-a02b87d2-e04b-47be-8c20-bf0f5b38fa77.mp4



Original Source on Codepen: [https://codepen.io/Rplus/pen/XgEBjd](https://codepen.io/Rplus/pen/XgEBjd)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_box">
    <div class="custom_loader_cube"></div>
    <div class="custom_loader_cube"></div>
    <div class="custom_loader_cube"></div>
    <div class="custom_loader_cube"></div>
  </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

.custom_loader_wrap * {
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

  /* 1. cube top side background color */
  --cl-cube-background: #FED74C;

  /* 2. cube south-east side background color */
  --cl-cube-south-east-side: #C97431;

  /* 3. cube south-west side background color */
  --cl-cube-south-west-side: #E7A22B;

  /* 4. cube shadow color */
  --cl-cube-shadow: #DBDBDB;
  
  /* 5. cube width, recommended value from 10vmin - 20vmin,
  but please avoid using 15vmin, as there is a strange white border when viewed on iPhone */
  --cl-cube-width: 16vmin;

  /* 6. cube shadow color */
  --cl-background: #fff;
}

.custom_loader_box {
  width: calc(var(--cl-cube-width) * 3);
  height: calc(var(--cl-cube-width) * 2);
  margin-bottom: 20vmin;
  transform-style: preserve-3d;
  transform: rotateX(60deg) rotateZ(45deg);
}

.custom_loader_cube {
  position: absolute;
  width: var(--cl-cube-width);
  height: var(--cl-cube-width);
  background: var(--cl-cube-background);
  animation: cube_move 3s ease-in-out infinite;
  transform-style: preserve-3d;
  box-shadow: 
    calc(var(--cl-cube-width) * 5) 
    calc(var(--cl-cube-width) * 5)
    calc(var(--cl-cube-width) * 0.3)
    calc(var(--cl-cube-width) * 0.1)
    var(--cl-cube-shadow);
}

.custom_loader_cube::before,
.custom_loader_cube::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.custom_loader_cube::before {
  background-color: var(--cl-cube-south-east-side);
  transform-origin: 100% 100%;
  transform: rotateY(-90deg);
}

.custom_loader_cube::after {
  background-color: var(--cl-cube-south-west-side);
  transform-origin: 0% 100%;
  transform: rotateX(90deg);
}

.custom_loader_cube:nth-of-type(1) {
  animation-delay: -11.25s;
}

.custom_loader_cube:nth-of-type(2) {
  animation-delay: -10.5s;
}

.custom_loader_cube:nth-of-type(3) {
  animation-delay: -9.75s;
}

.custom_loader_cube:nth-of-type(4) {
  animation-delay: -9s;
}

@keyframes cube_move {
  0%, 87.5%, 100% {
    transform: translate(var(--cl-cube-width), 0em);
  }
  12.5% {
    transform: translate(calc(var(--cl-cube-width) * 2), 0em);
  }
  25% {
    transform: translate(calc(var(--cl-cube-width) * 2), var(--cl-cube-width));
  }
  37.5%, 50% {
    transform: translate(var(--cl-cube-width), var(--cl-cube-width));
  }
  62.5% {
    transform: translate(0em, var(--cl-cube-width));
  }
  75% {
    transform: translate(0em, 0em);
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

/* 1. cube top side background color */
--cl-cube-background: #FED74C;

/* 2. cube south-east side background color */
--cl-cube-south-east-side: #C97431;

/* 3. cube south-west side background color */
--cl-cube-south-west-side: #E7A22B;

/* 4. cube shadow color */
--cl-cube-shadow: #DBDBDB;

/* 5. cube width, recommended value from 10vmin - 20vmin,
but please avoid using 15vmin, as there is a strange white border when viewed on iPhone */
--cl-cube-width: 16vmin;

/* 6. cube shadow color */
--cl-background: #fff;


```




