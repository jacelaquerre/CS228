var oneFrameOfData = nj.array([[[  694.56482,  646.73065,    151.746,  694.56482,  646.73065,    151.746],
    [  694.56482,  646.73065,    151.746,  498.20395,  465.13695,    119.606],
    [  498.20395,  465.13695,    119.606,  418.94097,  372.05463,    91.7985],
    [  418.94097,  372.05463,    91.7985,   403.0523,  332.63079,    70.6445]],
    [[  797.12888,  505.24427,    152.205,  666.44157,  230.61062,    95.4631],
        [  666.44157,  230.61062,    95.4631,  571.79418,  128.48059,    59.4421],
        [  571.79418,  128.48059,    59.4421,  503.10788,  173.18553,    39.3787],
        [  503.10788,  173.18553,    39.3787,  457.20798,  253.00625,     28.525]],
    [[   884.0961,  505.19326,    148.428,  827.12888,  257.78513,    91.9345],
        [  827.12888,  257.78513,    91.9345,  775.85367,  150.86053,    49.5638],
        [  775.85367,  150.86053,    49.5638,  700.57828,  195.08679,    25.4021],
        [  700.57828,  195.08679,    25.4021,  638.33195,  272.74956,    13.1922]],
    [[  967.27533,  528.57291,    144.578,  982.89704,  325.41146,    92.2275],
        [  982.89704,  325.41146,    92.2275,  959.12375,  231.18346,    52.4244],
        [  959.12375,  231.18346,    52.4244,  890.94813,  268.61413,    28.4919],
        [  890.94813,  268.61413,    28.4919,  826.26867,  338.50042,     15.867]],
    [[ 1033.23588,  601.99903,    139.992, 1110.54274,   420.0475,    92.0811],
        [ 1110.54274,   420.0475,    92.0811, 1141.44785,  339.95213,    60.9523],
        [ 1141.44785,  339.95213,    60.9523, 1109.02755,  348.76443,    43.1955],
        [ 1109.02755,  348.76443,    43.1955, 1051.44224,   391.6096,    29.8857]]]);

var frameIndex = 0;
var frameFlag = 0;
function draw() {
    var xStart;
    var yStart;
    var zStart;
    var xEnd;
    var yEnd;
    var zEnd;

    if(frameIndex === 100) {
        frameIndex = 0;
        //if (frameFlag === 0) {
        //    frameFlag = 1;
        //} else if (frameFlag === 1) {
        //    frameFlag = 0;
        //}
    }

    clear();
    for (var i = 0; i < 5; ++i) {
        for(var j = 0; j < 4; ++j) {

            xStart = window.innerWidth * oneFrameOfData.get(i, j, 0);
            yStart = window.innerHeight * (1 - oneFrameOfData.get(i, j, 1));
            xEnd = window.innerWidth * oneFrameOfData.get(i, j, 3);
            yEnd = window.innerHeight * (1 - oneFrameOfData.get(i, j, 4));
            //xStart = oneFrameOfData.get(i, j, 0)
            //yStart = oneFrameOfData.get(i, j, 1)
            //zStart = oneFrameOfData.get(i, j, 2)
            //xEnd = oneFrameOfData.get(i, j, 3)
            //yEnd = oneFrameOfData.get(i, j, 4)
            //zEnd = oneFrameOfData.get(i,j,5)

            //console.log(xStart);
            //console.log(yStart);
            //console.log(zStart);
            //console.log(xEnd);
            //console.log(yEnd);
            //console.log(zEnd);
            //console.log(xStart, yStart, zStart, xEnd, yEnd, zEnd);

            //if(frameFlag % 2 === 0) {
            line(xStart, yStart, xEnd, yEnd);
            //} else {
                //line(xStart2, yStart2, xEnd2, yEnd2);
            //}
        }
    }
    ++frameIndex;
}
