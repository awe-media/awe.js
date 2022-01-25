# LOADER: Wobbling Circle

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [wobbling_circle.mp4](wobbling_circle.mp4)



https://user-images.githubusercontent.com/22041360/149852548-ffa63bdf-1130-4d55-ba73-f0a9665a3207.mp4



Original Source on Codepen: [https://codepen.io/prathameshkoshti/pen/OJJRaRo](https://codepen.io/prathameshkoshti/pen/OJJRaRo)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="custom_loader_inner">
    <div class="custom_loader"></div>
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
  background: radial-gradient(var(--cl-background-1), var(--cl-background-2));

  /*
  ** You can modify these custom properties to change how the loader looks on the front end.
  ** And if the style you're looking for is not listed here, 
  ** or, if you require a completely different custom loader,
  ** you can always contact us at support@awe.media
  */

  /* 1. page background 2 gradient colors */
  --cl-background-1: #CECECE;
  --cl-background-2: #fff;
  
  /* 2. loader size */
  --cl-circle-size: 350px;

  /* 3. circle rotate duration */
  --cl-circle-rotate-duration: 2s;

  /* 4. circle gradient colors */
  --cl-circle-gradient-color1: rgba(255,255,255,1);
  --cl-circle-gradient-color2: rgb(220, 220, 220);
  --cl-circle-gradient-color3: rgb(170, 170, 170);
  --cl-circle-gradient-color4: rgb(10, 10, 10);

}

.custom_loader_inner {
  width: var(--cl-circle-size);
	height: var(--cl-circle-size);
	border-radius: 100%;
	background: linear-gradient(165deg, var(--cl-circle-gradient-color1) 0%, var(--cl-circle-gradient-color2) 40%, var(--cl-circle-gradient-color3) 98%, var(--cl-circle-gradient-color4) 100%);
	position: relative;
}

.custom_loader {
  position: absolute;
	width: 100%;
	height: 100%;
	border-radius: 100%;
	border-bottom: 0 solid #ffffff05;
  box-shadow: 
		0 -10px 20px 20px #ffffff40 inset,
		0 -5px 15px 10px #ffffff50 inset,
		0 -2px 5px #ffffff80 inset,
		0 -3px 2px #ffffffBB inset,
		0 2px 0px #ffffff,
		0 2px 3px #ffffff,
		0 5px 5px #ffffff90,
		0 10px 15px #ffffff60,
		0 10px 20px 20px #ffffff40;
	filter: blur(3px);
	animation: var(--cl-circle-rotate-duration) circle_rotate linear infinite;
}

@keyframes circle_rotate {
	100% {
		transform: rotate(360deg)
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

/* 1. page background 2 gradient colors */
--cl-background-1: #CECECE;
--cl-background-2: #fff;

/* 2. loader size */
--cl-circle-size: 350px;

/* 3. circle rotate duration */
--cl-circle-rotate-duration: 2s;

/* 4. circle gradient colors */
--cl-circle-gradient-color1: rgba(255,255,255,1);
--cl-circle-gradient-color2: rgb(220, 220, 220);
--cl-circle-gradient-color3: rgb(170, 170, 170);
--cl-circle-gradient-color4: rgb(10, 10, 10);


```




