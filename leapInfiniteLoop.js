var controllerOptions = {};
var x = 0;//window.innerWidth / 2;
var y = 0;//window.innerHeight / 2;
var z = 0;
var rawXMin = 999999;
var rawXMax = 1;
var rawYMin = 999999;
var rawYMax = 1;

Leap.loop(controllerOptions, function(frame) {
    clear();
    HandleFrame(frame)
    circle(x, y, 50);
}
);

function HandleFrame(frame) {
    var hand;
    // Check if there is one hand only
    if (frame.hands.length === 1) {
        hand = frame.hands[0];
        HandleHand(hand)
    }
}

function HandleHand(hand) {
    var finger;
    for (var i = 0; i < hand.fingers.length; i++) {
        finger = hand.fingers[i];
        HandleFinger(finger)
    }
}

function HandleFinger(finger) {
    // Check if the finger is an index finger
    if (finger.type === 1) {
        x = finger.tipPosition[0];
        y = finger.tipPosition[1];
        z = finger.tipPosition[2];
    }
}