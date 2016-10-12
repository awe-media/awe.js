

;(function(awe) {

  var jsartoolkit_camera_matrix = new Float32Array(16),
    marker_transform_matrix = new THREE.Matrix4().elements,
    threshold = 98,
    marker_size = 80,
    canvas,
    canvas_context,
    jsartoolkit,
    debug_canvas,
    frame_image,
    detector,
    
    renderer,
    awe_canvas,
    awe_canvas_width,
    awe_canvas_height,
    video_stream,
    video_element,
    last_time = 0,
    debug_threshold = 3,
    
    ar_marker_id_prefix = 'jsartoolkit_marker_',
    ar_marker_ids = [],
    visible_marker_ids = [],
    jsartoolkit_marker_transform_matrix,
    
    tracking_ready = false,
    tracking_scene_ready = false,
    tracking_config_ready = false,
    video_stream_ready = false,
    vars_ready = false,
    
    tracking_enabled = false,
    
    tracking_pov, 
    tracking_scene, 
    tracking_lights = {},
    
    old_render, 
    old_lights_add,
    old_lights_update,
    old_lights_delete,
    
    existing_pois = {},
    offset_scale = 1,
    x_offset = 0,
    y_offset = 0;

  for (var i=0;i<100;i++) {
    ar_marker_ids.push(ar_marker_id_prefix+i);
  }
  

  function convert_matrix_from_to(src, dst){
    dst[0] = src.m00;
    dst[1] = -src.m10;
    dst[2] = src.m20;
    dst[3] = 0;
    dst[4] = src.m01;
    dst[5] = -src.m11;
    dst[6] = src.m21;
    dst[7] = 0;
    dst[8] = -src.m02;
    dst[9] = src.m12;
    dst[10] = -src.m22;
    dst[11] = 0;
    dst[12] = src.m03;
    dst[13] = -src.m13;
    dst[14] = src.m23;
    dst[15] = 1;
  }
  
  function setup_vars(){
    renderer = awe.renderer(),
    awe_canvas = renderer.get_canvas();

    awe_canvas_width = awe_canvas.clientWidth;
    awe_canvas_height = awe_canvas.clientHeight;
    
    
    if (document.getElementById('jsartoolkit_canvas')) {
      canvas = document.getElementById('jsartoolkit_canvas');
    }
    else {
      canvas = document.createElement('canvas');
      canvas.id = "jsartoolkit_canvas";
      canvas.style.display = "none";
      
      document.body.appendChild(canvas);
      canvas_context = canvas.getContext('2d');
    }
    if (window.DEBUG) {
      if (document.getElementById('debugCanvas')) {
        debug_canvas = document.getElementById('debugCanvas');
      }
      else {
        debug_canvas = document.createElement('canvas');
        debug_canvas.id = "debugCanvas";
        document.body.appendChild(debug_canvas);
      }
    }
    
    vars_ready = true;
  }
  function setup_tracking() {
    if (tracking_ready) {
      return;
    }
    setup_tracking_scene();
    resize_tracking();
    setup_tracking_config();
    tracking_ready = true;
  }
  function resize_tracking(){
    if (!vars_ready) {
      console.warn('vars not ready');
      return;
    };
    
    awe_canvas_width = awe_canvas.clientWidth;
    awe_canvas_height = awe_canvas.clientHeight;
    var aspect = awe_canvas_width / awe_canvas_height;
    
    canvas.width = awe_canvas_width;
    canvas.height = awe_canvas_height;
    if (debug_canvas) {
      debug_canvas.width = awe_canvas_width;
      debug_canvas.height = awe_canvas_height;
    }
    
    tracking_pov.set_aspect(aspect);
    tracking_pov.update_projection_matrix();
    
    offset_scale = 1;
    y_offset = 0;
    x_offset = 0;
    
    if (video_stream_ready) {
      var video_aspect = video_element.videoWidth / video_element.videoHeight;
      
      if (video_aspect > aspect) { // slimmer viewport than video -> trim video sides
        x_offset = (((video_element.videoWidth * awe_canvas_height) / video_element.videoHeight ) - awe_canvas_width) / 2;
        offset_scale = video_element.videoHeight / awe_canvas_height;
      }
      else if (video_aspect < aspect) {
        y_offset = (((video_element.videoHeight * awe_canvas_width) / video_element.videoWidth ) - awe_canvas_height) / 2;
        offset_scale = video_element.videoWidth / awe_canvas_width;
      }
      
    }
    
    
    if (tracking_config_ready) {
      jsartoolkit.changeScreenSize(awe_canvas_width, awe_canvas_height);
      jsartoolkit.copyCameraMatrix(jsartoolkit_camera_matrix, tracking_pov.near, tracking_pov.far);
      tracking_pov.set_projection_matrix(jsartoolkit_camera_matrix);
    }
  }
  
  function destroy_tracking_config(){
    delete(jsartoolkit);
    delete(jsartoolkit_camera_matrix);
    delete(detector);
    delete(frame_image);
    delete(jsartoolkit_marker_transform_matrix);
    
    tracking_config_ready = false;
  }
  
  function setup_tracking_config(){
    if (tracking_config_ready) { destroy_tracking_config();  }
    if (!tracking_pov) {
      console.warn('setting up config too early');
      return;
    }
    
    jsartoolkit = new FLARParam(awe_canvas_width, awe_canvas_height, tracking_pov.fov);
    jsartoolkit_marker_transform_matrix = new NyARTransMatResult();

    detector = new FLARMultiIdMarkerDetector(jsartoolkit,marker_size);
    detector.setContinueMode(true);
    frame_image = new NyARRgbRaster_Canvas2D(canvas);
    
    jsartoolkit.copyCameraMatrix(jsartoolkit_camera_matrix, 10, tracking_pov.far);
    
    tracking_pov.set_projection_matrix(jsartoolkit_camera_matrix);
    tracking_config_ready = true;
  }
  
  function add_light(awe_light){
    if (tracking_lights[awe_light.id]) { console.warn('trying to add light that already exists', arguments); return; }
    var mesh = awe_light.get_mesh();
    var light = mesh.clone();
    tracking_scene._add_child(light);
    tracking_lights[awe_light.id] = light;
  }
  function delete_light(awe_light_id){
    if (!tracking_lights[awe_light_id]) { console.warn('trying to delete light rhat doesnt exist', arguments); return; }
    tracking_scene._remove_child(tracking_lights[awe_light_id]);
    delete tracking_lights[awe_light_id];
  }
  function update_light(awe_light){
    if (!tracking_lights[awe_light.id]) { console.warn('trying to update light rhat doesnt exist', arguments); return; }
    var mesh = awe_light.get_mesh();
    var light = tracking_lights[awe_light.id];
    ['visibility','castShadow','receiveShadow'].forEach(function(param){
      if (mesh[param] != undefined) {
        light[param] = mesh[param];
      }
    });
    // position
    light.position.set(mesh.position.x, mesh.position.y, mesh.position.z);
    
    // rotation
    light.quaternion.copy(mesh.quaternion);
    
    // scale
    light.scale.set(mesh.scale.x, mesh.scale.y, mesh.scale.z);
    
  }
  
  function setup_tracking_scene(){
    if (tracking_scene_ready) { return; }

    if (awe.renderer()) {
      if (!tracking_pov) {
        awe.povs.add({
          id: 'tracking_pov'
        });
        tracking_pov = awe.povs.view('tracking_pov');
        
        awe.scenes.add({
          id: 'tracking_scene'
        });
        tracking_scene = awe.scenes.view('tracking_scene');
        
        
        old_render = awe.render;
        awe.render = function() {
          var three_renderer = awe.renderer().get_three_renderer();
          three_renderer.autoClear = false;
          
          three_renderer.clear();
          three_renderer.render(tracking_scene.get_mesh(), tracking_pov.get_mesh());
          three_renderer.render(awe.scene().get_mesh(), awe.pov().get_mesh());
          awe.scene_needs_rendering = 0;
        }
        old_lights_add = awe.lights.add;
        old_lights_update = awe.lights.update;
        old_lights_delete = awe.lights.delete;
        
        // TODO duplicate lights
        awe.lights.list().forEach(add_light);
        
        awe.lights.add = function(){
          var result = old_lights_add.apply(this, arguments);
          var ids;
          if (!Array.isArray(result.id)) {
            ids = [result.id];
          }
          else {
            ids = result.id;
          }
          awe.lights.list({exact: {id: ids}}).forEach(add_light);
          return result;
        }
        awe.lights.update = function(){
          var result = old_lights_update.apply(this, arguments);
          var ids = Object.keys(result);
          awe.lights.list({exact: {id: ids}}).forEach(update_light);
          return result;
        }
        awe.lights.delete = function(){
          var result = old_lights_delete.apply(this, arguments);
          var ids;
          if (!Array.isArray(result.id)) {
            ids = [result.id];
          }
          else {
            ids = result.id;
          }
          ids.forEach(delete_light);
          return result;
        }
        
        tracking_scene_ready = true;
      }
      get_poi_ids();
    }
  }
  
  function add_stream_event(){
    awe.events.add([{
      id: 'jsartoolkit_gum_ready',
      
      register: function(handler) {
        window.addEventListener('gum_ready', handler, false);
      },
      unregister: function(handler){
        window.removeEventListener('gum_ready', handler, false);
      },
      handler: function(e) {
        video_stream = awe.video_stream();
        video_element = video_stream.get_video_element();
        
        video_stream_ready = true;
        
        if (tracking_ready) {
          resize_tracking();
        } 
      }
    }]);
  }
  
  function add_ar_events(){

    awe.events.add([
    {
      id: 'jsartoolkit_tracking',
      
      register: function(handler) {
        window.addEventListener('tick', handler, false);
      },
      unregister: function(handler){
        window.removeEventListener('tick', handler, false);
      },
      handler: function(event) {
        if (!tracking_enabled) {
          return;
        }
        if (!vars_ready) {
          setup_vars();
        }
        if (!tracking_ready) {
          setup_tracking();
        }
        if (!video_stream_ready) {
          return;
        }
        if (video_element.ended) { video_element.play(); }
        if (video_element.paused) { return; }
        if (video_element.currentTime == last_time) { return; }
//         if (video_element.currentTime - last_time < debug_threshold) { return; }

        last_time = video_element.currentTime;
        
        try {
          canvas_context.drawImage(video_element, x_offset*offset_scale, y_offset*offset_scale, video_element.videoWidth-2*offset_scale*x_offset, video_element.videoHeight-2*offset_scale*y_offset, 0, 0, canvas.width, canvas.height);
        }
        catch(e) { /* TODO */ }
        canvas.changed = true;
        var detected_count;
        try {
          detected_count = detector.detectMarkerLite(frame_image, threshold);
        }
        catch(e){ console.log(e); }
        
        var event_data = {};
        var markers_to_hide = visible_marker_ids.slice();
        var markers_previously_visible = visible_marker_ids.slice();
        visible_marker_ids = [];

        for (var i=0; i<detected_count; i++) {
          var id = detector.getIdMarkerData(i);
          var detected_marker_id = -1;
          if (id.packetLength <= 4) {
            detected_marker_id = 0;
            for (var j = 0; j < id.packetLength; j++) {
              detected_marker_id = (detected_marker_id << 8) | id.getPacketData(j);
            }
          }
          detector.getTransformMatrix(i, jsartoolkit_marker_transform_matrix);
          convert_matrix_from_to(jsartoolkit_marker_transform_matrix, marker_transform_matrix);
          event_data[detected_marker_id] = {
            transform: Object.asCopy(marker_transform_matrix)
          };
          if (existing_pois[detected_marker_id]) {
            visible_marker_ids.push(detected_marker_id);
            if (markers_to_hide.indexOf(detected_marker_id) > -1) {
              markers_to_hide.splice(markers_to_hide.indexOf(detected_marker_id), 1);
            }
            try {
              var poi = awe.pois.view(existing_pois[detected_marker_id]),
                mesh = poi.get_mesh();
             
              mesh.matrixAutoUpdate = false;
              mesh.matrix.setFromArray(Object.asCopy(marker_transform_matrix));
              mesh.matrixWorldNeedsUpdate = true;
              
              poi.update({
                visible: true
              });
            }
            catch(e){
              console.error(e);
            }
          }
        }

        // hide all others        
        var poi_to_hide = markers_to_hide.map(function(marker_id) {
          return existing_pois[marker_id];
        });
        if (poi_to_hide.length) {
          awe.pois.update({
            data: {
              visible: false
            },
            where: { id: poi_to_hide }
          });
        }
        
        // trigger custom event for other user-defined interactions
        var event = new CustomEvent('ar_tracking_marker', { detail: event_data });
        window.dispatchEvent(event);  
      }
    },
    {
      id: 'jsartoolkit_pov_projection_matrix',
      register: function(handler) {
        window.addEventListener('renderer_resized', handler, false);
      },
      unregister: function(handler){
        window.removeEventListener('renderer_resized', handler, false);
      },
      handler: function(e) {
        if (tracking_enabled) {
          resize_tracking();
          setup_tracking_config();
        }
      }
    }
    ]);
  }
  
  function remove_ar_events(){
    awe.events.delete('jsartoolkit_gum_ready');
    awe.events.delete('jsartoolkit_tracking');
    awe.events.delete('jsartoolkit_pov_projection_matrix');
  }

  function get_poi_ids(){
    existing_pois = {};
    var pois = awe.pois.list({id: ar_marker_id_prefix});
    pois.forEach(function(poi){

      existing_pois[poi.id.replace(ar_marker_id_prefix, '')] = poi.id;
      poi.update({visible: false});
      var parent = poi.parent();
      if (tracking_scene) {
//       if (!(parent instanceof awe.povs._item_constructor)) {
        tracking_scene._add_child(poi);
//       }
      }
    });
    
  }
  var awe_pov = awe.povs._item_constructor;
    
  awe.plugins.add([{
    id: 'jsartoolkit',
    auto_register: true,
    capabilities: ['gum','webgl'],
    enable: function(){
      // check if any image pois got added in meantime
      resize_tracking();
      setup_tracking_config();
      get_poi_ids();
      tracking_enabled = true;
    },
    disable: function(){
      destroy_tracking_config();
      tracking_enabled = false;
    },
    register: function(plugin_data){
      
      THREE.Matrix4.prototype.setFromArray = function(m){
        this.set(
          m[0], m[4], m[8], m[12],
          m[1], m[5], m[9], m[13],
          m[2], m[6], m[10], m[14],
          m[3], m[7], m[11], m[15]
        );
        
        var clone = this.clone();
        var v1 = new THREE.Vector3();
        var v2 = new THREE.Vector3();
        var q = new THREE.Quaternion();
        clone.decompose(v1, q, v2);
        
        var m1 = new THREE.Matrix4();
        m1.makeScale(-1,-1,-1);
        var m2 = new THREE.Matrix4();
        m2.makeRotationY(Math.PI);
        this.multiply(m1);
        this.multiply(m2);
      };
      
      add_ar_events();
      if (!awe.video_stream()) {
        add_stream_event();
        awe.setup_stream();
      }
      else if (awe.video_stream().is_stream_ready()) {
        video_stream = awe.video_stream();
        video_element = video_stream.get_video_element();
        video_stream_ready = true;
      }
      else {
        add_stream_event();
      }

    },
    unregister: function(plugin_data){
      awe.render = old_render;
      remove_ar_events();
    }
  }]);
  
})(window.awe);

