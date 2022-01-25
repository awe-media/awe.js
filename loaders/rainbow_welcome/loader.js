var animation_reset_counter = 0;
var animation_reset_flag = true; 
const animated_colorful_loader = document.querySelector('.text7');

animated_colorful_loader.onanimationend = () => {
   animation_reset_counter++;
   if(animation_reset_counter >= 3){
    //console.log('Animation ended');
    document.querySelector('#inner_loader_content').style.display = "none";
    animation_reset_counter = 0;
     if(animation_reset_flag) {setTimeout(function(){ reset_color_animation(); }, 500);}
  }
};
function reset_color_animation(){
    document.querySelector('#inner_loader_content').style.display = "flex";
}


(async function() { 
  await awe.on_state('ready'); 
  document.getElementById('main_animation_holder').classList.remove('visible_loader');
   animation_reset_flag = false;
})();