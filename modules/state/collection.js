// Collection state management for conversation history

const CollectionState = {
    // Collection data
    items: [],
    marksAlien: [],
    marksHuman: [],
    
    // Display parameters
    graphicsIndex: 0,
    graphicsMax: 24,
    numOfCollection: 8,
    proportionCollection: 4,
    scale: 3,
    
    // Layout calculations (set during setup)
    projectWidth: 0,
    projectHeight: 0,
    projectOffset: 0,
    projectMax: 16,
    colNum: 0,
    rowNum: 0,
    centralOffset: 0,
    startToDisplay: false,
    
    // Current conversation data
    currentAlienAnswer: '',
    currentHumanQuestion: '',
    
    // Initialize collection graphics
    initGraphics() {
        this.items = [];
        this.marksAlien = [];
        this.marksHuman = [];
        
        for (let i = 0; i < this.graphicsMax; i++) {
            const sticker = createGraphics(windowWidth, windowHeight);
            const markAlien = createP('');
            const markHuman = createP('');
            
            markAlien.hide();
            markHuman.hide();
            
            this.items.push(sticker);
            this.marksAlien.push(markAlien);
            this.marksHuman.push(markHuman);
        }
    },
    
    // Calculate layout based on screen size
    calculateLayout(radius, maxHW, minHW) {
        const proportionScreen = maxHW / minHW;
        this.projectWidth = maxHW / this.proportionCollection;
        this.projectHeight = minHW / this.proportionCollection;
        this.projectOffset = (maxHW / 2 - radius) / this.proportionCollection * 0.6;
        
        this.rowNum = this.proportionCollection;
        this.colNum = floor(maxHW / (this.projectWidth - this.projectOffset * 2));
        this.projectMax = this.colNum * this.rowNum;
        this.centralOffset = (maxHW - this.colNum * (this.projectWidth - this.projectOffset * 2)) / 2;
    },
    
    // Add current animation to collection
    collect(aoa, radius) {
        if (this.graphicsIndex >= this.projectMax) return;
        
        const markWidth = (this.projectWidth - 2 * this.projectOffset * 1.38);
        
        // Update text marks
        this.marksAlien[this.graphicsIndex].html(this.currentAlienAnswer);
        this.marksHuman[this.graphicsIndex].html(this.currentHumanQuestion);
        
        // Draw lines to collection graphics
        this.items[this.graphicsIndex].clear();
        for (let i = 0; i < aoa.length; i++) {
            this.items[this.graphicsIndex].line(
                aoa[i][0].x, aoa[i][0].y, 
                aoa[i][1].x, aoa[i][1].y
            );
        }
        
        this.graphicsIndex++;
    },
    
    // Reset collection
    reset() {
        this.graphicsIndex = 0;
        this.items = [];
        this.marksAlien = [];
        this.marksHuman = [];
        this.startToDisplay = false;
        this.initGraphics();
    },
    
    // Set current conversation data
    setCurrentData(alienAnswer, humanQuestion) {
        this.currentAlienAnswer = alienAnswer;
        this.currentHumanQuestion = humanQuestion;
    }
};
