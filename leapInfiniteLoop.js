var controllerOptions = {};
var i = 0;
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var rand = 0;
Leap.loop(controllerOptions, function(frame) {
    console.log(i)
    rand = Math.floor(Math.random() * (1 - (-1) + 1) ) + (-1)
    circle(x + rand, y, 50);

    }
);