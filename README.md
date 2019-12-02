Handwriting recognition for Malayalam, Tamil
============================================

This is online handwriting recognition and input tool for Malayalam and Tamil

How it works
------------
The core logic of recognition is curve matching. We have a saved version of curvers for each ligatures of Malayalam. This is matches against the curves users are drowing in the writing pad.

Since people write the letters in so many random ways, the curve matching should take care of these variations. Scaling up or down, rotation, distortions in the curve, some amount of flexibility for errors etc. For this kind of curve matching we use https://github.com/chanind/curve-matcher which is a https://en.wikipedia.org/wiki/Procrustes_analysis basd curve matching implementation.

Try out
-------

https://santhoshtr.gitlab.io/hand

Training
--------

To add a shape that is anot already supported, open the application in a desktop browser. Also open the browser debugger. Draw the shape in the pad, and note down the curve representation printed in the console. This representation is array of coordinates. Copy that and add to src/malayalam.json file just like any other entry in that file. Remember to re-build the application and refresh the webpage to see the new shape being recognized.

Building the application
------------------------

After checking out the source code. Run `npm install` to install all dependencies and building tools. Then run `npm run build`. You will see a dist foler created and production ready js library in it.
