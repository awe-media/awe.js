
# LOADER: flipping paper rhombus

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [video_loader_example_flipping_paper_rhombus.mp4](video_loader_example_flipping_paper_rhombus.mp4)

Original Source on icons8, example #1 by morningtrain [https://icons8.com/cssload/en/3d-loaders](https://icons8.com/cssload/en/3d-loaders)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div id="paper_loader_holder" class="loader_origami_wrapper visible_loader">
    <div class="cssload-thecube">
	    <div class="cssload-cube cssload-c1"></div>
	    <div class="cssload-cube cssload-c2"></div>
	    <div class="cssload-cube cssload-c4"></div>
	    <div class="cssload-cube cssload-c3"></div>
    </div>
</div>


```

### Step Two

Copy below **CSS** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **CSS** section.

```css


:root{
  --loader_origami_background: #e3e3e3; /*<-- you can change here the page background color */
  --loader_origami_square_size: 150px; /*<-- size of each square */
  --loader_origami_square_color: rgb(250 102 2); /*<-- color of each square */
  --loader_origami_cycle_duration: 2.76s; /*<-- duration in seconds of a full cycle */
}
.loader_origami_wrapper.visible_loader {
  display: flex;
}
.loader_origami_wrapper {
  min-width: 100vw;
  min-height: 100vh;
  background-color: var(--loader_origami_background);
  display: none;
  justify-content: center;
  align-items: center
}

.cssload-thecube {
	width: var(--loader_origami_square_size);
	height: var(--loader_origami_square_size);
	margin: 0 auto;
	position: relative;
	transform: rotateZ(45deg);
		-o-transform: rotateZ(45deg);
		-ms-transform: rotateZ(45deg);
		-webkit-transform: rotateZ(45deg);
		-moz-transform: rotateZ(45deg);
}
.cssload-thecube .cssload-cube {
	position: relative;
	transform: rotateZ(45deg);
		-o-transform: rotateZ(45deg);
		-ms-transform: rotateZ(45deg);
		-webkit-transform: rotateZ(45deg);
		-moz-transform: rotateZ(45deg);
}
.cssload-thecube .cssload-cube {
	float: left;
	width: 50%;
	height: 50%;
	position: relative;
	transform: scale(1.1);
		-o-transform: scale(1.1);
		-ms-transform: scale(1.1);
		-webkit-transform: scale(1.1);
		-moz-transform: scale(1.1);
}
.cssload-thecube .cssload-cube:before {
	content: "";
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background-color: var(--loader_origami_square_color);
	animation: cssload-fold-thecube var(--loader_origami_cycle_duration) infinite linear both;
		-o-animation: cssload-fold-thecube var(--loader_origami_cycle_duration) infinite linear both;
		-ms-animation: cssload-fold-thecube var(--loader_origami_cycle_duration) infinite linear both;
		-webkit-animation: cssload-fold-thecube var(--loader_origami_cycle_duration) infinite linear both;
		-moz-animation: cssload-fold-thecube var(--loader_origami_cycle_duration) infinite linear both;
	transform-origin: 100% 100%;
		-o-transform-origin: 100% 100%;
		-ms-transform-origin: 100% 100%;
		-webkit-transform-origin: 100% 100%;
		-moz-transform-origin: 100% 100%;
}
.cssload-thecube .cssload-c2 {
	transform: scale(1.1) rotateZ(90deg);
		-o-transform: scale(1.1) rotateZ(90deg);
		-ms-transform: scale(1.1) rotateZ(90deg);
		-webkit-transform: scale(1.1) rotateZ(90deg);
		-moz-transform: scale(1.1) rotateZ(90deg);
}
.cssload-thecube .cssload-c3 {
	transform: scale(1.1) rotateZ(180deg);
		-o-transform: scale(1.1) rotateZ(180deg);
		-ms-transform: scale(1.1) rotateZ(180deg);
		-webkit-transform: scale(1.1) rotateZ(180deg);
		-moz-transform: scale(1.1) rotateZ(180deg);
}
.cssload-thecube .cssload-c4 {
	transform: scale(1.1) rotateZ(270deg);
		-o-transform: scale(1.1) rotateZ(270deg);
		-ms-transform: scale(1.1) rotateZ(270deg);
		-webkit-transform: scale(1.1) rotateZ(270deg);
		-moz-transform: scale(1.1) rotateZ(270deg);
}
.cssload-thecube .cssload-c2:before {
	animation-delay: 0.35s;
		-o-animation-delay: 0.35s;
		-ms-animation-delay: 0.35s;
		-webkit-animation-delay: 0.35s;
		-moz-animation-delay: 0.35s;
}
.cssload-thecube .cssload-c3:before {
	animation-delay: 0.69s;
		-o-animation-delay: 0.69s;
		-ms-animation-delay: 0.69s;
		-webkit-animation-delay: 0.69s;
		-moz-animation-delay: 0.69s;
}
.cssload-thecube .cssload-c4:before {
	animation-delay: 1.04s;
		-o-animation-delay: 1.04s;
		-ms-animation-delay: 1.04s;
		-webkit-animation-delay: 1.04s;
		-moz-animation-delay: 1.04s;
}
@keyframes cssload-fold-thecube {
	0%, 10% {
		transform: perspective(280px) rotateX(-180deg);
		opacity: 0;
	}
	25%, 75% {
		transform: perspective(280px) rotateX(0deg);
		opacity: 1;
	}
	90%, 100% {
		transform: perspective(280px) rotateY(180deg);
		opacity: 0;
	}
}

@-o-keyframes cssload-fold-thecube {
	0%, 10% {
		-o-transform: perspective(280px) rotateX(-180deg);
		opacity: 0;
	}
	25%, 75% {
		-o-transform: perspective(280px) rotateX(0deg);
		opacity: 1;
	}
	90%, 100% {
		-o-transform: perspective(280px) rotateY(180deg);
		opacity: 0;
	}
}

@-ms-keyframes cssload-fold-thecube {
	0%, 10% {
		-ms-transform: perspective(280px) rotateX(-180deg);
		opacity: 0;
	}
	25%, 75% {
		-ms-transform: perspective(280px) rotateX(0deg);
		opacity: 1;
	}
	90%, 100% {
		-ms-transform: perspective(280px) rotateY(180deg);
		opacity: 0;
	}
}

@-webkit-keyframes cssload-fold-thecube {
	0%, 10% {
		-webkit-transform: perspective(280px) rotateX(-180deg);
		opacity: 0;
	}
	25%, 75% {
		-webkit-transform: perspective(280px) rotateX(0deg);
		opacity: 1;
	}
	90%, 100% {
		-webkit-transform: perspective(280px) rotateY(180deg);
		opacity: 0;
	}
}

@-moz-keyframes cssload-fold-thecube {
	0%, 10% {
		-moz-transform: perspective(280px) rotateX(-180deg);
		opacity: 0;
	}
	25%, 75% {
		-moz-transform: perspective(280px) rotateX(0deg);
		opacity: 1;
	}
	90%, 100% {
		-moz-transform: perspective(280px) rotateY(180deg);
		opacity: 0;
	}
}


```

### Step Three

Copy below **JavaScript** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **JS** section (you shoud clear out the existing codes first).

For more details on events provided by your AWE app, please check [https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)


```javascript

(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('paper_loader_holder').classList.remove('visible_loader');
})();


```

## Customization

You can modify these custom properties inside `:root` to change how the loader looks on the front end. And if the style you're looking for is not listed here, or, if you require a completely different custom loader, you can always contact us at **support@awe.media**

```css

:root{
  --loader_origami_background: #e3e3e3; /*<-- you can change here the page background color */
  --loader_origami_square_size: 150px; /*<-- size of each square */
  --loader_origami_square_color: rgb(250 102 2); /*<-- color of each square */
  --loader_origami_cycle_duration: 2.76s; /*<-- duration in seconds of a full cycle */
}


```

