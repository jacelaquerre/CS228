var controllerOptions = {};
var x = window.innerWidth / 2;
var y = window.innerHeight / 2;
var randx = 0;
var randy = 0;
var Hand;
Leap.loop(controllerOptions, function(frame) {
    //clear();
    //randx = Math.floor(Math.random() * (1 - (-1) + 1) ) + (-1);
    //randy = Math.floor(Math.random() * (1 - (-1) + 1) ) + (-1);
    //circle(x + randx, y + randy, 50);
    if (frame.hands.length === 1) {
        //console.log(frame.hands[0]);
        Hand = frame.hands[0];
        //console.log(Hand.fingers);
        for (var i = 0; i < Hand.fingers.length; i++) {
            if (Hand.fingers[i].type === 1) {
                console.log(Hand.fingers[i].tipPosition);
            }
        }
    }
}
);