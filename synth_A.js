
let breite = 1200;
let hoehe = 600;
let osc;
let button;
let sliderFreq;
let sliderAmp;
let buttonSaw;
let buttonTri;
let buttonSine;
let buttonPlay;
let playing;
let filter, filterFreq, filterRes;
let sliderFilterCutOff;
let sliderFilterRes;
let freq;

waveoffset = 300;

function setup() {
  createCanvas(breite, hoehe);
  osc = new p5.Oscillator(); // set frequency and type
  osc.amp(0.2);
  fft = new p5.FFT();
  filter = new p5.LowPass();
  sliderFreq = createSlider(20,2000,440);
  sliderAmp = createSlider(0.01,2,0.2,0.01);
  sliderFilterCutOff = createSlider(20,10000,1000);
  sliderFilterRes= createSlider(0,100,0);


  buttonTri = createButton('Triangle');
  buttonSaw = createButton('Sawtooth');
  buttonSine = createButton('Sine')
  buttonPlay = createButton('Play/Pause')
  buttonTri.mousePressed(setTri);
  buttonSaw.mousePressed(setSaw);
  buttonSine.mousePressed(setSine);
  buttonPlay.mousePressed(toggleOnOff)

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


function draw() {

  background(255);

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

}


function drawWaveform (waveform){
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < waveform.length; i++) {
    let x = map(i, 0, waveform.length, 0, width);
  //  let x = map(i, 0, 1/freq, 0, width);

    let y = map(waveform[i], -1, 1, height/2, 0)+waveoffset;
    vertex(x, y);
  }
 endShape();

}


function drawSpectrum(spectrum){
  beginShape();
  strokeWeight(1);
  for (let i = 0; i < spectrum.length; i++) {
    let x = map(i, 0, spectrum.length, 0, width);
    let y = map(spectrum[i], 0, 255, height/2, 0);
    vertex(x, y);
  }
 endShape();



}
