

# LOADER: waving stripes

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [video_loader_example_waving_stripes.mp4](video_loader_example_waving_stripes.mp4)



https://user-images.githubusercontent.com/22041360/149852513-7d228c80-8a15-45b2-acc8-84e9d8a8b9e5.mp4



Original Source on Codepen: [https://codepen.io/JeromeRenders/pen/wMMMLV?editors=1100](https://codepen.io/JeromeRenders/pen/wMMMLV?editors=1100)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div id="waves_line_loader_wrapper" class="waves_line_loader_wrapper visible_loader">
  <ul class="page_loader_content">
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
    <li class="line_loader"><span class="wave_loader"></span></li>
  </ul>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

:root{
 --loader_color_waves_background: #f1e6d9; /*<-- you can change here the page background color */
 --loader_color_bar_waves1: #a70747; /*<--  you can change here the first stripe color (same as the second wave) */
 --loader_color_bar_waves2: #f2d9bb; /*<--  you can change here the second stripe color (same as the first wave) */
 --loader_speed_waves: 2.4s /*<--  you can change here the waves speed (how long it takes to get to the other side) */

}

.waves_line_loader_wrapper.visible_loader {
  display: block;
}

.waves_line_loader_wrapper {
  background: var(--loader_color_waves_background);
  min-width: 100vw;
  min-height: 100vh;
  display:none;
  position:fixed;
  top:0;
  right:0;
  left:0;
  bottom:0;
}

ul.page_loader_content {
  position: absolute;
  width: 260px;
  height: 375px;
  top: 50%;
  left: 50%;
  box-shadow: 0 3px 20px #88571B;
  border-radius: 7px;
  overflow: hidden;
  transform: translate(-50%, -50%);
  padding: 0px;
}
ul.page_loader_content li.line_loader {
  position: relative;
  float: left;
  width: 100%;
  height: 25px;
  overflow: hidden;
}
ul.page_loader_content li.line_loader span.wave_loader {
  position: absolute;
  display: block;
  width: 18px;
  height: 18px;
  bottom: 0;
  left: -20px;
  border-radius: 50%;
}
ul.page_loader_content li.line_loader span.wave_loader:before, ul.page_loader_content li.line_loader span.wave_loader:after {
  content: "";
  position: absolute;
}
ul.page_loader_content li.line_loader span.wave_loader:before {
  width: 38px;
  height: 20px;
  top: 0px;
  left: -32px;
  transform-origin: 100% 0%;
  transform: rotate(-30deg);
}
ul.page_loader_content li.line_loader span.wave_loader:after {
  width: 10px;
  height: 30px;
  top: 7px;
  right: -4px;
  transform: rotate(-15deg);
}
ul.page_loader_content li.line_loader:nth-child(odd) {
  background: var(--loader_color_bar_waves2);
}
ul.page_loader_content li.line_loader:nth-child(odd) span, ul.page_loader_content li.line_loader:nth-child(odd) span:before, ul.page_loader_content li.line_loader:nth-child(odd) span:after {
  background: var(--loader_color_bar_waves1);
}
ul.page_loader_content li.line_loader:nth-child(even) {
  background: var(--loader_color_bar_waves1);
}
ul.page_loader_content li.line_loader:nth-child(even) span, ul.page_loader_content li.line_loader:nth-child(even) span:before, ul.page_loader_content li.line_loader:nth-child(even) span:after {
  background: var(--loader_color_bar_waves2);
}
ul.page_loader_content li.line_loader:last-child span, ul.page_loader_content li.line_loader:last-child span:before, ul.page_loader_content li.line_loader:last-child span:after {
  display: none;
}

li.line_loader:nth-child(1) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.1s;
}

li.line_loader:nth-child(2) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.2s;
}

li.line_loader:nth-child(3) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.3s;
}

li.line_loader:nth-child(4) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.4s;
}

li.line_loader:nth-child(5) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.5s;
}

li.line_loader:nth-child(6) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.6s;
}

li.line_loader:nth-child(7) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.7s;
}

li.line_loader:nth-child(8) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.8s;
}

li.line_loader:nth-child(9) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 0.9s;
}

li.line_loader:nth-child(10) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 1s;
}

li.line_loader:nth-child(11) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 1.1s;
}

li.line_loader:nth-child(12) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 1.2s;
}

li.line_loader:nth-child(13) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 1.3s;
}

li.line_loader:nth-child(14) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 1.4s;
}

li.line:nth-child(15) span {
  animation: move_wave_loader var(--loader_speed_waves) ease-in-out infinite;
  animation-delay: 1.5s;
}
@keyframes move_wave_loader {
  from {
    left: -20px;
  }
  to {
    left: 280px;
  }
}

```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you should clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('waves_line_loader_wrapper').classList.remove('visible_loader');
})();


```

## Customization

You can modify these custom properties inside `:root` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

:root{
 --loader_color_waves_background: #f1e6d9; /*<-- you can change here the page background color */
 --loader_color_bar_waves1: #a70747; /*<--  you can change here the first stripe color (same as the second wave) */
 --loader_color_bar_waves2: #f2d9bb; /*<--  you can change here the second stripe color (same as the first wave) */
 --loader_speed_waves: 2.4s /*<--  you can change here the waves speed (how long it takes to get to the other side) */

}


```

