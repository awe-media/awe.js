awe.media is hiring
-------------------
If you're an experienced javascript developer and you're interested in pushing the boundaries of Virtual and Augmented Reality or Computer Vision then contact us through `jobs [ at ] awe.media`.

# This is your 'how to' guide to creating awe apps

This page is for people interested in creating web-based Immersive experiences (Augmented Reality, Virtual Reality, Interactive 360° Scenes, Mixed Reality, etc.) using awe.js on the the [awe.media](https://awe.media) platform.

It provides you with an overview of the different 'how-to' guides that are available to show you how to use different features and concepts when creating your own awe app.

If you have any questions or need any other information please contact our support team (support [at] awe.media). We love to help people get the best out of the awe platform.

- [How do I create an awe app?](#how-do-i-create-an-awe-app)
- [How do I test and share my awe app?](#how-do-i-test-and-share-my-awe-app)
- [How do I add content to my awe app?](#how-do-i-add-content-to-my-awe-app)
- [What types of experiences can I create?](#what-types-of-experiences-can-i-create)
- [Are there any quick keys in the creator UI](#are-there-any-quick-keys-in-the-creator-ui)
- [Getting started writing custom code for my awe app](#getting-started-writing-custom-code-for-my-awe-app)
- [What are the types of objects in my awe app?](#what-are-the-types-of-objects-in-my-awe-app)
  - [awe](#awe)
  - [application](#application)
  - [apps](#apps)
  - [capabilities](#capabilities)
  - [settings](#settings)
  - [scenes](#scenes)
  - [views](#views)
  - [assets](#assets)
  - [files](#files)
  - [pois](#pois)
  - [projections](#projections)
  - [events](#events)
  - [actions](#actions)
  - [animations](#animations)
  - [povs](#povs)
  - [video streams](#video-streams)
  - [plugins](#plugins)
- [Detailed How-To guides on specific topics](#detailed-how-to-guides-on-specific-topics)
  - [Adding custom HTML content to my awe app](#adding-custom-html-content-to-my-awe-app)
  - [Referring to assets uploaded to my awe app](#referring-to-assets-uploaded-to-my-awe-app) 
  - [Adding audio to my awe app](#adding-audio-to-my-awe-app) 
  - [Adding simple object interactivity to my awe app](#adding-simple-object-interactivity-to-my-awe-app) 
  - [Adding a custom scan again button to my awe app](#adding-a-custom-scan-again-button-to-my-awe-app) 
  - [Showing a fullscreen video from a tap on an object in my awe app](#showing-a-fullscreen-video-from-a-tap-on-an-object-in-my-awe-app) 
  - [Events provided by my awe app](#events-provided-by-my-awe-app) 

## How do I create an awe app?
To get started you can [create a free trial at try.awe.media](https://try.awe.media). This lets you explore what you can create with your own awe app. This will setup your own awe app domain (e.g. `1234abcd.awe.io`), and all the experiences you create will be accessible as pages under this domain (e.g. `https://1234abce.awe.io/my-first-webar-experience`).

Once you've explored your free trial and you're ready to turn it into a real project you can activate your awe app. This will give you control over publishing your awe app (e.g. if you want it to be public for others to view), plus unlock other features so you can add more custom Javascript and CSS, etc. It will also add additional views to your app so you can create up to 5 of [each type of experience](#what-types-of-experiences-can-i-create).

Beyond that, you can also purchase more value added features including additional views (e.g. AR images/3D scenes/pages), increase your upload limits, add your own custom domain and add your own custom branding. You can even fully remove all awe branding to create your own white-label experience.

## How do I test and share my awe app?
To share your creation all you need to do is share the web link to your awe app (e.g. `https://1234abcd.awe.io`). You can even deep link directly to a specific experience you have created (e.g. `https://1234abce.awe.io/my-first-webar-experience`). 

All anyone needs to do to try your experience is open this web link in the browser on their computer or in their pocket. No apps to download or install. It works on over 3 Billion web browsers around the world - including iPhones, Androids, Computers and Head Mounted Displays.

(After our next release) During your trial you can share your creation with anyone and it can be viewed up to 50 times. After that it will be placed in `private mode` and you will need to activate your app to make it public again.

If your app is in `public mode`, then when other people access your app they will see the experience you have created without any of the `creator` options.

## How do I add content to my awe app?
If your awe app is in `private mode` then you will need to sign-in on any device you use to view and edit your creation. When you are signed-in you will see your app in the `creator` mode. Using this friendly web UI you can easily upload `images`, `videos` (including alpha/greenscreen videos), `3D objects`, `3D animated clips`, `audio` files and `AR target images` to your awe app. You can do this from your computer, tablet or mobile device and the whole `creator` experience is very similar across all devices.

You can then simply add these media assets to your 3D scenes, lay them out and add actions and interactivity to create rich and immersive experiences.

## What types of experiences can I create?
You can think of your awe app as a single page web app. Under your top level awe app domain (e.g. `https://1234abcd.awe.io`) you can create individual pages. These pages are a combination of HTML content, a 3D scene, additional interactivity and animations, plus AR or VR functionality. We call these combinations `views` as they are what your end users look at and they provide a unique view onto the real world or into a virtual world.

The 3 main types of experience you can create are:
- image: These are image or `Natural Feature Tracking` based AR experiences that let you glue digital objects onto images in the real world
- standard: These are 360° or VR experiences that work on computers, mobiles and head mounted displays with controllers
- location: These are location based AR experiences that use GPS to place objects in the real world

NOTE: [awe.media](https://awe.media) is the only platform in the world that provides **Natural Feature Based** image tracking in the web!

One of the most powerful features of your awe app is that it makes it easy to seamlessly link from one type of experience to another, all within the same app. For example:
- You might want your end users to start by scanning a QR code or entering a web link. 
- This can then open their camera through their browser to let them view AR overlaid onto a poster. 
- Once they've interacted with this poster you may drive them to unlock a location based experience (e.g. a treasure hunt) that leads them around the local area. 
- And once they find a specific item you've hidden in a specific place then this may unlock an interactive 360° experience. 
This is just one simple scenario that shows how you could blend different modes into one seamless experience using a single awe app. The creative options here are endless.

**Stay tuned because we have some exciting new modes and options we'll be announcing soon!**

## Are there any quick keys in the creator UI
If you are signed-in as a `creator` on your computer browser you can use the following quick keys.

- O for object editor
- B for background (only available in standard views)
- T for target image (only available in image views)
- L for live preview
- S for scan (only available in image views)

Of course you can use the `creator` UI on your mobile devices too, but quick keys are not supported there.

## Getting started writing custom code for my awe app
Now lets look at an overview of the different places where you can add custom Javascript and CSS within your awe app. This will introduce you to the key concepts that make your awe app work.

To get started you'll want to enable console output in your awe app. We have turned this off to reduce overhead and prevent our production awe apps from polluting the browser console. But to interact during development you want to turn this on. 

Copy this line into your Javascript console and hit enter, then reload your page.
```
document.cookie="enable_console=1"
```

## What are the types of objects in my awe app?
Below we outline 17 key Javascript objects you can work with when creating custom code for your awe app. By convention all awe related objects and functions use all lower case with underscores. This makes it easy to differentiate awe related objects and functions from APIs and objects provided by the browser.

Another key part of your awe app is the orange circle that sits in the bottom left hand corner of your window. We call this the awe `doodat`. If you are signed-in as a `creator` then the `doodat` will almost always be there and you can use this to access the different modes and editing tools. 

However, as a `creator` you can choose whether you want your end users to see the `doodat` or not. It does provide a useful UI that lets them easily change mode, etc. But if you want to remove some or all of the awe branding then you can contact our support team (support [at] awe.media) to purchase the ability to hide the `doodat`.

### awe
The `awe.js` API is made available through the `awe` object in the DOM. `awe.js` was first released in 2012 and was the first Immersive Web Javascript framework released. Since then we have moved the version of `awe.js` that was in this github repository to the `deprecated` branch and the latest version is now available inline as part of your `awe.media` awe app. This latest version includes a wide range of enhancements and new features that are not included in the `deprecated` branch on github. This repos is now focused on providing guides and examples of how to create immersive web-based experiences using `awe.media` based awe apps.

Most of the objects within the `awe` object are based on a type of datastore using the [awe v8 api](/awe-v8-api). This simple and consistent API is along the lines of the database style [CRUD model](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) - but instead it focuses on 8 key verbs.

- search
- list
- add
- view
- edit
- update
- delete
- report

These verbs let you access and manage the objects stored in a datastore (e.g. `awe.projections.list()`). Once you have accessed a specific object you can get at the detailed information it contains by calling the `.get_data()` method. And in specific cases key data or functions are made available at the top level of the object too.

If you want to update a specific object you can then use the `.update()` method in one of 2 ways. You can use the full and verbose method e.g.
```
awe.projections.update({
  data: {
    position:{ x:0, y:0, z:-100 }
  },
  where: {
    id: 1234,
  }
});
```
Or if you already have a reference to the specific object (e.g. projection id 1234) then you can use the simpler method e.g.
```
var projection = awe.projections.view(1234);
projection.update({
  position:{ x:0, y:0, z:-100 }
});
```

The `awe.js` API sits on top of `THREE.js` and makes it easy for you to manage scenes, media objects, interactivity, sensors, device types and more. The guides listed below provide detailed examples of how to use this API where relevant.

### application
Much of the `awe.media` specific functionality is made available through the `application` object in the DOM. This provides some key utilities and also lets you access information about the current `app`, current `view`, configuration and more. The guides listed below provide detailed examples of how to use this API where relevant.

### apps
Your awe app is represented by an `awe_app` object that is a type of `awe_object`. You can access all the awe `apps` loaded using the `awe.js` API e.g.
```
awe.apps.list();
```
Alternatively, you can access the current `app` using the `application` API e.g.
```
application.current_app
```

Generally it is best to manage the configuration of your `app` through the `awe.media` creator UI. Then you can access this `app` configuration at runtime to make decisions that can dynamically update your experience.

### capabilities
Each device has a specific set of capabilities that allow it to deliver content and interactivity. By detecting the capabilities you device provides `awe` is able to classify the unique interaction and content it can present to you. You can access the capabilities of the current device through the `awe` API e.g.
```
awe.capabilities.list()
```

The list of key capabilities that `awe` tests for are:
- ajax (ability to make service requests via xhr or fetch)
- audio (ability to use the WebAudio API to load and play sounds)
- geo (ability to access the Geolocation API - on mobile this is driven by GPS)
- gum (ability to access the devices Camera and Microphone)
- gyro (ability to access the DeviceOrientation or similar API to detect the devices pose)
- javascript_w3c (ability to use some specific javascript features required)
- motion (ability to access the DeviceMotion API to detect acceleration & gravity)
- sockets (ability to access the WebSockets API to send bi-directional real-time messages)
- storage (ability to access localStorage to persist key data)
- touch (ability to access user input through touch)
- webgl (ability to access the WebGL API to present 3D scenes)

### settings
Important values that define how your awe app is configured are stored in the global awe `settings` datastore. You can access this through the `awe` API e.g.
```
awe.settings.list()
```

You can also turn on and off key features within the standard interaction model by updating specific settings e.g.
```
awe.settings.update({ 
  data: { value: true }, 
  where: {id: 'prevent_pan_and_zoom' } // set value to true to turn off pan/pinch/zoom in standard views
});
```

Generally it is best to manage the configuration of your `settings` through your awe app creator UI.

### scenes
The 3D part of your experience is represented by an awe `scene`. This lets you load, display and interact with media in a spatial way. Your scenes can be view in the `magic window` model, or what awe calls `view_mode:mono`. Or you can render it for 2 eyes so you can view it in a Head Mounted Display or similar, which awe calls `view_mode:stereo`. Your users can easily switch between `mono` and `stereo` mode in `standard` and `location` based views by selecting the `doodat` and clicking on the `live` or `stereo` icons in the `view control` panel.

You can easily jump between these 2 modes using the `application` API e.g.
```
application.show_stereo();
application.show_mono();
```

You can access your scenes through the `awe` API e.g.
```
awe.scenes.list()
```

Or you can access the default, or primary scene through the `awe` API e.g.
```
awe.scene()
```

You will also find a wide range of useful functions attached to this scene object.


### views
Each interactive experience you create has it's own page (e.g. `https://1234abce.awe.io/my-first-webar-experience`). However, this is more than a normal web page - it's an awe `view`. This is a combination of the HTML overlay content, a WebGL based 3D scene that contains interactive objects, actions and animations that bind them all together and custom Javascript and CSS that can extend them to enhance the way the look and behave. These are all then linked together with unique AR and VR functionality to let you create truly immersive web-based experiences.

You can access access your `views` through the `awe.js` API e.g.
```
awe.views.list()
```

Or you can access the current `view` through the `application` API e.g.
```
application.current_view
```

Also, using the editor UI you can easily add actions that link from one `view` to another. Just go to the object editor and select the object you want. Then select the `...` button in the bottom right corner, then select `Actions` and add an `On select` action. Then select `Load view` and select the `view` you want to link to. Now you can open the doodat and go to the `live preview` mode. When you select that object (e.g. click or tap on it) then it will load the view you specified.

Of course you can do the same sort of thing directly from Javascript using the `application` API e.g.
```
application.load_view('my-first-webar-experience'); // use any valid view name that exists
```

### assets
Assets represent a collection of media and configuration that can be added into a 3D scene. If you are signed in as a `creator` and are in the object editor mode, then in the bottom right hand corner you'll see an orange tab hanging out from the side of the viewport. This is your media library, and when you upload files here they will be transcoded into various sizes and formats required for all the different browsers and stored as `assets`.

Generally it is best to manage the configuration of your `assets` through the media library in your awe app. Then you can access their configuration at runtime to make decisions that can dynamically update your experience e.g.
```
application.current_app.assets
```

### files
As mentioned above, each `file` that is uploaded to your media library is transcoded into various sizes and formats and converted into an `asset`. 

These files can be images (png, jpg, static gif, tif, bmp, etc.), video (.mp4, .avi and .mov including alpha/greenscreen videos), static objects (.obj/.mtl/textures files all in a single .zip), animated objects (.fbx files with any external textures in a single .zip) & audio (.mp3, .aiff, etc.).

You can access the list of `files` related to each `asset` within that specific `asset` object e.g.
```
var my_asset = application.current_app.assets[1234];
var my_files = my_asset.files;
``` 

You can access the individual `asset` id's through the media library UI. Just click on the `(i)` button in the bottom right hand corner of the thumbnail of each `asset`.

### pois
In order to place any object within a 3D scene you need to identify a point in that 3D space. `pois` are objects that represent a `Point Of Interest` and they allow you to attach other objects to them. You can them move these `pois` around by updating their position. All objects attached to these `pois` will then move in a relative way. You can also adjust a `poi's` rotation, scale and visible values to transform or show & hide them and all their children.

You can access `pois` through the `awe` API e.g.
```
awe.pois.list()
```

Or if you have a specific `poi` object already then you can transform it using the `awe` API e.g.
```
var poi = awe.pois.view(123);
poi.update({
  position:{ x:0, y:0, z:-100 })
});
```


### projections
The objects that are projected into your scene that are actually seen by the end users are called `projections`. These use `assets` and their `files` to construct 3D objects. Each `projection` is generally attached to a `poi` as it's parent, however `pois` and `projections` can be dynamically nested arbitrarily.

Through the creator UI we allow you to easily layout and create these structures with an easy to use drag'n'drop interface. However, at runtime you can create and modify these `pois` and `projections` through the `awe` API e.g.
```
awe.projections.list()
```

Or if you have a specific `projection` object already then you can transform it using the `awe` API e.g.
```
var projection = awe.projection.view(456);
projection.update({
  position:{ x:0, y:0, z:-100 }),
  visible:true,
  material:{
    opacity: 0.5
  }
});
```

You can also move a projection from one parent to another using the `awe` API e.g.
```
var projection = awe.projection.view(456);
projection.update({
  parent: {
    object_type:'poi', // this is the type of the new parent (e.g. poi, projection or pov)
    object_id:789}, // this is the id of the new parent object
    retain_world_position: true // stay in the same world position or move relative to new parent
  }
});
```

### events
When you configure interactivity using the creator UI your awe app will setup a specific `event` object. Depending on the type of object you are adding them to they can be `On load` (e.g. when the object loads), `On select` (e.g. when the object it clicked or tapped), `On play` (e.g. when the media starts playing), etc.

You can access these `events` through the `application` API e.g.
```
application.current_app.events
```

Find out more about the overall awe app event lifecycle in the [Events provided by my awe app](#events-provided-by-my-awe-app) section.

### actions
When you configure interactivity using the creator UI your awe app will setup a specific `action` object. Depending on the type of object you are adding them to they can be `On load` (e.g. when the object loads), `On select` (e.g. when the object it clicked or tapped), etc.

You can access these `actions` through the `application` API e.g.
```
application.current_app.actions
```

### animations
When you configure `animations` using the creator UI your awe app will setup a specific `animation` object. These animations can be awe based animations or pre-defined 3D clip animations.

You can access these `animations` through the `application` API e.g.
```
application.current_app.animations
```

You can also easily create `animations` through Javascript using the `awe` API. Just add an `animation` block to your `.update()` call e.g.
```
var projection = awe.projection.view(456);
projection.update({
  position:{ x:0, y:0, z:-100 }),
  animation:{
    duration:5, // take 5 seconds to complete the animation
    persist:1, // stay at the end state when the animation is complete
    end_callback:function() {
      // do something else when the animation is complete
    }
  }
});
```

These type of `animations` in `awe` are created using the [TWEEN.js library](https://github.com/tweenjs/tween.js/blob/master/docs/user_guide.md). The `TWEEN` object is automatically loaded and available in the DOM within your awe app so you can also use that to create any other custom HTML animations etc.

You can also access the `animations` objects for running animations through the `awe` API e.g.
```
awe.animations.list()
```


### povs
Your view into your 3D scene is created by a virtual camera. In `awe` we call these a `Point Of View` or `pov` for short. These `povs` have a very similar API to `pois` and `projections` and can be moved around and rotated in a very similar way. But be aware that specific `view` types on specific device types may override or manage the position and configuration of your `pov` automatically. For example, in AR it is important for the position and orientation of the `pov` to be closely matched to the position and orientation, etc. of the real world camera that's providing the video stream seen in the background of the scene. If you alter this then the illusion created by AR may be broken or diminished.

You can access `povs` through the `awe` API e.g.
```
awe.povs.list()
```

Or you can access the default or primary `pov` directly through the `awe` API e.g.
```
awe.pov()
```

### video streams
In order to create the illusion of see-thru AR, we will often present a video stream from the devices camera in the background of the scene. And many devices have more than one camera so it is possible to setup more than one stream. You can access these streams through the `awe` API e.g.
```
awe.video_streams.list()
```

Or you can access the default or primary video stream (if it is setup) through the `awe` API e.g.
```
awe.video_stream()
```

We have also made it as simple as possible to turn on and off these video streams and automatically place them into the background of the scene. This is effectively flipping between AR and VR modes. You can turn on AR mode using the `application` API e.g.
```
application.show_ar()
```

NOTE: This simply turns on the camera and does not necessarily start any specific type of AR plugin (see below).

Or alternatively, you can switch back to VR/360° mode using the `application` API e.g.
```
application.show_vr()
```

### plugins
There is a standard format for extending the `awe` API which is based on a `plugin` model. Your awe app comes with several standard plugins already loaded including one for detecting object interactions, one for handling mobile based gyro driven scene, one for QR code detection and one for image based natural feature tracking. You can access the `plugins` through the `awe` API e.g.
```
awe.plugins.list()
```

## Detailed 'how-to' guides on specific topics
Below is a collection of detailed 'how-to' guides that will help you complete a specific goal or objective. They assume you have read the content above and include all the relevant Javascript, CSS and HTML snippets you may require.

If you have an idea for another 'how-to' guide please contact our support team (support [at] awe.media). We'd love to hear from you.

### [Adding custom HTML content to my awe app](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-HTML-content-to-my-awe-app)
Learn about the key types of HTML content you can add to your awe app, the standard way you should do this and the common CSS styles you should be aware of. [Read more...](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-HTML-content-to-my-awe-app) 

### Adding a 'start' page to my awe app
Learn about how to add an 'start' page that your users will see when they first load your awe app. This is a great place to set the context for what they are about to experience and what they need to do. COMING SOON 

### [Referring to assets uploaded to my awe app](https://github.com/awe-media/awe.js/wiki/How-To:-Referring-to-assets-uploaded-to-my-awe-app)
Learn about how you can link to, or reference the different types of assets you have uploaded to the media library within your awe app. [Read more...](https://github.com/awe-media/awe.js/wiki/How-To:-Referring-to-assets-uploaded-to-my-awe-app) 

### Custom branding my awe app
Learn about the different parts of your awe app that you can change as part of your custom branding using Javascript and CSS. COMING SOON 

### Adding simple object animations to my awe app
Learn about how to transform and animate one or more objects using Javascript. COMING SOON 

### [Adding audio to my awe app](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-audio-to-my-awe-app)
Learn about how to add audio to your awe app using Javascript. [Read more...](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-audio-to-my-awe-app)

### [Adding simple object interactivity to my awe app](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-simple-object-interactivity-to-my-awe-app)
Learn about how to add interactivity to your objects using Javascript. [Read more...](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-simple-object-interactivity-to-my-awe-app)

### Creating menus with objects in my awe app
Learn about how you can use multiple objects and visibility changes/animations to create multi-object structures like menus. COMING SOON 

### Creating HTML overlay menus in my awe app
Learn about how you can setup an HTML overlay to create a persistent menu. COMING SOON 

### [Adding a custom 'Scan again' button to my awe app](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-a-custom-scan-again-button-to-my-awe-app)
Learn about how you can add a scan again button within your views or as a persistent overlay image. [Read more...](https://github.com/awe-media/awe.js/wiki/How-To:-Adding-a-custom-scan-again-button-to-my-awe-app)

### [Showing a fullscreen video from a tap on an object in my awe app](https://github.com/awe-media/awe.js/wiki/How-To:-Showing-a-fullscreen-video-from-a-tap-on-an-object-in-my-awe-app)
Learn about how you can display a video that fills the browser window when a user taps on an object in your awe app. [Read more...](https://github.com/awe-media/awe.js/wiki/How-To:-Showing-a-fullscreen-video-from-a-tap-on-an-object-in-my-awe-app) 

### [Events provided by my awe app](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)
Learn about the common events provided by your awe app for use within your custom Javascript and how you can tie your functionality to these states and events. [Read more...](https://github.com/awe-media/awe.js/wiki/How-To:-Events-provided-by-my-awe-app)

### Setting the size and scale of the 360° or VR scenes in my awe app
Learn about the different parts that make up the size and strucure of the 360° or VR scenes in your awe app and how you can change their configuration. COMING SOON

### Working with directions in my awe app
Learn about how to deal with compass headings and device orientation within custom Javascript for your awe app. COMING SOON 

### Placing content in front of me in my awe app
Learn about how to use Javascript to place object in front of what the user is looking. COMING SOON 

### Working with locations and active areas in my awe app
Learn about how to work with geolocation and active area features within your awe app. COMING SOON 

### Adding more sophisticated animations to my awe app
Learn about how to create more dynamic animations like throwing objects, etc. COMING SOON 

### Adding a score counter to my awe app
Learn about how to add the HTML, CSS and Javascript needed to add a score counter that tracks different interactions within your awe app. COMING SOON 

### Adding a special page to my awe app that only computer or only mobile users see
Learn about how to setup a page that only shows for certain types of devices e.g. You may want to create an AR experience that only works on mobile or only works on a computer. COMING SOON

### Creating plugins for my awe app
Learn about how to create your own awe plugins. COMING SOON 
