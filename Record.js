var controllerOptions = {};
var rawXMin = 1000;
var rawXMax = 1;
var rawYMin = 1000;
var rawYMax = 1;
var previousNumHands = 0;
var currentNumHands = 0;
var oneFrameOfData = nj.zeros([5,4,6]);

Leap.loop(controllerOptions, function(frame) {
        currentNumHands = frame.hands.length;
        clear();
        HandleFrame(frame)
        if (currentNumHands === 1 && previousNumHands === 2) {
            RecordData();
        }
        previousNumHands = currentNumHands;
    }
);

function HandleFrame(frame) {
    var hand;
    // Check if there is a hand
    if (frame.hands.length > 0) {
        hand = frame.hands[0];
        HandleHand(hand, frame)
    }
}

function HandleHand(hand, frame) {
    var finger;
    for(var i = 3; i >= 0; i--) {
        for (var j = 0; j < hand.fingers.length; j++) {
            finger = hand.fingers[j];
            HandleBone(finger.bones[i], frame, j, i);
        }
    }
}

function HandleBone(bone, frame, fingerIndex, boneIndex) {
    var baseX = 0;
    var baseY = 0;
    var baseZ = 0;
    var tipX;
    var tipY;
    var tipZ;
    var fingerSum;

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

    fingerSum = baseX + baseY + baseZ + tipX + tipY + tipZ;

    oneFrameOfData.set(fingerIndex, boneIndex, 0, tipX);
    oneFrameOfData.set(fingerIndex, boneIndex, 1, tipY);
    oneFrameOfData.set(fingerIndex, boneIndex, 2, tipZ);

    oneFrameOfData.set(fingerIndex, boneIndex, 3, baseX);
    oneFrameOfData.set(fingerIndex, boneIndex, 4, baseY);
    oneFrameOfData.set(fingerIndex, boneIndex, 5, baseZ);

    if(bone.type === 0) {
        if (frame.hands.length === 1) {
            stroke('rgb(0,210,0)');
        } else {
            stroke('rgb(210,0,0)');
        }
        strokeWeight(10);
        line(baseX, baseY, tipX, tipY);
    }
    if (bone.type === 1) {
        //stroke('rbg(192,192,192)');
        strokeWeight(7);
        line(baseX, baseY, tipX, tipY);
    }
    if (bone.type === 2) {
        if (frame.hands.length === 1) {
            stroke('rgb(0,150,0)');
        } else {
            stroke('rgb(150,0,0)');
        }
        strokeWeight(5);
        line(baseX, baseY, tipX, tipY);

    }
    if (bone.type === 3) {
        if (frame.hands.length === 1) {
            stroke('rgb(0,90,0)');
        } else {
            stroke('rgb(90,0,0)');
        }
        strokeWeight(2.5);
        line(baseX, baseY, tipX, tipY);
    }
}

function TransformCoordinates(x,y) {
    var newX;
    var newY;
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

function RecordData() {
    console.log(oneFrameOfData.toString())
    background(50);
}
