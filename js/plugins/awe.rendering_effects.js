
// var DEBUG = true; 

;(function(awe){
  
  if (!awe) {
    throw 'awe library not included';
    return;
  }

  var old_renderers_add,
    old_render,
    old_resize_canvas,
    stereo_effect,
    vr_effect,
    enabled = false,
    vr_effect_supported = true,
    vs, 
    video_element,
    camerastream_projection_id = 'ar_camerastream_projection';
    
  var adapt_view_mode, resize_video;
  
  var capabilities = awe.util.get_capabilities('gum');
  
  function is_stream_ready(){
    var vs = awe.video_stream();
    if (vs) {
      video_element = vs.get_video_element();
      return vs.is_stream_ready();
    }
    return false;

  }
  awe.plugins.add([{
    id: 'render_effects',
    capabilities: ['webgl'], // gum ?
    auto_register: true,
    register: function(plugin_data){
      
      old_settings_update = awe.settings.update;
      old_renderers_add = awe.renderers.add;
      old_render = awe.render;
      old_resize_canvas = awe.resize_canvas;
      old_pov_value_updated = awe.povs._item_constructor.prototype._values_updated;
      
      awe.povs._item_constructor.prototype._values_updated = function(){
        old_pov_value_updated.call(this, arguments);
        if (!capabilities.gum && awe.projections.view(camerastream_projection_id)) {
          awe.projections.update({
            data: {
              position: awe.pov().position
            },
            where: {
              id: camerastream_projection_id
            }
          });
        }
      };
      
      awe.resize_canvas = function(force) {
        
        var renderer = awe.renderer(),
          awe_canvas = renderer.get_canvas(),
          pov = awe.pov(),
          width = awe_canvas.clientWidth,
          height = awe_canvas.clientHeight,
          aspect = width / height;

        
        function resize_renderer(){
          renderer.set_size(width, height, false);
          resize_video();
          awe.scene_needs_rendering = 1;
          
          var event = new CustomEvent('renderer_resized');
          window.dispatchEvent(event);
        }
        
        if (awe_canvas.width != width || awe_canvas.height != height || force) {
          
          pov.set_aspect(aspect);
          pov.update_projection_matrix();
          
          var view_count = awe.settings.view('view_count') ? awe.settings.view('view_count').value() : 'mono';
          if (view_count == 'stereo') {
            if (vr_effect_supported) {
              vr_effect.setSize(width, height, false);
            }
            else if (stereo_effect) {
              var factor = 1; //window.devicePixelRatio;
              stereo_effect.setSize(width*factor, height*factor, false);
            }
            resize_renderer();
            // holy shmoly - ios webgl is not applying these changes unless they happen a teeny bit later than the stereo
            requestAnimationFrame(function(){
              requestAnimationFrame(resize_renderer);
            });
          }
          else {
            resize_renderer();
          }
        }        
      };
      
      resize_video = function(){
        if (!capabilities.gum) {
          console.warn('Your device does not support getUserMedia');
          return;
        }
        if (!is_stream_ready()){
          return;
        }
        if (!awe.projections.view(camerastream_projection_id)) {
          return;
        }
        
        var pov_mesh = awe.pov().get_mesh(),
          scale_y = (Math.tan((pov_mesh.fov*Math.PI/180)/2) * pov_mesh.far) * 2,
          scale_x = pov_mesh.aspect * scale_y,
          video_aspect = video_element.videoWidth / video_element.videoHeight,
          new_x, 
          new_y;
          
        if (pov_mesh.aspect > video_aspect) {
          new_x = scale_x;
          new_y = new_x / video_aspect;
        }
        else {
          new_y = scale_y;
          new_x = video_aspect * new_y;
        }
        
          
        awe.projections.update({
          data: {
            scale: { x: new_x, y: new_y }
          },
          where: { id: camerastream_projection_id }
        });
      }

      
      adapt_view_mode = function (effect) {
        if (!enabled) { return; }
        if (effect == 'ar') {
          
          if (!capabilities.gum) {
            console.warn('Your device does not support getUserMedia');
//            return;
          }
          // add camera stream projection (if one doesn't exist), attached to pov() and at pov.far+1
          var camerastream_projection = awe.projections.view(camerastream_projection_id);
          if (camerastream_projection) {
            camerastream_projection.update({
              visible: true
            });
            camerastream_projection.play_video_texture();
            resize_video();
            return;
          }
          // add and play camera stream if not playing yet
          
          var reset_camerastream_projection = function(){
            awe.events.delete('render_effects_camerastream_error');
            if (awe.projections.view(camerastream_projection_id)) {
              awe.projections.delete(camerastream_projection_id)
              add_camerastream_projection();
            }
          };
          
          var add_camerastream_projection = function(){
            var pov = awe.pov();
            var settings = awe.util.get_settings('camerastream_poster');
            var scale_y = (Math.tan(pov.fov/2) * pov.far),
              scale_x = pov.aspect * scale_y;
            
            var geometry, material, texture, position, scale, parent;
            
            material = { 
              type: 'phong',
              color: 0xFFFFFF,
            };
            
            if (capabilities.gum && !awe.gum_denied) {
              // camerastream plane with poster fallback
              geometry = {
                shape:'plane',
                width: 1,
                height: 1 
              };
              texture = {
                color: 0xFFFFFF,
                path: 'camerastream',
                poster: settings.camerastream_poster
              };
              position = {
                x: 0,
                y: 0,
                z: -pov.far + 1
              };
              scale = {
                x: scale_x,
                y: scale_y,
                z: 1
              };
              parent = { parent: { object_id: 'default', object_type: 'pov'} }
            }
            else {
              // poster sphere
              geometry = {
                shape:'sphere',
                widthSegments: 50,
                heightSegments: 20,
                radius: pov.far-1
              };
              texture = {
                color: 0xFFFFFF,
                path: settings.camerastream_poster,
              };
              position = pov.position;
              scale = {
                x: 1,
                y: 1,
                z: 1
              };
              parent = { parent: { object_id: 'default', object_type: 'scene'} }
            }
            
            awe.projections.add({
              id: camerastream_projection_id,
              geometry: geometry,
              material: material,
              texture: texture,
              position: position,
              scale: scale,
              not_clickable: 1
            }, parent);
          };
          
          var attach_camerastream_projection = function(){
            
            awe.events.delete('render_effects_camerastream');
            vs = awe.video_stream();
            if (!vs) {
              return;
            }
            video_element = vs.get_video_element();
            
            if (video_element && video_element.readyState != video_element.HAVE_NOTHING) {
              resize_video();
            }
            else {
              video_element.addEventListener('loadedmetadata', resize_video);
            }
          };

          add_camerastream_projection();
          
          if (is_stream_ready()) {
            attach_camerastream_projection();
            return;
          }
          
          if (!awe.events.view('render_effects_camerastream') && capabilities.gum) {
            awe.events.add([
              {
                id: 'render_effects_camerastream',
                register: function(handler){
                  window.addEventListener('gum_ready', handler);
                },
                unregister: function(handler){
                  window.removeEventListener('gum_ready', handler);
                },
                handler: function(e){
                  attach_camerastream_projection();
                }
              },
              {
                id: 'render_effects_camerastream_error',
                register: function(handler){
                  window.addEventListener('gum_error', handler);
                },
                unregister: function(handler){
                  window.removeEventListener('gum_error', handler);
                },
                handler: function(e){
                //  reset_camerastream_projection();
                }
              }
            ]);
          }

          
          if (!awe.video_stream()) {
            awe.setup_stream();
          }
        }
        else if (awe.projections.view(camerastream_projection_id)) {
          // hide camera stream poi only if added by adapt_view_mode()
          // other video stream pois / video elements should keep on playing.
          awe.projections.update({
            data: {
              visible: false
            },
            where: { id: camerastream_projection_id }
          });
        }
      }
      
      awe.settings.update = function(BODY, HEAD) {
        old_settings_update.call(this, BODY, HEAD);
        
        if (BODY.where.id && (BODY.where.id == 'view_mode' || (BODY.where.includes && BODY.where.id.includes('view_mode'))) ) {
          var view_mode = awe.settings.view('view_mode') ? awe.settings.view('view_mode').value() : 'vr';
          adapt_view_mode(view_mode);
          
          var event = new CustomEvent('view_mode_changed', {detail: view_mode});
          window.dispatchEvent(event);
        }
        if (BODY.where.id && (BODY.where.id == 'view_count' || (BODY.where.includes && BODY.where.id.includes('view_count'))) ) {
          var view_count = awe.settings.view('view_count') ? awe.settings.view('view_count').value() : 'mono';
          
          var event = new CustomEvent('view_count_changed', {detail: view_count});
          window.dispatchEvent(event);
        }
        awe.resize_canvas(1);
      };
      
      awe.renderers.add = function(BODY, HEAD) {
        old_renderers_add.call(this, BODY, HEAD);
        
        var renderer = awe.renderer(),
          container_element = renderer.get_canvas().parentNode,
          three_renderer = renderer.get_three_renderer();
        
        vr_effect = new THREE.VREffect(three_renderer, function(error) {
          if (error) {
            vr_effect_supported = false;
            console.warn(error);
            
            stereo_effect = new THREE.StereoEffect(three_renderer);
            stereo_effect.separation = 0.8;
            stereo_effect.setSize(container_element.clientWidth, container_element.clientHeight, false);
            
            three_renderer.autoClear = true;
            
            awe.scene_needs_rendering = 1;
            if (enabled) {
              var view_mode = awe.settings.view('view_mode') ? awe.settings.view('view_mode').value() : 'vr';
              adapt_view_mode(view_mode);
            }
          }
        })
        
        
      };
      
      awe.render = function() {
        var view_count = awe.settings.view('view_count') ? awe.settings.view('view_count').value() : 'mono';
        
        if (enabled && view_count == 'stereo' && awe.scene_needs_rendering && awe.pov()) {
          if (vr_effect_supported) {
            vr_effect.render(awe.scene().get_three_scene(), awe.pov().get_mesh());
            awe.scene_needs_rendering = 0;
            return;
          }
          if (stereo_effect) {
            awe.renderer().get_three_renderer().autoClear = false;
            stereo_effect.render(awe.scene().get_three_scene(), awe.pov().get_mesh());
            awe.scene_needs_rendering = 0;
            return;
          }
        }
        old_render();
        
      };
      this.registered = true;
    },
    unregister: function(plugin_data){
      console.log('unregister')
      this.registered = false;
      awe.renderers.add = old_renderers_add;
      awe.render = old_render;
      awe.resize_canvas = old_resize_canvas;
      awe.settings.update = old_settings_update;
    },
    enable: function(){
      enabled = true;
      var view_mode = awe.settings.view('view_mode') ? awe.settings.view('view_mode').value() : 'vr';
      adapt_view_mode(view_mode);
    },
    disable: function(){
      console.log('disable')
      enabled = false;
      var three_renderer = awe.renderer().get_three_renderer();
      three_renderer.autoClear = true;
      awe.resize_canvas(1);
    },
    api: {
      get_stereo_cameras: function(){
        var cameras = {};
        if (stereo_effect) {
          cameras = stereo_effect.getCameras();
        }
        else if (vr_effect) {
          cameras = vr_effect.getCameras();
        }
        return cameras;
      } 
    }
  }]);

})(window.awe);
