var eventd = document.querySelector(".eventd");
var intd = document.querySelector(".intd");
var invtd = document.querySelector(".invtd");
var event = document.querySelector(".event");
var int = document.querySelector(".int");
var invt = document.querySelector(".invt");
event.classList.add("none");
int.classList.add("none");
invt.classList.add("none");
eventd.addEventListener("click",function(){
	event.classList.toggle("events");
	event.classList.toggle("none");
})
intd.addEventListener("click",function(){
    int.classList.toggle("events");
	int.classList.toggle("none");
})
invtd.addEventListener("click",function(){
    invt.classList.toggle("events");
	invt.classList.toggle("none");
})