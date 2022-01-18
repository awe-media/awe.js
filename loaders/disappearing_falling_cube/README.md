
# LOADER: disappearing falling cube

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [video_loader_example_disappearing_falling_cube.mp4](video_loader_example_disappearing_falling_cube.mp4)



https://user-images.githubusercontent.com/22041360/149852135-5bceb77f-f2bc-4aa7-acc3-244e0ecb3cf6.mp4



Original Source on Codepen: [https://codepen.io/aaroniker/pen/MWgRBdV](https://codepen.io/aaroniker/pen/MWgRBdV)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div id="cubes_loader_holder" class="loader_bigcube_wrapper visible_loader">
  <div class="loader_bigcube">
    <div class="box3d box0">
      <div></div>
    </div>
    <div class="box3d box1">
      <div></div>
    </div>
    <div class="box3d box2">
      <div></div>
    </div>
    <div class="box3d box3">
      <div></div>
    </div>
    <div class="box3d box4">
      <div></div>
    </div>
    <div class="box3d box5">
      <div></div>
    </div>
    <div class="box3d box6">
      <div></div>
    </div>
    <div class="box3d box7">
      <div></div>
    </div>
    <div class="ground">
      <div></div>
    </div>
  </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css
:root {
  --background-loader-color: #121621; /* <-- you can change here the page background color */
  --primary-cube-loader-color: rgba(39, 94, 254, 1); /* <-- you can change here the page square primary color  */
  --primary-light: #2f71ff; /* <-- you can change here the page square primary color (light version)  */
  --primary-rgba: rgba(39, 94, 254, 0); /* <-- you can change here the page square primary color (darker version) */
  --duration-loader-animation: 3s; /* <-- you can change here the animation duration */
}
.loader_bigcube_wrapper.visible_loader {
  display: flex;
}
.loader_bigcube_wrapper {
  background-color: var(--background-loader-color);
  min-width: 100vw;
  min-height: 100vh;
  display: none;
  justify-content: center;
  align-items: center;
}
.loader_bigcube {
  width: 200px;
  height: 320px;
  position: relative;
  transform-style: preserve-3d;
  margin: auto;
}
@media (max-width: 480px) {
  .loader_bigcube {
    zoom: 0.44;
  }
}
.loader_bigcube:before, .loader_bigcube:after {
  --r: 20.5deg;
  content: "";
  width: 320px;
  height: 140px;
  position: absolute;
  right: 32%;
  bottom: -11px;
  background: var(--background-loader-color);
  transform: translateZ(200px) rotate(var(--r));
  -webkit-animation: mask var(--duration-loader-animation) linear forwards infinite;
          animation: mask var(--duration-loader-animation) linear forwards infinite;
}
.loader_bigcube:after {
  --r: -20.5deg;
  right: auto;
  left: 32%;
}
.loader_bigcube .ground {
  position: absolute;
  left: -50px;
  bottom: -120px;
  transform-style: preserve-3d;
  transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
}
.loader_bigcube .ground div {
  transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
  width: 200px;
  height: 200px;
  background: var(--primary-cube-loader-color);
  background: linear-gradient(45deg, var(--primary-cube-loader-color) 0%, var(--primary-cube-loader-color) 50%, var(--primary-light) 50%, var(--primary-light) 100%);
  transform-style: preserve-3d;
  -webkit-animation: ground var(--duration-loader-animation) linear forwards infinite;
          animation: ground var(--duration-loader-animation) linear forwards infinite;
}
.loader_bigcube .ground div:before, .loader_bigcube .ground div:after {
  --rx: 90deg;
  --ry: 0deg;
  --x: 44px;
  --y: 162px;
  --z: -50px;
  content: "";
  width: 156px;
  height: 300px;
  opacity: 0;
  background: linear-gradient(var(--primary-cube-loader-color), var(--primary-rgba));
  position: absolute;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
  -webkit-animation: ground-shine var(--duration-loader-animation) linear forwards infinite;
          animation: ground-shine var(--duration-loader-animation) linear forwards infinite;
}
.loader_bigcube .ground div:after {
  --rx: 90deg;
  --ry: 90deg;
  --x: 0;
  --y: 177px;
  --z: 150px;
}
.loader_bigcube .box3d{
  --x: 0;
  --y: 0;
  position: absolute;
  -webkit-animation: var(--duration-loader-animation) linear forwards infinite;
          animation: var(--duration-loader-animation) linear forwards infinite;
  transform: translate(var(--x), var(--y));
}
.loader_bigcube .box3d div {
  background-color: var(--primary-cube-loader-color);
  width: 48px;
  height: 48px;
  position: relative;
  transform-style: preserve-3d;
  -webkit-animation: var(--duration-loader-animation) ease forwards infinite;
          animation: var(--duration-loader-animation) ease forwards infinite;
  transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
}
.loader_bigcube .box3d div:before, .loader_bigcube .box3d div:after {
  --rx: 90deg;
  --ry: 0deg;
  --z: 24px;
  --y: -24px;
  --x: 0;
  content: "";
  position: absolute;
  background-color: inherit;
  width: inherit;
  height: inherit;
  transform: rotateX(var(--rx)) rotateY(var(--ry)) translate(var(--x), var(--y)) translateZ(var(--z));
  filter: brightness(var(--b, 1.2));
}
.loader_bigcube .box3d div:after {
  --rx: 0deg;
  --ry: 90deg;
  --x: 24px;
  --y: 0;
  --b: 1.4;
}
.loader_bigcube .box3d.box0 {
  --x: -220px;
  --y: -120px;
  left: 58px;
  top: 108px;
}
.loader_bigcube .box3d.box1 {
  --x: -260px;
  --y: 120px;
  left: 25px;
  top: 120px;
}
.loader_bigcube .box3d.box2 {
  --x: 120px;
  --y: -190px;
  left: 58px;
  top: 64px;
}
.loader_bigcube .box3d.box3 {
  --x: 280px;
  --y: -40px;
  left: 91px;
  top: 120px;
}
.loader_bigcube .box3d.box4 {
  --x: 60px;
  --y: 200px;
  left: 58px;
  top: 132px;
}
.loader_bigcube .box3d.box5 {
  --x: -220px;
  --y: -120px;
  left: 25px;
  top: 76px;
}
.loader_bigcube .box3d.box6 {
  --x: -260px;
  --y: 120px;
  left: 91px;
  top: 76px;
}
.loader_bigcube .box3d.box7 {
  --x: -240px;
  --y: 200px;
  left: 58px;
  top: 87px;
}
.loader_bigcube .box0 {
  -webkit-animation-name: box-move0;
          animation-name: box-move0;
}
.loader_bigcube .box0 div {
  -webkit-animation-name: box-scale0;
          animation-name: box-scale0;
}
.loader_bigcube .box1 {
  -webkit-animation-name: box-move1;
          animation-name: box-move1;
}
.loader_bigcube .box1 div {
  -webkit-animation-name: box-scale1;
          animation-name: box-scale1;
}
.loader_bigcube .box2 {
  -webkit-animation-name: box-move2;
          animation-name: box-move2;
}
.loader_bigcube .box2 div {
  -webkit-animation-name: box-scale2;
          animation-name: box-scale2;
}
.loader_bigcube .box3 {
  -webkit-animation-name: box-move3;
          animation-name: box-move3;
}
.loader_bigcube .box3 div {
  -webkit-animation-name: box-scale3;
          animation-name: box-scale3;
}
.loader_bigcube .box4 {
  -webkit-animation-name: box-move4;
          animation-name: box-move4;
}
.loader_bigcube .box4 div {
  -webkit-animation-name: box-scale4;
          animation-name: box-scale4;
}
.loader_bigcube .box5 {
  -webkit-animation-name: box-move5;
          animation-name: box-move5;
}
.loader_bigcube .box5 div {
  -webkit-animation-name: box-scale5;
          animation-name: box-scale5;
}
.loader_bigcube .box6 {
  -webkit-animation-name: box-move6;
          animation-name: box-move6;
}
.loader_bigcube .box6 div {
  -webkit-animation-name: box-scale6;
          animation-name: box-scale6;
}
.loader_bigcube .box7 {
  -webkit-animation-name: box-move7;
          animation-name: box-move7;
}
.loader_bigcube .box7 div {
  -webkit-animation-name: box-scale7;
          animation-name: box-scale7;
}
@-webkit-keyframes box-move0 {
  12% {
    transform: translate(var(--x), var(--y));
  }
  25%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}

@keyframes box-move0 {
  12% {
    transform: translate(var(--x), var(--y));
  }
  25%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale0 {
  6% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  14%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale0 {
  6% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  14%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes box-move1 {
  16% {
    transform: translate(var(--x), var(--y));
  }
  29%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@keyframes box-move1 {
  16% {
    transform: translate(var(--x), var(--y));
  }
  29%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale1 {
  10% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  18%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale1 {
  10% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  18%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes box-move2 {
  20% {
    transform: translate(var(--x), var(--y));
  }
  33%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@keyframes box-move2 {
  20% {
    transform: translate(var(--x), var(--y));
  }
  33%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale2 {
  14% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  22%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale2 {
  14% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  22%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes box-move3 {
  24% {
    transform: translate(var(--x), var(--y));
  }
  37%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@keyframes box-move3 {
  24% {
    transform: translate(var(--x), var(--y));
  }
  37%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale3 {
  18% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  26%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale3 {
  18% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  26%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes box-move4 {
  28% {
    transform: translate(var(--x), var(--y));
  }
  41%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@keyframes box-move4 {
  28% {
    transform: translate(var(--x), var(--y));
  }
  41%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale4 {
  22% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  30%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale4 {
  22% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  30%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes box-move5 {
  32% {
    transform: translate(var(--x), var(--y));
  }
  45%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@keyframes box-move5 {
  32% {
    transform: translate(var(--x), var(--y));
  }
  45%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale5 {
  26% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  34%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale5 {
  26% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  34%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes box-move6 {
  36% {
    transform: translate(var(--x), var(--y));
  }
  49%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@keyframes box-move6 {
  36% {
    transform: translate(var(--x), var(--y));
  }
  49%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale6 {
  30% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  38%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale6 {
  30% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  38%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes box-move7 {
  40% {
    transform: translate(var(--x), var(--y));
  }
  53%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@keyframes box-move7 {
  40% {
    transform: translate(var(--x), var(--y));
  }
  53%, 52% {
    transform: translate(0, 0);
  }
  80% {
    transform: translate(0, -32px);
  }
  90%, 100% {
    transform: translate(0, 188px);
  }
}
@-webkit-keyframes box-scale7 {
  34% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  42%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@keyframes box-scale7 {
  34% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(0);
  }
  42%, 100% {
    transform: rotateY(-47deg) rotateX(-15deg) rotateZ(15deg) scale(1);
  }
}
@-webkit-keyframes ground {
  0%, 65% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
  }
  75%, 90% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(1);
  }
  100% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
  }
}
@keyframes ground {
  0%, 65% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
  }
  75%, 90% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(1);
  }
  100% {
    transform: rotateX(90deg) rotateY(0deg) translate(-48px, -120px) translateZ(100px) scale(0);
  }
}
@-webkit-keyframes ground-shine {
  0%, 70% {
    opacity: 0;
  }
  75%, 87% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@keyframes ground-shine {
  0%, 70% {
    opacity: 0;
  }
  75%, 87% {
    opacity: 0.2;
  }
  100% {
    opacity: 0;
  }
}
@-webkit-keyframes mask {
  0%, 65% {
    opacity: 0;
  }
  66%, 100% {
    opacity: 1;
  }
}
@keyframes mask {
  0%, 65% {
    opacity: 0;
  }
  66%, 100% {
    opacity: 1;
  }
}


```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you shoud clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('cubes_loader_holder').classList.remove('visible_loader');
})();


```

## Customization

You can modify these custom properties inside `:root` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

:root {
  --background-loader-color: #121621; /* <-- you can change here the page background color */
  --primary-cube-loader-color: rgba(39, 94, 254, 1); /* <-- you can change here the page square primary color  */
  --primary-light: #2f71ff; /* <-- you can change here the page square primary color (light version)  */
  --primary-rgba: rgba(39, 94, 254, 0); /* <-- you can change here the page square primary color (darker version) */
  --duration-loader-animation: 3s; /* <-- you can change here the animation duration */
}

```

