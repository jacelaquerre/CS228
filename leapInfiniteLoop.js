var controllerOptions = {};
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var rand = 0;
Leap.loop(controllerOptions, function(frame) {
    clear();
    rand = Math.floor(Math.random() * (1 - (-1) + 1) ) + (-1);
    circle(x + rand, y, 50);
    }

);