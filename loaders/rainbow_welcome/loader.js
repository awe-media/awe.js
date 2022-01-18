var animation_reset_counter = 0;
const animated_colorful_loader = document.querySelector('.text7');

animated_colorful_loader.onanimationend = () => {
   animation_reset_counter++;
   if(animation_reset_counter >= 3){
    //console.log('Animation ended');
    document.querySelector('#inner_loader_content').style.display = "none";
    animation_reset_counter = 0;
     setTimeout(function(){ reset_color_animation(); }, 500);
  }
};
function reset_color_animation(){
	document.querySelector('#inner_loader_content').style.display = "flex";
}