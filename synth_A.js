
let breite = 1200;
let hoehe = 600;
let osc;
var sliderFreq;
var sliderAmp;
var buttonSaw;
var buttonTri;
var buttonSine;
var buttonPlay;
var buttonSquare;

let playing;
let filter, filterFreq, filterRes;
var sliderFilterCutOff;
var sliderFilterRes;
let freq;
let trigger;

var waveoffset = 300;

offsetBorder = 30;


function setup() {

  createCanvas(breite, hoehe);

  osc = new p5.Oscillator();
  osc.amp(0.2);
  fft = new p5.FFT();
  filter = new p5.LowPass();
  sliderAmp = createSlider(0.01,2,0.2,0.01);
  sliderFreq = createSlider(20,2000,440);
  sliderFilterCutOff = createSlider(20,10000,1000);
  sliderFilterRes= createSlider(0,100,0);


  buttonTri = createButton('Triangle');
  buttonSaw = createButton('Sawtooth');
  buttonSine = createButton('Sine');
  buttonPlay = createButton('Play/Pause');
  buttonSquare = createButton('Square');
  buttonTri.mousePressed(setTri);
  buttonSaw.mousePressed(setSaw);
  buttonSine.mousePressed(setSine);
  buttonPlay.mousePressed(toggleOnOff)
  buttonSquare.mousePressed(setSquare);

  osc.disconnect();
  osc.connect(filter);

}

function toggleOnOff(){

  if (playing == 1){
  osc.stop();
  playing = 0;
  }
  else {

  osc.start();
  playing = 1;
  }
}


function setTri (){
osc.setType('triangle')
}

function setSaw(){
osc.setType('sawtooth')
}

function setSine(){
osc.setType('sine')
}

function setSquare(){
osc.setType('square')
}


function draw() {

  background(45+random(1,5), 140+random(1,5), 131+random(1,5));

  let waveform = fft.waveform(); // analyze the waveform
  let spectrum = fft.analyze();
  let freq = sliderFreq.value();
  osc.freq(freq)
  let amp = sliderAmp.value();
  osc.amp(amp);

  // change oscillator frequency based on mouseX
  filter.set(sliderFilterCutOff.value(), sliderFilterRes.value());

  drawWaveform(waveform);
  drawSpectrum(spectrum);
  drawText();
}


function drawWaveform (waveform){
  beginShape();
  strokeWeight(3);
  noFill();
  stroke(109+random(1,4),255+random(1,4),245+random(1,4));
  trigger = 0;
  for (var i = 0; i < waveform.length; i++){

    // find the first point in the waveform buffer
    // where the waveform crosses zero, going in a positive direction
    if ((waveform[i] > 0) && (waveform[i-1] <= 0) && (trigger == 0))
    {
      trigger = 1;
      firstPos = i;
    }
    //once that first positive-going zero crossing is found,
    //start drawing the waveform
    if (trigger == 1)
    {
    	// subtract the offset of the first zero crossing from "i",
      // and use only use an early section of the buffer
      // (in this case, the first third of it, because it will
      // end in different places based on where the zero crossing
      // happened)
      var x = map((i - firstPos), 0, waveform.length, 0+offsetBorder, width-offsetBorder);
    	var y = map(waveform[i], -1, 1, height/2, 0)+waveoffset;
    }
    vertex(x, y);
  }
  endShape();
}


function drawSpectrum(spectrum){
  beginShape();
  strokeWeight(2);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0+offsetBorder, width-offsetBorder);
    let y = map(spectrum[i], 0, 255, height/2, 0);
    vertex(x, y);
  }
 endShape();

}

function drawText(){
    let sliderlength = 140;
    textFont('monospace');
    text('Osc\nVolume', 5 , hoehe-25,);
    text('Osc\nFrequency', sliderlength*1, hoehe-25);
    text('Filter\nCutOff', sliderlength*2, hoehe-25);
    text('Filter\nResonance', sliderlength*3, hoehe-25);


}
