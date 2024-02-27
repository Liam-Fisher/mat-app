# Pokemon Panner
simple creative project using angular, angular material, firestore, firebase storage, RNBO and the Web Audio API.
check it out [here](https://fun-with-dsp.web.app)

## How it works:

### Load Web Audio

First, you need to click the load button. This will load the RNBO patcher used, as well as enable web audio. 
Clicking "Test", should play a click. Use this to make sure your system volume is at an appropriate level. 

### Select a pokemon

Next, select a pokemon from the table. You can use the "Filter.." input to search by name or index.
Clicking on the loaded pokemon's picture will play the cry. These can be quite loud, so make sure your volume is at an appropriate level.

### Set your parameters

The "count" slider will determine the number of times a cry is played.
The "scale" slider will scale the distance of the motion path.

### Draw a path

Use the canvas (the blank white square) to draw a motion path for your pokemon to follow. 
Click the "create" button to load the path in RNBO, or "clear" to remove it.

### Finally...
Clicking the "play" button will play the cries, filtered through the Web Audio API "PannerNode", as the sound source moves along the path drawn on the canvas.

### Notes
Fair warning, this is not as realistic as I had originally hoped. Most of the pokemon cries are in low resolution buffers, and the PannerNode leaves much to be desired in terms of realism.
To experiment with more realistic 3d sound-in-motion, check out the "HRTF" device in [this repo](https://github.com/Liam-Fisher/MiscM4L) for Ableton Live M4L devices.








