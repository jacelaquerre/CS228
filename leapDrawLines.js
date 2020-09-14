var controllerOptions = {};
var x = 0;
var y = 0;
var z = 0;
var rawXMin = 1000;
var rawXMax = 1;
var rawYMin = 1000;
var rawYMax = 1;
var newX;
var newY;

Leap.loop(controllerOptions, function(frame) {
        clear();
        HandleFrame(frame)


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
    //for (var i = 0; i < (hand.fingers).length; i++) {
    //    finger = hand.fingers[i];
    //    HandleFinger(finger)
    //}
}

function HandleFinger(finger) {
    var bone;
    for (var i = 0; i < finger.bones.length; i++) {
        //x = finger.tipPosition[0];
        //y = finger.tipPosition[1];
        //z = finger.tipPosition[2];
        bone = finger.bones[i];
        HandleBone(bone);
        //circle(newX, newY, 50);
    }
}

function HandleBone(bone) {
    x = bone.nextJoint[0];
    y = bone.nextJoint[1];
    z = bone.nextJoint[2];

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
    newX = (((x - rawXMin) * (window.innerWidth)) / (rawXMax - rawXMin))
    newY = (((y - rawYMin) * (window.innerHeight)) / (rawYMax - rawYMin))


    circle(newX, newY, 50);
}
