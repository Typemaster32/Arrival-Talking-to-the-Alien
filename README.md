# Arrival (Talking to the Alien)
This is my final project for 2023 ITP Winter Show, a generative artwork, a recreation of movie "Arrival". Here users can talk to the alien behind the screen like what they do in the movie. AI translation is accompanied.



[1]To deploy in your machine, here is what you need to prepare:

1. Get an OpenAI API KEY.
  Here's their homepage: https://openai.com/blog/openai-api
  Here's a good tutotial if you don't know where to start: https://www.youtube.com/watch?v=nafDyRsVnXU
  Tips: you'll need a payment method for OpenAI to use that. Each 100 reply costs about 3 cents. 1 dollar would be defenately enough.
2. Get an IDE (VSCode Recommended) https://code.visualstudio.com/
3. In VSCode extension, find "Live Server" and add it.
4. If you don't plan to use VSCode or Live Server, pay attention to the "Go Live" step. Clicking the html file then opening it in a browser is the substitute.
5. Download Node.js https://nodejs.org/en



[2]Let's go!!!

1. Download the whole package through Code -> Download ZIP.
2. Unzip.
3. Use your IDE, open the unziped folder.
4. Open the terminal of your IDE. If you're a MacOS & VSCode user, press " ` + shift + control ".
5. Type "npm install", then press enter (Windows) / return (MacOS).
6. Type "node server.js", then press enter (Windows) / return (MacOS).
7. Create a file named ".env". Paste: "OPENAI_API_KEY=", and fill your own OpenAI API KEY behind "=". (This file is going to be offline, so feel safe to do it!)
8. Click "Go Live" at the buttom. (If you don't plan to use VSCode or Live Server, click the html file then open it in a browser)

And if everything's well, you should be now starting with the project.



[3]How to interact?
1. Type your own question below, press enter (Windows) / return (MacOS) to ask.
2. Or, click own the three questions prepared. They also refresh.
3. The answer is given in the center of the screen. It comes with an AI translation below.



[4]How did I make it?
1. Using p5js (https://p5js.org/) to generate the artistic circle language. Check the pure version: https://openprocessing.org/sketch/2121872
2. Using "perlin noise" and "randomGaussian" function to create and randomness of the circle.
3. Adjust multiple(enormous) times.
4. Using OpenAI ChatGPT to prepare the conversation.
