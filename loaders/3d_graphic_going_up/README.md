

# LOADER: 3d graphic going up

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [video_loader_example_3d_graphic_going_up.mp4](video_loader_example_3d_graphic_going_up.mp4)



https://user-images.githubusercontent.com/22041360/149852015-40e144df-0344-4f55-be6c-dadc31e82e14.mp4



Original Source on Codepen: [https://codepen.io/brandrocket/pen/Vvpjvw](https://codepen.io/brandrocket/pen/Vvpjvw)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div id="graphic_loader_holder" class="loading-container_graphics visible_loader">
  <div class="loader_graphics">
		<span class="loader-row square1"></span>
		<span class="loader-row square2"></span>
		<span class="loader-row square3"></span>
	</div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

:root{
  --loading_graphics_background: #000000; /*<-- you can change here the page background color */
  --loading_graphics_cube1: #fff; /*<-- you can change here color of the first cube*/
  --loading_graphics_cube2: #fff;  /*<-- you can change here color of the 2nd cube*/
  --loading_graphics_cube3: #fff;  /*<-- you can change here color of the 3rd cube*/
  --loader_graphics_duration: 3s;  /*<-- you can change here the speed of the loader (less seconds make it faster)*/
  --loader_graphics_square2_delay: 0.33s;  /*<-- seconds to start animating of 2nd square (delay) */
  --loader_graphics_square3_delay: 0.66s;  /*<-- seconds to start animating of 3rd square (delay)*/
}
.loading-container_graphics.visible_loader{
	display: block;
}
.loading-container_graphics {
	height: 100vh;
	width: 100vw;
	position: absolute;
	top: 0;
	left: 0;
	z-index: 1000;
	background: var(--loading_graphics_background);
	display:none;
}
.loading-container_graphics .loader_graphics {
	position: absolute;
	top: 50%;
	left: 50%;
	-webkit-transform: translate(-50%, -50%);
	-moz-transform: translate(-50%, -50%);
	-ms-transform: translate(-50%, -50%);
	-o-transform: translate(-50%, -50%);
	transform: translate(-50%, -50%);
}
span.loader-row {
	display: block;
	float: left;
	height: 30vmin;
	width: 10vmin;
	-webkit-animation: loader 3s ease-in-out infinite;
	-moz-animation: loader 3s ease-in-out infinite;
	animation: loader 3s ease-in-out infinite;
	transform-style: preserve-3d;
	-webkit-transform: rotateX(30deg) rotateY(30deg);
	-moz-transform: rotateX(30deg) rotateY(30deg);
	transform: rotateX(30deg) rotateY(30deg);
  animation-duration: var(--loader_graphics_duration);
}
span.loader-row.square1 {
  background: var(--loading_graphics_cube1);
}
span.loader-row.square2 {
  background: var(--loading_graphics_cube2);
}
span.loader-row.square3 {
  background: var(--loading_graphics_cube3);
}
span.loader-row:before {
	content: "";
	display: block;
	position: absolute;
	height: 10vmin;
	width: 10vmin;
	background: rgb(240, 240, 240);
	top: -10vmin;
	-webkit-transform: rotateX(90deg) translateY(-2.5vmin) translateX(4.5vmin);
	-moz-transform: rotateX(90deg) translateY(-2.5vmin) translateX(4.5vmin);
	transform: rotateX(90deg) translateY(-2.5vmin) translateX(4.5vmin);
}
span.loader-row.square1:before {
  background: var(--loading_graphics_cube1);
}
span.loader-row.square2:before {
  background: var(--loading_graphics_cube2);
}
span.loader-row.square3:before {
  background: var(--loading_graphics_cube3);
}
span.loader-row:after {
	content: "";
	display: block;
	position: absolute;
	height: 100%;
	width: 10vmin;
	background: rgb(240, 240, 240);
	left: 100%;
	-webkit-transform: rotateY(-270deg) translateY(-5.5vmin) translateX(3.5vmin);
	-moz-transform: rotateY(-270deg) translateY(-5.5vmin) translateX(3.5vmin);
	transform: rotateY(-270deg) translateY(-5.5vmin) translateX(3.5vmin);
}
span.loader-row.square1:after {
  background: var(--loading_graphics_cube1);
}
span.loader-row.square2:after {
  background: var(--loading_graphics_cube2);
}
span.loader-row.square3:after {
  background: var(--loading_graphics_cube3);
}
span.loader-row:nth-child(even) {
	margin: 0 10vmin;
}
span.loader-row:nth-child(2) {
	-webkit-animation-delay: var(--loader_graphics_square2_delay);
	-moz-animation-delay: var(--loader_graphics_square2_delay);
	animation-delay: var(--loader_graphics_square2_delay);
}
span.loader-row:nth-child(3) {
	-webkit-animation-delay: var(--loader_graphics_square3_delay);
	-moz-animation-delay: var(--loader_graphics_square3_delay);
	animation-delay: var(--loader_graphics_square3_delay);
}
@-webkit-keyframes loader {
	50% {
		margin-top: 20vmin;
		height: 10vmin;
	}
}

@-moz-keyframes loader {
	50% {
		margin-top: 20vmin;
		height: 10vmin;
	}
}

@keyframes loader {
	50% {
		margin-top: 20vmin;
		height: 10vmin;
	}
}


```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you shoud clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('graphic_loader_holder').classList.remove('visible_loader');
})();


```

## Customization

You can modify these custom properties inside `:root` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

:root{
  --loading_graphics_background: #000000; /*<-- you can change here the page background color */
  --loading_graphics_cube1: #fff; /*<-- you can change here color of the first cube*/
  --loading_graphics_cube2: #fff;  /*<-- you can change here color of the 2nd cube*/
  --loading_graphics_cube3: #fff;  /*<-- you can change here color of the 3rd cube*/
  --loader_graphics_duration: 3s;  /*<-- you can change here the speed of the loader (less seconds make it faster)*/
  --loader_graphics_square2_delay: 0.33s;  /*<-- seconds to start animating of 2nd square (delay) */
  --loader_graphics_square3_delay: 0.66s;  /*<-- seconds to start animating of 3rd square (delay)*/
}


```


