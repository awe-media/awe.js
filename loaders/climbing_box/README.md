# LOADER: Climbing Box

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [climbing_box.mp4](climbing_box.mp4)



https://user-images.githubusercontent.com/22041360/149852094-c088a6e4-9d83-4bfa-a4c6-cb6490eac1ac.mp4



Original Source on Codepen: [https://codepen.io/pawelqcm/pen/dMqrqd](https://codepen.io/pawelqcm/pen/dMqrqd)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_inner">
    <div class="custom_loader_box"></div>
    <div class="custom_loader_hill"></div>
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
  overflow: auto; 
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
  background-color: var(--cl-background);

  /*
  ** You can modify these custom properties to change how the loader looks on the front end.
  ** And if the style you're looking for is not listed here, 
  ** or, if you require a completely different custom loader,
  ** you can always contact us at support@awe.media
  */

  /* 1. page background color */
  --cl-background: #404456; 

  /* 2. animation container width, recommended value from 20vin - 60vmin*/
  --cl-width: 50vmin; 

  /* 3. hill color */
  --cl-hill-color: whitesmoke; 

  /* 4. box animation duration */
  --cl-box-animation: 2.5s;
  
}

.custom_loader_inner {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: calc(var(--cl-width) / -2);
  margin-left: calc(var(--cl-width) / -2);
  width: var(--cl-width);
  height: var(--cl-width);
}

.custom_loader_hill {
  position: absolute;
  width: calc(var(--cl-width) * 1.3);
  height: calc(var(--cl-width) * 1.3);
  top: calc(var(--cl-width) * 0.3);
  left: calc(var(--cl-width) * 0.3);
  background-color: transparent;
  border-left: calc(var(--cl-width) * 0.045) solid var(--cl-hill-color);
  transform: rotate(45deg);
}

.custom_loader_box {
  position: absolute;
  left: 0;
  bottom: calc(var(--cl-width) * -.0185);
  width: calc(var(--cl-width) * 0.185);
  height: calc(var(--cl-width) * 0.185);
  background-color: transparent;
  border: calc(var(--cl-width) * 0.045) solid var(--cl-hill-color);
  border-radius: 15%;
  transform: translate(0, calc(var(--cl-width) * -.0185)) rotate(-45deg);
  animation: box-push var(--cl-box-animation) cubic-bezier(.79, 0, .47, .97) infinite;
}

@keyframes box-push {
  0% {
    transform: translate(0, calc(var(--cl-width) * -0.185)) rotate(-45deg);
  }
  5% {
    transform: translate(0, calc(var(--cl-width) * -0.185)) rotate(-50deg);
  }
  20% {
    transform: translate(calc(var(--cl-width) * 0.185), calc(var(--cl-width) * -0.37)) rotate(47deg);
  }
  25% {
    transform: translate(calc(var(--cl-width) * 0.185), calc(var(--cl-width) * -0.37)) rotate(45deg);
  }
  30% {
    transform: translate(calc(var(--cl-width) * 0.185), calc(var(--cl-width) * -0.37)) rotate(40deg);
  }
  45% {
    transform: translate(calc(var(--cl-width) * 0.37), calc(var(--cl-width) * -0.56)) rotate(137deg);
  }
  50% {
    transform: translate(calc(var(--cl-width) * 0.37), calc(var(--cl-width) * -0.56)) rotate(135deg);
  }
  55% {
    transform: translate(calc(var(--cl-width) * 0.37), calc(var(--cl-width) * -0.56)) rotate(130deg);
  }
  70% {
    transform: translate(calc(var(--cl-width) * 0.56), calc(var(--cl-width) * -0.74)) rotate(217deg);
  }
  75% {
    transform: translate(calc(var(--cl-width) * 0.56), calc(var(--cl-width) * -0.74)) rotate(220deg);
  }
  100% {
    transform: translate(0, calc(var(--cl-width) * -0.185)) rotate(-225deg);
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
--cl-background: #404456; 

/* 2. animation container width, recommended value from 20vin - 60vmin*/
--cl-width: 50vmin; 

/* 3. hill color */
--cl-hill-color: whitesmoke; 

/* 4. box animation duration */
--cl-box-animation: 2.5s;


```




