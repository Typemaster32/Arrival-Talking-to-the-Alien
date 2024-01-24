# Arrival (Talking to the Alien)
![image](https://github.com/Typemaster32/Arrival-Talking-to-the-Alien/assets/70934733/a8492416-20d5-47ea-954e-8e2429c23e38)

![image](https://github.com/Typemaster32/Arrival-Talking-to-the-Alien/assets/70934733/eba0bc6a-4835-464c-998c-4ec8ab02c231)

Have you ever watched this movie? Have you ever thinked of a real talk to the alien?

![Arrival_Jiaqi_Yi-20](https://github.com/Typemaster32/Arrival-Talking-to-the-Alien/assets/70934733/2cad2f16-d56f-4a7e-93b1-97a56e29a40b)

![IMG_3510](https://github.com/Typemaster32/Arrival-Talking-to-the-Alien/assets/70934733/06999a28-7ef1-4e7c-aaf5-bf56f67a9ca0)


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
1. Using p5js (https://p5js.org/) to generate the artistic circle language. Check the pure version with only the visual part: https://openprocessing.org/sketch/2121872
2. Using "perlin noise" and "randomGaussian" function to create and randomness of the circle.
3. Adjust the parameters for multiple(enormous) times.
4. Using OpenAI ChatGPT to prepare the conversation.



[5]About:
1. This is the ORIGINAL fantastic movie! https://en.wikipedia.org/wiki/Arrival_(film)
2. This project is one of my generative artworks. You can also take a look at at https://openprocessing.org/user/402229?view=sketches&o=28
3. This project should NEVER be used to make any profit.
