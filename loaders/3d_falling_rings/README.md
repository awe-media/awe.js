
# LOADER: 3d falling rings

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [video_loader_example_3d_falling_rings.mp4](video_loader_example_3d_falling_rings.mp4)

Original Source on Codepen: [https://codepen.io/phpcodertech/pen/aboPGBm](https://codepen.io/phpcodertech/pen/aboPGBm)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div id="ring_loader_holder" class="rings_loader_wrapper visible_loader">
  <div class="rings_loader">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css

:root{
   --loader_color_rings_background: #d7d7d7;  /*<-- you can change here the page background color */
   --loader_size_rings: 180px;   /*<-- you can change here the size of the rings */
   --loader_color_ring_upside: #2d2613;   /*<-- you can change here the color of the ring (upside) */
   --loader_color_ring_inside: #e62a2a;   /*<-- you can change here the color of the ring (inside) */
   --loader_color_ring_side: #e05113;   /*<-- you can change here the color of the ring (main side) */
   --loader_duration_rings: 5s;   /*<-- you can change here the duration (in seconds) of the rings animation */
   --loader_duration_ring2: 1s;   /*<-- you can change here the delay (in seconds) of the ring#2 to start its animation */
   --loader_duration_ring3: 2s;   /*<-- you can change here the delay (in seconds) of the ring#3 to start its animation */
}
.rings_loader_wrapper.visible_loader
{
	display: flex;
}
.rings_loader_wrapper
{
	margin: 0;
	padding: 0;
	display: none;
	justify-content: center;
	align-items: center;
	min-height: 100vh;
	background-color: var(--loader_color_rings_background);
}
.rings_loader
{
	position: relative;
	width: var(--loader_size_rings);
	height: var(--loader_size_rings);
	display: flex;
	justify-content: center;
	align-items: center;
	transform-style: preserve-3d;
	transform: perspective(500px) rotateX(45deg);
}
.rings_loader span
{
	position: absolute;
	display: block;
	border: 15px solid var(--loader_color_ring_upside);
	box-sizing: border-box;
	border-radius: 50%;
	box-shadow: 0 10px 0 var(--loader_color_ring_side), inset 0 10px 0 var(--loader_color_ring_inside);
	animation: animate var(--loader_duration_rings) ease-in-out infinite;
}
.rings_loader span:nth-child(1)
{
	animation-delay: 0s;
}
.rings_loader span:nth-child(2)
{
	animation-delay: var(--loader_duration_ring2);
}
.rings_loader span:nth-child(3)
{
	animation-delay: var(--loader_duration_ring3);
}
@keyframes animate
{
	0%{
		transform: translateZ(-100px);
		width: 100%;
		height: 100%;
	}
	25%{
		transform: translateZ(100px);
		width: 100%;
		height: 100%;
	}
	50%{
		transform: translateZ(100px);
		width: 35%;
		height: 35%;
	}
	75%{
		transform: translateZ(-100px);
		width: 35%;
		height: 35%;
	}
	100%{
		transform: translateZ(-100px);
		width: 100%;
		height: 100%;
	}


```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you shoud clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('ring_loader_holder').classList.remove('visible_loader');
})();


```

## Customization

You can modify these custom properties inside `:root` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

:root{
   --loader_color_rings_background: #d7d7d7;  /*<-- you can change here the page background color */
   --loader_size_rings: 180px;   /*<-- you can change here the size of the rings */
   --loader_color_ring_upside: #2d2613;   /*<-- you can change here the color of the ring (upside) */
   --loader_color_ring_inside: #e62a2a;   /*<-- you can change here the color of the ring (inside) */
   --loader_color_ring_side: #e05113;   /*<-- you can change here the color of the ring (main side) */
   --loader_duration_rings: 5s;   /*<-- you can change here the duration (in seconds) of the rings animation */
   --loader_duration_ring2: 1s;   /*<-- you can change here the delay (in seconds) of the ring#2 to start its animation */
   --loader_duration_ring3: 2s;   /*<-- you can change here the delay (in seconds) of the ring#3 to start its animation */
}


```

