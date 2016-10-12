

// BEGIN FILE:  awe-loader.js file
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
  var ID_FIELD = "id";
  var this_awe;
  var _audio_context;
  
  
  function awe_v8_item(data, v8_datastore){
    
    var datastore;
    var data;

    this.setup = function(initial_data){
      // do we validate fields in any way?
      data = initial_data; //_clone(initial_data);
      this[ID_FIELD] = initial_data[ID_FIELD]
    };
    this._get_datastore = function(){
      return datastore;
    };
    this._get_data = function(){
      return data
    };
    this._get_data_value = function(key){
      return data[key];
    };
    this._set_data_value = function(key, value){
      data[key] = value;
      this._values_updated();
      return true;
    };
    // TBD if we want this
    this.get_data = function(){
      return data
    };
    
    try {
      if (!data) {
        throw 'Please provide item data';
      }
      if (!v8_datastore) {
        throw 'Please provide a v8_datastore this item belongs to';
      }
      if (v8_datastore+'' != 'awe_v8_object') {
        throw 'Please provide a valid v8_datastore this item belongs to';
      }
      datastore = v8_datastore;
      this.setup(data)
    }
    catch(e) {
      console.error(e);
    }
    
    return this;
  }
  
  awe_v8_item.prototype.constructor = awe_v8_item;
  awe_v8_item.prototype.toString = function(){
    var id = this._get_data_value(ID_FIELD)
    return this.constructor.name+' - '+ID_FIELD+': '+id;
  }
  awe_v8_item.prototype.update = function(data){
    var datastore = this._get_datastore();
    datastore.update({
      data: data,
      where: { id: this[ID_FIELD] }
    });
  };
  awe_v8_item.prototype._values_updated = function(){};
  
  // TBD if we keep this
  awe_v8_item.prototype.private_properties = [ID_FIELD];
  
  /// awe base object class
  function awe_object(data, datastore){
    awe_v8_item.call(this, data, datastore);
  }
  awe_object.prototype = Object.create(awe_v8_item.prototype);
  awe_object.prototype.constructor = awe_object;
  awe_object.prototype.toString = function(){
    var id = this._get_data_value(ID_FIELD)
    return this.constructor.name+' '+id+': '+this._get_data_value('value');
  };
  // value getter & setter
  awe_object.prototype.value = function(val){
    if (arguments.length) {
      this._set_data_value('value', val);
    }
    return this._get_data_value('value');
  };
  
  
  // awe_capability class
  function awe_capability(data, datastore){
    awe_object.call(this, data, datastore);
  }
  awe_capability.prototype = Object.create(awe_object.prototype);
  awe_capability.prototype.constructor = awe_capability;

  // awe_setting class
  function awe_setting(data, datastore){
    awe_object.call(this, data, datastore);
  }
  awe_setting.prototype = Object.create(awe_object.prototype);
  awe_setting.prototype.constructor = awe_setting;
  

  // awe_event class
  function awe_event(data, datastore){
    data._register = data.register;
    data._unregister = data.unregister;
    this.registered = false;
    awe_object.call(this, data, datastore);
    this.register();
  }
  awe_event.prototype = Object.create(awe_object.prototype);
  awe_event.prototype.constructor = awe_event;
  awe_event.prototype.register = function(){
    if (this.registered) {
      return;
    }
    var device_types = this._get_data_value('device_types');
    
    if (!device_types || Object.keys(device_types).length == 0 || device_types[this_awe.device_type()]) {
      
      var f = this._get_data_value('_register');
      var handler = this._get_data_value('handler');
      if (f && typeof(f) == 'function') {
        f.call(this, handler);
        this.registered = true;
      }
    }
  };
  awe_event.prototype.unregister = function(){
    if (!this.registered) {
      return;
    }
    var f = this._get_data_value('_unregister');
    var handler = this._get_data_value('handler');
    if (f && typeof(f) == 'function') {
      f.call(this, handler);
      this.registered = false;
    }
  };

  
  
  
  // awe_plugin class
  function awe_plugin(data, datastore){
    data._register = data.register;
    data._unregister = data.unregister;
    data._enable = data.enable;
    data._disable = data.disable;
    awe_object.call(this, data, datastore);
    this.registered = false;
    this.enabled = false;

    if (data.api) {
      // expose the api 
      var self = this;
      Object.keys(data.api).forEach(function(key, val){
        if (typeof data.api[key] == 'function' && !self[key]) {
          self[key] = data.api[key];
        }
      });
    }
    if (data.auto_register === undefined || data.auto_register == true) {
      this.register(data.data);
    }
  }
  awe_plugin.prototype = Object.create(awe_object.prototype);
  awe_plugin.prototype.constructor = awe_plugin;
  awe_plugin.prototype.register = function(){
    if (this.registered) {
      return;
    }
    var f = this._get_data_value('_register');
    if (f && typeof(f) == 'function') {
      f.call(this);
      this.registered = true;
    }
  };
  awe_plugin.prototype.unregister = function(){
    if (!this.registered) {
      return;
    }
    var f = this._get_data_value('_unregister');
    if (f && typeof(f) == 'function') {
      f.call(this);
      this.registered = false;
    }
  };
  awe_plugin.prototype.enable = function(){
    if (this.enabled) {
      return;
    }
    var f = this._get_data_value('_enable');
    if (f && typeof(f) == 'function') {
      f.call(this);
      this.enabled = true;
    }
  };
  awe_plugin.prototype.disable = function(){
    if (!this.enabled) {
      return;
    }
    var f = this._get_data_value('_disable');
    if (f && typeof(f) == 'function') {
      f.call(this);
      this.enabled = false;
    }
  };
  
  
  
  function _verify_view_config(config) {
    return {
      pois: config && Array.isArray(config.pois) ? config.pois : [],
      projections: config && Array.isArray(config.projections) ? config.projections : [],
      povs: config && Object.prototype.toString.call(config.povs) ? config.povs : {},
      lights: config && Array.isArray(config.lights) ? config.lights : []
    };
  }
  // awe_view class
  function awe_view(data, datastore){
    var self = this;
    var data_load_handler = data.load_handler;
    var data_unload_handler = data.unload_handler;
    
    delete(data.unload_handler);
    delete(data.load_handler);
    
    var load_handler = function(){
      self.pre_load_handler.apply(self, arguments);
      if (data_load_handler && typeof(data_load_handler) == 'function') {
        data_load_handler.apply(self, arguments);
      }
      self.post_load_handler.apply(self, arguments);
    }
    var unload_handler = function(){
      self.pre_unload_handler.apply(self, arguments);
      if (data_unload_handler && typeof(data_unload_handler) == 'function') {
        data_unload_handler.apply(self, arguments);
      }
      self.post_unload_handler.apply(self, arguments);
    }
    data.load_handler = load_handler;
    data.unload_handler = unload_handler;
    
    awe_object.call(this, data, datastore);
    this.config = _verify_view_config(data.config);
  }
  awe_view.prototype = Object.create(awe_object.prototype);
  awe_view.prototype.constructor = awe_view;
  // default config structure
  awe_view.prototype.handler_data = {};
  awe_view.prototype.config = {
    
    pois: [/* $id1, $id2, ... */],           // just ids or full object config ??? 
    projections: [],    // I'm more towards the IDs-only option 
    lights: [],         // we can store the scene objects config elsewhere
    povs: []            // and then either just show poi on view load or add if not in scene yet, but object config exists 
    
  }
  
  awe_view.prototype.pre_load_handler = function(){
    console.log('pre_load_handler', this.name)
  };
  awe_view.prototype.post_load_handler = function(){
    console.log('post_load_handler', this.name)
  };
  awe_view.prototype.pre_unload_handler = function(){
    console.log('pre_unload_handler', this.name)
  };
  awe_view.prototype.post_unload_handler = function(){
    console.log('post_unload_handler', this.name)
  };
  
  awe_view.prototype.get_config = function(){
    return this._get_data_value('config');
  };
  awe_view.prototype.get_title = function(){
    return this._get_data_value('title');
  };
  awe_view.prototype.get_handler_data = function(){
    return this._get_data_value('handler_data');
  };
  awe_view.prototype.load = function(){
    var load_handler = this._get_data_value('load_handler');
    var config = this.get_config();
    var self = this;
    var object_types = ['poi','light','pov','projection'];
    object_types.forEach(function(type){
      var all_objects = this_awe[type+'s'].list();
      var view_objects = Array.isArray(config[type+'s']) ? config[type+'s'] : [];
      all_objects.forEach(function(object){
        if (object.update) { 
          object.update({
            visible: view_objects.indexOf(object.id) != -1
          });
        }
        else {
          console.log('not yet an awe object', object)
        }
      });
    });
    
    if (load_handler && typeof(load_handler)) {
      // load_handler needs to be promise-like function
      return new Promise(function(resolve, reject){
        load_handler.call(self, resolve, reject);
      });
    }
    // resolve immediately
    return Promise.resolve();
  };
  awe_view.prototype.unload = function(){
    var self = this;
    var unload_handler = this._get_data_value('unload_handler');
    
    if (unload_handler && typeof(unload_handler) == 'function') {
      // unload_handler needs to be promise-like function
      return new Promise(function(resolve, reject){
        unload_handler.call(self, resolve, reject);
      });
    }
    // resolve immediately
    return Promise.resolve();
  };



  if (!window.awe) {
    function awe() {
      var initialized = false;
      var version = {
	      awe: '1.0a'
	     };

      this.constructor.prototype.capabilities = new awe_v8();
      this.constructor.prototype.capabilities._item_constructor = awe_capability;
      this.constructor.prototype.capabilities.add = function(BODY, HEAD) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        if (!Array.isArray(BODY)) {
          BODY = [BODY];
        }
        var self = this,
          result = []
        BODY.forEach(function(item){
          var s = new awe_capability(item, self);
          result.push(s);
        })
        return this.constructor.prototype.add.call(this, result, HEAD); // super
      }
      

      this.constructor.prototype.views = new awe_v8();
      this.constructor.prototype.views._item_constructor = awe_view;
      this.constructor.prototype.views.add = function(BODY, HEAD) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        if (!Array.isArray(BODY)) {
          BODY = [BODY];
        }
        var self = this,
          result = []
        BODY.forEach(function(item){
          var s = new awe_view(item, self);
          s._values_updated();
          result.push(s);
        })
        return this.constructor.prototype.add.call(this, result, HEAD); // super
      }

      this.constructor.prototype.settings = new awe_v8();
      this.constructor.prototype.settings._item_constructor = awe_setting;
      this.constructor.prototype.settings.add = function(BODY, HEAD) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        if (!Array.isArray(BODY)) {
          BODY = [BODY];
        }
        var self = this,
          result = []
        BODY.forEach(function(item){
          var s = new awe_setting(item, self);
          result.push(s);
        })
        return this.constructor.prototype.add.call(this, result, HEAD); // super
      }
      // set default settings
      // NOTE: override this in your code to customize how you want your awe.js app to behave
      
      this.settings.add([
        {
          id: 'debug',
          value: false,
        },
        {
          id: 'geo',
          value:{
            get_location: false,
          }
        },
        {
          id: 'auto_start',
          value: false,
        },
        {
          id: 'renderer',
          value: 'webgl',
        },
        {
          id: 'start_video_stream',
          value: false,
        },
        {
            id: 'fps',
            value: 60,
        },
        {
          id: 'default_lights',
          value: [
            {
              id: 'hemisphere_light',
              type: 'hemisphere',
              color: 0xffffff,
            },
          ],
        },
      ]);

      this.constructor.prototype.events = new awe_v8();
      this.constructor.prototype.events._item_constructor = awe_event;
      this.constructor.prototype.events.add = function(BODY, HEAD) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        if (!Array.isArray(BODY)) {
          BODY = [BODY];
        }
        var self = this,
          result_body = [];
        BODY.forEach(function(item){
          if (!this_awe.events.view(item.id)) {
            // prevent duplicate runs of register() that cannot be later unregister()ed via events.delete()
            var s = new awe_event(item, self);
            result_body.push(s);
          }
        });
        
        return this.constructor.prototype.add.call(this, result_body, HEAD); // super;
      }
      this.constructor.prototype.events.delete = function(BODY, HEAD) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        var event;
        if (typeof BODY == 'string' || typeof BODY == 'number') {
          BODY = { id: BODY };
        }
        if (BODY.id) {
          event = this_awe.events.view(BODY.id);
        }
        if (event) {
          var handler = event._get_data_value('handler');
          event.unregister(handler);
        }
        return this.constructor.prototype.delete.call(this, BODY, HEAD); // super
      }

      this.constructor.prototype.plugins = new awe_v8();
      this.constructor.prototype.plugins._item_constructor = awe_plugin;
      this.constructor.prototype.plugins.add = function(BODY, HEAD) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        if (!Array.isArray(BODY)) {
          BODY = [BODY];
        }
        var self = this,
          result_body = [];
        BODY.forEach(function(item){
          var supported = true;
          if (item.capabilities) {
            var capabilities = _get_capabilities(item.capabilities.join('|'));
            item.capabilities.forEach(function(c){
              if (!capabilities[c]) {
                supported = false;
              }
            });
          }
          if (supported) {
            var s = new awe_plugin(item, self);
            result_body.push(s);
          }
        })
        return this.constructor.prototype.add.call(this, result_body, HEAD); // super
      }
      this.constructor.prototype.plugins.delete = function(BODY, HEAD) {
        if (!BODY) { BODY = {}; }
        if (!HEAD) { HEAD = {}; }
        // tear down plugin
        if (typeof BODY == 'string' || typeof BODY == 'number') {
          BODY = { id: BODY };
        }
        if (BODY.id) {
          plugin = this.plugins.view(BODY.id);
        }
        if (plugin) {
          plugin.unregister(plugin.data);
        }
        return this.constructor.prototype.delete.call(this, BODY, HEAD); // super
      }
    
      this.constructor.prototype.error_handler = function(e, debug) {
        if (debug || this.debug) {
          if (e.code && e.message) {
            console.log('ERROR: '+e.code);
            console.log(e.message);
          }
          else {
            console.log('ERROR');
            console.log(e);
          }
          if (this.debug_verbose > 0) {
            console.log('CALLER');
            console.log(arguments.callee.caller);
          }
          if (this.debug_verbose > 2) {
            console.log(arguments.callee.caller.toString());
          }
        }
      };
      
      this.constructor.prototype.init = function(io) {
        if (initialized) {
          console.log('awe was already initialized.');
          return;
        }
        if (!io) { io = {}; }
        
        
        if (io.settings) {
          for (var key in io.settings) {
            try {
              if (this_awe.settings.view(key) !== undefined) {
                this_awe.settings.update({
                  data: {
                    value: io.settings[key],
                  },
                  where: {
                    id: key,
                  }
                });
              }
              else {
                this_awe.settings.add({
                  id: key,
                  value: io.settings[key],
                });
              }
            }
            catch(e) { /* TODO */ }
          }  
        }
        
        if (this_awe.settings.view('debug')) {
          this.debug = this_awe.settings.view('debug').value();
        }
        else {
          this.debug = true;
        }
        if (this_awe.settings.view('debug_verbose')) {
          this.debug_verbose = this_awe.settings.view('debug_verbose').value();
        }
        else {
          this.debug_verbose = 1;
        }
        if (this_awe.settings.view('capabilities_timeout')) {
          this.capabilities_timeout = this_awe.settings.view('capabilities_timeout').value();
        }
        else {
          this.capabilities_timeout = 5000;
        }

        if (io.device_type !== undefined) {
          if (io.device_type === true) {
            var device_type = 'unsupported';
            var ua = navigator.userAgent;
            if (ua.match(/ipad/i)) {
              device_type = 'ipad';
            } 
            else if (ua.match(/iphone/i)) {
              device_type = 'iphone';
            }
            else if (ua.match(/android/i)) {
              device_type = 'android';
              // NOTE: may differentiate more here
            }
            else if (ua.match(/(win|os x|linux)/i)) {
              device_type = 'pc';
            }
            this_awe.settings.update({ 
              data: { 
                value: device_type 
              }, 
              where: { 
                id: 'device_type' 
              } 
            });
          }
          else {
            this_awe.settings.update({
              data:{
                value: io.device_type,
              },
              where:{
                id: 'device_type',
              }
            });
          }
        }

        this_awe.detect_capabilities(function() {
          var plugins = this_awe.plugins.list();
          for (var i in plugins) {
            plugins[i].register(plugins[i]);
          }
          if (io.ready) {
            try {
              io.ready();
            }
            catch(e) { /* TODO */ }
          }
          var event = new CustomEvent('awe_ready');
          window.dispatchEvent(event);
          if (this_awe.settings.view('auto_start').value()) {
            this_awe.setup_scene();
          }
          initialized = true;
        });
      }; 

      this.constructor.prototype.detect_capabilities = function(done) {
        var io = {},
          asynch_count = 3,
          defaults = {
            ajax : false,      // is ajax supported
            geo : false,       // is geo supported
            lat: undefined,    // only populated once location requested
            lon: undefined,    // only populated once location requested
            gyro : false,      // is orientation supported
            motion : false,    // is motion supported
            audio : false,     // is web audio supported
            gum: false,        // is camera/microphone access supported 
            webgl: false,      // is webgl supported
            css3d: false,      // is css3d supported
            storage : false,   // is local storage supported
            sockets : false,   // are web sockets supported
            touch : false      // touch events supported
          };
          
        var finished = function() {
          asynch_count--;
          if (asynch_count === 0) {
            var io_array = [];
            for (prop in io) {
              io_array.push({ id:prop, value:io[prop] });
            }
            this_awe.capabilities.add(io_array);
            if (done && typeof(done) == 'function') {
              done();
            }
          }
        };
        
        for (prop in defaults) {
          if (!io[prop]) {
            io[prop] = defaults[prop];
          }
        }

        // services (ajax) enabled
        if (!!window.XMLHttpRequest || !!window.XMLHttpRequest2) {
          io.ajax = true;
        }

        // geo enabled
        if (!!navigator.geolocation) {
          io.geo = true;
          var geo = this_awe.settings.view('geo');
          var get_location = this_awe.settings.view('geo.get_location');
          if (geo && geo.value()) {
            if (get_location && get_location.value()) {
              navigator.geolocation.getCurrentPosition(function(position) {
                this_awe.capabilities.update({ data: { value: position.coords.latitude }, where: { id: 'lat' } });
                this_awe.capabilities.update({ data: { value: position.coords.longitude }, where: { id: 'lon' } });
              });
            }
          }
        }
        // orientation enabled
        if (!!window.DeviceOrientationEvent) {
          var s1 = function(e) {
            if (e.alpha !== null) {
              io.gyro = true;
            }
            window.removeEventListener('deviceorientation', s1, true);
            finished();
          }
          window.addEventListener('deviceorientation', s1, true);
          // in case event handler never returns - eg. on a pc
          setTimeout(function() {
            if (!io.gyro) {
              finished();
            }
          }, this_awe.capabilities_timeout);
        }
        else {
          finished();
        }

        // motion enabled
        if (!!window.DeviceMotionEvent) {
          var s2 = function(e) {
            if (e.acceleration !== null) {
              io.motion = true;
            }
            window.removeEventListener('devicemotion', s2, true);
            finished();
          }
          window.addEventListener('devicemotion', s2, true);
          // in case event handler never returns - eg. on a pc
          setTimeout(function() {
            if (!io.motion) {
              finished();
            }
          }, this_awe.capabilities_timeout);
        }
        else {
          finished();
        }

        // getUserMedia microphone & camera access enabled
        if (this_awe.util.get_user_media) {
          io.gum = true;
        }

        // web audio enabled 
        if (!!window.AudioContext) {
          _audio_context = new AudioContext();
        }
        else if (!!window.webkitAudioContext) {
          _audio_context = new webkitAudioContext();
        }
        if (_audio_context) {
          io.audio = true;
          this_awe.util.audio_context = _audio_context;
        }

        // webgl enabled
        if (!!document.createElement('canvas').getContext('experimental-webgl') || !!document.createElement('canvas').getContext('webgl')) {
          io.webgl = true;
        }
        
        var tmp_div = document.createElement('div');
        if (tmp_div.style.WebkitTransformStyle) {
          tmp_div.style.WebkitTransformStyle = 'preserve-3d';
          if (tmp_div.style.WebkitTransformStyle == 'preserve-3d') {
            io.css3d = true;
          }
        }
        else if (tmp_div.style.transformStyle) {
          tmp_div.style.transformStyle = 'preserve-3d';
          if (tmp_div.style.transformStyle == 'preserve-3d') {
            io.css3d = true;
          }
        }

        // localstorage enabled
        if (!!window.localStorage) {
          io.storage = true;
        }

        // websockets enabled
        if (!!window.WebSocket || !!window.MozWebSocket || !!window.WebkitWebSocket || !!window.OWebSocket || !!window.msWebSocket || !!window.KhtmlWebSocket) {
          io.sockets = true;
        }
        
        // touch events
        if ('ontouchstart' in window) {
          io.touch = true;
        }

        
        finished();
      };

      this.constructor.prototype.device_type = function() { 
        var device_type;
        try {
          device_type = this.settings.view('device_type').value();
        }
        catch(e) { /* TODO */ };
        return device_type;
      };

      this.constructor.prototype.ready = function() {
        return initialized;
      }
      this.constructor.prototype.version = function() {
        return version;
      }

      return this;
    };
    
    function _reset_load_file_queue() {
      return {
        error_called: false,
        success_called: false,
        queue: [],
        status: {},
      };
    }

    var _load_file_queue = _reset_load_file_queue();
    function _require(io) {
      _load_file_queue = _reset_load_file_queue();
      if (Array.isArray(io)) {
        for (var obj in io) {
          if (io[obj].capabilities && io[obj].files) {
            if (!io[obj].success || typeof io[obj].success !== 'function') {
              io[obj].success = function() { /* TODO */ }
            }
            if (!io[obj].error || typeof io[obj].error !== 'function') {
              io[obj].error = function() { console.log('required scripts load failed'); }
            }
            if (Array.isArray(io[obj].capabilities)) {
              var requirements_valid = true;
              for (var test in io[obj].capabilities) {
                var c = this_awe.capabilities.view(io[obj].capabilities[test])
                if (!c || !c.value()) {
                  requirements_valid = false;
                }
              }
              if (requirements_valid) {
                if (Array.isArray(io[obj].files)) {
                  _load_file_queue.queue = io[obj].files;
                  _load_file_queue.success = io[obj].success;
                  _load_file_queue.error = io[obj].error;
                  _process_load_file_queue();
                }
                else {
                  _load_file(
                    'script', 
                    { src: io[obj].files },
                    io[obj].success,
                    io[obj].error
                  );
                } 
                break;
              }
            }
            else {
              throw 'require is not an array';
            }
          }
        }
      }
    }

    function _process_load_file_queue() {
      var is_loading = _is_loading();
      if (is_loading.failed) {
        if (!_load_file_queue.error_called) {
          _load_file_queue.error_called = true;
          try {
            _load_file_queue.error();
          }
          catch(e) { /* TODO */ }
          _load_file_queue = _reset_load_file_queue();
        }
        return;
      }
      else if (!is_loading.loading) {
        if (Array.isArray(_load_file_queue.queue) && _load_file_queue.queue.length > 0) {
          if (Array.isArray(_load_file_queue.queue[0])) {
            for (var f in _load_file_queue.queue[0]) {
              var file = _load_file_queue.queue[0][f];
              _load_file_queue.status[file] = 0
              _load_file(
                'script', 
                { src: file }, 
                function(e) {
                  var file = this.getAttribute("src");
                  _load_file_queue.status[file] = 1;
                  _process_load_file_queue();
                },
                function(e) {
                  var file = this.getAttribute("src");
                  _load_file_queue.status[file] = -1;
                  _process_load_file_queue();
                }
              );
            }
            _load_file_queue.queue.splice(0, 1);
          }
          else {
            var file = _load_file_queue.queue[0];
            _load_file_queue.queue.splice(0, 1);
            _load_file_queue.status[file] = 0;
            _load_file(
              'script', 
              { src: file },
              function(e) {
                var file = this.getAttribute("src");
                _load_file_queue.status[file] = 1;
                _process_load_file_queue();
              },
              function(e) {
                var file = this.getAttribute("src");
                _load_file_queue.status[file] = -1;
                _process_load_file_queue();
              }
            );
          }
          var is_loading = _is_loading();
          if (is_loading.failed) {
            if (!_load_file_queue.error_called) {
              _load_file_queue.error_called = true;
              try {
                _load_file_queue.error();
              }
              catch(e) { /* TODO */ }
              _load_file_queue = _reset_load_file_queue();
            }
          }
        }
        else {
          if (!_load_file_queue.success_called) {
            _load_file_queue.success_called = true;
            try {
              _load_file_queue.success();
            }
            catch(e) { /* TODO */ }
            _load_file_queue = _reset_load_file_queue();
          }
        }
      }
    }

    function _is_loading() {
      var loading = false;
      var failed = false;
      for (var f in _load_file_queue.status) {
        if (_load_file_queue.status[f] == -1) {
          failed = true;
        }
        else if (_load_file_queue.status[f] == 0) {
          loading = true;;
        }
      }
      return { loading: loading, failed: failed };
    }

    function _load_file(type, attributes, success, error) {
      try {
        var file = document.createElement(type);
        for (var i in attributes) {
          file.setAttribute(i, attributes[i]);
        }
        if (success && typeof(success) == 'function') {
          file.onload = success;
        }
        if (error && typeof(error) == 'function') {
          file.onerror = error;
        }
        document.querySelector('head').appendChild(file);
      }
      catch(e) { /* TODO */ };
    }
    
    var _get_user_media = undefined, 
      _connect_stream_to_src = function(){},
      _stream_targets = {},
      _disconnect_stream = function(){},
      _get_stream_targets = function(){
        return _stream_targets;
      },
      _random_id = function(){
        return 'stream-target-'+Date.now();
      },
      _disconnect_stream_timeout;
      
    if (navigator.getUserMedia) { // WebRTC 1.0 standard compliant browser
      _get_user_media = navigator.getUserMedia.bind(navigator);
      _connect_stream_to_src = function(media_stream, media_element, identifier) {
        
        media_element.srcObject = media_stream;
        media_element.play();
        if (!identifier) {
          media_element.setAttribute('data-source-id', '_system');
        }
        else {
          media_element.setAttribute('data-source-id', identifier);
          _stream_targets[identifier] = {source: media_stream, target: media_element};
        }
      };
    }
    else if (navigator.mozGetUserMedia) { // early firefox webrtc implementation
      _get_user_media = navigator.mozGetUserMedia.bind(navigator);
      _connect_stream_to_src = function(media_stream, media_element, identifier) {
      
        media_element.mozSrcObject = media_stream;
        media_element.play();
        if (!identifier) {
          media_element.setAttribute('data-source-id', '_system');
        }
        else {
          media_element.setAttribute('data-source-id', identifier);
          _stream_targets[identifier] = {source: media_stream, target: media_element};
        }
      };
    }
    else if (navigator.webkitGetUserMedia) { // early webkit webrtc implementation
      _get_user_media = navigator.webkitGetUserMedia.bind(navigator);
      _connect_stream_to_src = function(media_stream, media_element, identifier) {
        clearTimeout(_disconnect_stream_timeout);
        media_element.src = URL.createObjectURL(media_stream);
        if (!identifier) {
          media_element.setAttribute('data-source-id', '_system');
          if (Object.keys(_stream_targets).length) {
            media_element.play();
          }
        }
        else {
          media_element.setAttribute('data-source-id', identifier);
          _stream_targets[identifier] = {source: media_stream, target: media_element};
          media_element.play();
        }
      };
    }
    _disconnect_stream = function(media_element, identifier){
      try {
        media_element.src = '';
        media_element.pause();
        
        if (_stream_targets[identifier]) {
          delete(_stream_targets[identifier]);
          
          if (!Object.keys(_stream_targets).length) {
            // stop the stream entirely as nothing is listening
            try {
              // TODO - add a timeout so we don't turn it on and off multiple times when switching views and multiple items have visibility changed
              // 1s should be more than enough
              clearTimeout(_disconnect_stream_timeout);
              _disconnect_stream_timeout = setTimeout(function(){
                this_awe.video_streams.delete('default');
              }, 1000);
            }
            catch(e) {
              console.error('awe.video_streams.delete',e)
            }
          }
        }
      }
      catch(e){ console.log('disconnect_stream',e)}
    };

    function _clean_object(object, list_of_keys) {
      var keys = {};
      for (var key in list_of_keys) {
        keys[list_of_keys[key]] = 1;
      }
      for (var key in object) {
        if (!keys[key]) { 
          delete object[key];
        }
      }
      return object;
    }
    function _extend() {
			var src, copy, name, options,
				target = arguments[0] || {},
				i = 1,
				length = arguments.length;
			if (typeof target !== 'object') {
				target = {};
			}
			for (; i < length; i++) {
				if ((options = arguments[ i ]) !== null) {
					for (name in options) {
						src = target[name];
						copy = options[name];
						if (src === copy) {
							continue;
						}
						if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}
			return target;
		}
		    // https://javascriptweblog.wordpress.com/2011/08/08/fixing-the-javascript-typeof-operator/
    function _type(obj){
      return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
    }
    
    function _clone_deep(obj) {
      if (obj === null || typeof obj !== 'object') {
          return obj;
      }
   
      var temp = obj.constructor(); // give temp the original obj's constructor
      for (var key in obj) {
          temp[key] = _clone_deep(obj[key]);
      }
   
      return temp;
    }
    
    function _clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    }

    function _get_settings(ids){
      ids = Array.isArray(ids) ? ids.join('|') : ids;
      var b = {};
      if (ids) {
        b.id = ids
      };
      var settings = {};
      this_awe.settings.list(b).forEach(function(setting){
        settings[setting.id] = setting.value();
      });
      return settings;
    }
    function _get_capabilities(ids){
      ids = Array.isArray(ids) ? ids.join('|') : ids;
      var b = {};
      if (ids) {
        b.id = ids
      };
      var capabilities = {};
      this_awe.capabilities.list(b).forEach(function(capability){
        capabilities[capability.id] = capability.value();
      });
      return capabilities;
    }
    var for_each = Function.prototype.call.bind([].forEach);
		
    var util = {
      get_capabilities: _get_capabilities,
      get_settings: _get_settings,
      require: _require,
      get_user_media: _get_user_media,
      connect_stream_to_src: _connect_stream_to_src,
      disconnect_stream: _disconnect_stream,
      get_stream_targets: _get_stream_targets,
      clean_object: _clean_object,
      extend: _extend ,
      clone: _clone,
      clone_deep: _clone_deep,
      type: _type,
      for_each: for_each
    };
    
    
    window.awe_object = awe_object;
    window.awe = new awe(); 
    this_awe = window.awe;
    this_awe.util = util;
    
    this_awe.AUTO_DETECT_DEVICE_TYPE = true;
  }
    
// END FILE:  awe-loader.js file

})(window);
