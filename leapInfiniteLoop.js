var controllerOptions = {};
var x = 0;//window.innerWidth / 2;
var y = 0;//window.innerHeight / 2;
var z = 0;

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
        // Check if the finger is an index finger
        finger = hand.fingers[i];
        HandleFinger(finger)
    }
}

function HandleFinger(finger) {
    if (finger.type === 1) {
        x = finger.tipPosition[0];
        y = finger.tipPosition[1];
        z = finger.tipPosition[2];
    }
}