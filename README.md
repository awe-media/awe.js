awe.js
======

What is awe.js?
---------------
It's the quickest and easiest way to create Augmented Web applications.

If you want to see what an awe.js app looks like just visit https://awe.media and setup a free demo.

Here's a few short videos that show you just how easy it is to create an awe app.
- Add a 360° photo or video background https://youtu.be/B2mQaeXyXDw
- Add 3D objects, images or videos https://youtu.be/LxVRBxC-SHY
- Add interactivity https://youtu.be/3N2NZfCCuLY 

Or checkout some of our older demos showing showing different uses of awe.js 
- Location based AR http://youtu.be/OJHgBSRJNJY
- Marker based AR http://youtu.be/X_XR9VbQPeE
- Oculus Rift based AR http://youtu.be/kIHih4Cc1ag
- Leap Motion Sensor AR http://youtu.be/mDbvPU4aokQ
- Google Glass AR http://youtu.be/M97E2m6dRO4

Then checkout the docs in our [wiki](https://github.com/awe-media/awe.js/wiki).

What is the Augmented Web?
--------------------------
It's what comes after html5!

It uses WebRTC, WebGL, WebVR and the modern sensor APIs to bring Augmented Reality and so much more to the web platform. It will completely change the way you and your users see the web.


How do you create an awe.js app?
--------------------------------
Just add a `<script src='js/awe.js'></script>` tag to your html page to turn that page into an Augmented Web application.

Now you are ready to create adaptive Augmented Web Experiences. `awe.js` allows you to easily create and manage 3d objects, add and manage Video and Audio streams and integrate automatic handling of sensor driven data feeds.

See the `examples/` and their plugins for more details.

To initialize your `awe.js` application just call: 

```
awe.init({
  ...
});
```

Once the `awe_ready` event is fired then your `awe.js` app is ready to start. Then you can call `awe.setup_scene()` to setup your scene. NOTE: This must be called after `awe_ready` has been fired.

To see this working try loading `examples/basic_ar/index.html` in a suitable standards compliant browser.

How do you add objects to your scene?
-------------------------------------
The `awe.js` API is consistently built upon a simple CRUD like model but the common actions are named `list`, `add`, `view`, `update` and `delete` - see the `v8.js` file included in the top of `js/awe.js` for more detailed information.

Each `awe.js` application consists of a 3d scene and into that scene you can add points of interest or pois. Each poi marks out a point in space that is important or useful for some reason. This can be the location of an object or it might be a point where a recognised object or marker is currently sitting. Then you can attach different types of media (e.g. 3d objects, videos, images and sounds) to each poi and these pieces of media are called projections.

To add an object (point of interest) into your scene just call:

```
awe.pois.add({ id: 'my_first_poi' });
```

To see all the points of interest in the scene call:

```
awe.pois.list();
```

To see the first poi you created call: 

```
var poi = awe.pois.view('my_first_poi');
```

To see all the projections in the scene call:

```
awe.projections.list();
```

To rotate a poi and all it's children projections just call:

```
awe.pois.update({
  data:{
    rotation:{
      y:180
    }
  },
  where:{
    id:'my_first_poi'
  }
});
```

NOTE: It's important that you only manipulate your pois and projections using the `awe.js` interface (e.g. `awe.pois.update({ data:{...}, where:{...} }`) otherwise you will miss out on all the `awe.js` automagic goodness.


Example pois.add data structure 
-------------------------------
```
{
  id: 'poi_name',
  scale: { x:1, y:1, z:1 },
  position: { x:1, y:1, z:1 },
  rotation: { x:0, y:0, z:0 },
  visible: true,
}
```

Example projections.add data structure  
--------------------------------------
```
{
  id: 'projection_name',
  scale: { x:1, y:1, z:1 },
  position: { x:1, y:1, z:1 },
  rotation: { x:0, y:0, z:0 },
  geometry: { shape:'cube', x:10, y:10, z:10 },
  material: { color:0xFF0000, opacity:1.0, transparent:true, wireframe:false, fog:true },
  texture: { path:'example.jpg' },
  visible: true,
  cast_shadow: true,
  receive_shadow: true,
},
{
  poi_id:'poi_name',
}
```

Welcome to the future of the web - the Augmented Web!
