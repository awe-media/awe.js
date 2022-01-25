
# LOADER: 4 plates spinner

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [video_loader_example_4_plates_spinner.mp4](video_loader_example_4_plates_spinner.mp4)



https://user-images.githubusercontent.com/22041360/149852073-b69e2be4-f311-41d8-b826-11694c9136d7.mp4



Original Source on Codepen: [https://codepen.io/martinvd/pen/GehBy](https://codepen.io/martinvd/pen/GehBy)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div id="loader_plates_spinner" class="spinner_wrapper visible_loader">
   <div class="spinner_loader spinner_lower_side">
      <div class="spinner_outer_side">
        <div class="spinner_inner_side tl_spinner"></div>
        <div class="spinner_inner_side tr_spinner"></div>
        <div class="spinner_inner_side br_spinner"></div>
        <div class="spinner_inner_side bl_spinner"></div>
      </div>
   </div>
  <div class="spinner_loader">
    <div class="spinner_outer_side">
      <div class="spinner_inner_side tl_spinner"></div>
      <div class="spinner_inner_side tr_spinner"></div>
      <div class="spinner_inner_side br_spinner"></div>
      <div class="spinner_inner_side bl_spinner"></div>
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
  /*  you can change background color of the space here*/
  --loader_space_background_color_center: #A6FF21;  /* <-- center color of gradient (lighter color) */
  --loader_space_background_color_edge: #1E521A ;  /* <-- edge color of gradient (darker color) */
  --loader_disk_color_center: #fff;  /* <-- center color of gradient (lighter color) */
  --loader_disk_color_edge: #eee;  /* <-- edge color of gradient (darker color) */
  --loader_spin_duration: 1s;  /* <-- duration of a 360 cicle (smaller numbers make it faster) */
}

.spinner_wrapper.visible_loader {
  display: block;
}

.spinner_wrapper {
  background-image: radial-gradient(circle farthest-corner at center, var(--loader_space_background_color_center) 0%, var(--loader_space_background_color_edge) 100%);
  height: 100vh;
  width: 100vw;
 display:none;
}

.spinner_loader {
  position: absolute;
  width: 128px;
  height: 128px;
  top: 50%;
  left: 50%;
  margin: -64px 0 0 -64px;
  transform: perspective( 128px ) rotateX( 45deg );
}

  .spinner_loader.spinner_lower_side {
    top: 60%;
    opacity: .9;
    filter: blur(30px);
  }

  .spinner_loader.spinner_lower_side  .spinner_inner_side {
      background: #333;
  }

.spinner_outer_side {
  box-sizing: border-box;
  animation: spin_circles 1.5s linear infinite;
  animation-duration: var( --loader_spin_duration);
  height: 100%;
}

.spinner_inner_side {
  position: absolute;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  background: radial-gradient(circle farthest-corner at center, var( --loader_disk_color_center) 0%, var( --loader_disk_color_edge) 100%);
}

.spinner_inner_side.tl_spinner {
    top: 0;
    left: 0;
}

  .spinner_inner_side.tr_spinner {
    top: 0;
    right: 0;
  }

 .spinner_inner_side.br_spinner {
    bottom: 0;
    right: 0;
  }

 
 .spinner_inner_side.bl_spinner {
    bottom: 0;
    left: 0;
 }

@keyframes spin_circles {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}


```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you shoul clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('loader_plates_spinner').classList.remove('visible_loader');
})();


```

## Customization

You can modify these custom properties inside `:root` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

:root{
  /*  you can change background color of the space here*/
  --loader_space_background_color_center: #A6FF21;  /* <-- center color of gradient (lighter color) */
  --loader_space_background_color_edge: #1E521A ;  /* <-- edge color of gradient (darker color) */

  /*  you can change spinner color of the plates here*/
  --loader_disk_color_center: #fff;  /* <-- center color of gradient (lighter color) */
  --loader_disk_color_edge: #eee;  /* <-- edge color of gradient (darker color) */

  /*  you can change spinner speed here*/
  --loader_spin_duration: 1s;  /* <-- duration of a 360 cicle (smaller numbers make it faster) */
}



```

