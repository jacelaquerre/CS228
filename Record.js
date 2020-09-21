var controllerOptions = {};
var baseX = 0;
var baseY = 0;
var baseZ = 0;
var rawXMin = 1000;
var rawXMax = 1;
var rawYMin = 1000;
var rawYMax = 1;
var newX;
var newY;
var tipX;
var tipY;
var tipZ;

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
    for(var i = 3; i >= 0; i--) {
        for (var j = 0; j < hand.fingers.length; j++) {
            finger = hand.fingers[j];
            //HandleFinger(finger)
            HandleBone(finger.bones[i]);
        }
    }
}

function HandleFinger(finger) {
    var bone;
    for (var i = 0; i < finger.bones.length; i++) {
        bone = finger.bones[i];
        HandleBone(bone);
    }
}

function HandleBone(bone) {
    baseX = bone.nextJoint[0];
    baseY = bone.nextJoint[1];
    baseZ = bone.nextJoint[2];
    [baseX,baseY] = TransformCoordinates(baseX,baseY);
    baseY = -baseY + (window.innerHeight);

    tipX = bone.prevJoint[0];
    tipY = bone.prevJoint[1];
    tipZ = bone.prevJoint[2];
    [tipX, tipY] = TransformCoordinates(tipX, tipY);
    tipY = -tipY + (window.innerHeight);

    if(bone.type === 0) {
        stroke('rgb(220, 220, 220)');
        strokeWeight(10);
        line(baseX, baseY, tipX, tipY);
    }
    if (bone.type === 1) {
        //stroke('rbg(192,192,192)');
        strokeWeight(7.5);
        line(baseX, baseY, tipX, tipY);
    }
    if (bone.type === 2) {
        stroke('rgb(150, 150, 150)');
        strokeWeight(5);
        line(baseX, baseY, tipX, tipY);

    }
    if (bone.type === 3) {
        stroke('rgb(70, 70, 70)');
        strokeWeight(2.5);
        line(baseX, baseY, tipX, tipY);
    }
}

function TransformCoordinates(x,y) {
    if (x < rawXMin) {
        rawXMin = x;
    }
    if (x > rawXMax) {
        rawXMax = x;
    }
    if (y < rawYMin) {
        rawYMin = y;
    }
    if (y > rawYMax) {
        rawYMax = y;
    }

    newX = (((x - rawXMin) * (window.innerWidth)) / (rawXMax - rawXMin));
    newY = (((y - rawYMin) * (window.innerHeight)) / (rawYMax - rawYMin));
    return [newX, newY]
}