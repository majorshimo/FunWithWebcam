// import { isContext }  from "vm";

const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');
const redButton = document.querySelector('.redButton');
const rgbButton = document.querySelector('.rgbButton');
const greenScreenButton = document.querySelector('.greenScreenButton');

function getVideo() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false})
        .then(localMediaStream => {
            console.log(localMediaStream);
            video.srcObject = localMediaStream;
            video.play();
        })
        .catch(err => {
            console.error(`OH NO!!!`,err);
        });
}

function paintToCanvas() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with them
        if(redButton.value === "True"){
            pixels = redEffect(pixels);
        }
        if(rgbButton.value === "True"){
            pixels = rgbSplit(pixels);
            ctx.globalAlpha = 0.1
        } else if(greenScreenButton.value === "True"){
            pixels = greenScreen(pixels);
        }
        //put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);
}


/* function paintRedEffect() {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(() => {
        ctx.drawImage(video, 0, 0, width, height);
        //take the pixels out
        let pixels = ctx.getImageData(0, 0, width, height);
        //mess with them
        pixels = redEffect(pixels);
        //put them back
        ctx.putImageData(pixels, 0, 0);

    }, 16);
} */

function greenScreenEffectClick() {
    greenScreenButton.value = "True";
    rgbButton.value = "False"
    redButton.value = "False";
    console.log(redButton.value, rgbButton.value, greenScreenButton.value)
    paintToCanvas();
}


function redEffectClick (){
    redButton.value = "True"
    greenScreenButton.value = "False";
    rgbButton.value = "False";
    console.log(redButton.value, rgbButton.value, greenScreenButton.value)
    paintToCanvas();
}

function rgbEffectClick(){
    redButton.value = "False"
    greenScreenButton.value = "False";
    rgbButton.value = "True";
    console.log(redButton.value, rgbButton.value, greenScreenButton.value)
    paintToCanvas();
}

function takePhoto() {
    //played the sound
    snap.currentTime = 0;
    snap.play();

    //take the data out of the canvas
    const data = canvas.toDataURL('image/jpeg');
    const link = document.createElement('a');
    link.href = data;
    link.setAttribute('download', 'handsome');
    link.innerHTML = `<img src="${data}" alt="Handsome Man" />`
    strip.insertBefore(link, strip.firstChild);

}

function redEffect(pixels){
    for(let i = 0; i < pixels.data.length; i +=4) {
        pixels.data[i + 0] = pixels.data[i + 0] + 50;//red
        pixels.data[i + 1] = pixels.data[i + 1] - 50; // green
        pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //blue
    }
    return pixels;
}

function rgbSplit(pixels) {
    for(let i = 0; i < pixels.data.length; i +=4) {
        pixels.data[i - 150] = pixels.data[i + 0];//red
        pixels.data[i + 500] = pixels.data[i + 1]; // green
        pixels.data[i - 150] = pixels.data[i + 2]; //blue
    }
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};

    document.querySelectorAll('.rgb input').forEach((input) => {
        levels[input.name] = input.value;
    });


    for(let i = 0; i < pixels.data.length; i +=4) {
        red = pixels.data[i + 0];//red
        green = pixels.data[i + 1]; // green
        blue = pixels.data[i + 2]; //blue
        alpha = pixels.data[i + 3];


    if(red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red >= levels.rmax
        && green >= levels.gmax
        && blue >= levels.bmax){
        //if the tone is anywhere between the given values, take it out!
        pixels.data[i + 3] = 0;
        }
    }
    return pixels
}


getVideo();

video.addEventListener('canplay', paintToCanvas);