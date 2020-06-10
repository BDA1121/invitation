var canvas = document.querySelector("canvas");
canvas.width = 600;
canvas.height = 600;
var back = document.querySelector("#back");
var img = document.querySelector("#img");
var xs = document.querySelector("#x");
var ys = document.querySelector("#y");
var ctx = canvas.getContext('2d');
var running = false;
var x = 0;
var y = 0;
var phot;
 	phot = new Image();
 	phot.src = back.value ;
var phot2;
 	phot2 = new Image();
 	phot2.src = img.value ;
console.log(phot2.src);
power2();
function power2(){
 	ctx.drawImage(phot,0,0,600,600);
 	ctx.drawImage(phot2,x,y,200,200);
 }
canvas.addEventListener('mousemove', function(e) {
  if (!running) {
  ctx.fillRect(0,0,canvas.width,canvas.height);
    x = e.clientX;
    y = e.clientY;
    power2();
	 xs.value = x;
	 ys.value= 600 - y;
  }
});

canvas.addEventListener('click', function(e) {
  if (!running) {
    running = true;
   xs.value = x;
	 ys.value= 600 - y;
  }
	else{
		running = false;
	}
});
