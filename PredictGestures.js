const knnClassifier = ml5.KNNClassifier();
let numSamples = irisData.shape[0];
let numFeatures = irisData.shape[1]-1;
var trainingCompleted = false;
var testingSampleIndex = 1;
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
    //knnClassifier.addExample(currentFeatures.tolist(), currentLabel);
    console.log(train0.toString());
}

function Test() {
    //var predictedLabel = knnClassifier.classify(currentFeatures.tolist(), GotResults);
    console.log(test.toString());
}
