const knnClassifier = ml5.KNNClassifier();
let numSamples = train6Bongard.shape[0];
var controllerOptions = {};
var trainingCompleted = false;
var oneFrameOfData = nj.zeros([5, 4, 6]);
var numPredictions = 0;
var accuracy = 0;
//0 = the program is waiting to see the user’s hand.
//1 = the user’s hand is present but not centered.
//2 = the user’s hand is present and centered.
var programState = 0;
var timeSinceLastDigitChange = new Date();
// We are creating a dictionary that will keep track of users accuracy for each digit
// and the number of predictions for each digit
var dict = { "0" : 0 ,
    "0num" : 0 ,
    "1" : 0 ,
    "1num" : 0 ,
    "2" : 0 ,
    "2num" : 0 ,
    "3" : 0 ,
    "3num" : 0 ,
    "4" : 0 ,
    "4num" : 0 ,
    "5" : 0 ,
    "5num" : 0 ,
    "6" : 0 ,
    "6num" : 0 ,
    "7" : 0 ,
    "7num" : 0 ,
    "8" : 0 ,
    "8num" : 0 ,
    "9" : 0 ,
    "9num" : 0 ,
};
const PROFICIENT_ACCURACY = .70;

function SignIn() {
    var username = document.getElementById('username').value;
    var list = document.getElementById('users');
    if (IsNewUser(username, list))  {
        CreateNewUser(username,list);
    } else {
        CreateSignInItem(username,list);
    }
    console.log(list.innerHTML);
    return false;
}

function IsNewUser(username, list) {
    var usernameFound = false
    var users = list.children;
    for(var i = 0; i < users.length; ++i) {
        if (users[i].innerHTML === username) {
            usernameFound = true;
        }
    }
    return (usernameFound === false);
}

function CreateNewUser(username,list) {
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
    item = document.createElement('li');
    item.id = String(username) + "_signins";
    item.innerHTML = 1;
    list.appendChild(item);
}

function CreateSignInItem(username, list) {
    var ID = String(username) + "_signins"
    var listItem = document.getElementById(ID);
    listItem.innerHTML = parseInt(listItem.innerHTML) + 1;
}

Leap.loop(controllerOptions, function(frame) {
        clear();
        DetermineState(frame);
        if (programState === 0) {
            HandleState0(frame);
        } else if (programState === 1) {
            HandleState1(frame);
        } else {
            HandleState2(frame);
        }
    }
);

function HandleState0(frame) {
    TrainKNNIfNotDoneYet();
    DrawImageToHelpUserPutTheirHandOverTheDevice();
}

function HandleState1(frame) {
    HandleFrame(frame);
    if (HandIsTooFarToTheLeft()) {
        DrawArrowRight()
    } else if (HandIsTooFarToTheRight()) {
        DrawArrowLeft();
    } else if (HandIsTooFarUp()) {
        DrawArrowDown();
    } else if (HandIsTooFarDown()) {
        DrawArrowUp();
    } else if (HandIsTooForward()) {
        DrawArrowBack();
    } else if (HandIsTooBackward()) {
        DrawArrowForward();
    }
}

function HandleState2(frame) {
    HandleFrame(frame);
    DetermineWhetherToSwitchDigits()
    DrawLowerRightPanel();
    Test();
}

function DrawLowerRightPanel() {

    if (digitToShow === 4) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_4, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_4, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 5) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_5, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_5, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 6) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_6, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_6, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 7) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_7, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_7, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 8) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_8, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_8, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 9) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_9, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_9, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 0) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_0, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_0, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 1) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_1, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_1, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 2) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_2, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_2, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    } else if (digitToShow === 3) {
        if (dict[String(digitToShow)] < PROFICIENT_ACCURACY) {
            image(img_3, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        } else {
            image(num_3, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
        }
    }
}

function DetermineWhetherToSwitchDigits() {
    if (TimeToSwitchDigits()) {
        SwitchDigits();
    }
}

function TimeToSwitchDigits() {
    let currentTime = new Date();
    let timeInBetweenInMilliseconds = currentTime - timeSinceLastDigitChange;
    let timeInBetweenInSeconds = timeInBetweenInMilliseconds / 1000;
    if (timeInBetweenInSeconds >= 6) {
        timeSinceLastDigitChange = new Date();
        return true;
    } else {
        return false;
    }
}

function SwitchDigits() {
    if (digitToShow === 4) {
        digitToShow = 5;
        //if (dict[String(digitToShow)] > PROFICIENT_ACCURACY) {
        //    addDigit();
        //}
    } else if (digitToShow === 5) {
        digitToShow = 4;
    }
    numPredictions = 0;
}

function addDigit() {

}

function DetermineState(frame) {
    if (frame.hands.length <= 0) {
        programState = 0;
    } else if (HandIsUncentered()) {
        programState = 1;
    } else {
        programState = 2;
    }
}

function HandIsUncentered() {
    return HandIsTooFarToTheLeft() || HandIsTooFarToTheRight() || HandIsTooFarUp()
        || HandIsTooFarDown() || HandIsTooForward() || HandIsTooBackward();
}

function HandIsTooFarToTheRight() {
    var xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentMean = xValues.mean();
    return currentMean > 0.75;
}

function HandIsTooFarToTheLeft() {
    var xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentMean = xValues.mean();
    return currentMean < 0.25;
}

function HandIsTooFarUp() {
    var yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMean = yValues.mean();
    return currentMean > 0.75;
}

function HandIsTooFarDown() {
    var yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMean = yValues.mean();
    return currentMean < 0.25;
}

function HandIsTooForward() {
    var zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentMean = zValues.mean();
    return currentMean < 0.25;
}

function HandIsTooBackward() {
    var zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentMean = zValues.mean();
    return currentMean > 0.75;
}

function DrawArrowRight() {
    image(img_right, window.innerWidth/2, 0, 600, 400);
}

function DrawArrowLeft() {
    image(img_left, window.innerWidth/2, 0, 600, 400);
}

function DrawArrowUp() {
    image(img_up, window.innerWidth/2, 0, 600, 400);
}

function DrawArrowDown() {
    image(img_down, window.innerWidth/2, 0, 600, 400);
}

function DrawArrowBack() {
    image(img_back, window.innerWidth/2, 0, 600, 400);
}

function DrawArrowForward() {
    image(img_forward, window.innerWidth/2, 0, 600, 400);
}

function TrainKNNIfNotDoneYet() {
    if (!trainingCompleted) {
        Train();
        trainingCompleted = true;
    }
}
function DrawImageToHelpUserPutTheirHandOverTheDevice() {
    image(img, 0, 0, 600, 400);
}

function HandleFrame(frame) {
    var interactionBox = frame.interactionBox;
    var hand;
    // Check if there is a hand
    if (frame.hands.length > 0) {
        hand = frame.hands[0];
        HandleHand(hand, frame, interactionBox);
    }
}

function HandleHand(hand, frame, interactionBox) {
    var finger;
    for (var i = 3; i >= 0; --i) {
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
    oneFrameOfData.set(fingerIndex, boneIndex, 2, normalizedPrevJoint[2]);
    oneFrameOfData.set(fingerIndex, boneIndex, 3, normalizedNextJoint[0]);
    oneFrameOfData.set(fingerIndex, boneIndex, 4, normalizedNextJoint[1]);
    oneFrameOfData.set(fingerIndex, boneIndex, 5, normalizedNextJoint[2]);

    // Convert the normalized coordinates to span the canvas
    var canvasX = (window.innerWidth / 2) * normalizedPrevJoint[0];
    var canvasY = (window.innerHeight / 2) * (1 - normalizedPrevJoint[1]);
    var canvasPrevX = (window.innerWidth / 2) * normalizedNextJoint[0];
    var canvasPrevY = (window.innerHeight / 2) * (1 - normalizedNextJoint[1]);

    var green = accuracy * 255;
    var red = (1 - accuracy) * 255;
    if (bone.type === 0) {
        stroke(red, green, 0);
        strokeWeight(20);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
    if (bone.type === 1) {
        //stroke('rbg(192,192,192)');
        strokeWeight(15);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
    if (bone.type === 2) {
        stroke(red, green, 0);
        strokeWeight(10);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);

    }
    if (bone.type === 3) {
        stroke(red, green, 0);
        strokeWeight(5);
        line(canvasX, canvasY, canvasPrevX, canvasPrevY);
    }
}


function Train() {
    console.log("I am being trained!")
    for (var i = 0; i < train6Bongard.shape[3]; ++i) {
        //// 0
        var features = train0Allison.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        //// 1
        features = train1Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1c.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1d.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1e.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1f.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1g.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1h.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        features = train1McLaughlin.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
        //// 2
        features = train2.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        features = train2b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        features = train2Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 2);
        //// 3
        features = train3.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        features = train3b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        features = train3c.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        features = train3Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 3);
        //// 4
        features = train4.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        features = train4b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        features = train4c.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        features = train4Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 4);
        //// 5
        features = train5.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);
        features = train5b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);
        features = train5c.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);
        features = train5Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 5);
        //// 6
        features = train6.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        features = train6b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        features = train6Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        //// 7
        features = train7.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        features = train7b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        features = train7c.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        features = train7Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        //// 8
        features = train8Goldman.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        features = train8Bonguard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        features = train8.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        features = train8b.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        features = train8c.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 8);
        //// 9
        features = train9Bongard.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);
        features = train9.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 9);

        //console.log(features);
    }
    console.log("Training completed!")
}

function Test() {
    var currentTestingSample = oneFrameOfData.pick(null, null, null, 0);
    //console.log(oneFrameOfData.toString());
    CenterData();
    currentTestingSample = currentTestingSample.reshape(120).tolist();
    //console.log(currentTestingSample)
    knnClassifier.classify(currentTestingSample, GotResults);
    //console.log(currentTestingSample);
}

function GotResults(err, result) {
    let numPredForNum = (String(digitToShow) + "num");
    // Get total numPredictions and accuracy for that digit
    numPredictions = dict[numPredForNum] + 1;
    accuracy = dict[String(digitToShow)];
    accuracy = (((numPredictions - 1) * accuracy) + (result.label == digitToShow)) / numPredictions;
    // Set new values for tht num in global dictionary
    dict[numPredForNum] = numPredictions;
    dict[String(digitToShow)] = accuracy;
}

function CenterData() {
    CenterXData();
    CenterYData();
    CenterZData();
}

function CenterXData() {
    var xValues = oneFrameOfData.slice([],[],[0,6,3]);
    //console.log(xValues.shape);
    var currentMean = xValues.mean();
    //console.log(currentMean);
    var horizontalShift = 0.5 - currentMean;
    for (var currentRow = 0; currentRow < 5; ++currentRow) {
        for (var currentColumn = 0; currentColumn < 4; ++currentColumn) {
            var currentX = oneFrameOfData.get(currentRow, currentColumn, 0);
            var shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 0, shiftedX);
            currentX = oneFrameOfData.get(currentRow, currentColumn, 3);
            shiftedX = currentX + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 3, shiftedX);
        }
    }
    var newXValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentMean2 = newXValues.mean();
    //console.log(currentMean2);
}

function CenterYData() {
    var yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMean = yValues.mean();
    //console.log(currentMean);
    var horizontalShift = 0.5 - currentMean;
    for (var currentRow = 0; currentRow < 5; ++currentRow) {
        for (var currentColumn = 0; currentColumn < 4; ++currentColumn) {
            var currentY = oneFrameOfData.get(currentRow, currentColumn, 1);
            var shiftedY = currentY + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 1, shiftedY);
            currentY = oneFrameOfData.get(currentRow, currentColumn, 4);
            shiftedY = currentY + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 4, shiftedY);
        }
    }
    var newYValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMean2 = newYValues.mean();
    //console.log(currentMean2);
}

function CenterZData() {
    var zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentMean = zValues.mean();
    //console.log(currentMean);
    var horizontalShift = 0.5 - currentMean;
    for (var currentRow = 0; currentRow < 5; ++currentRow) {
        for (var currentColumn = 0; currentColumn < 4; ++currentColumn) {
            var currentZ = oneFrameOfData.get(currentRow, currentColumn, 2);
            var shiftedZ = currentZ + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 2, shiftedZ);
            currentZ = oneFrameOfData.get(currentRow, currentColumn, 5);
            shiftedZ = currentZ + horizontalShift;
            oneFrameOfData.set(currentRow, currentColumn, 5, shiftedZ);
        }
    }
    var newZValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentMean2 = newZValues.mean();
    //console.log(currentMean2);
}
