var oneFrameOfData = nj.array([[[ 0.74122, 0.27326,       0, 0.74122, 0.27326,       0],
    [ 0.74122, 0.27326,       0, 0.59963, 0.40349,       0],
    [ 0.59963, 0.40349,       0, 0.51473,   0.489,       0],
    [ 0.51473,   0.489,       0, 0.46355, 0.54457,       0]],
    [[ 0.78792, 0.35642,       0, 0.63323, 0.53891,       0],
        [ 0.63323, 0.53891,       0, 0.53318, 0.59855,       0],
        [ 0.53318, 0.59855,       0,  0.4745, 0.61283,       0],
        [  0.4745, 0.61283,       0, 0.43287, 0.61286,       0]],
    [[ 0.82721,  0.3662,       0, 0.71165, 0.53963,       0],
        [ 0.71165, 0.53963,       0, 0.62686, 0.61658,       0],
        [ 0.62686, 0.61658,       0, 0.56912, 0.64169,       0],
        [ 0.56912, 0.64169,       0, 0.52809, 0.64797,       0]],
    [[ 0.86551, 0.36322,       0, 0.79446, 0.51525,       0],
        [ 0.79446, 0.51525,       0, 0.72498, 0.59496,       0],
        [ 0.72498, 0.59496,       0, 0.67333, 0.62776,       0],
        [ 0.67333, 0.62776,       0, 0.63481, 0.64106,       0]],
    [[ 0.89624, 0.33276,       0, 0.86352, 0.47462,       0],
        [ 0.86352, 0.47462,       0, 0.83364, 0.54659,       0],
        [ 0.83364, 0.54659,       0, 0.81056, 0.57913,       0],
        [ 0.81056, 0.57913,       0, 0.78603, 0.60259,       0]]]);

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
