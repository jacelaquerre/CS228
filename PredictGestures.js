const knnClassifier = ml5.KNNClassifier();
let numSamples = train0.shape[0];
let numFeatures = train0.shape[1]-1;
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
    for (var i = 0; i < train0.shape[3]; ++i) {
        var features = train0.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 0);
        console.log(features.toString());
        features = train1.pick(null, null, null, i);
        features = features.reshape(120).tolist();
        knnClassifier.addExample(features, 1);
    }
}

function Test() {
    //var predictedLabel = knnClassifier.classify(currentFeatures.tolist(), GotResults);
    for (var i = 0; i < test.shape[3]; ++i) {
        var currentTestingSample = test.pick(null, null, null, i);
        currentTestingSample = currentTestingSample.reshape(120).tolist();
        var predicted = knnClassifier.classify(currentTestingSample, GotResults);
        console.log(currentTestingSample);
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
