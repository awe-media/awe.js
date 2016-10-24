;(function(awe){
  var enabled = false;
  var zoom = 700;
  var zoom_delta = 0;
  var current_screen_orientation = window.orientation;
  var last_update = performance.now();
  var mouse_ready = false;
  var mouse_mode = 'point'; // none|point|sphere
  var ignore_click = false;
  var setup_mouse = function(){
    if (mouse_ready) { return; }
    
    var mouse_position_data = {
      alpha: 0,
      beta: 90,
      gamma: 0.01 // fixed, non-zero
    };
    var alpha = mouse_position_data.alpha; // ~ horizontal axis
    var beta = mouse_position_data.beta; // ~ vertical axis
    var gamma = mouse_position_data.gamma; // fixed
    
    try {
      var canvas = awe.renderer().get_canvas();
      var mousedown = false;
      var horizontal_range = 360; // degrees
      var vertical_range = 180;
      var canvas_width = canvas.clientWidth;
      var canvas_height = canvas.clientHeight;
      var horizontal_ratio, vertical_ratio;
      var pov = awe.pov();
      
      var initial_x, initial_y, delta_x, delta_y, last_x, last_y;
      var last_delta = 2;
      
      var max_vertical_rotation = 90;
      var min_vertical_rotation = -90;
      
      awe.events.add({
        id: 'live_view_pov_sensors',
        register: function(handler){
          canvas.addEventListener('mousedown', mousedown_handler);
          canvas.addEventListener('mousemove', mousemove_handler);
          canvas.addEventListener('mouseup', mouseup_handler);
          canvas.addEventListener('mouseleave', mouseup_handler);
          canvas.addEventListener('wheel', wheel_handler);
        },
        unregister: function(handler){
          canvas.removeEventListener('mousedown', mousedown_handler);
          canvas.removeEventListener('mousemove', mousemove_handler);
          canvas.removeEventListener('mouseup', mouseup_handler);
          canvas.removeEventListener('mouseleave', mouseup_handler);
          canvas.removeEventListener('wheel', wheel_handler);
        },
        handler: function(){}
      });
      mouse_ready = true;

      function mousedown_handler(e){
        if ((awe.util.get_settings('paused_interactions'))['paused_interactions']) { return }
        mousedown = true;
        if (mouse_mode == 'point') {
          initial_x = e.clientX;
          initial_y = e.clientY;
          last_x = initial_x;
          last_y = initial_y;
          canvas_width = canvas.clientWidth;
          canvas_height = canvas.clientHeight;
          
          horizontal_ratio = horizontal_range / canvas_width;
          vertical_ratio = vertical_range / canvas_height;
          
        }
      }
      function mouseup_handler(e){
        if ((awe.util.get_settings('paused_interactions'))['paused_interactions']) { return }
        
        mousedown = false;
        if (mouse_mode == 'point') {
          alpha = mouse_position_data.alpha;
          beta = mouse_position_data.beta;
        }
      }
      function mousemove_handler(e){
        if ((awe.util.get_settings('paused_interactions'))['paused_interactions']) { return }

        if (mouse_mode == 'point') {
        
          if (mousedown
              && (e.clientX <= last_x-last_delta || e.clientX >= last_x+last_delta
                  || e.clientY <= last_y-last_delta || e.clientY >= last_y+last_delta)
            ) {
            e.preventDefault();
            e.stopPropagation();
            var position = {},
              rotation = {};
        
            delta_x = initial_x - e.clientX;
            delta_y = initial_y - e.clientY;
            
            mouse_position_data.gamma = gamma;
            mouse_position_data.alpha = (alpha - delta_x * horizontal_ratio) % 360;
            mouse_position_data.beta = Math.min(180, Math.max(0, beta - delta_y * vertical_ratio)); // vertical angle 0 -> 180
            
            awe.util.update_pov_quaternion( mouse_position_data, current_screen_orientation, zoom, zoom_delta, last_update, mouse_mode );
            ignore_click = true;
          }
          last_x = e.clientX;
          last_y = e.clientY;
        }
      }
      function wheel_handler(e){
        // stop the gesture
        mousedown = false;
      }
    }
    catch(e){
      console.log(e)
    }
  };

  awe.plugins.add([{
    id: 'mouse',
    capabilities: [],
    auto_register: true,
    register:function(plugin_data) {
      if (awe.scene_ready) {
        setup_mouse();
      } else {
        window.addEventListener('scene_ready', setup_mouse);
      }
    },
    unregister: function(plugin_data){
      
    },
    enable: function(){
      console.log('enable mouse')
      enabled = true;
    },
    disable: function(){
      console.log('disable mouse')
      enabled = false;
    },
  }]);

})(window.awe);
