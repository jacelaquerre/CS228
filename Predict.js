var frameIndex = 0;
var frameFlag = 0;
function draw() {
    var xStart, xStart2;
    var yStart, yStart2;
    var zStart, zStart2;
    var xEnd, xEnd2;
    var yEnd, yEnd2;
    var zEnd, zEnd2;

    if(frameIndex === 100) {
        frameIndex = 0;
        if (frameFlag === 0) {
            frameFlag = 1;
        } else if (frameFlag === 1) {
            frameFlag = 0;
        }
    }

    clear();
    for (var i = 0; i < 5; ++i) {
        for(var j = 0; j < 4; ++j) {
            xStart = oneFrameOfData.get(i, j, 0)
            yStart = oneFrameOfData.get(i, j, 1)
            zStart = oneFrameOfData.get(i, j, 2)
            xEnd = oneFrameOfData.get(i, j, 3)
            yEnd = oneFrameOfData.get(i, j, 4)
            zEnd = oneFrameOfData.get(i,j,5)

            console.log(xStart);
            console.log(yStart);
            console.log(zStart);
            console.log(xEnd);
            console.log(yEnd);
            console.log(zEnd);
            console.log(xStart, yStart, zStart, xEnd, yEnd, zEnd);

            xStart2 = anotherFrameOfData.get(i, j, 0)
            yStart2 = anotherFrameOfData.get(i, j, 1)
            zStart2 = anotherFrameOfData.get(i, j, 2)
            xEnd2 = anotherFrameOfData.get(i, j, 3)
            yEnd2 = anotherFrameOfData.get(i, j, 4)
            zEnd2 = anotherFrameOfData.get(i, j, 5)

            console.log(xStart2, yStart2, zStart2, xEnd2, yEnd2, zEnd2);
            if(frameFlag % 2 === 0) {
                line(xStart, yStart, xEnd, yEnd);
            } else {
                line(xStart2, yStart2, xEnd2, yEnd2);
            }
        }
    }
    ++frameIndex;
}