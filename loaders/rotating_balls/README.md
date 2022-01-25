# LOADER: Rotating Balls

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [rotating_balls.mp4](rotating_balls.mp4)



https://user-images.githubusercontent.com/22041360/149852399-a96287f0-48ca-4996-b16e-9e29a8f2b654.mp4



Original Source: [https://icons8.com/cssload/en/3d-loaders/2](https://icons8.com/cssload/en/3d-loaders/2)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_contain">
    <div class="custom_loader">
      <div class="custom_loader_ball"></div>
    </div>
  
    <div class="custom_loader">
      <div class="custom_loader_ball custom_loader_ball_two"></div>
    </div>
    
    <div class="custom_loader">
      <div class="custom_loader_ball custom_loader_ball_three"></div>
    </div>
    
    <div class="custom_loader">
      <div class="custom_loader_ball custom_loader_ball_four"></div>
    </div>
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
  background: var(--cl-background);

  /*
  ** You can modify these custom properties to change how the loader looks on the front end.
  ** And if the style you're looking for is not listed here, 
  ** or, if you require a completely different custom loader,
  ** you can always contact us at support@awe.media
  */

  /* 1. page background color */
  --cl-background: #fff;
  
  /* 2. ball size */
  --cl-size: 49px;

	/* 3. shadow color */
	--cl-ball-shadow: rgb(238,238,238);

	/* 4. ball colors */
	--cl-color-ball-one: rgb(227,116,107);
	--cl-color-ball-two: rgb(57,123,249);
	--cl-color-ball-three: rgb(244,180,0);
	--cl-color-ball-four: rgb(15,157,88);

  /* 5. animation duration, smaller value will make it go faster */
  --cl-animation-duration: 1150ms;

}

.custom_loader_contain {
	width: calc(var(--cl-size) * 146 / 49);
	height: var(--cl-size);
	position: absolute;
	top: 0;
	right: 0;
	left: 0;
	bottom: 0;
	margin: auto;
	opacity: 0;
	animation: contain_fade_in 1.15s 1;
	animation-fill-mode: forwards;
}

.custom_loader {
	animation: loader_translate var(--cl-animation-duration) infinite ease-in-out alternate, loader_zindex calc(var(--cl-animation-duration) * 2) infinite ease-in-out;
	position: absolute;
}

.custom_loader_ball {
	width: var(--cl-size);
	height: var(--cl-size);
	box-shadow: 0 calc(var(--cl-size) * -6.25 / 49) 0 rgba(0,0,0,0.15) inset;
	background-color: var(--cl-color-ball-one);
	border-radius: 50%;
	animation: loader_scale var(--cl-animation-duration) infinite ease-in-out alternate;
	animation-delay: calc(var(--cl-animation-duration) * -0.5);
	transform: scale(0.5);
	border: 2px solid black;
}

.custom_loader_ball:after {
	content: "";
	width: var(--cl-size);
	height: calc(var(--cl-size) * 13 / 49);
	background: var(--cl-ball-shadow);
	position: absolute;
	top: calc(var(--cl-size) * 68 / 49);
	border-radius: 50%;
}

.custom_loader:nth-child(2) {
	animation-delay: calc(var(--cl-animation-duration) * -1);
}

.custom_loader:nth-child(3) {
	animation-delay: calc(var(--cl-animation-duration) * -1.5);
}

.custom_loader:nth-child(4) {
	animation-delay: calc(var(--cl-animation-duration) * -2.5);
}

.custom_loader_ball_two {
	background-color: var(--cl-color-ball-two);
	animation-delay: calc(var(--cl-animation-duration) * -1.5);
}

.custom_loader_ball_three {
	background-color: var(--cl-color-ball-three);
	animation-delay: calc(var(--cl-animation-duration) * -2);
}

.custom_loader_ball_four {
	background-color: var(--cl-color-ball-four);
	animation-delay: calc(var(--cl-animation-duration) * -3);
}

@keyframes loader_translate {
	100% { transform: translateX(calc(var(--cl-size) * 2)); }
}

@keyframes loader_scale {
	100% { transform: scale(1); }
}

@keyframes loader_zindex {
	25% { z-index: 1; }
	75% { z-index: -1; }
}

@keyframes contain_fade_in {
	100% { opacity: 1; }
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
--cl-background: #fff;

/* 2. ball size */
--cl-size: 49px;

/* 3. shadow color */
--cl-ball-shadow: rgb(238,238,238);

/* 4. ball colors */
--cl-color-ball-one: rgb(227,116,107);
--cl-color-ball-two: rgb(57,123,249);
--cl-color-ball-three: rgb(244,180,0);
--cl-color-ball-four: rgb(15,157,88);

/* 5. animation duration, smaller value will make it go faster */
--cl-animation-duration: 1150ms;


```




