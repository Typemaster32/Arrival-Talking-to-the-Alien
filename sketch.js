/*
The TODO List:
1. box should not be diffusioning
2. box should be with tags;
3. answer not shown, 2 instead.
*/

let radius;
let center;
let angNum;
let notchWidth;
/*
Parameters_1: Paramenters that change with the size
*/
let notchMax = 8;
let branchMax = 60;
let branchGaussian = 1.4;
let branchLengthStandard = 60;
let branchCurveness = 6;
let thickness = 2.7;
let enclosingThickness = 0.5;
let wreckleness = 4;
let inkColor;
/*
Parameters_2: Paramenters that are customized
*/
let pixelDens = 1;
/*
Parameters_3: General settings of the canvas
*/
let blurDistance = 0.9;
let noiseScale = 0.015;
let noiseIndex = 0;
/*
Parameters_4: Parameters of motion blurring
*/
let xy_increment = 3;
let z_increment = 0.04;
let unit = 10;
let colorOff = 0;
let z_off;
let noiseDistributionProportionStandard = 0.03;
let threshold = 3;
/*
Parameters_5: The fog and glass effect (as  mask)
*/
let textBox;
let tbWidth = 200;
let tbHeight = 40;
let publicFont = "Arial";
let publicFontSize = 36;
/*
Parameters_6: The Input and Interaction
*/
let minHW;
let maxHW;
let minorSize;
let notchNum;
let notches = [];
let branchNum;
let branches = [];

/*
Parameters_7: Moving the parameters out of setup
*/
let click = false;
let attack = 3000;
let decay = 300;
let sustain = 3500;
let release = 3500;
//in millis
let startingTime = 0;
let aoa = [];
let peak = -0.07;
/*
Parameters_8: The feature of showing up;
*/
let collection = [];
let collectionMarksAlien = [];
let collectionMarksHuman = [];
let numOfCollection = 8;
let wth;
let hght;
let rim = 30;
let graphicsIndex = 0;
let graphicsMax = 24;
let colNum;
let rowNum;
let transfrom;
let scale = 3;
let collectionColor;
let proportionScreen;
let proportionCollection = 4;
let centralOffset;
let projectWidth;
let projectHeight;
let projectMax=16;
let projectOffset;
let startToDisplay = false;
/*
Parameter_9: The collection of the conversation
*/
let questions = [];
let numOfQuestion = numOfCollection;
let locations = [];
// let updated = false;
/*
Parameter_10: The questions raised by users
*/
let mainCanvas;
let otherCanvas;
//

let sizeA;
let sizeB;
let spaceBetween = 12;
let centralTextOffset;
let unifiedY;
let humanNoteWidthMovement=4.5;
//numbers
let chatGPTanswerOriginal;
//JSON
let alien;
let alienNote;
let human;
let humanGivenAnswerAllTogether;
let humanNote;
let possibleA;
let possibleB;
let possibleC;
let orMark;
let slash1;
let slash2;
//P
let humanAskInString = 'This is a test';
let alienAnswerInString;
let translationString;
let wordsAlltogetherInString;
//string
let labels = [];
let predictions = [];
let boundingBoxes = [];
let chatGPTanswerArray = [];
let wordsArray = [];
let humanGivenArray = [];
//[] 
let prefix = 'Now perfrom as an alien. You are going to receive a message, and I need you to reply to the message like you are first to the Earth. Your answer should always be consisted of three different parts: 1.your reaction, 3 ~ 5 different seperated words. 2.  up to three possible questions for human if they see your reaction. 3. from 1 to 20 words of what you really want to say as the alien. Here is the MESSAGE:';
let suffix = ' The MESSAGE is shown as above. now I need you to organaize your answer in one Javascript array of string. and the FIRST element of the array is an child array consisted of your reaction words as elements. the SECOND element is another child array, consisted of your up to three different possible questions for human. the THIRD element is the possible translation. all text elements shoule be in string format. Remember all your answer should be in JSON format.';
let defaultQuestions = [
    "What planet are you from?",
    "How do you communicate in your language?",
    "What is your planet like?",
    "Do you have a concept of music or art?",
    "How long have you known about Earth?",
    "What is your technology like?",
    "Do you eat food similar to us?",
    "Can you breathe our air comfortably?",
    "What is your lifespan?",
    "Have you visited other planets besides Earth?",
    "What is your society's structure?",
    "How do you travel through space?",
    "Do you have any special abilities?",
    "What are your customs and traditions?",
    "How do you perceive time?",
    "Are there other species like you?",
    "What is your form of government?",
    "What do you find most interesting about Earth?",
    "How does your species reproduce?",
    "Do you have religions or belief systems?",
    "What is your perception of the universe?",
    "Have you faced any challenges on Earth?",
    "What motivated you to visit Earth?",
    "How do you handle conflicts in your society?"
]


/*
ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS
ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS
ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS
ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS
ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS
ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS
ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS ALL ABOVE ARE THE PARAMETERS
*/
function setup() {


    for (let i = 0; i < 5; i++) {
        let thisLabel = createP('');
        thisLabel.hide();
        labels.push(thisLabel);
    }
    for (let i = 0; i < 3; i++) {
        let thisPrediction = createP('');
        thisPrediction.hide();
        predictions.push(thisPrediction);
    }
    /* 
    9-0. Prepage Additional Tags and Labels
    */

    textSize(publicFontSize);
    mainCanvas = createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, TOP);
    strokeCap(ROUND);
    angleMode(RADIANS);
    pixelDensity(1);
    strokeWeight(2);
    frameRate(24);
    noiseDetail(2, 0.12);
    push();
    noStroke();
    fill(255, 255, 255);
    rect(0, 0, width, height);
    pop();
    //CAUSION: This White rectangle is a MUST
    inkColor = color(10, 10, 10);
    collectionColor = color(225, 0, 0);
    //QUESTION: Not knowing why "collectionColor" is never applied
    minHW = min(windowWidth, windowHeight);
    maxHW = max(windowWidth, windowHeight);
    wth = width;
    hght = height;
    //QUESTION: Don't know if wth and hght can be deleted
    radius = minHW * 0.27;
    angNum = floor(PI * 4 * 100) + 1;
    center = createVector(width / 2, height / 2);
    notchWidth = floor(random(18, 26));
    for (let i = 0; i < 24; i++) {
        let sticker = createGraphics(windowWidth, windowHeight);
        let stickerMarkAlien = createP('Test Content (A---------------------------)');
        let stickerMarkHuman = createP('Test Content (H---------------------------)');
        collection.push(sticker);
        collectionMarksAlien.push(stickerMarkAlien);
        collectionMarksHuman.push(stickerMarkHuman);
        stickerMarkAlien.hide();
        stickerMarkHuman.hide();
    }
    //Only with this for loop, the collection won't stuck

    /*
    0-1. Setting up all the modes, and definition of colors, radius and center coordinate
    */

    proportionScreen = maxHW / minHW;
    projectWidth = maxHW / proportionCollection;
    projectHeight = minHW / proportionCollection;
    projectOffset = (maxHW / 2 - radius) / proportionCollection;
    projectOffset *= 0.6;
    colNum = floor(maxHW / (projectWidth - projectOffset * 2))
    rowNum = proportionCollection;
    projectMax = colNum * rowNum;
    //   console.log(projectMax);
    centralOffset = (maxHW - colNum * (projectWidth - projectOffset * 2)) / 2;

    /*
    5-1. The basics of projecting the circles to be in collections
    minHW is mostly windowHeight, maxHW is mostly windowWdith;
    rowNum is y-axis acommodation.
    projectMax is the Maximum of the number. 
    */
    alienNote = createP('Test-alienNote');
    alienNote.position(width / 2, height / 2);
    alienNote.style('text-align', 'center');
    alienNote.style('font-size', '18px');
    alienNote.style('left', '50%');
    alienNote.style('top', '50%');
    alienNote.style('transform', 'translate(-50%, -180%)');
    // alienNote.style('width', markWidth + 'px');
    // alienNote.style('word-wrap', 'break-word');
    alienNote.style('font-family', 'Arial');
    alienNote.style('font-style', 'italic');
    alienNote.hide();
    alien = createP('');
    alien.hide();
    alien.position(width / 2, height / 2);
    alien.style('text-align', 'center');
    alien.style('font-size', '18px');
    alien.style('left', '50%');
    alien.style('top', '50%');
    alien.style('transform', 'translate(-50%, -50%)');
    let alienTextWidth = radius * 1.7
    alien.style('width', alienTextWidth + 'px');
    alien.style('word-wrap', 'break-word');
    alien.style('font-family', 'Arial');
    alien.style('font-style', 'italic');
    alien.hide();
    humanNote = createP('Do you have any question?');
    // humanNote.hide();
    // let humanNoteWidth=textWidth()
    humanNote.position(width / 2 - 80, height / 1.08 - 100);
    humanNote.style('text-align', 'center');
    human = createP('Test-human');
    human.hide();

    orMark = createP('OR');
    //circle(width / 2, height / 1.18,100,100)
    orMark.position(width / 2 - 4, height / 1.08 - 40);
    // orMark.style("text-align", "center");
    orMark.style("font-size", "14px");
    orMark.style("color", "FF0000");
    orMark.style('text-align', 'center');
    // orMark.style('font-size', '18px');
    // orMark.style('left', '50%');
    // orMark.style('top', '50%');
    // orMark.style('transform', 'translate(-50%, -50%)');
    textBox = createInput();
    textBox.position(width / 2 - tbWidth / 2, height / 1.08 - tbHeight / 2);
    textBox.size(tbWidth, tbHeight);
    textBox.style("background", "rgba(255, 255, 255, 0)");
    textBox.style("border", "none");
    textBox.style("text-align", "center");
    textBox.style("outline", "none");
    textBox.style("font-size", "16px");
    textBox.style("color", "FF0000");
    textBox.attribute("placeholder", "Type your question here");
    textBox.style("::placeholder", "color: #FF0000; opacity: 1;");
    textBox.elt.focus();
    //
    possibleA = createP('');
    possibleB = createP('');
    possibleC = createP('');
    slash1 = createP('/');
    slash2 = createP('/');
    shuffleABC();
    // possibleA.style("text-align", "center");
    // possibleB.style("text-align", "center");
    // possibleC.style("text-align", "center");

    possibleA.style('text-decoration', 'underline');
    possibleB.style('text-decoration', 'underline');
    possibleC.style('text-decoration', 'underline');
    possibleA.mouseClicked(functionA);
    possibleB.mouseClicked(functionB);
    possibleC.mouseClicked(functionC);
    /*
    9-1. Notes for alien and human words
    */

    let revivalTime = attack + decay + sustain + release + max(attack + decay + sustain + release);
    setInterval(passiveTalk, revivalTime);
    passiveTalk();
}

/*
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP SETUP 
*/


function draw() {
    let timePassed = millis() - startingTime;
    // timePassed HAS TO BE THE FIRST since everything relies on it.
    let lerping = 0;
    let mapping = 0;
    // lerping and mapping together make the diffusion process.
    let noiseDistributionProportion = 0;
    if (aoa.length > 0) {
        noiseDistributionProportion = timePassed / (attack + decay + sustain + release);

        if (timePassed < attack) {
            mapping = map(timePassed, 0, attack, 0.5, peak);
            lerping = mapping;
            alienNote.html('Analyzing...');
            alienNote.show();
            // humanNote.hide();
            // if (timePassed > attack / 2.2) {
            //     // drawBoxes();
            //     alien.show();
            //     alienNote.html('Approximate Translation');
            // }
            // console.log("Attacking");
        } else if (timePassed < attack + decay) {
            lerping = map(timePassed - attack, 0, decay, peak, 0);
            alien.show();
            alienNote.hide();
            alienNote.html('Approximate Translation');
            // drawBoxes();
            // console.log("Decaying");
        } else if (timePassed < attack + decay + sustain) {
            lerping = 0;
            // drawBoxes();
            // console.log("Sustaining");
        } else if (timePassed < attack + decay + sustain + release) {
            lerping = map(timePassed - attack - decay - sustain, 0, release, 0, 0.5);
            // console.log("Releasing");
        } else if (timePassed >= attack + decay + sustain + release) {
            // humanNote.show();
            collect();
            aoa = [];
            startToDisplay = true;
            alienNote.show();
            alienNote.html('I am here.')
            alien.hide();
            // console.log("Finish");

        }
        if (aoa.length > 0) {
            for (let i = 0; i < aoa.length; i++) {
                let pointLerpedA = aoa[i][0].copy();
                let pointLerpedB = aoa[i][1].copy();
                pointLerpedA.lerp(aoa[i][1], lerping);
                pointLerpedB.lerp(aoa[i][0], lerping);
                //QUESTION: not sure if copy() is needed here
                line(pointLerpedA.x, pointLerpedA.y, pointLerpedB.x, pointLerpedB.y);
            }
        }
    }
    /*
    1-1. The Showing Up and Passing Away of Arrival
    (Not quite here. It is also affected by diffusion)
    */
    loadPixels();
    let pixelNum = width * height;
    for (let i = 0; i < pixelNum; i++) {
        let posX = i % width;
        let posY = floor(i / width);
        let colorOff = sin(z_off);
        let noiseVal = noise(
            (posX / width) * xy_increment,
            (posY / height) * xy_increment,
            z_off
        );
        let rNoise = 230 - noiseVal * 194 + colorOff * 10;
        let gNoise = 230 - noiseVal * 184 + colorOff * 12;
        let bNoise = 230 - noiseVal * 186 + colorOff * 16;
        let rArrival = pixels[i * 4];
        let gArrival = pixels[i * 4 + 1];
        let bArrival = pixels[i * 4 + 2];
        // The sets of parameters in pixels, as the starting of the Diffusion

        if (
            rNoise - rArrival >= 15 && timePassed < (attack + decay + sustain + release) && aoa.length > 0
        ) {
            let orientation = random(2 * PI);
            let deltaX = round(cos(orientation) * blurDistance);
            let deltaY = round(sin(orientation) * blurDistance);
            let destination = width * (deltaY + posY) + (deltaX + posX);
            // To pick up a random point that is at a constant distance
            if (
                pixels[destination * 4] != rArrival) {
                pixels[destination * 4 + 2] =
                    round(bNoise * noiseDistributionProportion +
                        bArrival * (1 - noiseDistributionProportion));
                pixels[destination * 4 + 1] =
                    round(gNoise * noiseDistributionProportion +
                        gArrival * (1 - noiseDistributionProportion));
                pixels[destination * 4 + 0] =
                    round(rNoise * noiseDistributionProportion +
                        rArrival * (1 - noiseDistributionProportion));
            }
        }
        // else if (timePassed < attack + decay + sustain * 4) {
        //   pixels[i * 4] = rNoise * 0.9 + pixels[i * 4] * 0.1;
        //   pixels[i * 4 + 1] = gNoise * 0.9 + pixels[i * 4 + 1] * 0.1;
        //   pixels[i * 4 + 2] = bNoise * 0.9 + pixels[i * 4 + 2] * 0.1;
        // }
        else {
            pixels[i * 4] = rNoise;
            pixels[i * 4 + 1] = gNoise;
            pixels[i * 4 + 2] = bNoise;
        }
    }
    z_off += z_increment;
    updatePixels();
    /*
    1-2. Motion blur of the ring (DIFFUSION), Mask with noise and the application
    */


    if (startToDisplay) {
        displayAoa();
    }
    /*
    1-3. Display the collections. (No idea about the color)
    */
}

/*
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
DRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAWDRAW
*/
function arrival() {
    let arrayOfArrival = [];
    /*
     ** Extra: creating an array to store the ring
     */
    notchNum = floor(random(notchMax));
    branchNum = floor(random(notchMax)) * branchMax;
    /*
    2-0. Numbers of Notches and Branches: 
        Branch is always ? times of notches;
        Notches is sometimes 0;
    */
    let startNotch = 0;
    for (let i = 0; i < notchNum; i++) {
        let thisNotch = random(startNotch, (angNum * (1 + i)) / notchNum);
        notches.push(thisNotch);
        startNotch = thisNotch;
    }

    for (let j = 0; j < branchNum; j++) {
        let thisBranch;
        let thisBranchCollapse = true;
        while (thisBranchCollapse) {
            let collapse = 0;
            thisBranch = random(angNum);
            for (let k = 0; k < notchNum; k++) {
                if (abs(thisBranch - notches[k]) < notchWidth) collapse++;
            }
            if (collapse == 0) thisBranchCollapse = false;
        }
        branches.push(thisBranch);
    }
    /*
    2-1. Preparing Array of Random Notches, try to divide evenly;
    2-2. Preparing Array of Branches not Overlapped with Notches;
    */

    /*
    CAUSION: This is the start of the main loop
    */
    let rotateAngle = random(2) * PI;
    for (let i = 0; i < angNum; i++) {
        let angle = i * 0.005 + rotateAngle;
        /*
        3-0. Rotate
        */
        let widOut = 0.1 * noise(wreckleness * angle);
        let widIn = 0.1 * noise(wreckleness * angle * 2);
        let widAid = 0.1 * noise((wreckleness * angle) / 4);
        let endDistance = min(angNum - i, i);
        let approachingEnd_A = endDistance / angNum;
        let approachingEnd_B = min(pow(approachingEnd_A, 2), 1) * 2;
        let approachingEnd_C = noise(i * 0.01) / 3;
        widOut *= approachingEnd_C ** enclosingThickness * thickness;
        widIn *= approachingEnd_C ** enclosingThickness * thickness;
        widAid *= approachingEnd_C ** 1 * thickness;
        /*
        3-1. Angle Related Parameters, including Steering Feature Width Related Parameters. 
        Controll of Width, and Narrowing down when approaching End.
        */
        let blank = 0;
        let gradualDecrease = 0;
        for (let j = 0; j < notches.length; j++) {
            if (abs(i - notches[j]) < notchWidth) {
                blank++;
            }
            // blank means the number of notches you're bumping into;

            // if (blank == 0) stroke(inkColor);
            // QUESTION: I feel like this is why it's always black;
            if (
                abs(i - notches[j]) < notchWidth * 3 &&
                abs(i - notches[j]) > notchWidth
            ) {
                gradualDecrease++;
                widOut *= map(abs(i - notches[j]), notchWidth * 3, 0, 1, -0.5);
                widIn *= map(abs(i - notches[j]), notchWidth * 3, 0, 1, -0.5);
            }
            //Making the gradualDecrease which is the part close to the notches
        }
        /*
        << 2-3. Applying Random Notches and the Gradual Decreases
        */
        let radiusA = radius * (1 + widOut) * (1 + widAid);
        let radiusB = radius * (1 - widIn) * (1 + widAid);
        let pointA = createVector(cos(angle) * radiusA, sin(angle) * radiusA);
        let pointB = createVector(cos(angle) * radiusB, sin(angle) * radiusB);
        pointA.add(center);
        pointB.add(center);
        // The brush of the canvas, the whole
        if (blank == 0) {
            //line(pointA.x, pointA.y, pointB.x, pointB.y);
            arrayOfArrival.push([pointA, pointB]);
        }
        /*
        << 3-1. Execute the Circle with Multiple Lines
        Branches System >>
        */
        for (let j = 0; j < branches.length; j++) {
            if (i == floor(branches[j])) {
                let branchLength = ((widOut + widIn) * branchLengthStandard) ** 3.1;
                //QUESTION: branchLength ranks in 0.1 ~ 152, and the folding phenomenon widely exists even just around 30;
                //console.log(branchLength);
                let perpAngle;
                let steering;
                let beta;
                let adjustment;
                if (random(1) > 0.5) angle += PI / 2;
                else angle -= PI / 2;
                // first attempt to make branches inward
                if (random(1) > 0.5) perpAngle = angle + PI / branchCurveness;
                else perpAngle = angle - PI / branchCurveness;
                //Preparing the parameters and set the directions of the branches;
                for (let k = 0; k < floor(branchLength) + 5; k++) {
                    steering = randomGaussian(k / branchLength, branchGaussian);
                    // steering is also widely spanned, but without +5 is would be extremely bold.
                    beta = lerp(angle, perpAngle, steering);
                    // beta is how the branches steer from the origin angle to destination angle.
                    adjustment = createVector(cos(beta), sin(beta));
                    //computing the twistness of the branch at this moment
                    if (k < branchLength) {
                        adjustment = createVector(cos(beta), sin(beta));
                    }
                    else {
                        pointB.lerp(pointA, 0.9);
                    }
                    // this else part and the "+5" is the key point to make branches shrink
                    pointA.add(adjustment.mult(0.7));
                    pointB.add(adjustment.mult(0.3));
                    let pointC = pointA.copy();
                    let pointD = pointB.copy();
                    //line(pointA.x, pointA.y, pointB.x, pointB.y);
                    arrayOfArrival.push([pointC, pointD]);
                }
            }
        }
        /*
        3-2. The Branch System with RandomGaussian(firstly the parameters)
        By making a Vector of adjustment and add it to point A and B
        */
    }
    z_off = 0;



    /*
    4-1. Input and Interaction
    */

    /*
    << TESTING >>
    */
    return arrayOfArrival;
}
/*
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
ArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrivalArrival
*/

function collect() {
    push();
    // stroke(collectionColor)
    // fill(0,0,0)
    // collection[graphicsIndex].rect(0,0,wth,hght);

    collectionMarksAlien[graphicsIndex].html(alienAnswerInString);
    collectionMarksHuman[graphicsIndex].html(humanAskInString);
    if (graphicsIndex < projectMax) {
        for (let i = 0; i < aoa.length; i++) { collection[graphicsIndex].line(aoa[i][0].x, aoa[i][0].y, aoa[i][1].x, aoa[i][1].y) }
        graphicsIndex++;
    }
    pop();
    shuffleABC();
}

function displayAoa() {
    let pX;
    let pY;
    let cX;
    let cY;
    let markWidth = (projectWidth - 2 * projectOffset * 1.38);
    for (let i = 0; i < graphicsIndex; i++) {
        pX=floor(i / rowNum);
        pY = i % rowNum;
        pX *= (projectWidth - projectOffset * 2);
        pX -= projectOffset;

        if(i>7){pX+=(projectWidth - projectOffset * 2)*2.62}
        pY *= projectHeight;
        cX = pX + projectWidth / 2;
        cY = pY + projectHeight / 2;
        push();
        image(collection[i], pX, pY, projectWidth, projectWidth / proportionScreen);
        // collectionMarksAlien[i].style('color', '');
        collectionMarksAlien[i].show();
        // collectionMarksAlien[i].html(collectionMarksAlien[i].html()+graphicsIndex)
        collectionMarksAlien[i].style('text-align', 'center');
        collectionMarksAlien[i].style('font-size', '18px');
        collectionMarksAlien[i].style('left', '50%');
        collectionMarksAlien[i].style('top', '50%');
        collectionMarksAlien[i].style('transform', 'translate(-50%, -50%)');
        collectionMarksAlien[i].style('width', markWidth + 'px');
        collectionMarksAlien[i].style('word-wrap', 'break-word');
        collectionMarksAlien[i].style('font-family', 'Arial');
        collectionMarksAlien[i].style('font-style', 'italic');
        collectionMarksAlien[i].position(cX, cY + (radius / proportionCollection) * 1.14);
        //
        collectionMarksHuman[i].show();
        collectionMarksHuman[i].style('text-align', 'center');
        collectionMarksHuman[i].style('font-size', '18px');
        collectionMarksHuman[i].style('left', '50%');
        collectionMarksHuman[i].style('top', '50%');
        collectionMarksHuman[i].style('transform', 'translate(-50%, -25%)');
        collectionMarksHuman[i].style('width', markWidth + 'px');
        collectionMarksHuman[i].style('word-wrap', 'break-word');
        collectionMarksHuman[i].position(cX, cY - (radius / proportionCollection) * 1.64);
        pop();


    }
}
function setBoxes() {
    for (let i = 0; i < 5; i++) {
        let boxSize = random(radius * 0.28, radius * 0.34);
        let boxTopLeftCorner = center.copy();
        let boxMovement = createVector(cos(boundingBoxes[i]) * radius, sin(boundingBoxes[i]) * radius);
        let boxCenterMovement = createVector(-boxSize / 2, -boxSize / 2);
        boxTopLeftCorner.add(boxMovement);
        boxTopLeftCorner.add(boxCenterMovement);
        rect(boxTopLeftCorner.x, boxTopLeftCorner.y, boxSize, boxSize);
    }
}
function drawBoxes() {
    for (let i = 0; i < 5; i++) {
        let boxTopLeftCorner = center.copy();
        let boxMovement = createVector(cos(boundingBoxes[i][0]) * radius, sin(boundingBoxes[i][0]) * radius);
        let boxCenterMovement = createVector(-boxSize / 2, -boxSize / 2);
        boxTopLeftCorner.add(boxMovement);
        boxTopLeftCorner.add(boxCenterMovement);
        rect(boxTopLeftCorner.x, boxTopLeftCorner.y, boxSize, boxSize);
    }
}

function keyPressed() {
    if (keyCode === ENTER) {
        humanAskInString = textBox.value();
        textBox.value("");
        humanNote.html("You are asking: " + humanAskInString);
        let humanNoteWidth = textWidth(humanNote.html())
        humanNote.position(width / 2 - humanNoteWidth/humanNoteWidthMovement, height / 1.08 - 100);
        trigger();
    }
    if (graphicsIndex==projectMax){
        graphicsIndex=0;
        collection=[];
        collectionMarksAlien=[];
        collectionMarksHuman=[];
    }
}

// function mousePressed() {
//     trigger();
// }
function functionA() {
    humanAskInString = possibleA.html();
    humanNote.html("You are asking: " + humanAskInString);
    let humanNoteWidth = textWidth(humanNote.html())
    humanNote.position(width / 2 - humanNoteWidth/humanNoteWidthMovement, height / 1.08 - 100);
    trigger();
}
function functionB() {
    humanAskInString = possibleB.html();
    humanNote.html("You are asking: " + humanAskInString);
    let humanNoteWidth = textWidth(humanNote.html())
    humanNote.position(width / 2 - humanNoteWidth/humanNoteWidthMovement, height / 1.08 - 100);
    trigger();
} function functionC() {
    humanAskInString = possibleC.html();
    humanNote.html("You are asking: " + humanAskInString);
    let humanNoteWidth = textWidth(humanNote.html())
    humanNote.position(width / 2 - humanNoteWidth/humanNoteWidthMovement, height / 1.08 - 100);
    trigger();
}

function passiveTalk() {
    humanAskInString = defaultQuestions[graphicsIndex];
    humanNote.html("Automatically Asked: " + humanAskInString);
    let humanNoteWidth = textWidth(humanNote.html())
    humanNote.position(width / 2 - humanNoteWidth/humanNoteWidthMovement, height / 1.08 - 100);
    trigger();
}

function shuffleABC() {
    let defaultQuestionCopy = defaultQuestions.slice();
    defaultQuestionCopy.splice(graphicsIndex, 1);
    defaultQuestionCopy = defaultQuestionCopy.filter(item => item !== possibleA.html());
    defaultQuestionCopy = defaultQuestionCopy.filter(item => item !== possibleB.html());
    defaultQuestionCopy = defaultQuestionCopy.filter(item => item !== possibleC.html());
    let selectedItems = [];
    for (let i = 0; i < 3; i++) {
        let randomIndex = Math.floor(random(defaultQuestionCopy.length - 1));
        selectedItems.push(defaultQuestionCopy[randomIndex]);
        defaultQuestionCopy.splice(randomIndex, 1);
    }
    possibleA.html(selectedItems[0]);
    possibleB.html(selectedItems[1]);
    possibleC.html(selectedItems[2]);
    sizeA = textWidth(possibleA.html()) / 2.5;
    sizeB = textWidth(possibleB.html()) / 2.5;
    sizeC = textWidth(possibleC.html()) / 2.5;
    centralTextOffset = sizeA + sizeB + sizeC + spaceBetween * 2;
    unifiedY = height / 1.08 - 72;
    // possibleA.position(width / 2 - sizeA - sizeB / 2 - spaceBetween, unifiedY);
    // slash1.position(width / 2 - sizeB / 2 - spaceBetween / 2, unifiedY);
    // possibleB.position(width / 2 - sizeB / 2, unifiedY);
    // slash2.position(width / 2 + sizeB / 2 + spaceBetween / 2, unifiedY);
    // possibleC.position(width / 2 + sizeB / 2 + spaceBetween, unifiedY);
    let startingTextX = width / 2 - centralTextOffset / 2;
    possibleA.position(startingTextX, unifiedY);
    slash1.position(startingTextX + sizeA + spaceBetween / 2, unifiedY);
    possibleB.position(startingTextX + sizeA + spaceBetween, unifiedY);
    slash2.position(startingTextX + sizeA + sizeB + spaceBetween * 1.5, unifiedY);
    possibleC.position(startingTextX + sizeA + sizeB + spaceBetween * 2, unifiedY);
}
/*
Trigger---------Trigger---------Trigger---------Trigger---------Trigger---------Trigger---------
Trigger---------Trigger---------Trigger---------Trigger---------Trigger---------Trigger---------
Trigger---------Trigger---------Trigger---------Trigger---------Trigger---------Trigger---------
*/
async function trigger() {
    click = true;
    startingTime = millis();
    aoa = arrival();
    let startBBox = 0;
    for (let i = 0; i < 5; i++) {
        let thisBBox = random(startBBox, (2 * PI * (1 + i)) / 5);

        let thisBoxSize = random(radius * 0.28, radius * 0.34);
        boundingBoxes.push([thisBBox, thisBoxSize]);
        startBBox = thisBBox;
    }
    await sendAndDisplayGPTResponse();
    //MARK
    try {
        chatGPTanswerArray = JSON.parse(chatGPTanswerOriginal);
        // console.log(chatGPTanswerOriginal);
    } catch (error) {
        chatGPTanswerArray = [
            ['Unknown', 'Unknown', 'Unknown', 'Unknown', 'Unknown'],
            ['What do you mean?', 'Is there any problems?'],
            'Unable to translate. Be careful.'
        ]
    }
    wordsArray = chatGPTanswerArray[0];
    wordsAlltogetherInString = JSON.stringify(chatGPTanswerArray[0]);
    humanGivenArray = chatGPTanswerArray[1];
    alienAnswerInString = chatGPTanswerArray[2];
    alien.html(alienAnswerInString);
    let allPredictions;
    for (let i = 0; i < humanGivenArray.length; i++) {
        allPredictions += humanGivenArray[i];
        if (i < humanGivenArray.length - 1)
            allPredictions += ' / '
    }
    humanGivenAnswerAllTogether = allPredictions
}
 
async function sendAndDisplayGPTResponse() {
    const message = prefix + humanAskInString + suffix;

    const response = await fetch('http://localhost:3000/chatgpt', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message })
    });

    const reply = await response.text();
    chatGPTanswerOriginal = reply;
}