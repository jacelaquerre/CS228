const knnClassifier = ml5.KNNClassifier();
let numSamples = train6Bongard.shape[0];
var controllerOptions = {};
var trainingCompleted = false;
var oneFrameOfData = nj.zeros([5, 4, 6]);
var numPredictions = 0;
var accuracy = 0;
var worstAccuracy = 0;
//0 = the program is waiting to see the user’s hand.
//1 = the user’s hand is present but not centered.
//2 = the user’s hand is present and centered.
var programState = 0;
var timeSinceLastDigitChange = new Date();
// We are creating a dictionary that will keep track of users accuracy for each digit
// and the number of predictions for each digit
var acc_dict = { "0" : 0 ,
    "1" : 0 ,
    "2" : 0 ,
    "3" : 0 ,
    "4" : 0 ,
    "5" : 0 ,
    "6" : 0 ,
    "7" : 0 ,
    "8" : 0 ,
    "9" : 0
};

var num_prediction_dict = { "0" : 0 ,
    "1" : 0 ,
    "2" : 0 ,
    "3" : 0 ,
    "4" : 0 ,
    "5" : 0 ,
    "6" : 0 ,
    "7" : 0 ,
    "8" : 0 ,
    "9" : 0
};
const PROFICIENT_ACCURACY = .70;
const SHORTER_TIME_ACCURACY = .90;
const MATH_PROBLEMS = false;
var mathHTMLCreated = false;
const LEN_MATH_PROBLEM_LISTS = 2;
var randomMathProblemIdx = Math.floor(Math.random() * LEN_MATH_PROBLEM_LISTS);
let username = "";
var userList = [];
var comparisonHTMLCreated = false;

function SignIn() {
    username = document.getElementById('username').value;
    var list = document.getElementById('users');
    if (IsNewUser(username, list))  {
        CreateNewUser(username,list);
    } else {
        CreateSignInItem(username, list);
    }
    ResetDictionaries();
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

function CreateNewUser(username, list) {
    var item = document.createElement('li');
    item.id = String(username) + "_name";
    item.innerHTML = String(username);
    list.appendChild(item);
    item = document.createElement('li');
    item.id = String(username) + "_signins";
    item.setAttribute("value", "1");
    item.innerHTML = "1";
    list.appendChild(item);
    // Create accuracy for numbers
    for (var i = 0; i < 10; ++i) {
        item = document.createElement('li');
        item.id = String(username) + String(i) + "_accuracy_curr";
        item.innerHTML = "0";
        item.setAttribute("value", "0");
        list.appendChild(item);
    }
    // Add user to global list
    userList.push(username);
}

function CreateSignInItem(username, list) {
    let ID = String(username) + "_signins";
    let listItem = document.getElementById(ID);
    if (listItem.getAttribute('value') === "1") {
        for (var i = 0; i < 10; ++i) {
            var item = document.createElement('li');
            item.id = String(username) + String(i) + "_accuracy_last";
            let ID = String(username) + String(i) + "_accuracy_curr";
            let listItem = document.getElementById(ID);
            item.innerHTML = listItem.getAttribute('value');
            item.setAttribute("value", listItem.getAttribute('value'));
            list.appendChild(item);
            listItem.innerHTML = "0";
            listItem.setAttribute("value", "0");
        }
    } else {
        for (i = 0; i < 10; ++i) {
            var ID2 = String(username) + String(i) + "_accuracy_curr";
            let listItem2 = document.getElementById(ID2);
            let ID3 = String(username) + String(i) + "_accuracy_last";
            let listItem3 = document.getElementById(ID3);
            listItem3.innerHTML = listItem2.getAttribute('value');
            listItem3.setAttribute("value", String(parseInt(listItem2.getAttribute('value'))));
            listItem3.innerHTML = "0";
            listItem3.setAttribute("value", "0");
        }
    }
    listItem.innerHTML = String(parseInt(listItem.innerHTML) + 1);
    var sign_ins = (parseInt(listItem.getAttribute('value'))) + 1;
    listItem.setAttribute("value", String(sign_ins));
}

function ResetDictionaries() {
    acc_dict = { "0" : 0 ,
        "1" : 0 ,
        "2" : 0 ,
        "3" : 0 ,
        "4" : 0 ,
        "5" : 0 ,
        "6" : 0 ,
        "7" : 0 ,
        "8" : 0 ,
        "9" : 0
    };

    num_prediction_dict = { "0" : 0 ,
        "1" : 0 ,
        "2" : 0 ,
        "3" : 0 ,
        "4" : 0 ,
        "5" : 0 ,
        "6" : 0 ,
        "7" : 0 ,
        "8" : 0 ,
        "9" : 0
    };
}

function UpdateAccuracy(accuracy) {
    var ID = String(username) + String(digitToShow) + "_accuracy_curr";
    var listItem = document.getElementById(ID);
    listItem.innerHTML = String(accuracy);
    listItem.setAttribute("value", String(accuracy));
    if (!comparisonHTMLCreated) {
        DisplaySessionComparisonHTML();
        comparisonHTMLCreated = true;
    }
    ID = String(username) + "_signins";
    listItem = document.getElementById(ID);
    var sign_ins = listItem.getAttribute('value');
    let headerSting = "--- &#127919; ---" + "<br>";
    if (sign_ins > 1) {
        ID = String(username) + String(digitToShow) + "_accuracy_last";
        listItem = document.getElementById(ID);
        var prev_accuracy = listItem.getAttribute('value');
        prev_accuracy = (parseInt(prev_accuracy) * 100).toFixed(2);
        var acc = (accuracy * 100).toFixed(2);
        let currString = "-> " + String(acc) + "%" + "<br>";
        let lastSting = "<- " + String(prev_accuracy) + "%" + "<br>";
        if (prev_accuracy > accuracy) {
            document.getElementById("curr").setAttribute("style", "color:red");
            document.getElementById("last").setAttribute("style", "color:green");
        } else if (prev_accuracy < accuracy) {
            document.getElementById("curr").setAttribute("style", "color:green");
            document.getElementById("last").setAttribute("style", "color:red");
        } else {
            document.getElementById("curr").setAttribute("style", "color:black");
            document.getElementById("last").setAttribute("style", "color:black");
        }
        document.getElementById("header").innerHTML = headerSting;
        document.getElementById("curr").innerHTML = currString;
        document.getElementById("last").innerHTML = lastSting;
    } else {
        var acc = (accuracy * 100).toFixed(2);
        let currString = "->" + String(acc) + "%" + "<br>";
        document.getElementById("curr").setAttribute("style", "color:black");
        document.getElementById("last").setAttribute("style", "color:white");
        document.getElementById("header").innerHTML = headerSting;
        document.getElementById("curr").innerHTML = currString;
    }
    //var table = document.getElementById("usersTable");
    var leaderboard = "--- &#128081; ---" + "<br>" + "\n";
    for (var i = 0; i < userList.length; ++i) {
        ID = userList[i] + String(digitToShow) + "_accuracy_curr";
        var element = document.getElementById(ID);
        var acc2 = element.getAttribute('value');
        var accRound = (acc2 * 100).toFixed(2);
        leaderboard = leaderboard + userList[i] + " - " + String(accRound) + "%" + "<br>" + "\n";
    }
    document.getElementById("usersTable").innerHTML = leaderboard;
}

function DisplaySessionComparisonHTML() {
    var sheet = document.createElement('style')
    sheet.innerHTML = '.resultsContainer {\n' +
        '        position: absolute;\n' +
        '        bottom: '+ String((window.innerHeight / 2) - 400) + ';\n' +
        '        left: '+ 150 + ';\n' +
        '    }';
    document.body.appendChild(sheet);
    sheet = document.createElement('style')
    sheet .innerHTML = '.bottomleft {\n' +
        //'        position: absolute;\n' +
        //'        bottom: '+ String((window.innerHeight / 2) + 400) + ';\n' +
        //'        left: '+ 100 + ';\n' +
        '        display: block;\n' +
        '        font-size: 35px;\n' +
        '    }';
    document.body.appendChild(sheet);
    var container = document.createElement('div');
    container.classList.add("resultsContainer");
    var header = document.createElement('div');
    var curr = document.createElement('div');
    var last = document.createElement('div');
    var usersTable = document.createElement('div');
    header.classList.add("bottomleft");
    header.id = "header";
    curr.classList.add("bottomleft");
    curr.id = "curr";
    last.classList.add("bottomleft");
    last.id = "last";
    usersTable.classList.add("bottomleft");
    usersTable.id = "usersTable"
    container.appendChild(header);
    container.appendChild(curr);
    container.appendChild(last);
    container.appendChild(usersTable);
    document.body.appendChild(container);
}

function GotResults(err, result) {
    // Get total numPredictions and accuracy for that digits
    numPredictions = num_prediction_dict[String(digitToShow)] + 1;
    accuracy = acc_dict[String(digitToShow)];
    accuracy = (((numPredictions - 1) * accuracy) + (result.label == digitToShow)) / numPredictions;
    // Set new values for tht num in global dictionary
    num_prediction_dict[String(digitToShow)] = numPredictions;
    acc_dict[String(digitToShow)] = accuracy;
    if (MATH_PROBLEMS) {
        if (result.label == digitToShow) {
            TimeToSwitchDigits();
            randomMathProblemIdx = Math.floor(Math.random() * LEN_MATH_PROBLEM_LISTS);
        }
    }
    UpdateAccuracy(accuracy);
}

Leap.loop(controllerOptions, function(frame) {
        clear();
        DetermineState(frame);
        if (programState === 0) {
            HandleState0();
        } else if (programState === 1) {
            HandleState1(frame);
        } else {
            HandleState2(frame);
        }
    }
);

function HandleState0() {
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

function createMathHTML() {
    var sheet = document.createElement('style')
    sheet.innerHTML = '.container {\n' +
             '        position: relative;\n' +
             '    }';
    document.body.appendChild(sheet);
    var sheet = document.createElement('style')
    sheet.innerHTML = '.bottomright {\n' +
             '        position: absolute;\n' +
             '        bottom: '+ String(window.innerHeight / 2) + ';\n' +
             '        left: '+ String(window.innerWidth / 2) + ';\n' +
             '        font-size: 100px;\n' +
             '    }';
    document.body.appendChild(sheet);
    var container = document.createElement('div');
    container.classList.add("container");
    var mathProb = document.createElement('div');
    mathProb.classList.add("bottomright");
    mathProb.id = "math";
    container.appendChild(mathProb);
    document.body.appendChild(container);
}

function DrawLowerRightPanel() {
    var digitAccuracy = acc_dict[String(digitToShow)];
    var mathProblem = "";
    if (MATH_PROBLEMS) {
        if (!mathHTMLCreated) {
            createMathHTML();
            mathHTMLCreated = true;
        }
        if (digitToShow === 4) {
            let mathEquations4 = ["2 x 2 = ?", "12 / 3 = ?"];
            mathProblem = mathEquations4[randomMathProblemIdx];
        } else if (digitToShow === 5) {
            let mathEquations5 = ["3 + 2 = ?", "12 - 7 = ?"];
            mathProblem = mathEquations5[randomMathProblemIdx];
        } else if (digitToShow === 6) {
            let mathEquations6 = ["6 x a = 36, a = ?", "36 / 6 = ?"];
            mathProblem = mathEquations6[randomMathProblemIdx];
        } else if (digitToShow === 7) {
            let mathEquations7 = ["(7 + 21) / 4 = ?", "8 - 1 - 0 = ?"];
            mathProblem = mathEquations7[randomMathProblemIdx];
        } else if (digitToShow === 8) {
            let mathEquations8 = ["8 x a = 64, a = ?", "5 + 3 = ?"];
            mathProblem = mathEquations8[randomMathProblemIdx];
        } else if (digitToShow === 9) {
            let mathEquations9 = ["3 x 3 = ?", "36 - 27 = ?"];
            mathProblem = mathEquations9[randomMathProblemIdx];
        } else if (digitToShow === 0) {
            let mathEquations0 = ["2 x 0 = ?", "(3 + 28) x 0 = ?"];
            mathProblem = mathEquations0[randomMathProblemIdx];
        } else if (digitToShow === 1) {
            let mathEquations1 = ["56 / 56 = ?", "(3 + 3) - 5 = ?"];
            mathProblem = mathEquations1[randomMathProblemIdx];
        } else if (digitToShow === 2) {
            let mathEquations2 = ["12 x a = 24, a = ?", "64 / 32 = ?"];
            mathProblem = mathEquations2[randomMathProblemIdx];
        } else if (digitToShow === 3) {
            let mathEquations3 = ["8 x a = 24, a = ?", "9 / 3 = ?"];
            mathProblem = mathEquations3[randomMathProblemIdx];
        }
        // Add math equation to element
        document.getElementById("math").innerHTML = mathProblem;
    } else {
        if (digitToShow === 4) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_4, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_4, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 5) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_5, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_5, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 6) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_6, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_6, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 7) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_7, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_7, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 8) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_8, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_8, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 9) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_9, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_9, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 0) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_0, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_0, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 1) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_1, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_1, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 2) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_2, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_2, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        } else if (digitToShow === 3) {
            if (digitAccuracy < PROFICIENT_ACCURACY) {
                image(img_3, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            } else {
                image(num_3, window.innerWidth / 2, window.innerHeight / 2, 200, 325);
            }
        }
    }
}

function DetermineWhetherToSwitchDigits() {
    if (MATH_PROBLEMS) {
        SwitchDigits();
    } else {
        if (TimeToSwitchDigits()) {
            SwitchDigits();
        }
    }
}

function TimeToSwitchDigits() {
    const SHORT_TIME = 3;
    const LONG_TIME = 6;
    let currentTime = new Date();
    let timeInBetweenInMilliseconds = currentTime - timeSinceLastDigitChange;
    let timeInBetweenInSeconds = timeInBetweenInMilliseconds / 1000;
    if (acc_dict[String(digitToShow)] >= SHORTER_TIME_ACCURACY) {
        if (timeInBetweenInSeconds >= SHORT_TIME) {
            timeSinceLastDigitChange = new Date();
            return true;
        } else {
            return false;
        }
    } else {
        if (timeInBetweenInSeconds >= LONG_TIME) {
            timeSinceLastDigitChange = new Date();
            return true;
        } else {
            return false;
        }
    }
}

function SwitchDigits() {
    // The next number to do will be the one with the worst accuracy
    var accuracyArray = [];
    var ct = 0;
    for (var key in acc_dict) {
        accuracyArray[ct] = acc_dict[key];
        ++ct;
    }
    worstAccuracy = Math.min.apply(Math, accuracyArray);
    for (key in acc_dict) {
        if (acc_dict[key] <= worstAccuracy) {
            digitToShow = parseInt(key);
            break;
        }
    }
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
    knnClassifier.classify(currentTestingSample, GotResults);
}

function CenterData() {
    CenterXData();
    CenterYData();
    CenterZData();
}

function CenterXData() {
    var xValues = oneFrameOfData.slice([],[],[0,6,3]);
    var currentMean = xValues.mean();
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
}

function CenterYData() {
    var yValues = oneFrameOfData.slice([],[],[1,6,3]);
    var currentMean = yValues.mean();
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
}

function CenterZData() {
    var zValues = oneFrameOfData.slice([],[],[2,6,3]);
    var currentMean = zValues.mean();
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
}
