var controllerOptions = {};
var previousNumHands = 0;
var currentNumHands = 0;
var numSamples = 2;
var framesOfData = nj.zeros([5, 4, 6, numSamples]);
var currentSample = 0;

Leap.loop(controllerOptions, function(frame) {
        clear();
        currentNumHands = frame.hands.length;
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
    var interactionBox = frame.interactionBox;

    //baseX = bone.nextJoint[0];
    //baseY = bone.nextJoint[1];
    //baseZ = bone.nextJoint[2];
    //[baseX,baseY] = TransformCoordinates(baseX,baseY);
    //baseY = -baseY + (window.innerHeight);
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);
    //console.log(normalizedPrevJoint);
    //console.log(normalizedNextJoint);

    framesOfData.set(fingerIndex, boneIndex, 0, currentSample, normalizedPrevJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 1, currentSample, normalizedPrevJoint[1]);
    framesOfData.set(fingerIndex, boneIndex, 3, currentSample, normalizedNextJoint[0]);
    framesOfData.set(fingerIndex, boneIndex, 4, currentSample, normalizedNextJoint[1]);

    // Convert the normalized coordinates to span the canvas
    var canvasX = window.innerWidth * normalizedPrevJoint[0];
    var canvasY = window.innerHeight * (1 - normalizedPrevJoint[1]);

    //console.log(canvasX);
    //console.log(canvasY);
    var canvasPrevX = window.innerWidth * normalizedNextJoint[0];
    var canvasPrevY = window.innerHeight * (1 - normalizedNextJoint[1]);
    //console.log(canvasX);
    //console.log(canvasY);

    //tipX = bone.prevJoint[0];
    //tipY = bone.prevJoint[1];
    //tipZ = bone.prevJoint[2];
    //[tipX, tipY] = TransformCoordinates(tipX, tipY);
    //tipY = -tipY + (window.innerHeight);


    //fingerSum = baseX + baseY + baseZ + tipX + tipY + tipZ;


    //oneFrameOfData.set(fingerIndex, boneIndex, 2, tipZ);
    //oneFrameOfData.set(fingerIndex, boneIndex, 5, baseZ);

    if(bone.type === 0) {
        if (frame.hands.length === 1) {
            stroke('rgb(0,210,0)');
        } else {
            stroke('rgb(210,0,0)');
        }
        strokeWeight(10);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
    if (bone.type === 1) {
        //stroke('rbg(192,192,192)');
        strokeWeight(7);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
    if (bone.type === 2) {
        if (frame.hands.length === 1) {
            stroke('rgb(0,150,0)');
        } else {
            stroke('rgb(150,0,0)');
        }
        strokeWeight(5);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);

    }
    if (bone.type === 3) {
        if (frame.hands.length === 1) {
            stroke('rgb(0,90,0)');
        } else {
            stroke('rgb(90,0,0)');
        }
        strokeWeight(2.5);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
}

function RecordData() {
    console.log(framesOfData.pick(null,null,null,1).toString());
    background(50);
}
