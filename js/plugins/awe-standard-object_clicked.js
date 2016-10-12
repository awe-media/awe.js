(function(awe) {

  var projector,
    ray,
    camera,
    canvas;
  
  var _ready = false;
  var _enabled = false;
  
	awe.plugins.add([{
		id: 'object_clicked',
    auto_register: true,
    enable: function(){
      _enabled = true;
    },
    disable: function(){
      _enabled = false;
    },
		register: function(){
			awe.events.add({
				id: 'click',
				capabilities: ['webgl'],
				register: function(handler) {
					window.addEventListener('click', handler, false);
				},
				unregister: function(handler){
					window.removeEventListener('click', handler, false);
				},
				handler: function(e) {
  				console.log(_enabled, _ready)
					if (!_enabled) {
  					console.log('click plugin disabled');
  					return;
					}
					if (!_ready) {
            projector = new THREE.Projector();
            ray = new THREE.Raycaster();
            camera = awe.pov().get_mesh();
            canvas = awe.renderer().get_canvas();
            _ready = true;
					}
          var settings = awe.util.get_settings('click_handling');
          if (settings.click_handling === undefined || settings.click_handling == true) {
            
            var x = (e.clientX/canvas.clientWidth) * 2 - 1;
            var y = -(e.clientY/canvas.clientHeight) * 2 + 1;
            var mouse_vector = new THREE.Vector3(x, y, 1);
            mouse_vector.unproject(camera); 
            var direction = mouse_vector.sub(camera.position).normalize();
            ray.set(camera.position, direction);
            var intersects = ray.intersectObjects(awe.projections.list({ type:'clickable' }), true);
            if (intersects.length) {
              var mesh = _get_clicked_projection(intersects[0].object);
              if (mesh && mesh.projection_id) {
                intersects[0].projection_id = mesh.projection_id;
                var event = new CustomEvent('object_clicked', { detail:intersects[0] });
                window.dispatchEvent(event);
              }
            }
          }
				}
			});
		},
		unregister: function(){
			awe.events.delete('click');
		}
	}]);
  function _get_clicked_projection(mesh) {
    if (mesh.projection_id == undefined) {
      if (mesh.parent == undefined) {
        return undefined;
      } else {
        return _get_clicked_projection(mesh.parent);
      }
    } else {
      return mesh;
    }
  }
})(window.awe);
