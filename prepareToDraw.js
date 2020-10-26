let img;
let img_right;
let img_left;
let img_up;
let img_down;
let img_back;
let img_forward;
function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    img = loadImage('https://i.postimg.cc/wTgX5Zsx/Zero.jpg');
    img_right = loadImage('https://i.postimg.cc/4ySr1B05/Arrow-Right.jpg');
    img_left = loadImage('https://i.postimg.cc/tTrfXB9j/Arrow-Left.jpg');
    img_up = loadImage('https://i.postimg.cc/yNsrcMdK/ArrowUp.jpg');
    img_down = loadImage('https://i.postimg.cc/y6b5tpfh/Arrow-Down.jpg');
    img_back = loadImage('https://i.postimg.cc/B6vYw2Hw/Arrow-Backward.jpg');
    img_forward = loadImage('https://i.postimg.cc/SRBgs55w/Arrow-Forward.jpg');
}