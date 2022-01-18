
# LOADER: 3d rotating color bars

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [video_loader_example_3d_rotating_color_bars.mp4](video_loader_example_3d_rotating_color_bars.mp4)



https://user-images.githubusercontent.com/22041360/149852037-c2807bab-dca7-4a21-910c-ee30f164ddf6.mp4



Original Source on Codepen: [https://codepen.io/websamples/pen/EzJwZV](https://codepen.io/websamples/pen/EzJwZV)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div id="3square_loader" class="visible_loader square_loader">
  <div class="loader_holder">
    <div class="square_color1">
      <div class="square_front_side"></div>
      <div class="square_back_side"></div>
      <div class="square_left_side"></div>
      <div class="square_right_side"></div>
      <div class="square_top_side"></div>
      <div class="square_bottom_side"></div>
    </div>
  
    <div class="square_color2">
      <div class="square_front_side"></div>
      <div class="square_back_side"></div>
      <div class="square_left_side"></div>
      <div class="square_right_side"></div>
      <div class="square_top_side"></div>
      <div class="square_bottom_side"></div>
    </div>
  
    <div class="square_color3">
      <div class="square_front_side"></div>
      <div class="square_back_side"></div>
      <div class="square_left_side"></div>
      <div class="square_right_side"></div>
      <div class="square_top_side"></div>
      <div class="square_bottom_side"></div>
    </div>

  </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

/* global vars (here you can easily modify how the loader looks) 
 ** And if the style you're looking for is not listed here,
** or, if you require a completely different custom loader,
** you can always contact us at support@awe.media
*/
:root{
  --loader_custom_color_background: #D8D7D8;  /* <-- page background color */
  --loader_3dcube_color1: cyan;  /* <-- first cube color */
  --loader_3dcube_color2: magenta;  /* <-- second cube color */
  --loader_3dcube_color3: yellow  /* <-- third cube color */
}

*{
  box-sizing: border-box;
}
.visible_loader.square_loader{
  display: flex;
}

.square_loader{
  background-color: var( --loader_custom_color_background); 
  display: none;
  margin:0;
  height:100vh;
  width: 100vw;
  justify-content:center;
  align-items:center;
  transform:scale(1.8);
}
.loader_holder {
    width: 100px;
    height: 100px;
    font-size: 100px;
    display: flex;
    justify-content: space-between;
    transform: perspective(100px);
    transform-style: preserve-3d;
}
.loader_holder > div {
    width: 30%;
    height: 100%;
    transform-style: preserve-3d;
}
.loader_holder > div > div {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0.8;
}

.square_front_side, .back {
    width: 100%;
    height: 100%;
}
.square_front_side {
    transform: translateZ(-0.15em);
}
.square_back_side {
    transform: translateZ(0.15em);
}
.square_left_side {
    width: 100%;
    height: 100%;
    transform-origin: left center;
    transform: rotate3d(0, -1, 0, 90deg) translateX(-0.15em);
}
.square_right_side {
    width: 100%;
    height: 100%;
    transform-origin: right center;
    transform: rotate3d(0, 1, 0, 90deg) translateX(0.15em);
}

.square_top_side {
    width: 100%;
    height: 30%;
    transform-origin: center top;
    transform: rotate3d(1, 0, 0, 90deg)
               translateY(-0.15em);
}
.square_bottom_side {
    width: 100%;
    height: 30%;
    transform-origin: center top;
    transform: rotate3d(1, 0, 0, 90deg)
               translateZ(-1em)
               translateY(-0.15em);
}

.square_color1 > div {
    background: var( --loader_3dcube_color1); 
}
.square_color2 > div {
    background: var( --loader_3dcube_color2);
}
.square_color3 > div {
    background: var( --loader_3dcube_color3); 
}

.loader_holder {
    animation: 3s flip_loader infinite;
    animation-delay: 1s;
}
.loader_holder .square_color2 {
    animation: 3s flip_color2 infinite;
    animation-delay: 1s;
}
.loader_holder .square_color1 {
    animation: 3s flip_color1 infinite;
    animation-delay: 1s;
}

@keyframes flip_loader {
    100% {
        transform: perspective(100px) 
                   rotate3d(1, 1, 1, 360deg);
    }
}
@keyframes flip_color2 {
    100% {
        transform: rotateX(180deg);
    }
}
@keyframes flip_color1 {
    100% {
        transform: rotateX(-180deg);
    }
}


```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you shoud clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('3square_loader').classList.remove('visible_loader');
})();


```

## Customization

You can modify these custom properties inside `:root` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

:root{
  --loader_custom_color_background: #D8D7D8;  /* <-- page background color */
  --loader_3dcube_color1: cyan;  /* <-- first cube color */
  --loader_3dcube_color2: magenta;  /* <-- second cube color */
  --loader_3dcube_color3: yellow  /* <-- third cube color */
}


```

