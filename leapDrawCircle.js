var controllerOptions = {};
var x = 0;
var y = 0;
var z = 0;
var rawXMin = 9999;
var rawXMax = 1;
var rawYMin = 999;
var rawYMax = 1;
var newX;
var newY;

Leap.loop(controllerOptions, function(frame) {
    clear();
    HandleFrame(frame)
    if (x < rawXMin) {
        rawXMin = x;
    }
    if (x > rawXMax) {
        rawXMin = x;
    }
    if (y < rawYMin) {
        rawYMin = y;
    }
    if (y > rawYMax) {
        rawYMax = y;
    }

    y = -y + (window.innerHeight)
    newX = (((x - rawXMin) * (window.innerWidth - 0)) / (rawXMax - rawXMin)) + 0
    newY = (((y - rawYMin) * (window.innerHeight - 0)) / (rawYMax - rawYMin)) + 0
    console.log(newY);
    circle(newX, newY, 50);
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
        //y = (-y)
        z = finger.tipPosition[2];
    }
}