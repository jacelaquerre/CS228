var controllerOptions = {};
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var randx = 0;
var randy = 0;
Leap.loop(controllerOptions, function(frame) {
    clear();
    randx = Math.floor(Math.random() * (1 - (-1) + 1) ) + (-1);
    randy = Math.floor(Math.random() * (1 - (-1) + 1) ) + (-1);
    circle(x + randx, y + randy, 50);
    }

);