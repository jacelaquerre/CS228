const knnClassifier = ml5.KNNClassifier();
let numSamples = train6.shape[0];
var controllerOptions = {};
var trainingCompleted = false;
//var predictedClassLabels = nj.zeros([numSamples]);
var oneFrameOfData = nj.zeros([5, 4, 6]);
var numPredictions = 0;
var accuracy = 0;

Leap.loop(controllerOptions, function(frame) {
        clear();
        HandleFrame(frame);
        if (!trainingCompleted) {
            Train();
            trainingCompleted = true;
        }
    }
);

function HandleFrame(frame) {
    var interactionBox = frame.interactionBox;
    var hand;
    // Check if there is a hand
    if (frame.hands.length > 0) {
        hand = frame.hands[0];
        HandleHand(hand, frame, interactionBox);
        Test();
    }
}

function HandleHand(hand, frame, interactionBox) {
    var finger;
    for(var i = 3; i >= 0; --i) {
        for (var j = 0; j < hand.fingers.length; ++j) {
            finger = hand.fingers[j];
            HandleBone(finger.bones[i], frame, j, i, interactionBox);
        }
    }
}

function HandleBone(bone, frame, fingerIndex, boneIndex, interactionBox) {
    var normalizedPrevJoint = interactionBox.normalizePoint(bone.prevJoint, true);
    var normalizedNextJoint = interactionBox.normalizePoint(bone.nextJoint, true);

    oneFrameOfData.set(fingerIndex, boneIndex, 0, normalizedPrevJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 1, normalizedPrevJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 2, 1);
    oneFrameOfData.set(fingerIndex, boneIndex, 3, normalizedNextJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 4, normalizedNextJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 5, 1);

    // Convert the normalized coordinates to span the canvas
    var canvasX = window.innerWidth * normalizedPrevJoint[0];
    var canvasY = window.innerHeight * (1 - normalizedPrevJoint[1]);
    var canvasPrevX = window.innerWidth * normalizedNextJoint[0];
    var canvasPrevY = window.innerHeight * (1 - normalizedNextJoint[1]);

    if(bone.type === 0) {
        stroke('rgb(220, 220, 220)');
        strokeWeight(10);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
    if (bone.type === 1) {
        //stroke('rbg(192,192,192)');
        strokeWeight(7.5);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
    if (bone.type === 2) {
        stroke('rgb(150, 150, 150)');
        strokeWeight(5);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);

    }
    if (bone.type === 3) {
        stroke('rgb(70, 70, 70)');
        strokeWeight(2.5);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
}


function Train() {
    console.log("I am being trained!")
    for (var i = 0; i < train6.shape[3]; ++i) {
        var features = train6.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        //console.log(features);
        features = train7.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        //console.log(features);
    }
    console.log("Training completed!")
}

function Test() {
    for (var i = 0; i < train6.shape[3]; ++i) {
        var currentTestingSample = oneFrameOfData.pick(null, null, null, i);
        //console.log(oneFrameOfData.toString());
        CenterData();
        currentTestingSample = currentTestingSample.reshape(120).tolist();
        knnClassifier.classify(currentTestingSample, GotResults);
        //console.log(currentTestingSample);
    }
}

function GotResults(err, result) {
    //predictedClassLabels[testingSampleIndex] = parseInt(result.label);
    ++numPredictions;
    accuracy = (((numPredictions - 1) * accuracy) + (result.label == 6)) / numPredictions;
    //console.log(numPredictions, accuracy, parseInt(result.label));
}

function CenterData() {
    xValues = oneFrameOfData.slice([],[],[0,6,3]);
    //console.log(xValues.shape);
    let currentMean = xValues.mean();
    console.log(currentMean);
    var horizontalShift = 0.5 - currentMean;
    for (var i = 0; i < oneFrameOfData.shape[3]; ++i) {
        for (var j = 0; i < oneFrameOfData.shape[3]; ++j) {
            var currentX = oneFrameOfData.get(currentRow, currentColumn, 0);
            var shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 0, shiftedX);
        }
    }
}
