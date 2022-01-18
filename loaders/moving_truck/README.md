# LOADER: Moving Truck

- [Documentation](#documentation)
- [Customization](#customization)

## Video Example & Original Source


Video Example: [moving_truck.mp4](moving_truck.mp4)



https://user-images.githubusercontent.com/22041360/149852224-44456002-1623-4d9d-bddf-727d8f554f91.mp4



Original Source on Codepen: [https://codepen.io/ChrisJohnson/pen/OyXWpr](https://codepen.io/ChrisJohnson/pen/OyXWpr)


## Documentation

This loader only uses [loader.html](loader.html) and [loader.css](loader.css), follow below steps to add it to your project. If you would like to change how the loaders looks, you can refer to [Customization](#customization).


### Step One

Copy below **HTML** code to **Setting** -> **PROJECT BRANDING** -> **FULL CUSTOM LOADING SCREEN ENABLED** -> **HTML** section.


```html

<div class="custom_loader_wrap">
  <div class="loop_wrapper">
    <div class="mountain"></div>
    <div class="hill"></div>
    <div class="tree"></div>
    <div class="tree"></div>
    <div class="tree"></div>
    <div class="rock"></div>
    <div class="truck"></div>
    <div class="wheels"></div>
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
  background-color: var(--cl-background);

  /*
  ** You can modify these custom properties to change how the loader looks on the front end.
  ** And if the style you're looking for is not listed here, 
  ** or, if you require a completely different custom loader,
  ** you can always contact us at support@awe.media
  */

  /* 1. page background color */
  --cl-background: #009688;
  
  /* 2. hill color */
  --cl-hill-color: #4DB6AC;

  /* 3. mountain color */
  --cl-mountain-color: #4DB6AC;

  /* 4. road color */
  --cl-road-color: #fff;

  /* 5. rock color */
  --cl-rock-color: #ddd;
  
  /* 6. mountain animation duration (other animation durations will response to this value), change 20s to 10s will speed up every animation by 2 
  */
  --cl-mountain-animation: 20s;
}

.loop_wrapper {
  margin: 0 auto;
  position: relative;
  display: block;
  width: 600px;
  height: 250px;
  overflow: hidden;
  border-bottom: 3px solid var(--cl-road-color);
  transform: translateY(-50%);
}

.mountain {
  position: absolute;
  right: -900px;
  bottom: -20px;
  width: 2px;
  height: 2px;
  box-shadow: 
    0 0 0 50px var(--cl-mountain-color),
    60px 50px 0 70px var(--cl-mountain-color),
    90px 90px 0 50px var(--cl-mountain-color),
    250px 250px 0 50px var(--cl-mountain-color),
    290px 320px 0 50px var(--cl-mountain-color),
    320px 400px 0 50px var(--cl-mountain-color);
  transform: rotate(130deg);
  animation: mtn var(--cl-mountain-animation) linear infinite;
}

.hill {
  position: absolute;
  right: -900px;
  bottom: -50px;
  width: 400px;
  border-radius: 50%;
  height: 20px;
  box-shadow: 
    0 0 0 50px #4DB6AC,
    -20px 0 0 20px var(--cl-hill-color),
    -90px 0 0 50px var(--cl-hill-color),
    250px 0 0 50px var(--cl-hill-color),
    290px 0 0 50px var(--cl-hill-color),
    620px 0 0 50px var(--cl-hill-color);
  animation: hill calc(var(--cl-mountain-animation) / 5) calc(var(--cl-mountain-animation) / 10) linear infinite;
}

.tree, .tree:nth-child(2), .tree:nth-child(3) {
  position: absolute;
  height: 100px; 
  width: 35px;
  bottom: 0;
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMiIgaGVpZ2h0PSIxMDAiIHZpZXdCb3g9IjAgMCAzMiAxMDAiPgogIDxwYXRoIGZpbGw9IiNGRkYiIGQ9Ik0zMS45NDUgNzQuOTg2TDE3LjM3IDEuMTQ4QTEuNDE2IDEuNDE2IDAgMCAwIDE1Ljk4OCAwYy0uNjczIDAtMS4yNTIuNDgtMS4zODMgMS4xNDhMLjAyNyA3NC45ODZjLS4wODMuNDIuMDI1Ljg1NC4yOTIgMS4xODYuMjY4LjMzMi42NjkuNTIzIDEuMDkxLjUyM2gxMy4xNjdWMTAwaDIuODIxVjc2LjY5NWgxMy4xNjVjLjQyMiAwIC44MjEtLjE5MSAxLjA5LS41MjMuMjctLjMzMS4zNzUtLjc2Ni4yOTItMS4xODZ6Ii8+Cjwvc3ZnPgo=') no-repeat;
}

.rock {
  margin-top: -17%;
  height: 2%; 
  width: 2%;
  bottom: -2px;
  border-radius: 20px;
  position: absolute;
  background: var(--cl-rock-color);
}

.truck, .wheels {
  transition: all ease;
  width: 85px;
  margin-right: -60px;
  bottom: 0px;
  right: 50%;
  position: absolute;
  background: #eee;
}

.truck {
  background: url('data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICB4bWxuczpjYz0iaHR0cDovL2NyZWF0aXZlY29tbW9ucy5vcmcvbnMjIgogICB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4wYmV0YTIgKDJiNzFkMjUsIDIwMTktMTItMDMpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ0cnVjay5zdmciCiAgIGlkPSJzdmcyNDAwIgogICB2ZXJzaW9uPSIxLjEiCiAgIHZpZXdCb3g9IjAgMCA4NSA2MCIKICAgaGVpZ2h0PSI2MCIKICAgd2lkdGg9Ijg1Ij4KICA8bWV0YWRhdGEKICAgICBpZD0ibWV0YWRhdGEyNDA2Ij4KICAgIDxyZGY6UkRGPgogICAgICA8Y2M6V29yawogICAgICAgICByZGY6YWJvdXQ9IiI+CiAgICAgICAgPGRjOmZvcm1hdD5pbWFnZS9zdmcreG1sPC9kYzpmb3JtYXQ+CiAgICAgICAgPGRjOnR5cGUKICAgICAgICAgICByZGY6cmVzb3VyY2U9Imh0dHA6Ly9wdXJsLm9yZy9kYy9kY21pdHlwZS9TdGlsbEltYWdlIiAvPgogICAgICAgIDxkYzp0aXRsZT48L2RjOnRpdGxlPgogICAgICA8L2NjOldvcms+CiAgICA8L3JkZjpSREY+CiAgPC9tZXRhZGF0YT4KICA8ZGVmcwogICAgIGlkPSJkZWZzMjQwNCIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaW5rc2NhcGU6Y3VycmVudC1sYXllcj0ic3ZnMjQwMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIwIgogICAgIGlua3NjYXBlOndpbmRvdy15PSIwIgogICAgIGlua3NjYXBlOndpbmRvdy14PSIwIgogICAgIGlua3NjYXBlOmN5PSIzMCIKICAgICBpbmtzY2FwZTpjeD0iNDIuNSIKICAgICBpbmtzY2FwZTp6b29tPSI4LjYyMzUyOTQiCiAgICAgc2hvd2dyaWQ9ImZhbHNlIgogICAgIGlkPSJuYW1lZHZpZXcyNDAyIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjkwMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE0NDAiCiAgICAgaW5rc2NhcGU6cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBndWlkZXRvbGVyYW5jZT0iMTAiCiAgICAgZ3JpZHRvbGVyYW5jZT0iMTAiCiAgICAgb2JqZWN0dG9sZXJhbmNlPSIxMCIKICAgICBib3JkZXJvcGFjaXR5PSIxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXJvdGF0aW9uPSIwIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIHBhZ2Vjb2xvcj0iI2ZmZmZmZiIgLz4KICA8cGF0aAogICAgIGlkPSJwYXRoMjM5NiIKICAgICBkPSJNNS4xMzggNTQuMDM5YTMuNzcgMy43NyAwIDAgMS0uMTQ5LS4wMDVsLS44NTkuMDAyQTQuMTM0IDQuMTM0IDAgMCAxIDAgNDkuOTA2VjUuMTk1YTQuMTM1IDQuMTM1IDAgMCAxIDQuMTMtNC4xMzNoNDYuOTczYzIuMjcyIDAgNC4xMjMgMS45NSA0LjEyMyA0LjIyOXY0NC42MTJhNC4xMzMgNC4xMzMgMCAwIDEtNC4xMjcgNC4xMzFIMjkuOTYyYy0xLjA5MS0uMDE5LTMuMjM5LS42OTEtMy43MjctMy4xMjgtMS4wNjctMy45NTctNC43NTUtNi43ODktOC45NDctNi43ODktNC4yOTEgMC04LjA5OCAzLjA0MS05LjA1MSA3LjIyOS0uMjI1IDEuODE3LTEuNzIzIDIuNjkzLTMuMDk5IDIuNjkzek00LjEyNyA0LjIwOGMtLjU5NiAwLTEuMDgzLjM4OS0xLjA4My45ODd2NDQuNzA5YzAgLjU5Ny40ODggMS4wODYgMS4wODYgMS4wODZoMS4wMDRjLjAwNS0uMDQ3LjEyMy0uMjcxLjEzMy0uMzE3IDEuMjY3LTUuNTYyIDYuMzIzLTkuNTk3IDEyLjAyMi05LjU5N2ExMi4zNTYgMTIuMzU2IDAgMCAxIDExLjkxMiA5LjEzN2MuMTUxLjczNC42ODEuNzc3Ljc4NS43NzdoMjEuMTExYy41OTYgMCAxLjA4My0uNDg3IDEuMDgzLTEuMDg0VjUuMjkzYzAtLjU5OC0uNDg1LTEuMDg1LTEuMDgzLTEuMDg1SDQuMTI3ek04NC45MjkgMzUuODI4cy0uMDkzLTIuMDkzLS4yODgtMy4xMThjLS4xNjQtLjg3My0xLjA4Ny0yLjY0NC0xLjA4Ny0yLjY0NGwtNy4yOTktMTMuNTljLS45NTEtMS41Mi0zLjExNS0yLjcwNy00LjU1OC0yLjcwN0g2MC43ODVhMi42MDggMi42MDggMCAwIDAtMi42MDYgMi42MDl2MzMuNTI2YTIuNjA5IDIuNjA5IDAgMCAwIDIuNjA2IDIuNjA5aC42NDNzLjk0OS0uMTIzIDEuMzA0LTEuMzEyYy45ODYtMy45MzMgNC41MTQtNi44NjIgOC43NDktNi44NjIgNC4xNDUgMCA3LjYxMiAyLjgwOCA4LjY4MiA2LjYxMy40NDIgMS42MTIgMi4yMzEgMS41NjEgMi4yMzEgMS41NjFBMi42MDggMi42MDggMCAwIDAgODUgNDkuOTA0bC0uMDcxLTE0LjA3NnptLTYuNjAzLTMuNTExSDY1LjMxMmExLjk5NiAxLjk5NiAwIDAgMS0xLjk4OS0xLjk5VjIwLjE0M2MwLTEuMDk4Ljg5NC0xLjk5IDEuOTg5LTEuOTloNC4zNjVjMi40ODMgMCA0LjExNyAyLjAwOSA0LjYzIDIuOTc4bDUuMDY1IDkuNDM0Yy41MjEuOTYyLjA1MyAxLjc1Mi0xLjA0NiAxLjc1MnoiCiAgICAgZmlsbD0iI0ZGRiIgLz4KICA8cGF0aAogICAgIHN0eWxlPSJmaWxsOm5vbmUiCiAgICAgaWQ9InBhdGgyMzk4IgogICAgIGQ9Ik00LjEyNyA0LjIwOGMtLjU5NiAwLTEuMDgzLjM4OS0xLjA4My45ODd2NDQuNzA5YzAgLjU5Ny40ODggMS4wODYgMS4wODYgMS4wODZoMS4wMDRjLjAwNS0uMDQ3LjEyMy0uMjcxLjEzMy0uMzE3IDEuMjY3LTUuNTYyIDYuMzIzLTkuNTk3IDEyLjAyMi05LjU5N2ExMi4zNTYgMTIuMzU2IDAgMCAxIDExLjkxMiA5LjEzN2MuMTUxLjczNC42ODEuNzc3Ljc4NS43NzdoMjEuMTExYy41OTYgMCAxLjA4My0uNDg3IDEuMDgzLTEuMDg0VjUuMjkzYzAtLjU5OC0uNDg1LTEuMDg1LTEuMDgzLTEuMDg1SDQuMTI3eiIKICAgICBmaWxsPSIjMDA5Njg4IiAvPgo8L3N2Zz4K') no-repeat;
  background-size: contain;
  height: 60px;
}

.truck:before {
  content: " ";
  position: absolute;
  width: 25px;
  box-shadow:
    -30px 28px 0 1.5px #fff,
    -35px 18px 0 1.5px #fff;
}

.wheels {
  background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4NSIgaGVpZ2h0PSIxNSIgdmlld0JveD0iMCAwIDg1IDE1Ij4KICA8Y2lyY2xlIGZpbGw9IiNGRkYiIGN4PSIxNy4yODkiIGN5PSI4LjQxMyIgcj0iNi41ODciLz4KICA8Y2lyY2xlIGZpbGw9IiNGRkYiIGN4PSI3MS40OCIgY3k9IjguNDEyIiByPSI2LjU4NiIvPgo8L3N2Zz4K') no-repeat;
  height: 15px;
  margin-bottom: 0;
}

.tree { 
  animation: tree calc(var(--cl-mountain-animation) / 6.67) 0.000s linear infinite; 
}

.tree:nth-child(2) { 
  animation: tree2 calc(var(--cl-mountain-animation) / 10) 0.150s linear infinite; 
}

.tree:nth-child(3) { 
  animation: tree3 calc(var(--cl-mountain-animation) / 2.5) 0.050s linear infinite; 
}

.rock { 
  animation: rock calc(var(--cl-mountain-animation) / 5)   -0.530s linear infinite; 
}

.truck { 
  animation: truck calc(var(--cl-mountain-animation) / 5)   0.080s ease infinite; 
}

.wheels { 
  animation: truck calc(var(--cl-mountain-animation) / 5)   0.001s ease infinite; 
}

.truck:before { 
  animation: wind calc(var(--cl-mountain-animation) / 13.3)   0.000s ease infinite; 
}


@keyframes tree {
  0%   { transform: translate(1350px); }
  50%  { }
  100% { transform: translate(-50px); }
}

@keyframes tree2 {
  0%   { transform: translate(650px); }
  50%  { }
  100% { transform: translate(-50px); }
}

@keyframes tree3 {
  0%   { transform: translate(2750px); }
  50%  { }
  100% { transform: translate(-50px); }
}

@keyframes rock {
  0%   { right: -200px; }
  100% { right: 2000px; }
}

@keyframes truck {
  0%   { }
  6%   { transform: translateY(0px); }
  7%   { transform: translateY(-6px); }
  9%   { transform: translateY(0px); }
  10%  { transform: translateY(-1px); }
  11%  { transform: translateY(0px); }
  100% { }
}

@keyframes wind {
  0%   {  }
  50%  { transform: translateY(3px) }
  100% {  }
}

@keyframes mtn {
  100% { transform: translateX(-2000px) rotate(130deg); }
}

@keyframes hill {
  100% { transform: translateX(-2000px); }
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
--cl-background: #009688;

/* 2. hill color */
--cl-hill-color: #4DB6AC;

/* 3. mountain color */
--cl-mountain-color: #4DB6AC;

/* 4. road color */
--cl-road-color: #fff;

/* 5. rock color */
--cl-rock-color: #ddd;

/* 6. mountain animation duration (other animation durations will response to this value), change 20s to 10s will speed up every animation by 2 
*/
--cl-mountain-animation: 20s;


```




