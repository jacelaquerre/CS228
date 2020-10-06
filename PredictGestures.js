const knnClassifier = ml5.KNNClassifier();
let numSamples = train6.shape[0];
var trainingCompleted = false;
var testingSampleIndex = 0;
var predictedClassLabels = nj.zeros([numSamples]);

function draw() {
    clear();
    if (!trainingCompleted) {
        Train();
        trainingCompleted = true;
    }
    Test();

}

function Train() {
    for (var i = 0; i < train6.shape[3]; ++i) {
        var features = train6.pick(null, null, null, i);
        //console.log(train6.shape[0]-1);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 6);
        //console.log(features.toString());
        features = train7.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 7);
        //console.log(features.toString());
    }
}

function Test() {
    for (var i = 0; i < train6.shape[3]; ++i) {
        var currentTestingSample = test.pick(null, null, null, i);
        currentTestingSample = currentTestingSample.reshape(120).tolist();
        knnClassifier.classify(currentTestingSample, GotResults);
        //console.log(currentTestingSample);
    }
}

function GotResults(err, result) {
    predictedClassLabels[testingSampleIndex] = parseInt(result.label);
    ++testingSampleIndex;
    if (testingSampleIndex > numSamples) {
        testingSampleIndex = 0;
    }
    console.log(parseInt(result.label));
}
