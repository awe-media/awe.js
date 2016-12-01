/*

  The MIT License

  Copyright (c) 2013 Rob Manson & Malgorzata Wierzbicka, http://buildAR.com. 
  All rights reserved.

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.

*/

(function(window) {
  if (window.awe) {
    var undefined;
    var this_awe;
    
    var _extend,
      _clone,
      _clone_deep,
      _type,
      _tween_queue;
    
    var noop = function(){};
    var this_awe = window.awe;
    var _clickable_objects = {};
    var loading_manager;
    var texture_loading_progress = function(xhr){},
      texture_loading_error = function(){};
      
    var frustum;
    var cameraViewProjectionMatrix;
    var inline_video_shim_required = !!(navigator.userAgent.match(/iphone/ig));
    function inline_video_shim_toggle(video, val){
      if (video._playing != val) {
        video._playing = val; 

        // trigger events manually
        var event_name = val ? ( video.currentTime == 0 ? 'playing' : 'play') : 'pause';
        video.dispatchEvent(new CustomEvent(event_name));
      }
    }
    
    this_awe.OBJECT_STATES = {
      INITIAL: 'initial',
      LOADING: 'loading',
      LOADED: 'loaded',
      LOWRES: 'low_res', // not all objects have this state, applies only to objects that have a low-res fallback option 
      DEFAULT: 'default',
      ACTIVE: 'active',
      INACTIVE: 'inactive'
    };

    // renderer class
    function awe_renderer(data, datastore){
      awe_object.call(this, data, datastore);
      var canvas = this.get_canvas();
      if (canvas) {
        this.canvas_width = canvas.clientWidth;
        this.canvas_height = canvas.clientHeight;
      }
    }
    awe_renderer.prototype = Object.create(awe_object.prototype);
    awe_renderer.prototype.constructor = awe_renderer;
    awe_renderer.prototype.get_three_renderer = function(){
      return this._get_data_value('three_renderer');
    };
    awe_renderer.prototype.get_canvas = function(){
      var three_renderer = this.get_three_renderer();
      return three_renderer.domElement;
    };
    awe_renderer.prototype.update = function(BODY, HEAD){
      awe_object.prototype.update.call(this, BODY, HEAD);
      // update any shortcut params we'd like to have exposed
      var canvas = this.get_canvas();
      if (canvas) {
        this.canvas_width = canvas.clientWidth;
        this.canvas_height = canvas.clientHeight;
      }
    };
    awe_renderer.prototype.set_size = function(width, height, inline_css){
      var three_renderer = this.get_three_renderer();
      three_renderer.setSize(width, height, inline_css);
      var canvas = this.get_canvas();
      if (canvas) {
        this.canvas_width = canvas.clientWidth;
        this.canvas_height = canvas.clientHeight;
      }
    };
    awe_renderer.prototype.set_clear_color = function(clear_color, opacity){
      var three_renderer = this.get_three_renderer();
      three_renderer.setClearColor( clear_color, opacity );
    };
    awe_renderer.prototype.set_shadow_map_type = function(shadow_map_type){
      var three_renderer = this.get_three_renderer();
      three_renderer.shadowMapEnabled = true;
      
      switch(shadow_map_type) {
        case 'basic':
          three_renderer.shadowMapType = THREE.BasicShadowMap;                
          break;
        case 'pcf':
          three_renderer.shadowMapType = THREE.PCFShadowMap;                
          break;
        case 'pcf_soft':
          three_renderer.shadowMapType = THREE.PCFSoftShadowMap;                
          break;
        default:
          throw { code: 500, message: 'shadow_map_type unsupported' };
          break;
      }
    };
    awe_renderer.prototype.render = function(awe_scene, awe_pov){
      var three_renderer = this.get_three_renderer();
      three_renderer.render( awe_scene.get_three_scene(), awe_pov.get_mesh() );
    };
    
    
    // awe_video_stream class
    function awe_video_stream(data, datastore){
      awe_object.call(this, data, datastore);
    }
    awe_video_stream.prototype = Object.create(awe_object.prototype);
    awe_video_stream.prototype.constructor = awe_video_stream;
    awe_video_stream.prototype.attach_target = function(video_element, identifier){
      var stream = this._get_data_value('stream');
      if (stream) {
        this_awe.util.connect_stream_to_src(stream, video_element, identifier);
      }
    };
    awe_video_stream.prototype.detach_target = function(video_element, identifier){
      this_awe.util.disconnect_stream(video_element, identifier);
    };
    awe_video_stream.prototype.is_stream_ready = function(){
      var v = this.get_video_element(),
        s = this.get_stream(),
        active = false;
      // firefox on android does not have stream.active
      if (v && s) {
        try {
          if (s.active) {
            active = true;
          }
          else if (s.getVideoTracks) {
            var tracks = s.getVideoTracks();
            tracks.forEach(function(track){
              if (track.enabled) {
                active = true;
              }
            });
          }
        }
        catch(e){}
      }
      return active;
    };
    awe_video_stream.prototype.get_video_element = function(){
      return this._get_data_value('video_element');
    };
    awe_video_stream.prototype.get_stream = function(){
      return this._get_data_value('stream');
    };
    awe_video_stream.prototype.stop = function(){
      awe.video_streams.delete(this.id);
    };
    
    // awe_scene class
    function awe_scene(data, datastore){
      awe_object.call(this, data, datastore);
      this.init();
    }
    awe_scene.prototype = Object.create(awe_object.prototype);
    awe_scene.prototype.constructor = awe_scene;
    awe_scene.prototype.three_children = function(){
      var three_scene = this._get_data_value('three_scene');
      return three_scene.children;
    };
    awe_scene.prototype.init = function(){
      
    };
    awe_scene.prototype.get_three_scene = function(){
      return this._get_data_value('three_scene');
    };
    awe_scene.prototype.get_mesh = function(){
      return this.get_three_scene();
    };
    awe_scene.prototype.add = function(object){
      var mesh;
      if (object instanceof awe_mesh_object) {
        mesh = object.get_mesh();
      }
      else if (object instanceof THREE.Object3D){
        mesh = object;
      }
      if (mesh) {
        var scene_mesh = this.get_mesh();
        scene_mesh.add(mesh);
        return true;
      }
      else {
        console.warn('cannot add object to scene', object)
      }
      return false;
    };
    awe_scene.prototype.remove = function(object){
      var mesh;
      if (object instanceof awe_mesh_object) {
        mesh = object.get_mesh();
      }
      else if (object instanceof THREE.Object3D){
        mesh = object;
      }
      if (mesh) {
        var three_scene = this._get_data_value('three_scene');
        three_scene.remove(mesh);
        return true;
      }
      return false;
    };
    awe_scene.prototype._add_child = function(child){
      var my_mesh = this.get_mesh();
      var new_mesh = child instanceof THREE.Object3D ? child : child.get_mesh();
      my_mesh.add(new_mesh);
      this_awe.scene_needs_rendering = 1;      
    };
    awe_scene.prototype._remove_child = function(child){
      var my_mesh = this.get_mesh();
      var new_mesh = child instanceof THREE.Object3D ? child : child.get_mesh();
      my_mesh.remove(new_mesh);
      this_awe.scene_needs_rendering = 1;      
    };
    
    
    // awe_texture class
    function awe_texture(data, datastore){
      awe_object.call(this, data, datastore);
      this.texture = data.texture;
    }
    awe_texture.prototype = Object.create(awe_object.prototype);
    awe_texture.prototype.constructor = awe_texture;
    awe_texture.prototype.value = function(){
      return this._get_data_value('texture');
    };
    awe_texture.prototype.is_video_texture = function(){
      var three_texture = this.value();
      return !!three_texture.video;
    };
    awe_texture.prototype.autoplay = function(){
      var three_texture = this.value();
      return !!(three_texture.video && three_texture.video.autoplay);
    };
    awe_texture.prototype.play = function(){
      if (this.is_video_texture()) {
        var three_texture = this.value();
        this.paused = false;
        if (three_texture.video && three_texture.video.getAttribute('data-sourcetype') != 'camerastream') {
          inline_video_shim_toggle(three_texture.video, true);
          if (!inline_video_shim_required) {
            three_texture.video.play();
          }
        }
        else {
          var self = this
          var go = function(){
            window.removeEventListener('gum_ready', go, false);
            if (!self.paused) {
              this_awe.util.connect_stream_to_src(this_awe.video_stream().get_stream(), three_texture.video, self.id);
            }
          }
          if (this_awe.video_stream() && this_awe.video_stream().is_stream_ready()) {
            go();
          }
          else {
            this_awe.setup_stream();
            window.addEventListener('gum_ready', go, false);
          }

        }
      }
    };
    awe_texture.prototype.pause = function(){
      if (this.is_video_texture()) {
        var three_texture = this.value();
        this.paused = true;
        if (three_texture.video && three_texture.video.getAttribute('data-sourcetype') != 'camerastream') {
          try {
            // we should not pause video stream textures, the stream video will get paused in effect
            inline_video_shim_toggle(three_texture.video, false);
            if (!inline_video_shim_required) {
              three_texture.video.pause();
            }
          }
          catch(e) {}
        }
        else {
          this_awe.util.disconnect_stream(three_texture.video, this.id);
        }
      }
    };
    awe_texture.prototype.stop = function(){
      if (this.is_video_texture()) {
        var three_texture = this.value();
        if (three_texture.video && three_texture.video.getAttribute('data-sourcetype') != 'camerastream') {
          try {
            inline_video_shim_toggle(three_texture.video, false);
            if (!inline_video_shim_required) {
              three_texture.video.pause();
            }

            three_texture.video.last_time = 0;
            three_texture.video.currentTime = 0;
          }
          catch(e) {}
        }
        else {
          this_awe.util.disconnect_stream(three_texture.video);
        }
      }
    };
    awe_texture.prototype.update_video_texture = function(){
      var three_texture = this.value();
      var result = false;
//        console.log('readystate', three_texture.video.readyState, three_texture.video.HAVE_ENOUGH_DATA)
      if (three_texture.video && three_texture.video.readyState === three_texture.video.HAVE_ENOUGH_DATA) {

        if (inline_video_shim_required && three_texture.video._playing && three_texture.video.duration) { // manually progress through the video
          // trigger the 'playing' event manually
           
          var frames_per_second = 25;
          var time = Date.now();
          if (three_texture.video.last_time) {
            var elapsed = (time - three_texture.video.last_time) / 1000;
            if (elapsed >= ((1000/frames_per_second)/1000)) {
              three_texture.video.currentTime = three_texture.video.currentTime + elapsed;
            }
            // if we are at the end of the video -> stop OR loop
            var currentTime = (Math.round(parseFloat(three_texture.video.currentTime)*10000)/10000);
            var duration = (Math.round(parseFloat(three_texture.video.duration)*10000)/10000);
            if (currentTime >= duration) {
              three_texture.video.last_time = 0;
              three_texture.video.currentTime = 0;
              if (!three_texture.video.loop) {
                inline_video_shim_toggle(three_texture.video, false);
              }
              return;
            }
          }
          three_texture.video.last_time = time;
          
        }
/*
        if (three_texture.video.getAttribute('data-sourcetype') == 'camerastream' && !this_awe.video_stream()) {
//           this_awe.setup_stream();

        }
*/
        if (three_texture.cc) {
          try {
            three_texture.cc.drawImage(three_texture.video, 0, 0, three_texture.cc.canvas.width, three_texture.cc.canvas.height);
            three_texture.needsUpdate = true;
            result = true;
          }
          catch(e) { };
        }
      }
      return result;
    };
    
    // awe_material class
    function awe_material(data, datastore){
      awe_object.call(this, data, datastore);
      this.material = data.material;
    }
    awe_material.prototype = Object.create(awe_object.prototype);
    awe_material.prototype.constructor = awe_material;
    awe_material.prototype.value = function(){
      return this._get_data_value('material');
    };
    
    // awe_sound class
    function awe_sound(data, datastore){
      awe_object.call(this, data, datastore);
    }
    awe_sound.prototype = Object.create(awe_object.prototype);
    awe_sound.prototype.constructor = awe_sound;
    
    
    // awe_mesh_object class
    function awe_mesh_object(data, datastore){
      awe_object.call(this, data, datastore);
      this.children = [];
      this._tweens = {};
      
      this._values_updated();
      /*
// TODO - wire up direct click handling
      if (data.click_handlers) {
        
      }
*/
    }
    awe_mesh_object.prototype = Object.create(awe_object.prototype);
    awe_mesh_object.prototype.constructor = awe_mesh_object;

    
    
    Object.defineProperty(awe_mesh_object.prototype, 'position', { get: function() { 
      var mesh = this.get_mesh('position');
      return _extend({x:0,y:0,z:0}, {
        x: parseFloat(mesh.position.x),
        y: parseFloat(mesh.position.y),
        z: parseFloat(mesh.position.z),
      });
    } });
    
    Object.defineProperty(awe_mesh_object.prototype, 'rotation', { get: function() { 
      var mesh = this.get_mesh('rotation');
      return _extend({x:0,y:0,z:0}, {
        x: THREE.Math.radToDeg(mesh.rotation.x),
        y: THREE.Math.radToDeg(mesh.rotation.y),
        z: THREE.Math.radToDeg(mesh.rotation.z),
      });
    } });
    
    Object.defineProperty(awe_mesh_object.prototype, 'scale', { get: function() { 
      var mesh = this.get_mesh('scale');
      return _extend({x:1,y:1,z:1}, {
        x: parseFloat(mesh.scale.x),
        y: parseFloat(mesh.scale.y),
        z: parseFloat(mesh.scale.z),
      });
    } });
    
    Object.defineProperty(awe_mesh_object.prototype, 'visible', { get: function() { 
      var mesh;
      if (this.get_component) {
        mesh = this.get_component('the_mesh');
      }
      if (!mesh) {
        mesh = this.get_mesh('object');
      }
      return mesh ? +mesh.visible : 0; // output as number
    } });
    
    Object.defineProperty(awe_mesh_object.prototype, 'opacity', { get: function() { 
      var mesh;
      if (this.get_component) {
        mesh = this.get_component('the_mesh');
      }
      if (!mesh) {
        mesh = this.get_mesh('object');
      }
      var opacity = 1;
      if (mesh) {
        mesh.traverse(function(o){
          if (o.material && o.material.transparent) {
            opacity = o.material.opacity;
          }
        })
      }
      return opacity
    } });
    
  ;['title', 'name', 'cast_shadow', 'receive_shadow'].forEach(function(prop){
    Object.defineProperty(awe_mesh_object.prototype, prop, { get: function() { 
      var data = this.get_data();
      return data[prop];
    } });
  });
    
    awe_mesh_object.prototype.move_to = function(position, animation){
      // validate & sanitise position
      position = _valid_coordinates(position);
      if (position) {
        this.update({
          animation: animation,
          position: position
        });
      }
    };

    awe_mesh_object.prototype._values_updated = function(){
      awe_object.prototype._values_updated.call(this);
      var mesh = this.get_mesh();

      if (mesh) {
        if (!mesh.visible) {
          this.pause_video_texture();
        }
        else if (this.autoplay_texture()) {
          this.play_video_texture();
        }
      }
      
    }
    

    awe_mesh_object.prototype.get_mesh = function(){
      return this._get_data_value('mesh');
    };
    
    awe_mesh_object.prototype.material_data = function(){
      if (!arguments.length) {
        return this._get_data_value('material');
      }
      else {
        var m = arguments[0];
        if (m.constructor.name == 'awe_material') {
          m = m.value();
        }
        var mesh = this.get_mesh();
        mesh.material = m;
        this._set_data_value('material', m);        
      }
    };

    awe_mesh_object.prototype.texture_data = function(){
      if (!arguments.length) {
        return this._get_data_value('texture');
      }
      else {
        var t = arguments[0];
        if (t.constructor.name == 'awe_texture') {
          this._set_data_value('texture', t.value());
        }
        else {
          this._set_data_value('texture', t);
        }
      }
    };

    awe_mesh_object.prototype.texture = function(){
      var t = this.texture_data();
      if (t && t.id) {
        return awe.textures.view(t.id);
      }
    };
    awe_mesh_object.prototype.material = function(){
      var t = this.material_data();
      if (t && t.id) {
        return awe.materials.view(t.id);
      }
    };
    awe_mesh_object.prototype.three_texture = function(){
      var mesh = this._get_data_value('mesh');
      var texture;
      try {
        texture = mesh.material.map;
      }
      catch(e) {}
      return texture;
    };
    awe_mesh_object.prototype.three_material = function(){
      var mesh = this._get_data_value('mesh');
      var material;
      try {
        material = mesh.material;
      }
      catch(e) {}
      return material;
    };
    
    awe_mesh_object.prototype.autoplay_texture = function(){
      var autoplay = false;
      var texture = this.texture();
      if (texture && texture.is_video_texture()) {
        autoplay = texture.autoplay();
      }
      return autoplay;
    };
    awe_mesh_object.prototype.toggleplay_video_texture = function(){
      try {
        var awe_texture = this.texture();
        if (awe_texture && awe_texture.is_video_texture()) {
          console.log('texture', awe_texture, awe_texture.paused, awe_texture.texture.video, awe_texture.texture.video.paused)
          if (awe_texture.paused) {
            awe_texture.play();
          }
          else {
            awe_texture.pause();
          }
        }
      }
      catch(e){ console.error('toggle play',e);}
    };
    awe_mesh_object.prototype.play_video_texture = function(){
      var texture = this.texture();
      if (texture && texture.is_video_texture()) {
        texture.play();
      }
    };
    awe_mesh_object.prototype.pause_video_texture = function(){
      var texture = this.texture();
      if (texture && texture.is_video_texture()) {
        texture.pause();
      }
    };
    awe_mesh_object.prototype.stop_video_texture = function(){
      var texture = this.texture();
      if (texture && texture.is_video_texture()) {
        texture.stop();
      }
    };
    awe_mesh_object.prototype.get_world_position = function(){
      var mesh = this.get_mesh('position');
      var pos = mesh.getWorldPosition();
      return {x: pos.x, y: pos.y, z: pos.z};
    };
    awe_mesh_object.prototype.get_screen_coordinates = function(){
      if (!awe.pov()) {
        return;
      }
      var camera = awe.pov().get_mesh('position');
      var mesh = this.get_mesh();
      
      if (!mesh.geometry) {
        console.info('Screen coordinates unavailable for objects without geometries');
        return;
      }
      
      
      // every time the camera or objects change position (or every frame)
      camera.updateMatrixWorld(); // make sure the camera matrix is updated
      camera.matrixWorldInverse.getInverse( camera.matrixWorld );
      cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
      frustum.setFromMatrix( cameraViewProjectionMatrix );
      
      // frustum is now ready to check all the objects you need
      if( frustum.intersectsObject( mesh ) ) {
        var width = canvas.clientWidth, height = canvas.clientHeight;
        var widthHalf = width / 2, heightHalf = height / 2;
        
        var vector = new THREE.Vector3();
        var projector = new THREE.Projector();
        vector.setFromMatrixPosition( mesh.matrixWorld );
        vector.project( camera );
        
        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;
        return { x: vector.x, y: vector.y};
      
      }
      return null;
    };
    awe_mesh_object.prototype._remove_child = function(child){
      try {
        var my_mesh = this.get_mesh();
        var child_mesh = child.get_mesh();
        my_mesh.remove(child_mesh);
      }
      catch(e) {
        console.warn('removing mesh failed', e, this, child);
      }
      this_awe.scene_needs_rendering = 1;
      
      var object_type;
      if (child instanceof awe_projection) {
        object_type = 'projection';
      }
      else if (child instanceof awe_poi) {
        object_type = 'poi';
      }
      else if (child instanceof awe_light) {
        object_type = 'light';
      }
      else if (child instanceof awe_pov) {
        object_type = 'pov';
      }
      else if (child instanceof THREE.Object3D) {
        console.warn('child', child, 'not stored in .children')
        return;
      }
      if (!object_type) {
        throw 'unknown object type '+child.toString()+' '+JSON.stringify(child);
      }
      
      var temp = this.children.filter(function(item){
        return (item.object_type != object_type || item.object_id+'' != child.id+'');
      });
      this.children = temp;
    };
    awe_mesh_object.prototype._add_child = function(child){
      var my_mesh = this.get_mesh('object');
      var new_mesh = child instanceof THREE.Object3D ? child : child.get_mesh();
      my_mesh.add(new_mesh);
      this_awe.scene_needs_rendering = 1;
      
      var object_type;
      if (child instanceof awe_projection) {
        object_type = 'projection';
      }
      else if (child instanceof awe_poi) {
        object_type = 'poi';
      }
      else if (child instanceof awe_light) {
        object_type = 'light';
      }
      else if (child instanceof awe_pov) {
        object_type = 'pov';
      }
      else if (child instanceof THREE.Object3D) {
        console.warn('child', child, 'not stored in .children')
        return;
      }
      if (!object_type) {
        throw 'unknown object type '+child.toString()+' '+JSON.stringify(child);
      }
            
      this.children.push({ object_type: object_type, object_id: child.id });
      
    };
    awe_mesh_object.prototype.parent = function(){
      var parent = this._get_data_value('parent');
      if (!parent) {
        return awe.scene();
      }
      switch (parent.object_type) {
        case 'poi':
        case 'pov':
        case 'light':
        case 'projection':
          return awe[parent.object_type+'s'].view(parent.object_id);
          break;
        default:
          return awe.scene();
      }
    };
    awe_mesh_object.prototype.rotate = function(rotate, animation){
      this.update({
        rotate: rotate,
        animation: animation
      });
    };
    awe_mesh_object.prototype.position = function(position, animation){
      this.update({
        position: position,
        animation: animation
      });
    };
    awe_mesh_object.prototype.scale = function(scale, animation){
      this.update({
        scale: scale,
        animation: animation
      });
    };
    awe_mesh_object.prototype.face_user = function(){
      
      return this.look_at(awe.pov().get_world_position());
      
	  };

    awe_mesh_object.prototype.look_at = function(world_coords){
      var m1 = new THREE.Matrix4();
      var mesh = this.get_mesh('rotation');
      var v_target = _make_three_vector(this.get_world_position());
      var v_eye = _make_three_vector(world_coords);
  		
  		_look_at.apply(m1, [v_eye, v_target, mesh.up]);
  		mesh.quaternion.setFromRotationMatrix( m1 );
//       TODO - test if this can be removed (it should be covered by getters)
      this._values_updated(); 
      awe.scene_needs_rendering = true;
	  };

    this_awe.awe_mesh_object = awe_mesh_object
    
    
    // awe_poi class
    function awe_poi(data, datastore){
      awe_mesh_object.call(this, data, datastore);
      
      var scale = data.scale || { x: 1, y: 1, z: 1 };
      var position = data.position || { x: 0, y: 0, z: 0 };
      var rotation = data.rotation || { x: 0, y: 0, z: 0 };
      
      var origin = new THREE.Object3D();
      origin.scale.set(scale.x, scale.y, scale.z)
      origin.position.set(position.x, position.y, position.z)
      origin.rotation.x = THREE.Math.degToRad(rotation.x);
      origin.rotation.y = THREE.Math.degToRad(rotation.y);
      origin.rotation.z = THREE.Math.degToRad(rotation.z);
      origin.poi_id = this.id;
      
      this._set_data_value('origin', origin);
      
      this.scale = scale;
      this.position = position;
      this.rotation = rotation;
            
    }
    awe_poi.prototype = Object.create(awe_mesh_object.prototype);
    awe_poi.prototype.constructor = awe_poi;
    
    awe_poi.prototype.get_origin = function(){
      return this._get_data_value('origin');
    };
    awe_poi.prototype.get_mesh = function(){
      return this.get_origin();
    };
    
    // awe_pov class
    function awe_pov(data, datastore){
      awe_mesh_object.call(this, data, datastore);
      this.init();
    }
    awe_pov.prototype = Object.create(awe_mesh_object.prototype);
    awe_pov.prototype.constructor = awe_pov;
    awe_pov.prototype.init = function(){};
    awe_pov.prototype.look_at_poi = function(poi_id){
      var poi = awe.pois.view(poi_id);
      var mesh = poi.get_mesh('position');
      var vector = new THREE.Vector3();
      vector.setFromMatrixPosition( mesh.matrixWorld );
      return this.look_at(vector);
    };
    
    


    awe_pov.prototype.look_at_projection = function(projection_id){
      var projection = awe.projections.view(projection_id);
      var mesh = projection.get_mesh('position');
      var vector = new THREE.Vector3();
      vector.setFromMatrixPosition( mesh.matrixWorld );
      return this.look_at(vector);
    };
    awe_pov.prototype.look_at = function(target){
      if (!target) { return; }
      // target can be any awe_mesh_object (poi, projection, pov), or any js object with x,y,z coordinates
      var target_coordinates;
      
      switch (target.constructor.name) {
        case 'awe_poi':
        case 'awe_pov': 
        case 'awe_projection':
          target_coordinates = _valid_coordinates(target.position);
          break;
        default: 
          // just check if there's an target.x target.y and target.z and we're good to go.
          target_coordinates = _valid_coordinates(target);
      }
      if (target_coordinates) {
        var mesh = this.get_mesh('rotation');
        var vector = new THREE.Vector3(target_coordinates.x, target_coordinates.y, target_coordinates.z);
        _look_at.call(mesh, vector);

        _map_audio_listener_to_pov();
        this_awe.scene_needs_rendering = 1;
      }
      return target_coordinates;
    };
    awe_pov.prototype.set_aspect = function(aspect){
      var mesh = this.get_mesh();
      mesh.aspect = aspect;
    };
    awe_pov.prototype.update_projection_matrix = function(){
      var mesh = this.get_mesh();
      mesh.updateProjectionMatrix();
    };
    awe_pov.prototype.set_projection_matrix = function(matrix){
      var mesh = this.get_mesh();
      mesh.projectionMatrix.fromArray(matrix);
    };
    awe_pov.prototype.get_projection_matrix = function(){
      var mesh = this.get_mesh();
      return mesh.projectionMatrix;
    };
    awe_pov.prototype.update_properties = function(){
      console.trace('awe_pov.prototype.update_properties(): DEPRECATED')
    };
    
    ;['far', 'near', 'fov', 'aspect'].forEach(function(prop){
      Object.defineProperty(awe_pov.prototype, prop, { get: function() { 
        var mesh = this.get_mesh();
        return mesh[prop];
      } });
    });
    
    
    Object.defineProperty(awe_pov.prototype, 'active', { get: function() { 
      return this._get_data_value('active');
    } });

    
    
    // awe_projection class
    function awe_projection(data, datastore){
      awe_mesh_object.call(this, data, datastore);
      this.init();
      this.trigger_state(awe.OBJECT_STATES.INITIAL);
    }
    awe_projection.prototype = Object.create(awe_mesh_object.prototype);
    awe_projection.prototype.constructor = awe_projection;
    
    
    awe_projection.prototype.is_origin = function(){
      console.trace('DEPRECATED: awe_projection.prototype.is_origin');
      return false; // !!this._get_data_value('is_origin');
    };

    awe_projection.prototype.place_mesh = function(mesh){
      var wrapper = this.get_mesh('object');
      mesh.name = 'the_mesh';
      wrapper.add(mesh);
      
//       console.log('after placing', wrapper.children.length, mesh)
      var event = new CustomEvent('placed_mesh', { detail: { id: this.id, l: wrapper.children.length } });
      window.dispatchEvent(event);
      try {
        console.log('PLACED MESH', this.id, this.get_mesh('object').children[0].geometry.boundingBox.size);
      } catch(e) { }
    };

    awe_projection.prototype.get_component = function(name){
      var wrapper = this.get_mesh('wrapper')
      if (!wrapper) {
        console.trace('no mesh!!!')
        var position_mesh = this.get_mesh('position');
        var rotation_mesh = this.get_mesh('rotation');
        var scale_mesh = this.get_mesh('scale');
    
        console.log('no mesh',this.get_mesh(), this, position_mesh, rotation_mesh, scale_mesh)
        return null;
      }
      return wrapper.getObjectByName(name);
    };
      
    awe_projection.prototype.get_scale_mesh = function(){
      return this.get_mesh('scale');
    };
    awe_projection.prototype.get_position_mesh = function(){
      return this.get_mesh('position');
    };
    awe_projection.prototype.get_rotation_mesh = function(){
      return this.get_mesh('rotation');
    };
    
    awe_projection.prototype.get_object_mesh = function(){
      return this.get_mesh('object');
    };
    awe_projection.prototype.get_three_mesh = function(){
      return this.get_component('the_mesh');
    };
    
    awe_projection.prototype.trigger_state = function(state){
      this.state = state;
    };
    awe_projection.prototype.init = function(){
      var data = this.get_data();
      var three_mesh = data.mesh;
      
      var parent = this.parent();
      
      var wrapper = new THREE.Object3D();
      wrapper.name = 'wrapper';
      wrapper.projection_id = this.id;
      
      if (three_mesh) { // place object straight away
        three_mesh.name = 'the_mesh';
        wrapper.add(three_mesh);
      }
      
      this.get_mesh = function(type){
        if (!type) {
          return wrapper;
        }
        switch(type) {
          case 'wrapper':
          case 'position':
          case 'rotation':
          case 'scale':
          case 'object':
            return wrapper;
          case 'three':
            return this.get_component('the_mesh');
          default: 
            return awe_mesh_object.prototype.get_mesh.call(this);
        }
      };
      
      if (parent && parent._add_child && typeof (parent._add_child) == 'function') {
        // can be any awe_mesh_object
        parent._add_child(this);
      }
      
      if (!this._get_data_value('not_clickable')) {
        _clickable_objects['projection-'+this.id] = wrapper;
      }
      

    };

    awe_projection.prototype.is_clickable = function(){
      return !!_clickable_objects['projection-'+this.id];
    };
    
    
    
    // awe_light class
    function awe_light(data, datastore){
      awe_mesh_object.call(this, data, datastore);
    }
    awe_light.prototype = Object.create(awe_mesh_object.prototype);
    awe_light.prototype.constructor = awe_light;
    
    
    
    
    
    this_awe.constructor.prototype.renderers = new awe_v8();
    this_awe.constructor.prototype.renderers._item_constructor = awe_renderer;
    this_awe.constructor.prototype.renderers.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      
      // read settings
      var settings = this_awe.util.get_settings('renderer|debug|fps|antialias|clear_color|opacity|shadows|shadow_map_type|canvas_style|container_id');
      var capabilities = this_awe.util.get_capabilities('webgl');
      var renderer;
      
      if (settings.renderer) {
        if (capabilities.webgl && settings.renderer == 'webgl') {
          var antialias = settings.antialias || true;
          var three_renderer = new THREE.WebGLRenderer({ antialias: antialias, alpha: true });
          if (!three_renderer) {
            throw { code: 500, message: 'three.js renderer creation failed' };
            return;
          }
          
          BODY.three_renderer = three_renderer;
          renderer = new awe_renderer(BODY, this);
          
          var clear_color = settings.clear_color || 0x000000;
          var opacity = settings.opacity || 0;
          renderer.set_clear_color( clear_color, opacity );
          
          // spotlight is required to add shadows!
          // see https://github.com/mrdoob/three.js/issues/748
          if (settings.shadows) {
            var shadow_map_type = settings.shadow_map_type || "pcf_soft";
            renderer.set_shadow_map_type(shadow_map_type);
          }
        }
        
        var l = this.constructor.prototype.list().length;
        var awe_canvas = renderer.get_canvas();
        awe_canvas.id = 'awe_canvas-'+l;
        var style_settings = settings.canvas_style
        if (style_settings) {
          try {
            for (var i in style_settings) {
              if (style_settings.hasOwnProperty(i)) {
                awe_canvas.style[i] = style_settings[i];                
              }
            }
          }
          catch(e) { /* TODO */ };
        }
        else {             
          awe_canvas.style.position = 'absolute';
          awe_canvas.style.top = '0px';
          awe_canvas.style.left = '0px';
          awe_canvas.style.width = '100%';
          awe_canvas.style.height = '100%';
        }
        if (BODY.container_id && document.getElementById(BODY.container_id)) {
          document.getElementById(BODY.container_id).appendChild(awe_canvas);
        }
        else if (settings.container_id && document.getElementById(settings.container_id)) {
          document.getElementById(settings.container_id).appendChild(awe_canvas);
        }
        else {
          document.body.appendChild(awe_canvas);
        }
        var w = awe_canvas.parentNode.clientWidth,
          h = awe_canvas.parentNode.clientHeight;
          
        if (!w || !h) {
          console.info('awe canvas container has no height - making it use window dimensions', w, h);
          w = window.innerWidth;
          h = window.innerHeight;
        }
        renderer.set_size(w, h, false);
        
      }
      else {
        throw { code: 500, message: 'three.js renderer not defined' };
      }
      
      this_awe.scene_needs_rendering = 1;
      return this.constructor.prototype.add.call(this, renderer, HEAD); // super
    }

    this_awe.constructor.prototype.renderer = function(id) {
      return this_awe.renderers.view({ id: id ? id : 'default' });
    }; 

    this_awe.constructor.prototype.lights = new awe_v8();
    this_awe.constructor.prototype.lights._item_constructor = awe_light;
    this_awe.constructor.prototype.lights.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var results = [],
        self = this;
        
      BODY.forEach(function(BODY_item){
          
        // sensible defaults
        BODY_item.id = BODY_item.id || "light-"+random_id();
        BODY_item.visible = BODY_item.visible !== undefined ? BODY_item.visible : 1;
        BODY_item.type = BODY_item.type !== undefined ? BODY_item.type : 'hemisphere';
        BODY_item.color = BODY_item.color !== undefined ? BODY_item.color : 0x404040;
  
        if (HEAD.parent && HEAD.parent.object_id && HEAD.parent.object_type && this_awe[HEAD.parent.object_type+'s'] && ''+this_awe[HEAD.parent.object_type+'s'] == 'awe_v8_object')  {
          try {
            BODY_item.parent = HEAD.parent;
          }
          catch(e) {
            consoe.log(e)
            this_awe.error_handler(e);
          }
        }

        var three_light, 
          position = true,
          shadows = false;
        switch (BODY_item.type) {
          case 'area':
            three_light = new THREE.AreaLight(BODY_item.color);
            if (parseInt(BODY_item.intensity) && parseInt(BODY_item.intensity) != NaN) {
              three_light.intensity = parseInt(BODY_item.intensity);
            }
            break;
          case 'directional':
            three_light = new THREE.DirectionalLight(BODY_item.color);
            shadows = true;
            if (parseInt(BODY_item.intensity) && parseInt(BODY_item.intensity) != NaN) {
              three_light.intensity = parseInt(BODY_item.intensity);
            }
            break;
          case 'hemisphere':
            var ground_color;
            if (BODY_item.ground_color) {
              ground_color = BODY_item.ground_color;
            }
            three_light = new THREE.HemisphereLight(BODY_item.color, ground_color);
            position = false;
            if (parseInt(BODY_item.intensity) && parseInt(BODY_item.intensity) != NaN) {
              three_light.intensity = parseInt(BODY_item.intensity);
            }
            break;
          case 'point':
            three_light = new THREE.PointLight(BODY_item.color);
            if (parseInt(BODY_item.distance) != NaN) {
              three_light.distance = parseInt(BODY_item.distance);
            }
            if (parseInt(BODY_item.decay) != NaN) {
              three_light.decay = parseInt(BODY_item.decay);
            }
            if (parseInt(BODY_item.intensity) && parseInt(BODY_item.intensity) != NaN) {
              three_light.intensity = parseInt(BODY_item.intensity);
            }
            break;
          case 'spot':
            three_light = new THREE.SpotLight(BODY_item.color);
            if (parseFloat(BODY_item.angle) && parseFloat(BODY_item.angle) != NaN) {
              three_light.angle = parseFloat(BODY_item.angle);
            }
            if (parseInt(BODY_item.distance) && parseInt(BODY_item.distance) != NaN) {
              three_light.distance = parseInt(BODY_item.distance);
            }
            if (parseInt(BODY_item.decay) && parseInt(BODY_item.decay) != NaN) {
              three_light.decay = parseInt(BODY_item.decay);
            }
            if (parseFloat(BODY_item.exponent) && parseFloat(BODY_item.exponent) != NaN) {
              three_light.exponent = parseFloat(BODY_item.exponent);
            }
            if (parseInt(BODY_item.intensity) && parseInt(BODY_item.intensity) != NaN) {
              three_light.intensity = parseInt(BODY_item.intensity);
            }
            shadows = true;

            break;
          default: 
            three_light = new THREE.AmbientLight(BODY_item.color);
        }
        
        // spot and directional lights
        if (shadows && three_light.shadow) {
          
          if (undefined !== BODY_item.only_shadow) {
            three_light.onlyShadow = !!BODY_item.only_shadow;
          }
          if (undefined !== BODY_item.cast_shadow) {
            three_light.castShadow = !!BODY_item.cast_shadow;
          }
          if (undefined !== BODY_item.shadow_camera_visible) {
            three_light.shadow.camera.visible = !!BODY_item.shadow_camera_visible;
            three_light.shadow.camera.near = BODY_item.shadow_camera_near || 0.01;
            three_light.shadow.camera.far = BODY_item.shadow_camera_far || 5000;
          }    

        
          if (parseInt(BODY_item.shadow_bias) != NaN) {
            three_light.shadow.bias = parseInt(BODY_item.shadow_bias);
          }
          if (three_light.shadow.map) {
            if (parseInt(BODY_item.shadow_map_width) != NaN) {
              three_light.shadow.map.width = parseInt(BODY_item.shadow_map_width);
            }
            if (parseInt(BODY_item.shadow_map_height) != NaN) {
              three_light.shadow.map.height = parseInt(BODY_item.shadow_map_height);
            }
          }
        }

        if (three_light.target && three_light.target.position && BODY_item.target && typeof(BODY_item.target) == 'object') {
          three_light.target.position.set(BODY_item.target.x || 0, BODY_item.target.y || 0, BODY_item.target.z || 0)
        }
        
        if (position && three_light.position && BODY_item.position && typeof(BODY_item.position) == 'object') {
          three_light.position.set(BODY_item.position.x || 0, BODY_item.position.y || 0, BODY_item.position.z || 0)
        
        }
        
        BODY_item.mesh = three_light;
        var light = new awe_light(BODY_item, self);
        
        var parent = light.parent();
        if (parent && parent._add_child && typeof (parent._add_child) == 'function') {
          // can be any awe_mesh_object
          parent._add_child(light);
          if (three_light.target) {
            parent._add_child(three_light.target);
          }
        }
        
        this_awe.scene_needs_rendering = 1;
        results.push(light);
      });
      var ret = this.constructor.prototype.add.call(this, results, HEAD); // super
      _update_materials();
      return ret;
    }
    this_awe.constructor.prototype.lights.update = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var return_result = {},
        self = this;
      
      BODY.forEach(function(item){
        if (item.data && item.where && item.where.id) {
          var fields_updated = [];
          if (item.data.position) { fields_updated.push('position'); }
          if (item.data.scale) { fields_updated.push('scale'); }
          if (item.data.rotation) { fields_updated.push('rotation'); }
          if (item.data.target) { fields_updated.push('target'); }
          if (fields_updated.length) {
            HEAD.fields_updated = fields_updated;
          }
          if (!Array.isArray(item.where.id)) {
            item.where.id = [item.where.id];
          }
          item.where.id.forEach(function(where_id){
            try {
              var object = this_awe.lights.view(where_id);
              var mesh = object.get_mesh();
            } catch(e) { return; /* TODO */ };
            if(item.data.animation && parseFloat(item.data.animation.duration) > 0) {
              // after tween ends _update_materials();
              try {
                _tween(_extend({
                  object: object,
//                   mesh: mesh,
                  end_state: item.data
                }, item.data.animation));
              } catch(e) { /* TODO */ };
            }
            else {
              try {
                var mesh = _update_mesh_io(item.data, mesh);
              } catch(e) { /* TODO */ };
            }
            var result = _clone(item);
            result.mesh = mesh;
            
            return_result[where_id] = self.constructor.prototype.update.call(self, result, HEAD); // super
          });
        }
      });
      _update_materials();
      return return_result;
    };
    this_awe.constructor.prototype.lights.delete = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      var id_array = [];
      if (BODY.id !== undefined) {
        id_array = Array.isArray(BODY.id) ? BODY.id : [BODY.id];
      }
      else if (typeof BODY == 'string' || typeof BODY == 'number') {
        id_array = [BODY];
      }
      else if (Array.isArray(BODY)) {
        id_array = BODY;
      }
      
      id_array.forEach(function(BODY_item){
        var light;
        if (typeof BODY_item == 'string' || typeof BODY_item == 'number') {
          light = this_awe.lights.view(BODY_item);
          BODY_item = { id: BODY_item };
        }
        else if (BODY_item.id) {
          light = this_awe.lights.view(BODY_item.id);
        }
        
        
        if (!light) {
          console.trace('cant delete',BODY_item);
          return;
        }
        var mesh = light.get_mesh();
        if (mesh && mesh.parent) {
          if (mesh.target) { 
            mesh.parent.remove(mesh.target);
          }
          mesh.parent.remove(mesh);
        }
        else {
          console.log('no light mesh to delete!', BODY, HEAD)
        } 
      });
      
      this_awe.scene_needs_rendering = 1;
      return this.constructor.prototype.delete.call(this, BODY, HEAD); // super
    };
    
    this_awe.constructor.prototype.video_streams = new awe_v8();
    this_awe.constructor.prototype.video_streams._item_constructor = awe_video_stream;
    this_awe.constructor.prototype.video_streams.add = function(BODY, HEAD) {
      var capabilities = this_awe.util.get_capabilities('gum');
      if (capabilities.gum) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        try {
          var self = this,
            video_id = 'video_stream-'+BODY.id+'-'+random_id(),
            video = document.createElement('video');
          
          video.setAttribute('id', video_id);
          video.setAttribute('autoplay', true);
          video.style.position = 'absolute';
          video.style.top = '-999em';
          video.style.left = '-999em';
          video.style.height = '100%';
          video.style.width = '100%';
          video.setAttribute('width', '100%');  
          video.setAttribute('height', '100%');
          
          BODY.video_element = video;
          var video_stream = new awe_video_stream(BODY, this);
          var result = this.constructor.prototype.add.call(this, video_stream, HEAD); // super
          // if many sources try to get the environemt-facing camera
          
          var go = function(video_source_id){
            var options = this_awe.util.extend({
              video: true
            }, BODY.gum_options);
            if (video_source_id) {
              options.video = {
                optional: [{ facingMode: (BODY.facing_mode ? BODY.facing_mode : "environment") }, {sourceId: video_source_id}]
              };
            }
            // clear before each access request
            this_awe.gum_denied = false;                console.log('requesting gum')
            this_awe.util.get_user_media(options, 
              function(stream) {
                document.body.appendChild(video);
                video.muted = true;
                
                BODY.stream = stream;
                self.constructor.prototype.update.call(this, {data: {stream: stream}, where: {id: BODY.id}}, HEAD); // super
                this_awe.util.connect_stream_to_src(stream, video);
                var targets = this_awe.util.get_stream_targets();
                
                video.addEventListener('pause', function(){
                  var event = new CustomEvent('gum_pause', { detail: { id: BODY.id } });
                  window.dispatchEvent(event);
                });

                if (video.readyState == video.HAVE_METADATA) {
                  var event = new CustomEvent('gum_ready', { detail: { id: BODY.id } });
                  window.dispatchEvent(event);
                }
                else {
                  video.addEventListener('loadedmetadata', function (e) {
                    var event = new CustomEvent('gum_ready', { detail: { id: BODY.id } });
                    window.dispatchEvent(event);
                  }, false);
                }
              }, 
              function(e) {
                this_awe.gum_denied = true;
                var event = new CustomEvent('gum_error', { detail: { id: BODY.id } });
                window.dispatchEvent(event);
              }
            );
          }
          
          if (navigator.mediaDevices && navigator.mediaDevices.enumerateDevices) {
            navigator.mediaDevices.enumerateDevices()
            .then(function(devices) {
              var selected_source = null;
              var last_videoinput_source = null;
              devices.forEach(function(device) {
                if (device.kind === 'videoinput') {
                  if (BODY.facing_mode === 'environment' && device.label.indexOf('back') !== -1) {
                    selected_source = device.deviceId;
                  }
                  last_videoinput_source = device.deviceId;
                }
              });
              if ((!selected_source || BODY.facing_mode === 'environment') && last_videoinput_source) {
                selected_source = last_videoinput_source;
              }
              go(selected_source);
            })
            .catch(function(err) {
              console.log(err.name + ": " + err.message);
            });
          }
          else if (window.MediaStreamTrack && window.MediaStreamTrack.getSources) {
            MediaStreamTrack.getSources(function(source_infos) {
              var selected_source = null;
              for (var i = 0; i != source_infos.length; ++i) {
                var source_info = source_infos[i];
                if (source_info.kind === 'video') {
                  if (!selected_source || (source_info.facing && source_info.facing == (BODY.facing_mode ? BODY.facing_mode : "environment") )) {
                    selected_source = source_info.id;
                  }
                }
              }
              go(selected_source);
            });
          }
          else {
            go();
          }
        }
        catch(e) {
          console.log(e);
        }
        return result;
      }
      else {
        // throw { code: 500, message: 'video streams not supported by this browser' };
      }
    };
    this_awe.constructor.prototype.video_streams.delete = function(BODY, HEAD) {
      var capabilities = this_awe.util.get_capabilities('gum');
      if (capabilities.gum) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        try {
          if (typeof BODY == 'string' || typeof BODY == 'number') {
            video_stream = this.constructor.prototype.view(BODY);
            BODY = { id: BODY };
          }
          else if (BODY.id) {
            video_stream = this.constructor.prototype.view(BODY.id);
          }
          if (!video_stream) {
            return;
          }
          var stream = video_stream.get_stream();
          if (stream && stream.stop) {
            stream.stop();
          }
          else {
            try {
              stream.getVideoTracks().forEach(function(s){
                s.stop();
              });
              stream.getAudioTracks().forEach(function(s){
                s.stop();
              });
            }
            catch(e){}
          }
          // remove video element
          var video = video_stream.get_video_element();
          video.parentNode.removeChild(video);
          
          return this.constructor.prototype.delete.call(this, BODY, HEAD); // super
        }
        catch(e) {
          console.log(e);
        }
      }
    };

    this_awe.constructor.prototype.video_stream = function(id) {
      return this_awe.video_streams.view({ id: id ? id : 'default' });
    }; 
    
    this_awe.constructor.prototype.scenes = new awe_v8();
    this_awe.constructor.prototype.scenes._item_constructor = awe_scene;
    this_awe.constructor.prototype.scenes.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var results = [],
        self = this;
        
      BODY.forEach(function(BODY_item){
        var scene = new THREE.Scene();
        if (BODY_item.container_id && document.getElementById(BODY_item.container_id)) {
          scene.element = document.getElementById(BODY_item.container_id);
        }
        BODY_item.three_scene = scene;
        var item = new awe_scene(BODY_item, self);
        results.push(item);
        this_awe.scene_needs_rendering = 1;
      });
      return this.constructor.prototype.add.call(this, results, HEAD); // super
    }

    this_awe.constructor.prototype.scene = function(id) {
      return this_awe.scenes.view({ id: id ? id : 'default' });
    };
    this_awe.constructor.prototype.scene.stringify = function() {
      // TODO walk the scene and stringify to JSON
    }
    


    
    
    this_awe.constructor.prototype.povs = new awe_v8();
    this_awe.constructor.prototype.povs._item_constructor = awe_pov;
    this_awe.constructor.prototype.povs.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)){
        BODY = [BODY];
      }
      var settings = this_awe.util.get_settings('fov|near|far|default_camera_position');
      var self = this;
      var result_ids = [];
      
      var fov = settings.fov || 65;  // ~fov of ios devices - TODO: should set default based on device_type or ideally camera introspection
      var near = settings.near || 1;
      var far = settings.far || 20000;
      
      var awe_canvas = this_awe.renderer().get_canvas();
      var aspect_ratio = awe_canvas.clientWidth / awe_canvas.clientHeight; 
      
      BODY.forEach(function(BODY_item){
        var camera = new THREE.PerspectiveCamera(
          fov,
          aspect_ratio,
          near,
          far
        );
        if (!settings.default_camera_position) {
          this_awe.settings.add({
            id: 'default_camera_position',
            value: { x:0, y:0, z:0 },
          });
        }
        BODY_item.mesh = camera;
        var position = _extend({x:0, y:0, z:0}, settings.default_camera_position);
        camera.position.set(position.x, position.y, position.z);
        this_awe.scene().add(camera);
        
        var result = new awe_pov(BODY_item, self);
        
        this_awe.scene_needs_rendering = 1;
        var ret = self.constructor.prototype.add.call(self, result, HEAD); // super
        result_ids.push(ret);
        result.look_at(this_awe.origin);
      })
      
      return { id: result_ids };
    };
    
    this_awe.constructor.prototype.povs.update = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      
      var return_result = {},
        self = this;
        
      BODY.forEach(function(item){
        if (item.data && item.where && item.where.id) {
          var fields_updated = [];
          if (!Array.isArray(item.where.id)) {
            item.where.id = [item.where.id];
          }
          if (item.data.position) {
            fields_updated.push('position');
            var users_step_callback;
            if (item.data.animation && item.data.animation.step_callback) {
              users_step_callback = item.data.animation.step_callback;
              item.data.animation.step_callback = function(io) {
                this_awe.util.audio_context.listener.setPosition(io.mesh.position.x, io.mesh.position.y, io.mesh.position.z);
                return users_step_callback(io);
              }
            }
          }
          if (item.data.scale) { fields_updated.push('scale'); }
          if (item.data.rotation) {
            fields_updated.push('rotation');
            _map_audio_listener_to_pov();
          }
          if (fields_updated.length) {
            HEAD.fields_updated = fields_updated;
          }
          item.where.id.forEach(function(where_id){  
            try {
              var object = this_awe.povs.view(where_id);
              var mesh = object.get_mesh();
            } catch(e) { return; /* TODO */ };
            if(item.data.animation && parseFloat(item.data.animation.duration) > 0) {
              try {
                _tween(_extend({
                  object: object,
//                   mesh: mesh,
                  end_state: item.data
                }, item.data.animation));
              } catch(e) { /* TODO */ };
            }
            else {
              var mesh = _update_mesh_io(item.data, mesh);
            }
            var result = _clone(item);
            result.mesh = mesh;
            return_result[where_id] = self.constructor.prototype.update.call(self, result, HEAD); // super
          });
          this_awe.scene_needs_rendering = 1;
          
        }
      });
      return return_result;
    };

    this_awe.constructor.prototype.pov = function(id) {
      if (id) {
        return this_awe.povs.view({ id: id });
      }
      else {
        var povs = this_awe.povs.list({active:true});
        if (!povs.length) {
          povs = this_awe.povs.list({id:'default'});
        }
        if (!povs.length) {
          povs = this_awe.povs.list({visible:true});
        }
        if (!povs.length) {
          povs = this_awe.povs.list();
        }
        return povs[0];
      }
    };
    
    this_awe.constructor.prototype.pois = new awe_v8();
    this_awe.constructor.prototype.pois._item_constructor = awe_poi;
    this_awe.constructor.prototype.pois.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var self = this,
        pois = [];
      
      BODY.forEach(function(BODY_item){
          
        if (!BODY_item.id) {
          BODY_item.id = 'poi-'+random_id();
        }
        
        var projections = [];
        if (BODY_item.projections && Array.isArray(BODY_item.projections)) {
          projections = BODY_item.projections;
          delete BODY_item.projections;
        }

        var projection_io = {};
        var parent;
        if (HEAD.poi_id) {
          parent = {
            object_type: 'poi',
            object_id: HEAD.poi_id
          };
        }
        else if (HEAD.parent) {
          parent = HEAD.parent;
        }
        BODY_item.parent = parent;
        var poi = new awe_poi(BODY_item, self);
        pois.push(poi);
        
        // add the mesh to the scene/parent
        var p = poi.parent();
        if (p && p._add_child) {
          p._add_child(poi)
        }
        else {
          console.trace('no add_child', p, poi);
        }
        projections.forEach(function(projection_io){
          if (!projection_io.id) {
            projection_io.id = 'projection-'+random_id();
          }
          this_awe.projections.add(projection_io, { poi_id: BODY_item.id });
        });
      });
      return this.constructor.prototype.add.call(self, pois, HEAD); // super
    };
    this_awe.constructor.prototype.pois.update = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var return_result = {},
        self = this;
      BODY.forEach(function(item){
        if (item.data && item.where && item.where.id) {
          var fields_updated = [];
          if (item.data.position) { fields_updated.push('position'); } 
          if (item.data.scale) { fields_updated.push('scale'); } 
          if (item.data.rotation) { fields_updated.push('rotation'); } 
          if (fields_updated.length) {
            HEAD.fields_updated = fields_updated;
          }
          if (!Array.isArray(item.where.id)) {
            item.where.id = [item.where.id];
          }
          item.where.id.forEach(function(where_id){
            try {
              var object = this_awe.pois.view(where_id);
              var mesh = object.get_mesh();
            } catch(e) { return; /* TODO */ };
            
            if(item.data.animation && parseFloat(item.data.animation.duration) > 0) {
              var poi = self.constructor.prototype.view(where_id),
                end_callback = item.data.animation.end_callback;
              item.data.animation.end_callback = function(io){
                if (poi) {
                  poi._values_updated();
                }
                if (end_callback) {
                  end_callback(io);
                }
              }
              try {
                console.log('poi tween', item.data, item.data.animation, object);
                _tween(_extend({
                  object: object,
//                   mesh: mesh,
                  end_state: item.data,
                }, item.data.animation));
              } catch(e) { /* TODO */ };
            }
            else {
              try {
                var mesh = _update_mesh_io(item.data, mesh);
                this_awe.scene_needs_rendering = 1;
              } catch(e) { /* TODO */ };
            }
            var result = _clone(item);
            result.mesh = mesh;
            return_result[where_id] = self.constructor.prototype.update.call(self, result, HEAD); // super
          })
        }
      })
      return return_result;
    };
    this_awe.constructor.prototype.pois.delete = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      var projection;
      try {
        if (typeof BODY == 'string' || typeof BODY == 'number') {
          poi = this_awe.pois.view(BODY);
          BODY = { id: BODY };
        }
        else if (BODY.id) {
          poi = this_awe.pois.view(BODY.id);
        }
        if (poi.children) {
          poi.children.forEach(function(item){
            if (this_awe[item.object_type+'s']) {
              this_awe[item.object_type+'s'].delete(item.object_id);
            }
          });
        }
        
        if (poi.parent && typeof(poi.parent) == 'function')  {
          try {
            parent = poi.parent();
            parent._remove_child(poi);
            this_awe.scene_needs_rendering = 1;
          }
          catch(e) {}
        }
        else {
          // remove mesh directly from parent mesh
          var mesh = poi.get_mesh();
          if (mesh && mesh.parent) {
            mesh.parent.remove(mesh);
            this_awe.scene_needs_rendering = 1;
          }
          else {
            console.log('no mesh to delete!', BODY, HEAD)
          } 
        }
      }
      catch(e) {
        this_awe.error_handler(e);  
      }
      this_awe.scene_needs_rendering = 1;
      return this.constructor.prototype.delete.call(this, BODY, HEAD); // super
    };

    this_awe.constructor.prototype.projections = new awe_v8();
    this_awe.constructor.prototype.projections._item_constructor = awe_projection;
    this_awe.constructor.prototype.projections.list = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (BODY.type && BODY.type === "clickable") {
        var meshes = [];
        Object.keys(_clickable_objects).forEach(function(key){
          if (_clickable_objects[key].visible) {
            // skip invisible meshes
            meshes.push(_clickable_objects[key]);
          }
        });
        return meshes;
      } else {
        return this.constructor.prototype.list.call(this, BODY, HEAD); // super
      }
    }
    this_awe.constructor.prototype.projections.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var result_ids = [],
        self = this;
      function finish_add(id) {
        var projection = this_awe.projections.view(id);
/*
        if (!projection) {
          // super add() failed
          console.warn('no projection', id)
          return;
        }
*/
/*
        var mesh = projection.get_mesh();
        if (!mesh) {
          // mesh instance creation failed
          console.warn('no mesh', id)
          return
        }
        mesh.projection_id = id;
*/
/*
        var parent = projection.parent();
        if (!parent) {
          // not origin, but has no parent to be added to
          console.warn('no parent', id)
          return;
        }
        if (!projection._get_data_value('not_clickable')) {
          _clickable_objects['projection-'+id] = mesh;
        }
        
        if (parent._add_child && typeof (parent._add_child) == 'function') {
          // can be any awe_mesh_object

          parent._add_child(projection);
        }
        else {
          console.warn('parent doesnt have _add_child() method', parent);
          return;
        }
*/
        projection._values_updated();
        this_awe.scene_needs_rendering = 1;
        projection.loaded = true;
        projection.trigger_state(awe.OBJECT_STATES.DEFAULT);
        projection.trigger_state(awe.OBJECT_STATES.LOADED);
/*
        try {
          console.log('LOADED', projection.id, projection.get_mesh('object').children[0].geometry.boundingBox.size);
        } catch(e) { console.log(e); }
*/
        var event = new CustomEvent('projection_loaded', {detail: id});
        window.dispatchEvent(event);
        
      }
      
      BODY.forEach(function(BODY_item){
        var config = _clone(BODY_item);
        var geometry, material, mesh, parent, origin;
        if (!BODY_item.id) {
           throw 'projections.add(): BODY.id required';
        }
        if (this_awe.projections.view(BODY_item.id)) {
          console.warn('projections.add(): BODY.id already exists', BODY_item.id);
          return;
        }
        
        BODY_item.config = config;
        if (HEAD.parent && HEAD.parent.object_id && HEAD.parent.object_type && this_awe[HEAD.parent.object_type+'s'] && ''+this_awe[HEAD.parent.object_type+'s'] == 'awe_v8_object')  {
          try {
            BODY_item.parent = HEAD.parent;
          }
          catch(e) {
            console.log(e)
            this_awe.error_handler(e);
          }
        }
        else if (HEAD.poi_id) {
//          parent = this_awe.pois.view(HEAD.poi_id);
          BODY_item.parent = {
            object_type: 'poi',
            object_id: HEAD.poi_id
          };
        }
        if (!_check_parent(BODY_item)) {
          return null;
        }
        origin = new THREE.Object3D();
        origin.name = 'projection ID:'+BODY_item.id+' origin';
        BODY_item.origin = origin;
        
        /*
if (!parent) {
          throw 'HEAD.poi_id or HEAD.parent required';
        }
*/
        
        if (!BODY_item.material) {
          BODY_item.material = {};
        }
        if (!BODY_item.texture) {
          BODY_item.texture = {};
        }
        if (BODY_item.sound) {
          var capabilities = this_awe.util.get_capabilities('audio');
          if (capabilities.audio) {
            if (BODY_item.sound.path == undefined) {
              throw "sound path required";
            }
            BODY_item.sound.source = this_awe.util.audio_context.createBufferSource();
            BODY_item.sound.panner = this_awe.util.audio_context.createPanner();
            BODY_item.sound.source.connect(BODY_item.sound.panner);
            BODY_item.sound.panner.connect(this_awe.util.audio_context.destination);
            BODY_item.sound.panner.refDistance = 100;
            var position = { x:0, y:0, z:0 };
            if (BODY_item.position !== undefined) {
              for (var p in BODY_item.position) {
                if (BODY_item.position.hasOwnProperty(p)) {
                  position[p] = BODY_item.position[p];
                }
              }
            }
            BODY_item.sound.panner.setPosition(position.x, position.y, position.z);
            this_awe.sounds.add(BODY_item.sound);
          }
        }
        
        var item, item_id;
        if (BODY_item.geometry) {
          if (BODY_item.geometry.shape) {
            var shape_data = _validate_shape(BODY_item.geometry);
            switch(BODY_item.geometry.shape) {
              case 'cube': 
                geometry = new THREE.BoxGeometry(shape_data.x, shape_data.y, shape_data.z);
                break;
              case 'circle': 
                geometry = new THREE.CircleGeometry(shape_data.radius, shape_data.segments);
                break;
              case 'sphere': 
                geometry = new THREE.SphereGeometry(shape_data.radius, shape_data.widthSegments, shape_data.heightSegments, shape_data.phiStart, shape_data.phiLength, shape_data.thetaStart, shape_data.thetaLength);
                break;
              case 'cylinder': 
                geometry = new THREE.CylinderGeometry(shape_data.radiusTop, shape_data.radiusBottom, shape_data.height, shape_data.radiusSegments, shape_data.heightSegments, shape_data.openEnded);
                break;
              case 'lathe': 
                geometry = new THREE.LatheGeometry(shape_data.points, shape_data.segments, shape_data.phiStart, shape_data.phiLength);
                break;
              case 'octahedron': 
                geometry = new THREE.OctahedronGeometry(shape_data.radius, shape_data.detail);
                break;
              case 'plane': 
  //              geometry = new THREE.PlaneGeometry(shape_data.width, shape_data.height, shape_data.widthSegments, shape_data.heightSegments)
                geometry = new THREE.PlaneBufferGeometry(parseInt(shape_data.width,10), parseInt(shape_data.height,10), parseInt(shape_data.widthSegments,10), parseInt(shape_data.heightSegments,10));
                break;
              case 'tetrahedron': 
                geometry = new THREE.TetrahedronGeometry(shape_data.radius, shape_data.detail);
                break;
              case 'text': 
                geometry = new THREE.TextGeometry(shape_data.text, shape_data.parameters)
                break;
              case 'torus': 
                geometry = new THREE.TorusGeometry(shape_data.radius, shape_data.tube, shape_data.radialSegments, shape_data.tubularSegments, shape_data.arc);
                break;
              case 'torusknot': 
                geometry = new THREE.TorusKnotGeometry(shape_data.radius, shape_data.tube, shape_data.radialSegments, shape_data.tubularSegments, shape_data.p, shape_data.q, shape_data.heightScale);
                break;
              case 'tube': 
                geometry = new THREE.TubeGeometry(shape_data.path, shape_data.segments, shape_data.radius, shape_data.radiusSegments, shape_data.closed, shape_data.debug)
                break;
              case 'shape': 
                geometry = new THREE.ShapeGeometry(shape_data.points);
                break;
              case 'extrude': 
                geometry = new THREE.ExtrudeGeometry(shape_data.points, shape_data.extrude_settings);
                break;
              case 'grid': 
                geometry = new THREE.GridHelper(shape_data.size, shape_data.step)
                break;
              default: 
                geometry = new THREE.BoxGeometry(10,10,10);
            }
            if (geometry) {
              if (BODY_item.geometry.shape == 'grid') {
                // grid is not a geometry 
                // ignore texture and material
                if (Object.keys(BODY_item.texture).length) {
                  console.info('grid projection does not support textures.');
                }
                if (BODY_item.material.grid_color) {
                  var colors = this_awe.util.extend({
                    grid_color: 0xCCCCCC,
                    center_line_color: 0x666666
                  }, BODY_item.material);
                  geometry.setColors(colors.center_line_color, colors.grid_color);
                }
                mesh = geometry;
              }
              else {
                var texture, material;
                if (Object.keys(BODY_item.texture).length) {
                  if (BODY_item.geometry.x) { // a cube
                    BODY_item.texture.width = BODY_item.geometry.x; 
                  }
                  if (BODY_item.geometry.width) { // a plane
                    BODY_item.texture.width = BODY_item.geometry.width; 
                  }
                  if (BODY_item.geometry.y) { // a cube
                    BODY_item.texture.height = BODY_item.geometry.y; 
                  }
                  if (BODY_item.geometry.height) { // a plane
                    BODY_item.texture.height = BODY_item.geometry.height; 
                  }
                    
                  var capabilities = this_awe.util.get_capabilities('gum');
                  if (BODY_item.texture.path == 'camerastream' && !capabilities.gum){
                    
                    delete(BODY_item.texture.path);
                    BODY_item.texture.width = 800;
                    BODY_item.texture.height = 600;
                    BODY_item.texture.background_color = null;
                    BODY_item.texture.label = 'camerastream texture is unsupported on this device';
                    BODY_item.texture.font = '100px Arial';
                  }
                  // hidden projection textures start out as paused
                  BODY_item.texture.paused = (BODY_item.visible != undefined ? !BODY_item.visible : false);
                  BODY_item.texture.success_callback = function(){
                    var event = new CustomEvent('texture_loaded', {detail: BODY_item.id});
                    window.dispatchEvent(event);
                  }
                  var texture_id = this_awe.textures.add(BODY_item.texture);
                  BODY_item.texture.id = texture_id.id;
                  if (BODY_item.texture.color) {
                    BODY_item.material.color = BODY_item.texture.color;
                  }
                  BODY_item.material.map = this_awe.textures.view(texture_id).value();
                }
/*
                BODY_item.material.success_callback = function(){
                  var event = new CustomEvent('material_loaded', {detail: BODY_item.id});
                  window.dispatchEvent(event);
                }
*/
                var material_id = this_awe.materials.add(BODY_item.material);
                BODY_item.material.id = material_id.id;
                var material = this_awe.materials.view(material_id).value();
                mesh = new THREE.Mesh(geometry, material);
              }
            }
          }
          else if (BODY_item.geometry.path) {
            var loader;
            // get extension and detect file type
            var file_extension = BODY_item.geometry.file_type ? BODY_item.geometry.file_type.toLowerCase() : (BODY_item.geometry.path.split('.').pop()).toLowerCase();
            
            var progress_callback = BODY_item.geometry.progress_callback && _type(BODY_item.geometry.progress_callback) == 'function' ? BODY_item.geometry.progress_callback : noop;
            var start_callback = BODY_item.geometry.start_callback && _type(BODY_item.geometry.start_callback) == 'function' ? BODY_item.geometry.start_callback : noop;
            var end_callback = BODY_item.geometry.end_callback && _type(BODY_item.geometry.end_callback) == 'function' ? BODY_item.geometry.end_callback : noop;
            var error_callback = BODY_item.geometry.error_callback && _type(BODY_item.geometry.error_callback) == 'function' ? BODY_item.geometry.error_callback : noop;
            

            switch(file_extension) {
              case 'obj':
                if (BODY_item.material.path) {
                  item = new awe_projection(BODY_item, self);
                  item_id = self.constructor.prototype.add.call(self, item, HEAD); // super
                  item.trigger_state(awe.OBJECT_STATES.DEFAULT);
                  item.trigger_state(awe.OBJECT_STATES.LOADING);
                  loader = new THREE.OBJMTLLoader(loading_manager);
                  loader.load(BODY_item.geometry.path, BODY_item.material.path, function(mesh) {

                    try {
                      console.log('loaded mtl obj1', BODY_item.id, mesh.children[1].material.color);
                    } catch(e) {}
                                
                    if (BODY_item.position) { 
                      var position_mesh = item.get_mesh('position');
                      _update_mesh_io({position: BODY_item.position}, position_mesh);
                      delete (BODY_item.position);
                    }
                    if (BODY_item.scale) { 
                      var scale_mesh = item.get_mesh('scale');
                      _update_mesh_io({scale: BODY_item.scale}, scale_mesh);
                      delete (BODY_item.scale);
                    }
                    if (BODY_item.rotation) { 
                      var rotation_mesh = item.get_mesh('rotation');
                      _update_mesh_io({rotation: BODY_item.rotation}, rotation_mesh);
                      delete (BODY_item.rotation);
                    }

                    BODY_item.mesh = _update_mesh_io(BODY_item, mesh, true);
                    item.place_mesh(BODY_item.mesh);
                    
                    try {
                      console.log('loaded mtl obj2', BODY_item.id, mesh.children[1].material.color);
                    } catch(e) {}
                    
                    finish_add(BODY_item.id);
                    _update_materials(BODY_item.mesh);
                    end_callback();
                  }, progress_callback, error_callback);
                }
                else {
                  loader = new THREE.OBJLoader(loading_manager);
                  var texture;
                  if (BODY_item.texture.path) {
                    if (BODY_item.geometry.x) { // a cube
                      BODY_item.texture.width = BODY_item.geometry.x; 
                    }
                    if (BODY_item.geometry.width) { // a plane
                      BODY_item.texture.width = BODY_item.geometry.width; 
                    }
                    if (BODY_item.geometry.y) { // a cube
                      BODY_item.texture.height = BODY_item.geometry.y; 
                    }
                    if (BODY_item.geometry.height) { // a plane
                      BODY_item.texture.height = BODY_item.geometry.height; 
                    }
                      
                    
                    var capabilities = this_awe.util.get_capabilities('gum');
                    if (BODY_item.texture.path == 'camerastream' && !capabilities.gum){
                      delete(BODY_item.texture.path);
                      BODY_item.texture.width = 800;
                      BODY_item.texture.height = 600;
                      BODY_item.texture.background_color = null;
                      BODY_item.texture.label = 'camerastream texture is unsupported on this device';
                      BODY_item.texture.font = '100px Arial';
                    }
                    // hidden textures start out as paused
                    BODY_item.texture.paused = (BODY_item.visible != undefined ? BODY_item.visible : false);
                    var texture_id = this_awe.textures.add(BODY_item.texture);
                    BODY_item.texture.id = texture_id.id;
                    texture = this_awe.textures.view(texture_id).value();
                  }
/*
                  else {
                    var texture_id = this_awe.textures.add();
                    BODY_item.texture.id = texture_id.id;
                    texture = this_awe.textures.view(texture_id);
                  }
*/
                  item = new awe_projection(BODY_item, self);
                  item_id = self.constructor.prototype.add.call(self, item, HEAD); // super
                  item.trigger_state(awe.OBJECT_STATES.DEFAULT);
                  item.trigger_state(awe.OBJECT_STATES.LOADING);
                
                  loader.load(BODY_item.geometry.path, function (mesh) {
                    if (texture) {
                      mesh.traverse(function (child) {
                        if ( child instanceof THREE.Mesh ) {
                          child.material.map = texture;
                          child.material.needsUpdate = true;
                        }
                      });
                    }
                    BODY_item.mesh = _update_mesh_io(BODY_item, mesh, true);
                    item.place_mesh(BODY_item.mesh);
                    finish_add(BODY_item.id);
                    end_callback();
                    
                  }, progress_callback, error_callback);
                }
                start_callback();
                break;
              case 'json':
                // assimp json loader
                item = new awe_projection(BODY_item, self);
                item_id = self.constructor.prototype.add.call(self, item, HEAD); // super
                item.trigger_state(awe.OBJECT_STATES.DEFAULT);
                item.trigger_state(awe.OBJECT_STATES.LOADING);
                
                loader = new THREE.AssimpJSONLoader(loading_manager);
  //              loader.options.convertUpAxis = true;
                loader.load( BODY_item.geometry.path, function ( object ) {
                  try {
                    
                  BODY_item.mesh = _update_mesh_io(BODY_item, object, true);
                  item.place_mesh(BODY_item.mesh);
                  finish_add(BODY_item.id);
                  end_callback();
                  
                  }
                  catch(e) { console.log(e); }
                }, progress_callback, error_callback);
                start_callback();
                break;
              case 'dae':
                // collada loader
                item = new awe_projection(BODY_item, self);
                item_id = self.constructor.prototype.add.call(self, item, HEAD); // super
                item.trigger_state(awe.OBJECT_STATES.DEFAULT);
                item.trigger_state(awe.OBJECT_STATES.LOADING);
                
                loader = new THREE.ColladaLoader(loading_manager);
                loader.options.convertUpAxis = true;
                loader.load( BODY_item.geometry.path, function ( collada ) {
                  dae = collada.scene;
                  dae.traverse(function(child) {
                    if ( child instanceof THREE.SkinnedMesh ) {
                      var animation = new THREE.Animation( child, child.geometry.animation );
                      // TODO - this will probably require setting scene_needs_update to work.
                      animation.play();
                    }
                  });
                  
                  BODY_item.mesh = _update_mesh_io(BODY_item, dae, true);
                  item.place_mesh(BODY_item.mesh);
                  finish_add(BODY_item.id);
                  end_callback();
                }, progress_callback, error_callback);
                start_callback();
                break;
              default:
                console.warn('unknown file type', file_extension);
                throw { code: 500, messgae: 'unknown file type: '+ file_extension};
            }
            
            result_ids.push(item_id.id);
        
            // out of forEach loop
            return;
          }
        }
        else {
          geometry = new THREE.BoxGeometry(10,10,10);
          var material_id = this_awe.materials.add(BODY_item.material);
          BODY_item.material.id = material_id.id;
          
          var material = this_awe.materials.view(material_id).value();
          mesh = new THREE.Mesh(geometry, material);
        }
//        BODY_item.visible = parent.visible;
        var mesh_data = awe.util.clone(BODY_item);
        
        var position, rotation, scale;
        if (BODY_item.rotation) {
          rotation = BODY_item.rotation;
          delete (mesh_data.rotation);
        }
        if (BODY_item.position) {
          position = BODY_item.position;
          delete (mesh_data.position);
        }
        if (BODY_item.scale) {
          scale = BODY_item.scale;
          delete (mesh_data.scale);
        }
        
        BODY_item.mesh = _update_mesh_io(mesh_data, mesh, true);
        
        item = new awe_projection(BODY_item, self);
        
        if (scale) {
          _update_mesh_io({scale: scale}, item.get_mesh('scale'));
        }
        if (rotation) {
          _update_mesh_io({rotation: rotation}, item.get_mesh('rotation'));
        }
        if (position) {
          _update_mesh_io({position: position}, item.get_mesh('position'));
        }
        
/*
        // why was this here???
        if (BODY_item.scale) {
          for (var p in BODY_item.scale) {
            if (BODY_item.scale.hasOwnProperty(p)) {
              BODY_item.mesh.scale[p] = BODY_item.scale[p];
            }
          }
        }
*/
        
        
        
        item_id = self.constructor.prototype.add.call(self, item, HEAD); // super
        
        item.trigger_state(awe.OBJECT_STATES.DEFAULT);
        item.trigger_state(awe.OBJECT_STATES.LOADING);
        result_ids.push(item_id.id);
        finish_add(BODY_item.id);
      });
      return { id: result_ids }; 
    };
    this_awe.constructor.prototype.projections.view = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      return this.constructor.prototype.view.call(this, BODY, HEAD); // super
    };
    this_awe.constructor.prototype.projections.update = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var return_result = {},
        self = this;
      
      BODY.forEach(function(item){
        if (item.data && item.where && item.where.id) {
          var fields_updated = [];
          if (item.data.position) { fields_updated.push('position'); }
          if (item.data.scale) { fields_updated.push('scale'); }
          if (item.data.rotation) { fields_updated.push('rotation'); }
          if (fields_updated.length) {
            HEAD.fields_updated = fields_updated;
          }
          if (!Array.isArray(item.where.id)) {
            item.where.id = [item.where.id];
          }
          item.where.id.forEach(function(where_id){
            try {
              var object = this_awe.projections.view(where_id);
              var mesh = object.get_mesh();
            } catch(e) { return; /* TODO */ };
            if(item.data.animation && parseFloat(item.data.animation.duration) > 0) {
              try {
                _tween(_extend({
                  object: object,
//                   mesh: mesh,
                  end_state: item.data
                }, item.data.animation));
              } catch(e) { /* TODO */ };
            }
            else {
              try {
                var mesh = _update_mesh_io(item.data, mesh);
              } catch(e) { /* TODO */ };
            }
            var result = _clone(item);
            result.mesh = mesh;
            return_result[where_id] = self.constructor.prototype.update.call(self, result, HEAD); // super
          });
        }
      });
      return return_result;
    };
    this_awe.constructor.prototype.projections.delete = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      var projection;
      if (typeof BODY == 'string' || typeof BODY == 'number') {
        projection = this_awe.projections.view(BODY);
        BODY = { id: BODY };
      }
      else if (BODY.id) {
        projection = this_awe.projections.view(BODY.id);
      }
      
      if (!projection) {
        console.trace('cant delete',BODY);
        return this.constructor.prototype.delete.call(this, BODY, HEAD); // super
      }
    
      if (projection.material()) {
        this_awe.materials.delete(projection.material().id)
      }
      if (projection.texture()) {
        this_awe.textures.delete(projection.texture().id)
      }
      
      if (projection.parent && typeof(projection.parent) == 'function')  {
        try {
          parent = projection.parent();
          parent._remove_child(projection);
          this_awe.scene_needs_rendering = 1;
        }
        catch(e) {}
      }
      else {
        var mesh = projection.get_mesh();
        if (mesh && mesh.parent) {
          mesh.parent.remove(mesh);
          this_awe.scene_needs_rendering = 1;
        }
        else {
          console.log('no mesh to delete!', BODY, HEAD)
        } 
      }
      
      delete(_clickable_objects['projection-'+projection.id]);
      
      return this.constructor.prototype.delete.call(this, BODY, HEAD); // super
    };

    this_awe.constructor.prototype.textures = new awe_v8();
    this_awe.constructor.prototype.textures._item_constructor = awe_texture;
    this_awe.constructor.prototype.textures.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var results = [],
        self = this;

      
      BODY.forEach(function(BODY_item){
        console.log('adding texture', BODY_item)
        var id = "texture-"+random_id();
        var success = BODY_item.success_callback ? BODY_item.success_callback : noop;
        delete (BODY_item.success_callback);
        if (BODY_item.path) {
          var texture = new THREE.Texture();
          texture.needsUpdate = true;
          texture.minFilter = THREE.LinearFilter;
          var paths = [];
          var v = document.createElement('video');
//           document.body.appendChild(v)
          if (Array.isArray(BODY_item.path)) {
            BODY_item.path.forEach(function(p){
              var tmp_path = BODY_item.path[p];
              var suffix = tmp_path.match(/\.(webm|mp4|ogg|ogv)/i);
              if (suffix) {
                if (suffix[1].toLowerCase() == "ogv") {
                  suffix[1] = "ogg";
                }
                var can_play = v.canPlayType("video/"+suffix[1].toLowerCase());
                if (can_play == "probably" || can_play == "maybe") {
                  paths.push(BODY_item.path[p]);
                }
              }
            });
          } else if (BODY_item.path.match(/\.(webm|mp4|ogg|ogv)/i)) {
            paths.push(BODY_item.path);
          }
          var capabilities = this_awe.util.get_capabilities('gum');
          var settings = this_awe.util.get_settings('camerastream_poster|default_video_poster');
          if (paths.length) {
            
  //          v.crossOrigin = BODY_item.cross_origin || "anonymous";
//             v.src = path;
            
            paths.forEach(function(path){
              var suffix = path.match(/\.(webm|mp4|ogg|ogv)/i);
              var source = document.createElement('source');
              source.setAttribute('src', path);
              source.setAttribute('type', 'video/'+suffix[1].toLowerCase());
              console.log(source, suffix[1]);
              v.appendChild(source);
            });
            
            var autoplay = true;
            if (BODY_item.autoplay !== undefined) {
              autoplay = BODY_item.autoplay;
            }
            else if (BODY_item.paused !== undefined) {
              autoplay = !BODY_item.paused;
            }
            v.autoplay = autoplay;
            v.load();
            var c = document.createElement('canvas');
            var cc = c.getContext('2d');
            cc.fillStyle = "white";
            cc.fillRect(0, 0, c.width, c.height);
            
            var poster;
            if (BODY_item.poster) {
              poster = BODY_item.poster;
            }
            else if(settings.default_video_poster) {
              poster = settings.default_video_poster;
            }
            if (poster) {
              var poster_img = new Image();
              poster_img.onload = function(){
                if (v.readyState == v.HAVE_NOTHING) {
                  c.width = poster_img.width;
                  c.height = poster_img.height;
                  if (BODY_item.flip) {
                    cc.translate(c.width, 0);
                    cc.scale(-1, 1);
                  }
                  cc.drawImage(poster_img, 0, 0, c.width, c.height);
                  if (BODY_item.flip) {
                    // flip again - will get flipped once video loads metadata
                    cc.translate(c.width, 0);
                    cc.scale(-1, 1);
                  }
                  texture.needsUpdate = true;
                }
              };
              poster_img.src = poster;
              v.setAttribute('poster', poster);
            }
            var _resize = function(){
              c.width = v.videoWidth || 320;
              c.height = v.videoHeight || 240;
              if (BODY_item.flip) {
                cc.translate(v.videoWidth, 0);
                cc.scale(-1, 1);
              }
            };
            if (v.videoWidth && v.videoHeight) {
              _resize();
            }
            else {
              v.addEventListener('loadedmetadata', function (e) {
                _resize();
              }, false);
            }
            
            var play = function(){
              try {
                inline_video_shim_toggle(v, true)

                if (!inline_video_shim_required) {
                  v.play();
                }

                if (!autoplay) {
                  try {
                    inline_video_shim_toggle(v, false);
                    if (!inline_video_shim_required) {
                      v.pause();
                    }
                    v.currentTime = 0;
                  } catch(e) {}
                }
              } catch(e) { console.trace('play() error',e);}
            }
            window.addEventListener('touchstart', play, false);
            
            v.addEventListener('playing', function(){
              if (!v.paused) {
                window.removeEventListener('touchstart', play);
              }
            })
            
            play();
            v.setAttribute('data-sourcetype', 'video')
            v.setAttribute('data-textureid', id)
            
            if (BODY_item.loop !== undefined) {
              v.loop = BODY_item.loop;
            }
            if (BODY_item.muted !== undefined) {
              v.muted = BODY_item.muted;
            }
            
            texture = new THREE.Texture(c);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            texture.video = v;
            texture.cc = cc;
          }
          else if (BODY_item.path.match(/^camerastream$/i) && capabilities.gum) {
            
            var autoplay = true;
            if (BODY_item.autoplay !== undefined) {
              autoplay = BODY_item.autoplay;
            }
            if (BODY_item.paused !== undefined) {
              autoplay = !BODY_item.paused;
            }
            v.autoplay = autoplay;
            
            var play = function(){
              inline_video_shim_toggle(v, true);
              if (!inline_video_shim_required) {
                v.play();
              }
              if (!autoplay) {
                try {
                  inline_video_shim_toggle(v, false);
                  if (!inline_video_shim_required) {
                    v.pause();
                  }
                  v.currentTime = 0;
                } catch(e) {}
              }
            }
            v.go = function(){
              
              var vs = this_awe.video_stream();
              window.removeEventListener('gum_ready', v.go, false);
              window.addEventListener('touchstart', play, false);
              v.addEventListener('playing', function(){
                window.removeEventListener('touchstart', play);
              })
              
              this_awe.util.connect_stream_to_src(vs.get_stream(), v, BODY_item.id);
              v.load();
              play();
            }
            
            v.setAttribute('data-sourcetype', 'camerastream');
            v.setAttribute('data-textureid', id)
            
            if (BODY_item.loop !== undefined) {
              v.loop = BODY_item.loop;
            }
            if (BODY_item.muted !== undefined) {
              v.muted = BODY_item.muted;
            }
            var width = v.videoWidth || 320;
            var height = v.videoHeight || 240;
            var c = document.createElement('canvas');
            var cc = c.getContext('2d');
            
            c.width = width;
            c.height = height;
            
            cc.fillStyle = "white";
            cc.fillRect(0, 0, c.width, c.height);
            
            
            var poster;
            if (BODY_item.poster) {
              poster = BODY_item.poster;
            }
            else if(settings.camerastream_poster) {
              poster = settings.camerastream_poster;
            }
            if (poster) {
              var poster_img = new Image();
              poster_img.onload = function(){
                if (v.readyState == v.HAVE_NOTHING) {
                  c.width = poster_img.width;
                  c.height = poster_img.height;
                  if (BODY_item.flip) {
                    cc.translate(c.width, 0);
                    cc.scale(-1, 1);
                  }
                  cc.drawImage(poster_img, 0, 0, c.width, c.height);
                  if (BODY_item.flip) {
                    // flip again - will get flipped once video loads metadata
                    cc.translate(c.width, 0);
                    cc.scale(-1, 1);
                  }
                  texture.needsUpdate = true;
                }
              };
              poster_img.src = poster;
              v.setAttribute('poster', poster);
            }
            
            var _resize = function(){
              c.width = v.videoWidth || width;
              c.height = v.videoHeight || height;
              if (BODY_item.flip) {
                cc.translate(v.videoWidth, 0);
                cc.scale(-1, 1);
              }
            };
            if (v.videoWidth && v.videoHeight) {
              _resize();
            }
            else {
              v.addEventListener('loadedmetadata', function (e) {
                _resize();
              }, false);
            }
            
            cc.font = '20px sans-serif';
            cc.textAlign = 'center';
            cc.textBaseline = 'middle';
            
            cc.fillStyle = '#000000';
            cc.fillText('LOADING TEXTURE', width/2, height/2, width);
            
            texture = new THREE.Texture(c);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            texture.video = v;
            texture.cc = cc;
            
            if (!BODY_item.paused) {
              if (!this_awe.video_stream()) {
                this_awe.setup_stream();
              }
              var vs = this_awe.video_stream();
              if (vs.is_stream_ready()) {
                v.go();
              }
              else {
                window.addEventListener('gum_ready', v.go, false);
              }
            }
            else {
              window.addEventListener('gum_ready', v.go, false);
            }
            
          }
          else if (BODY_item.path.match(/^stream$/i)) {
            if (!BODY_item.source_element) {
              throw { code: 500, message: 'texture.source_element required' };
            }
            var v = BODY_item.source_element;
            var c = document.createElement('canvas');
            var cc = c.getContext('2d');
            cc.fillStyle = "white";
            cc.fillRect(0, 0, c.width, c.height);
            
            var poster;
            if (BODY_item.poster) {
              poster = BODY_item.poster;
            }
            else if(settings.default_video_poster) {
              poster = settings.default_video_poster;
            }
            if (poster) {
              var poster_img = new Image();
              poster_img.onload = function(){
                if (v.readyState == v.HAVE_NOTHING) {
                  c.width = poster_img.width;
                  c.height = poster_img.height;
                  if (BODY_item.flip) {
                    cc.translate(c.width, 0);
                    cc.scale(-1, 1);
                  }
                  cc.drawImage(poster_img, 0, 0, c.width, c.height);
                  if (BODY_item.flip) {
                    // flip again - will get flipped once video loads metadata
                    cc.translate(c.width, 0);
                    cc.scale(-1, 1);
                  }
                  texture.needsUpdate = true;
                }
              };
              poster_img.src = poster;
              v.setAttribute('poster', poster);
            }
            
            var _resize = function(){
              c.width = v.videoWidth || 320;
              c.height = v.videoHeight || 240;
              if (BODY_item.flip) {
                cc.translate(v.videoWidth, 0);
                cc.scale(-1, 1);
              }
            };
            if (v.videoWidth && v.videoHeight) {
              _resize();
            }
            else {
              v.addEventListener('loadedmetadata', function (e) {
                _resize();
              }, false);
            }
            
            var autoplay = true;
            if (BODY_item.autoplay !== undefined) {
              autoplay = BODY_item.autoplay;
            }
            if (BODY_item.paused !== undefined) {
              autoplay = !BODY_item.paused;
            }
            v.autoplay = autoplay;
            
            var play = function(){
              inline_video_shim_toggle(v, true);
              if (!inline_video_shim_required) {
                v.play();
              }
              if (!autoplay) {
                try {
                  inline_video_shim_toggle(v, false);
                  if (!inline_video_shim_required) {
                    v.pause();
                  }
                  v.currentTime = 0;
                } catch(e) {}
              }
            }
            window.addEventListener('touchstart', play, false);
            v.addEventListener('playing', function(){
              window.removeEventListener('touchstart', play);
            });
            play();
            v.setAttribute('data-sourcetype', 'stream')
            v.setAttribute('data-textureid', id)
  
            texture = new THREE.Texture(c);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            texture.video = v;
            texture.cc = cc;
          }
          else {
            texture = (new THREE.TextureLoader(loading_manager)).load(BODY_item.path, function(texture) {
              texture.needsUpdate = true;
              this_awe.scene_needs_rendering = 1;
              try {
                success();
              }
              catch(e){}
            }, texture_loading_progress, texture_loading_error);
            texture.needsUpdate = true;
            texture.minFilter = THREE.LinearFilter;
            if (BODY_item.wrap_s) {
              // THREE.ClampToEdgeWrapping, where the edge is clamped to the outer edge texels. The other two choices are THREE.RepeatWrapping and THREE.MirroredRepeatWrapping.
              texture.wrapS = BODY_item.wrap_s;
            }
            if (BODY_item.wrap_t) {
              // THREE.ClampToEdgeWrapping, where the edge is clamped to the outer edge texels. The other two choices are THREE.RepeatWrapping and THREE.MirroredRepeatWrapping.
              texture.wrapT = BODY_item.wrap_t;
            }
            if (BODY_item.repeat) {
              texture.repeat.set(BODY_item.repeat.x || 1, BODY_item.repeat.y || 1)
            }
            if (BODY_item.flip) {
              texture.wrapS = THREE.RepeatWrapping;
              texture.repeat.x = -1;
            }
            
          }
          var item = new awe_texture({ id: id, texture: texture }, self);
          results.push(item);
        }
        else if (BODY_item.label) {
          // text on a canvas
          var params = this_awe.util.extend({
            width: 300,
            height: 200,
            
            background_color: '#ffffff',
            background_image: null,
            text_style: 'fill', // fill / outline
            text_color: '#000000',
            text_align: 'center', // "left" || "right" || "center" || "start" || "end";
            text_baseline: 'middle', //"top" || "hanging" || "middle" || "alphabetic" || "ideographic" || "bottom";
            direction: 'inherit', // "ltr" || "rtl" || "inherit";
            /*
text_position_y: 0,
            text_position_x: 0,
*/
            
            line_width: 0,
            line_cap: 'butt', // butt / round / square
            line_join: 'round', // round / bevel / miter
            miter_limit: 10,
            line_dash: null,
            line_dash_offset: 0,
            
            font: '20px sans-serif',
            
            shadow_offset_x: 0,
            shadow_offset_y: 0,
            shadow_blur: 0,
            shadow_color: null,

            max_width: undefined
            
          }, BODY_item);
          // center label by default
          if (params.text_position_x == undefined) {
            params.text_position_x = params.width / 2;
          }
          if (params.text_position_y == undefined) {
            params.text_position_y = params.height / 2;
          }
          
          var c = document.createElement('canvas');
          
//           c.id = 'texture-canvas-'+id;
//           document.body.appendChild(c);
          
          var cc = c.getContext('2d');
          c.width = params.width;
          c.height = params.height;
          cc.fillStyle = "white";
          cc.fillRect(0, 0, c.width, c.height);
//           c.setAttribute('style','position: absolute;left: 0;top: 0;border: solid red 1px;z-index: 999'); // DEBUG

          if (params.background_color) {
            cc.fillStyle = params.background_color;
            cc.fillRect(0,0,width,height);
          }
          /*
if (params.background_image){
            var img = new Image();
            img.src = params.background_image;
            img.onload = function(){
              var ptrn = cc.createPattern(img,'repeat');
              cc.fillStyle = ptrn;
              cc.fillRect(0,0,width,height);
              texture.needsUpdate = true;
            };       
          }
          
*/
          if (parseInt(params.line_width) > 0) {
            cc.strokeStyle = params.text_outline_color;
            cc.lineWidth = params.line_width;
          }
          if (params.line_dash != null) {
            cc.setLineDash(params.line_dash);
            cc.lineDashOffset = params.line_dash_offset;
          }
          cc.lineCap = params.line_cap;
          cc.lineJoin = params.line_join;
          cc.miterLimit = params.miter_limit;
          cc.font = params.font;
          cc.textAlign = params.text_align;
          cc.textBaseline = params.text_baseline;
          cc.direction = params.direction;
          
          cc.fillStyle = params.text_color;
          
          if (params.text_style == 'fill'){
            cc.fillText(params.label, params.text_position_x, params.text_position_y, params.max_width || params.width);
          }
          else {
            cc.strokeText(params.label, params.text_position_x, params.text_position_y, params.max_width || params.width);
          }
          
          var texture = new THREE.Texture(c);
          texture.needsUpdate = true;
          // 
//          texture.cc = cc;
          texture.minFilter = THREE.LinearFilter;
          if (BODY_item.wrap_s) {
            // THREE.ClampToEdgeWrapping, where the edge is clamped to the outer edge texels. The other two choices are THREE.RepeatWrapping and THREE.MirroredRepeatWrapping.
            texture.wrapS = BODY_item.wrap_s;
          }
          if (BODY_item.wrap_t) {
            // THREE.ClampToEdgeWrapping, where the edge is clamped to the outer edge texels. The other two choices are THREE.RepeatWrapping and THREE.MirroredRepeatWrapping.
            texture.wrapT = BODY_item.wrap_t;
          }
          if (BODY_item.repeat) {
            texture.repeat.set(BODY_item.repeat.x || 1, BODY_item.repeat.y || 1)
          }
          
          texture.needsUpdate = true;
          
          var item = new awe_texture({ id: id, texture: texture }, self);
          results.push(item);
        }
        else {
          throw { code: 500, message: 'texture.path or texture.label required' };
        }
      });
      
      return this.constructor.prototype.add.call(this, results, HEAD); // super
    } 
    this_awe.constructor.prototype.textures.delete = function(BODY, HEAD) {
      var texture;
      if (typeof BODY == 'string' || typeof BODY == 'number') {
        BODY = { id: BODY };
      }
      if (BODY.id) {
        texture = this.constructor.prototype.view(BODY.id);
      }
      if (texture.is_video_texture()) {
        window.removeEventListener('gum_ready', texture.texture.video.go, false);
        texture.stop();
        texture.texture.video.pause();
        delete texture.texture.cc;
        delete texture.texture.video;
      }
      delete texture;
      return this.constructor.prototype.delete.call(this, BODY, HEAD); // super;
    };

    this_awe.constructor.prototype.materials = new awe_v8();
    this_awe.constructor.prototype.materials._item_constructor = awe_material;
    this_awe.constructor.prototype.materials.add = function(BODY, HEAD) {
      if (!BODY) { BODY = {}; }
      if (!HEAD) { HEAD = {}; }
      if (!Array.isArray(BODY)) {
        BODY = [BODY];
      }
      var results = [],
        self = this;
        
      BODY.forEach(function(BODY_item){
      
        var id = BODY_item.id || "material-"+random_id();
//         var success = BODY_item.success_callback || noop;
        delete BODY_item.id;
        var type = BODY_item.type || 'basic';
        delete BODY_item.type;
        if (!BODY_item.wireframe) {
          BODY_item.wireframe = false;
        }
        if (!BODY_item.color) {
          BODY_item.color = 0x404040;
        }
        var side = THREE.DoubleSide;
        if (BODY_item.side) {
          if (BODY_item.side == "front") {
            side = THREE.FrontSide;
          }
          else if (BODY_item.side == "back") {
            side = THREE.BackSide;
          }
          delete BODY_item.side;
        }
        if (!BODY_item.overdraw) {
          BODY_item.overdraw = true;
        }
        var material;
        
        switch(type) {
          case 'phong':
            if (!BODY_item.shading) {
              BODY_item.shading = THREE.SmoothShading;
            }
            material = new THREE.MeshPhongMaterial(BODY_item);
            break;
          case 'lambert':
            material = new THREE.MeshLambertMaterial(BODY_item);
            break;
          case 'shader':
            material = new THREE.ShaderMaterial(BODY_item);
            break;
          case 'sprite':
            material = new THREE.SpriteMaterial(BODY_item);
            break;
          case 'sprite_canvas':
            material = new THREE.SpriteCanvasMaterial(BODY_item);
            break;
          default: 
            material = new THREE.MeshBasicMaterial(BODY_item);
        }
        material.side = side;
        var item = new awe_material({ id: id, material: material }, self);
//         success();
        results.push(item);
      })
      return this.constructor.prototype.add.call(this, results, HEAD); // super
    };

    this_awe.constructor.prototype.sounds = new awe_v8();
    this_awe.constructor.prototype.sounds._item_constructor = awe_sound;
    this_awe.constructor.prototype.sounds.add = function(BODY, HEAD) {
      var capabilities = this_awe.util.get_capabilities('audio');
      if (capabilities.audio) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        var id = BODY.id || "sound-"+random_id();
        delete BODY.id;
        if (BODY.autoplay == undefined) {
          BODY.autoplay = true;
        }
        _load_sound(BODY);
        var item = new awe_sound(BODY, this);
        return this.constructor.prototype.add.call(this, item, HEAD); // super
      }
    };
          
    this_awe.constructor.prototype.setup_scene = function(io) {
      this.origin = { x: 0, y: 0, z: 0};
      
      io = _extend({
        id: 'default'
      }, io);
      if (!this_awe.renderers.view('default')) {
        this_awe.renderers.add({ id: 'default' });
      }
      this_awe.scenes.add({id: io.id, container_id: io.container_id });
      this_awe.povs.add({id: io.id, scene_id: io.id});
      var settings = this_awe.util.get_settings('start_video_stream|default_lights');
      if (settings.start_video_stream) {
        this_awe.setup_stream();
      }
      var lights = this_awe.lights.list();

      if (!lights.length) {
        if (settings.default_lights && Array.isArray(settings.default_lights)) { 
          this_awe.lights.add(settings.default_lights);
        }
      }
      frustum = new THREE.Frustum();
      cameraViewProjectionMatrix = new THREE.Matrix4();

      loading_manager = new THREE.LoadingManager();
      loading_manager.onProgress = function ( item, loaded, total ) {
        this_awe.scene_needs_rendering = 1;
      }
      
      var renderer = this_awe.renderer();
      var awe_canvas = renderer.get_canvas();
      var aspect_ratio = awe_canvas.clientWidth / awe_canvas.clientHeight;
      var pov = this_awe.pov();
      
      pov.set_aspect(aspect_ratio);
      pov.update_projection_matrix();
      
      renderer.set_size(awe_canvas.clientWidth, awe_canvas.clientHeight, false);
      this_awe.scene_needs_rendering = 1;
      
      this_awe.scene_ready = true;
      var event = new CustomEvent('scene_ready');
      window.dispatchEvent(event);
      
      console.log('scene_ready')
      _tick();
    };

    this_awe.constructor.prototype.setup_stream = function(id) {
      id = id ? id : 'default';
      if (!this_awe.video_streams.view(id)) {
        this_awe.video_streams.add({ id: id });
      }
    };

    this_awe.constructor.prototype.resize_canvas = function(force) {
      var renderer = this_awe.renderer(),
        awe_canvas = renderer.get_canvas(),
        pov = this_awe.pov(),
        width = awe_canvas.clientWidth,
        height = awe_canvas.clientHeight,
        aspect = width / height;
        
      if (awe_canvas.width != width || awe_canvas.height != height || force) {
        pov.set_aspect(aspect);
        pov.update_projection_matrix();
        renderer.set_size(width, height, false);
        this_awe.scene_needs_rendering = 1;

        var event = new CustomEvent('renderer_resized');
        window.dispatchEvent(event);
      }
    };

    this_awe.constructor.prototype.render = function() {
      if (this_awe.scene_needs_rendering) {
        // loop through all scenes
        
        var renderer = this_awe.renderer();
        var scenes = this_awe.scenes.list();
        var the_scene = this_awe.scene();
        
        if (scenes.length > 1) {
          renderer.enableScissorTest( true );
          scenes.forEach(function(item) {
            var scene = item.value,
              povs = awe.povs.list({exact: { scene_id: item.id }}),
              pov;
              
            switch (povs.length) {
              case 0:
                // nothing to render
                console.log('No pov in scene id '+item.id+' to render with');
                return;
              case 1:
                pov = povs[0].value;
                break;
              default:
                active_povs = awe.povs.list({exact: { scene_id: item.id, active: 1 }});
                pov = active_povs.length ? active_povs[0].value : povs[0].value;
            }
            
            // get the element that is a place holder for where we want to
            // draw the scene
            if (scene.element) {
              var element = scene.element;
    
              // get its position relative to the page's viewport
              var rect = element.getBoundingClientRect();
    
              // check if it's offscreen. If so skip it
              if ( rect.bottom < 0 || rect.top  > renderer.domElement.clientHeight ||
                rect.right  < 0 || rect.left > renderer.domElement.clientWidth ) {
                return;  // it's off screen
              }
    
              // set the viewport
              var width  = rect.right - rect.left;
              var height = rect.bottom - rect.top;
              var left   = rect.left;
              var bottom = renderer.domElement.clientHeight - rect.bottom;
              
              pov.aspect = width / height;
              pov.updateProjectionMatrix();
              
              renderer.setViewport( left, bottom, width, height );
              renderer.setScissor( left, bottom, width, height );
            }
            renderer.render( the_scene, pov );
          });
          renderer.enableScissorTest( false );
        }
        else {
          renderer.render( the_scene, this_awe.pov() );
        }
        
/*
        for (var i=0,l=scenes.length, scene; i<l; i++) {
          this_awe.renderer().render(scenes[i].value, this_awe.povs.view(scenes[i].id));
        }
*/
        this_awe.scene_needs_rendering = 0;
      }
    };
    var version = this_awe.version();
    this_awe.constructor.prototype.version = function(){
      return {
        awe: version,
        THREE: THREE.REVISION
      }
    }
    
    this_awe.constructor.prototype.animations = (function(){
      return {
        stop: function(objects){
          var stop = function(mesh_id){
            var mesh_tweens = tween_queue[mesh_id];
            for (var property in mesh_tweens) {
              if (mesh_tweens.hasOwnProperty(property)) {               
                for (var i in mesh_tweens[property]) {
                  if (mesh_tweens[property].hasOwnProperty(i)) {
                    mesh_tweens[property][i].stop();
                  }
                } 
              }
            }
            tween_queue[mesh_id] = {};
          }
          
          if (!objects) {
            for (var mesh_id in tween_queue) {
              if (tween_queue.hasOwnProperty(mesh_id)) {
                stop(mesh_id);
              }
            }
            tween_queue = {};
            return;
          }
          if (!Array.isArray(objects)) {
            objects = [objects];
          }
          for (var i=0,l=objects.length; i<l; i++) {
            try {
              var object = this_awe[objects[i].object_type+'s'].view(objects[i].object_id);
              if (object._tweens) {
                Object.forEach(object._tweens, function(id, t){
                  TWEEN.remove(t);
                });
              }
              else {
                var mesh = object.get_mesh();
                if (mesh) {
                  stop(mesh.id);
                }
              }
            } catch(e) { console.log(e); }
            
          }
        }
      }
    })();

    function _get_mesh_state(mesh) {
      try {
        var accuracy = 7;
        var state = {
          material: {
            opacity: mesh.material && mesh.material.transparent ? mesh.material.opacity: 1
          },
          rotation: {
            x: parseFloat(THREE.Math.radToDeg(mesh.rotation.x).toFixed(accuracy)),
            y: parseFloat(THREE.Math.radToDeg(mesh.rotation.y).toFixed(accuracy)),
            z: parseFloat(THREE.Math.radToDeg(mesh.rotation.z).toFixed(accuracy))
          },
          scale: {
            x: parseFloat(parseFloat(mesh.scale.x).toFixed(accuracy)),
            y: parseFloat(parseFloat(mesh.scale.y).toFixed(accuracy)),
            z: parseFloat(parseFloat(mesh.scale.z).toFixed(accuracy))
          },
          position: {
            x: parseFloat(parseFloat(mesh.position.x).toFixed(accuracy)),
            y: parseFloat(parseFloat(mesh.position.y).toFixed(accuracy)),
            z: parseFloat(parseFloat(mesh.position.z).toFixed(accuracy))
          }
        };
        if (mesh.target && mesh.target.position) {
          state.target = {
            x: parseFloat(parseFloat(mesh.target.position.x).toFixed(accuracy)),
            y: parseFloat(parseFloat(mesh.target.position.y).toFixed(accuracy)),
            z: parseFloat(parseFloat(mesh.target.position.z).toFixed(accuracy))
          }
        }
        return state;
      }
      catch(e) {
        console.error(e);
      }
    }
    
    function _transform(ob) {
      ob = ob ? ob : {};
      var def = {
        rotation: {
          x: 0,
          y: 0,
          z: 0
        },
        scale: {
          x: 1,
          y: 1,
          z: 1
        },
        position: {
          x: 0,
          y: 0,
          z: 0
        }
      };
      this.rotation = _extend(def.rotation, ob.rotation);
      this.scale = _extend(def.scale, ob.scale); 
      this.position = _extend(def.position, ob.position);   
      return this;
    };

    _transform.prototype.data = function(ob) {
      return {
        rotation: this.rotation,
        scale: this.scale,
        position: this.position
      };
    };

    _transform.prototype.add = function(ob) {
      if (ob.rotation) {
        this.rotation.x += ob.rotation.x || 0;
        this.rotation.y += ob.rotation.y || 0;
        this.rotation.z += ob.rotation.z || 0;
      }
      if (ob.scale) {
        this.scale.x *= ob.scale.x || 1;
        this.scale.y *= ob.scale.y || 1;
        this.scale.z *= ob.scale.z || 1;
      }
      if (ob.position) {
        this.position.x += ob.position.x || 0;
        this.position.y += ob.position.y || 0;
        this.position.z += ob.position.z || 0;
      }
      return this;
    };

    function _validate_shape(geometry) {
      var io = {};
      if (!geometry.shape) {
        return io;
      }
      switch(geometry.shape) {
        case 'cube': 
          io = {
            x: 1,
            y: 1,
            z: 1
          };
          break;
        case 'sphere': 
          io = {
            radius: 10
          };
          break;
        case 'grid': 
          io = {
            size: 100,
            step: 10
          };
          break;
        case 'plane': 
          io = {
            width: 1,
            height: 1,
            widthSegments: 1,
            heightSegments: 1
          };
        case 'text': 
          io = {
            text: 'theAWEsomeWEB'
          };
          break;
      }
      for (var i in geometry) {
        if (geometry.hasOwnProperty(i)) {
          io[i] = geometry[i];
        }
      }
      return io;
    }
    
    function _update_mesh_io(io, mesh, new_object) {
      if (!io) {
        io = {};
      } else {
        io = _clone(io);
      }
      
      if (!io.geometry) {
        io.geometry = {};
      }
      if (!io.material) {
        io.material = {};
      }
      var render = false;
      if (!mesh) {
        var geometry = new THREE.BoxGeometry(io.geometry.x, io.geometry.y, io.geometry.z);
        var material_id = this_awe.materials.add(io.material);
        var material = this_awe.materials.view(material_id).value();
        mesh = io.mesh || new THREE.Mesh(geometry, material);
        render = true;
      }
      if (io.scale) {
        if (io.scale.x !== undefined) { 
          mesh.scale.x = io.scale.x; 
        }
        else if (new_object) { 
          mesh.scale.x = 1; 
        }
        if (io.scale.y !== undefined) { 
          mesh.scale.y = io.scale.y; 
        }
        else if (new_object) { 
          mesh.scale.y = 1; 
        }
        if (io.scale.z !== undefined) { 
          mesh.scale.z = io.scale.z; 
        }
        else if (new_object) { 
          mesh.scale.z = 1; 
        }
        delete io.scale;
        render = true;
      }
      if (io.rotation) {
        if (io.rotation.x !== undefined) { 
          mesh.rotation.x = THREE.Math.degToRad(io.rotation.x); 
        }
        else if (new_object) { 
          mesh.rotation.x = 0; 
        }
        if (io.rotation.y !== undefined) { 
          mesh.rotation.y = THREE.Math.degToRad(io.rotation.y); 
        }
        else if (new_object) { 
          mesh.rotation.y = 0; 
        }
        if (io.rotation.z !== undefined) { 
          mesh.rotation.z = THREE.Math.degToRad(io.rotation.z); 
        }
        else if (new_object) { 
          mesh.rotation.z = 0; 
        }
        delete io.rotation;
        render = true;
      }
      if (io.position) {
        if (io.position.x !== undefined) { 
          mesh.position.x = io.position.x; 
        }
        else if (new_object) { 
          mesh.position.x = 0; 
        }
        if (io.position.y !== undefined) { 
          mesh.position.y = io.position.y; 
        }
        else if (new_object) { 
          mesh.position.y = 0; 
        }
        if (io.position.z !== undefined) { 
          mesh.position.z = io.position.z; 
        }
        else if (new_object) { 
          mesh.position.z = 0; 
        }
        delete io.position;
        render = true;
      }
      if (io.target && mesh.target) {
        
        if (io.target.x !== undefined) { 
          mesh.target.position.x = io.target.x; 
        }
        else if (new_object) { 
          mesh.target.position.x = 0; 
        }
        if (io.target.y !== undefined) { 
          mesh.target.position.y = io.target.y; 
        }
        else if (new_object) { 
          mesh.target.position.y = 0; 
        }
        if (io.target.z !== undefined) { 
          mesh.target.position.z = io.target.z; 
        }
        else if (new_object) { 
          mesh.target.position.z = 0; 
        }
        delete io.target;
        render = true;
      }
      if (!mesh.overdraw) {
        try {
          mesh.overdraw = true;
          render = true;
        }
        catch(e) { /* TODO */ };
      }
      if (io.visible !== undefined) {
        mesh.visible = !!io.visible;
        mesh.traverse(function(child) {
          if (!child._dont_traverse) {
            child.visible = !!io.visible;
          }
        });
        render = true;
      }
      if (io.cast_shadow !== undefined) {
        mesh.castShadow = io.cast_shadow;
        mesh.traverse(function(child) {
          if (!child._dont_traverse) {
            child.castShadow = io.cast_shadow;
          }
        });
        render = true;
      }
      if (io.receive_shadow !== undefined) {
        mesh.receiveShadow = io.receive_shadow;
        mesh.traverse(function(child) {
          if (!child._dont_traverse) {
            child.receiveShadow = io.receive_shadow;
          }
        });
        render = true;
      }
      if (io.matrix_auto_update !== undefined) {
        mesh.matrixAutoUpdate = io.matrix_auto_update;
        render = true;
      }
      if (io.custom_matrix !== undefined) {
        mesh.customMatrix = io.custom_matrix;
        render = true;
      }
      if (io.euler_order !== undefined) {
        mesh.rotation.order = io.euler_order;
        render = true;
      }
      if (io.material.color !== undefined) {
        var c = _parse_color(io.material.color);
        try {
          // THREE.Group / THREE.Object3D does not have a material applied directly
          if (mesh.material) {
            mesh.material.color.setHex(c);
          }
          mesh.traverse(function(child) {
            if (child.material && !child._dont_traverse) {
              child.material.color.setHex(c);
            }
          });
          render = true;
        }
        catch(e) { /* TODO */ };
      }
      if (io.material.opacity !== undefined) {
        try {
          // THREE.Group / THREE.Object3D does not have a material applied directly
          if (mesh.material) {
            mesh.material.opacity = io.material.opacity;
          }
          mesh.traverse(function(child) {
            if (child.material && !child._dont_traverse) {
              child.material.opacity = io.material.opacity;
            }
          });
          render = true;
        }
        catch(e) { console.log('opacity error', e) /* TODO */ };
      }
      if (io.material.transparent !== undefined) {
        try {
          // THREE.Group / THREE.Object3D does not have a material applied directly
          if (mesh.material) {
            mesh.material.transparent = !!io.material.transparent;
          }
          mesh.traverse(function(child) {
            if (child.material && !child._dont_traverse) {
              child.material.transparent = !!io.material.transparent;
            }
          });
          render = true;
        }
        catch(e) { /* TODO */ };
      }
      if (io.material.wireframe !== undefined) {
        try {
          // THREE.Group / THREE.Object3D does not have a material applied directly
          if (mesh.material) {
            mesh.material.wireframe = io.material.wireframe;
          }
          mesh.traverse(function(child) {
            if (child.material && !child._dont_traverse) {
              child.material.wireframe = io.material.wireframe;
            }
          });
          render = true;
        }
        catch(e) { /* TODO */ };
      }
      if (io.material.fog !== undefined) {
        try {
          // THREE.Group / THREE.Object3D does not have a material applied directly
          if (mesh.material) {
            mesh.material.fog = io.material.fog;
          }
          mesh.traverse(function(child) {
            if (child.material && !child._dont_traverse) {
              child.material.fog = io.material.fog;
            }
          });
          render = true;
        }
        catch(e) { /* TODO */ };
      }
      if (render) {
        this_awe.scene_needs_rendering = 1;
      }
      delete io.geometry;
      return mesh;
    }
    
    var tween_queue = {};
    
    function _tween(io) {
      try {
        if (!io.mesh && !io.object) { 
          throw  { code: 500, message: '_tween(): mesh/object not defined' };
        }
        if (!io.end_state) { 
          throw  { code: 500, message: '_tween(): end_state not defined' };
        }
        var tween_id = io.mesh ? io.mesh.id : io.object.id;
        var previous_tween;
        if (tween_queue[tween_id] && Object.keys(tween_queue[tween_id]).length && (io.run_immediately != undefined && !io.run_immediately)) {
//           previous_tween = // TBD...
          console.warn('already animating this mesh ('+tween_id+')', tween_queue[tween_id], io.object._tweens);
          return [];
        }
      }
      catch(e) {
        console.log(e);
        this_awe.error_handler(e);
        return [];
      }
      io = _extend({
        duration: 1, // seconds
        delay: 0, // seconds
        persist: 1,
        repeat: 0,
        easing: 'LinearNone',
        run_immediately: 1 // allow creating tweens to be run later
      }, io);
      var easing_function,
        easing = io.easing.replace(/([A-Z])/g, ' $1').split(' ');
        
      easing.shift();
      var _1 = easing.shift(), 
        _2 = easing.join('');
      try {
        if (!TWEEN.Easing[_1] || !TWEEN.Easing[_1][_2]) {
          throw {code: 500, message: 'Unsupported easing functions. See TWEEN.Easing for available easing functions.'};
        }
        easing_function = TWEEN.Easing[_1][_2]
      }
      catch(e) {
        console.log(e);
        this_awe.error_handler(e);
      }
      if (io.mesh) {
        var start_state = _get_mesh_state(io.mesh);  
      }
      else {
        var accuracy = 7;
        var start_state = {
          material: {
            opacity: io.object.opacity || 1
          },
          rotation: {
            x: parseFloat(io.object.rotation.x.toFixed(accuracy)),
            y: parseFloat(io.object.rotation.y.toFixed(accuracy)),
            z: parseFloat(io.object.rotation.z.toFixed(accuracy))
          },
          scale: {
            x: parseFloat(io.object.scale.x.toFixed(accuracy)),
            y: parseFloat(io.object.scale.y.toFixed(accuracy)),
            z: parseFloat(io.object.scale.z.toFixed(accuracy))
          },
          position: {
            x: parseFloat(io.object.position.x.toFixed(accuracy)),
            y: parseFloat(io.object.position.y.toFixed(accuracy)),
            z: parseFloat(io.object.position.z.toFixed(accuracy))
          }
        };
/* // TODO
        if (mesh.target && mesh.target.position) {
          state.target = {
            x: parseFloat(parseFloat(mesh.target.position.x).toFixed(accuracy)),
            y: parseFloat(parseFloat(mesh.target.position.y).toFixed(accuracy)),
            z: parseFloat(parseFloat(mesh.target.position.z).toFixed(accuracy))
          }
        }     
*/
      }

      var initial_state = _clone_deep(start_state);
      
      
      if (!tween_queue[tween_id]) {
        tween_queue[tween_id] = {};
      }
      
      var index = 'tween-'+random_id();
      var tweens = [];

      ['rotation', 'position', 'scale', 'material', 'target'].forEach(function(param, i){
        
        var mesh;
        if (io.mesh) {
          mesh = io.mesh;
        }
        else if (io.object && io.object.get_mesh) {
          // get the correct mesh
          mesh = io.object.get_mesh(param);
        }
        if (!mesh) {
          console.trace('no mesh to animate');
          return;
        }
        
        if (io.end_state[param] != undefined) {
          // compare start and end state and run only if different
          var run = false;
          for (var j in io.end_state[param]) {
            if (io.end_state[param].hasOwnProperty(j) && io.end_state[param][j] != start_state[param][j]) {
              run = true;
              break;
            }
          }
          if (!run) {
            return;
          }
          var d = {};
          d[param] = {};
          var tween = new TWEEN.Tween( start_state[param] );
          
          var last_progress = 0, loop = 0;
          if (!io.object._tweens) {
            io.object._tweens = {};
          }
          if (io.object._tweens[param]) {
            // stop the tween!
            TWEEN.remove(io.object._tweens[param]);
          }
          io.object._tweens[param] = tween;
          
          tweens.push(tween);
          tween.to( io.end_state[param], io.duration * 1000 )
          .repeat( io.repeat )
          .delay( io.delay * 1000)
  //        .yoyo( true )
          .easing( easing_function )
          .onUpdate( function(progress) {
            d[param] = this;
            _update_mesh_io(d, mesh);
            if (io.object && io.object._values_updated) {
//               io.object._values_updated(); // removed to optimise
            }
            if (io.step_callback) {
              io.step_callback(io);
            }
            if (io.loop_callback) { // track loops only if loop_callback is set
              if (progress < last_progress) { // repeating progress
                loop++;
                io.loop_callback(io, loop);
              }
              last_progress = progress
            }
          })
          .onStop(function(){
            console.log('stop tween', io.end_state[param])
            if (!io.persist) {
              _update_mesh_io(initial_state, mesh);
              if (io.object && io.object._values_updated) {
                io.object._values_updated();
              }
            }
            // clear queue? or is this just a "pause animation" thing?
          })
          .onComplete(function(){
            console.log('complete',io.persist);
            delete(tween_queue[tween_id][index][param]);
            if (!Object.keys(tween_queue[tween_id][index]).length) {
              delete(tween_queue[tween_id][index])
            }
            
            delete(io.object._tweens[param]);
            
            if (!io.persist) {
              _update_mesh_io(initial_state, mesh);
              
//               console.log('updated to initial state', initial_state);
              if (io.object && io.object._values_updated) {
                io.object._values_updated();
              }
            }
            if (io.end_callback) {
//             console.log('end callback called');
              io.end_callback(io);
            }
          })
          .onStart(function(){
//             console.log('start tween', io.end_state[param], initial_state.scale)
            if (!tween_queue[tween_id][index]) {
              tween_queue[tween_id][index] = {};
            }
            tween_queue[tween_id][index][param] = tween;
            
            if (io.start_callback) {
              io.start_callback(io);
            }              
          });
          if (io.run_immediately) {
            tween.start();
          }
        }
        else {
          delete (initial_state[param]);
        }
      });
      return tweens;
    }
    
    function _load_sound(io) {
      if (io.path == undefined) {
        throw 'url required';
      }
      var request = new XMLHttpRequest();
      request.open('GET', io.path, true);
      request.responseType = 'arraybuffer';
      request.onload = function() {
        this_awe.util.audio_context.decodeAudioData(request.response, function(new_buffer) {
          io.buffer = new_buffer;
          if (io.autoplay) {
            _play_sound(io);
          }
          if (io.callback) {
            try {
              io.callback(io);
            }
            catch(e) {  };
          }
        }, function(e) { console.log(e); });
      }
      request.send();
    }

    function _play_sound(io) {
      if (io.source == undefined) {
        throw 'source required'; 
      }
      if (io.buffer == undefined) {
        throw 'buffer required'; 
      }
      try {
        io.source.buffer = io.buffer;
        if (io.loop == undefined) {
          io.source.loop = true;
        }
        else {
          io.source.loop = io.loop;
        }
        io.source.start(io.start || 0.0);
      }
      catch(e) { };
    }

    function _map_audio_listener_to_pov() {
      var capabilities = this_awe.util.get_capabilities('audio');
      if (capabilities.audio) {
        var m = this_awe.pov().get_mesh().matrix;
        var mx = m.n14, my = m.n24, mz = m.n34;
        m.n14 = m.n24 = m.n34 = 0;
        var vec = new THREE.Vector3(0,0,1);
        vec.applyProjection(m);
        vec.normalize();
        
        var up = new THREE.Vector3(0,1,0);
        up.applyProjection(m);
        up.normalize();
        
        this_awe.util.audio_context.listener.setOrientation(vec.x, vec.y, vec.z, up.x, up.y, up.z);
        m.n14 = mx;
        m.n24 = my; 
        m.n34 = mz;
      }
    }
    
    function _update_materials(mesh){
      // after lighting change all visible objects need to have their material.needsUpdate flags set to true and re-rendered
      // awe.materials() does not hold materials that got loaded via loaders, 
      // so we will traverse the three scene children to make sure we reach all materials
      var count = 0;
      this_awe.scene().get_three_scene().traverse( function ( node ) {
        if (node.material && !node._dont_traverse) {
          node.material.needsUpdate = true;
          count++;
          if ( node.material instanceof THREE.MeshFaceMaterial ) {
            for ( var i = 0; i < node.material.materials.length; i ++ ) {
              node.material.materials[ i ].needsUpdate = true;
              count++;
            }
          }
        }
      });
    }

    function _valid_coordinates(io) {
      // extract just the x y and z and make sure they are numeric values
      try {
        if (!isNaN(parseFloat(io.x) + parseFloat(io.y) + parseFloat(io.z))) {
          return {
            x: io.x,
            y: io.y,
            z: io.z
          };
        }
      }
      catch (e) {}
      return null;
    }
    
    function _to_scene_coordinates(screen_coordinates, z) {
      var projector = new THREE.Projector();
      var ray = new THREE.Ray();
      var camera = awe.pov().get_mesh();
      var canvas = awe.renderer().get_canvas();
            
      var x = (screen_coordinates.x/canvas.clientWidth) * 2 - 1;
      var y = -(screen_coordinates.y/canvas.clientHeight) * 2 + 1;
      var mouse_vector = new THREE.Vector3(x, y, 1);
      mouse_vector.unproject(camera); 
      var direction = mouse_vector.sub(camera.position).normalize();
      ray.set(camera.position, direction);
      
      var plane = new THREE.Plane(new THREE.Vector3(0,0,1), -z);
      var point = ray.intersectPlane(plane);

      return {
        x: point.x,
        y: point.y,
        z: point.z
      };
      
    }
    function _to_screen_coordinates(scene_coordinates) {
  
      var camera = awe.pov().get_mesh();
      var frustum = new THREE.Frustum();
      var cameraViewProjectionMatrix = new THREE.Matrix4();
      var canvas = awe.renderer().get_canvas();

      camera.updateMatrixWorld(); // make sure the camera matrix is updated
      camera.matrixWorldInverse.getInverse( camera.matrixWorld );
      cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
      frustum.setFromMatrix( cameraViewProjectionMatrix );
      
      // frustum is now ready to check all the objects you need
      var vector = new THREE.Vector3(scene_coordinates.x, scene_coordinates.y, scene_coordinates.z);
      if (frustum.containsPoint(vector)) {
        var width = canvas.clientWidth, height = canvas.clientHeight;
        var widthHalf = width / 2, heightHalf = height / 2;
        
        var projector = new THREE.Projector();
        vector.project( camera );
        
        vector.x = ( vector.x * widthHalf ) + widthHalf;
        vector.y = - ( vector.y * heightHalf ) + heightHalf;
        return { x: vector.x, y: vector.y};
      
      }

    }
    function _color_hex_string(hex){
      var c = new THREE.Color(hex);
      return c.getHexString();
    }
    
    function _parse_color(color){
      var hex;
      if (color.charAt && color.charAt(0) == '#') {
        hex = color.substring(1);
      }
      else if (color.substring && color.substring(0,2) == '0x') {
        hex = parseInt(color,16);
      }
      else if (typeof color == 'number') {
        hex = color.toString(16);
      }
      else {
        
        console.warn('invalid material color, defaulting to #ffffff', color);
        hex = 'ffffff';
      }
      return parseInt(hex,16);
    }
    
    
    function _make_three_vector(xyz){
      if (!isNaN(xyz.x) && !isNaN(xyz.y) && !isNaN(xyz.z)) {
        return new THREE.Vector3(xyz.x, xyz.y, xyz.z);
      }
      console.warn('util.make_three_vector(): not a valid 3d point',xyz);
      return null;
    }
    
    var last_tick_time;
    var frames_per_second = 25;
    var render_threshold = ((1000/frames_per_second)/1000);
    
    function _tick() {
      try {
        var textures = this_awe.textures.list(),
          textures_updated = false;
        textures.forEach(function(awe_texture){
          if (awe_texture.is_video_texture()) {
            textures_updated = awe_texture.update_video_texture() || textures_updated;
          }
        });
        if (textures_updated) {
          this_awe.scene_needs_rendering = 1;
        }
        // throttle 
        var render = false;
        
        if (!last_tick_time) {
          last_tick_time = Date.now();
          render = true;
        }
        else {
          var time = Date.now();
          var elapsed = (time - last_tick_time) / 1000;
//           console.log('elapsed',elapsed, ((1000/frames_per_second)/1000));
          if (elapsed >= render_threshold) {
            render = true;
            last_tick_time = time;
          }
        }
        
        if (render) {
          TWEEN.update();
          this_awe.resize_canvas();
          this_awe.render();
        }
        
        requestAnimationFrame(function() {
          if (render) {
            var event = new CustomEvent('pretick');
            window.dispatchEvent(event);
          }
          _tick();
          if (render) {
            var event = new CustomEvent('tick');
            window.dispatchEvent(event);
          }
        });
      } 
      catch(e) {
        this_awe.error_handler(e);
      }
    }
    function _add_clickable_object(id, mesh){
      if (!_clickable_objects[id]) {
        _clickable_objects[id] = mesh;
      }
    }
    function _delete_clickable_object(id){
      delete(_clickable_objects[id]);
    }
    function _check_parent(object_data){
      if (object_data.parent) {
        return !!(this_awe[object_data.parent.object_type+'s'] && this_awe[object_data.parent.object_type+'s'].view(object_data.parent.object_id));
      }
      return true;
    }
    function random_id() {
      return Date.now()+'-'+Math.round(Math.random()*1000);
    }
    
    
    var _look_at = function() {
    	return function ( vector ) {
      	var m1 = new THREE.Matrix4();
    		m1.lookAt( this.getWorldPosition(), vector, this.up );
    		this.quaternion.setFromRotationMatrix( m1 );
    	};
    }();

    var _create_pov_quaternion = function (alpha, beta, gamma, screen_orientation) {
      var init = false;
      if (this_awe.pov_quaternion == undefined) {
        init = true;
        this_awe.pov_quaternion = {
          screen_orientation:screen_orientation,
          alpha:alpha,
          beta:beta,
          gamma:gamma,
        };
      }
      var pq = this_awe.pov_quaternion;
      if (init || pq.screen_orientation !== screen_orientation || pq.alpha !== alpha || pq.beta !== beta || pq.gamma !== gamma) {
        var final_quaternion = new THREE.Quaternion();
        var device_euler = new THREE.Euler();
        var screen_transform = new THREE.Quaternion();
        var world_transform = new THREE.Quaternion( - Math.sqrt(0.5), 0, 0, Math.sqrt(0.5) ); // - PI/2 around the x-axis
        var adjustment_transform = new THREE.Quaternion();
        adjustment_transform.setFromAxisAngle( new THREE.Vector3( 1, 0, 0 ), 90 * Math.PI / 180 ); // rotate the world by 90degrees
        var minus_half_angle = 0;

        device_euler.set( beta, alpha, - gamma, 'YXZ' );
        final_quaternion.setFromEuler( device_euler );
        minus_half_angle = - screen_orientation / 2;
        screen_transform.set( 0, 0, Math.sin( minus_half_angle ), Math.cos( minus_half_angle ) );
        if ( alpha !== 0 ) {
          final_quaternion.multiply( world_transform );
        }
        final_quaternion.multiply( screen_transform );
        pq.quaternion = final_quaternion;
      }
      return pq.quaternion;
    };

    var _update_pov_quaternion = function(orientation_data, screen_orientation, zoom, zoom_delta, last_update, mode) {
      var alpha, beta, gamma, orient;
      var obj_quat;
      var now = performance.now();
      var delta = now-last_update;
      if (delta > 1000/10) { // TODO gah should be part of tick()
        last_update = now;
        orient = THREE.Math.degToRad( screen_orientation || 0 ); // O
        if (mode == 'point') {
          alpha  = THREE.Math.degToRad( orientation_data.alpha || 0 ); // Z
          beta   = THREE.Math.degToRad( orientation_data.beta  || 0 ); // X'
          gamma  = THREE.Math.degToRad( orientation_data.gamma || 0 ); // Y''

          // only process non-zero 3-axis data
          if ( alpha !== 0 && beta !== 0 && gamma !== 0) {
            obj_quat = this_awe.util.create_pov_quaternion( alpha, beta, gamma, orient );
            awe.pov().get_mesh().quaternion.copy( obj_quat );
            awe.scene_needs_rendering = 1;
          }
        }
        else if (mode == 'sphere') {
          if (orient == 0) {  // portrait
            alpha  = THREE.Math.degToRad( orientation_data.alpha+90 || 0 ); // Z
            beta   = THREE.Math.degToRad( orientation_data.beta || 0 ); // X'
            gamma  = THREE.Math.degToRad( orientation_data.gamma || 0 ); // Y''
          } else if (orient > 0) { // right landscape
            alpha  = THREE.Math.degToRad( orientation_data.alpha+180 || 0 ); // Z
            beta   = THREE.Math.degToRad( orientation_data.beta || 0 ); // X'
            gamma  = THREE.Math.degToRad( orientation_data.gamma || 0 ); // Y''
          } else { // left landscape
            alpha  = THREE.Math.degToRad( orientation_data.alpha || 0 ); // Z
            beta   = THREE.Math.degToRad( orientation_data.beta || 0 ); // X'
            gamma  = THREE.Math.degToRad( orientation_data.gamma || 0 ); // Y''
          }

          var new_alpha = -orientation_data.alpha;
          var x = Math.cos(THREE.Math.degToRad(new_alpha));
          var z = Math.sin(THREE.Math.degToRad(new_alpha));

          var new_zoom = zoom+zoom_delta;

          awe.pov().update({
            position: {
              x: new_zoom*x,
              y: new_zoom,
              z: (0.77*new_zoom)*z
            }
          });

          awe.pov().look_at(awe.origin);

          var new_quat = this_awe.util.create_pov_quaternion( alpha, beta, gamma, orient );
          awe.pov().get_mesh().quaternion.copy( new_quat ); // no smoothing

          awe.scene_needs_rendering = 1;
        }
      }
    };
    
    this_awe.util.to_scene_coordinates = _to_scene_coordinates;
    this_awe.util.to_screen_coordinates = _to_screen_coordinates;
    this_awe.util.make_three_vector = _make_three_vector;
    this_awe.util.create_pov_quaternion = _create_pov_quaternion;
    this_awe.util.update_pov_quaternion = _update_pov_quaternion;
    this_awe.util._update_mesh_io = _update_mesh_io;
    this_awe.util.parse_color = _parse_color;
    this_awe.util.color_hex_string = _color_hex_string;
    this_awe.util.tween = _tween;
    this_awe.util.add_clickable_object = _add_clickable_object;
    this_awe.util.delete_clickable_object = _delete_clickable_object;
    this_awe.util.inline_video_shim_toggle = inline_video_shim_toggle;
    var _extend = this_awe.util.extend;
    var _clone = this_awe.util.clone;
    var _clone_deep = this_awe.util.clone_deep;
    var _type = this_awe.util.type;
    
  } else {
    throw "awe does not exist";
  }
})(window);
