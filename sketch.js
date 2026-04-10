// Main entry point - Arrival: Talking to the Alien
// Modular architecture with memory, progressive questions, and bubble UI

// Global references for p5.js callbacks
let mainCanvas;
let boundingBoxes = [];

function setup() {
    // Initialize canvas
    mainCanvas = createCanvas(windowWidth, windowHeight);
    textAlign(CENTER, TOP);
    strokeCap(ROUND);
    angleMode(RADIANS);
    pixelDensity(1);
    strokeWeight(2);
    frameRate(24);
    noiseDetail(2, 0.12);
    
    // Initial white background (required)
    push();
    noStroke();
    fill(255, 255, 255);
    rect(0, 0, width, height);
    pop();
    
    // Initialize modules
    RenderConfig.initColor();
    LayoutState.init();
    
    // Initialize UI (new bubble design)
    UI.init();
    UI.setSubmitCallback(handleSubmit);
    
    // Initialize collection
    CollectionState.initGraphics();
    CollectionState.calculateLayout(LayoutState.radius, LayoutState.maxHW, LayoutState.minHW);
    
    // Initialize conversation state
    ConversationState.reset();
    
    // Generate initial suggestions
    updateSuggestions();
    
    // Start passive talk timer
    const revivalTime = AnimationState.getRevivalTime();
    setInterval(passiveTalk, revivalTime);
    passiveTalk();
}

function draw() {
    // Handle animation with progress bar
    if (AnimationState.aoa.length > 0) {
        handleAnimation();
    }
    
    // Apply diffusion effect
    const timePassed = millis() - AnimationState.startingTime;
    const totalDuration = AnimationState.attack + AnimationState.decay + 
                         AnimationState.sustain + AnimationState.release;
    
    applyDiffusion(AnimationState.aoa, timePassed, totalDuration);
    
    // Display collection if ready
    if (CollectionState.startToDisplay) {
        displayCollection(CollectionState, LayoutState.radius);
    }
}

function handleAnimation() {
    const phase = AnimationState.getPhase();
    const lerpValue = AnimationState.getLerpValue();
    const timePassed = millis() - AnimationState.startingTime;
    const totalDuration = AnimationState.attack + AnimationState.decay + 
                         AnimationState.sustain + AnimationState.release;
    
    // Update progress bar
    UI.updateAnimationProgress(timePassed, totalDuration);
    
    switch (phase) {
        case 'attack':
            UI.setAlienNoteText('Analyzing...');
            UI.showAlienNote();
            break;
            
        case 'decay':
            UI.showAlien();
            UI.hideAlienNote();
            UI.setAlienNoteText('Approximate Translation');
            break;
            
        case 'sustain':
            // Sustain phase - no changes
            break;
            
        case 'release':
            // Release phase
            break;
            
        case 'finished':
            finishAnimation();
            return;
    }
    
    // Draw animated lines
    drawArrivalLines(AnimationState.aoa, lerpValue);
}

function finishAnimation() {
    // Collect to collection
    CollectionState.collect(AnimationState.aoa, LayoutState.radius);
    
    // Reset animation state
    AnimationState.aoa = [];
    CollectionState.startToDisplay = true;
    
    // Update UI
    UI.showAlienNote();
    UI.setAlienNoteText('I am here.');
    UI.hideAlien();
    
    // Hide progress bar
    UI.hideProgress();
    UI.clearStatus();
    
    // Update suggestions
    updateSuggestions();
}

// Handle form submission
function handleSubmit(value) {
    ConversationState.setQuestion(value);
    UI.clearInput();
    UI.setHumanNote('You are asking: ' + value);
    triggerConversation();
}

// Input handling (backup for any p5 key events)
function keyPressed() {
    // Enter is now handled by the input field
    // This is just for collection reset
    if (CollectionState.graphicsIndex === CollectionState.projectMax) {
        resetSession();
    }
}

// Reset entire session (collection + conversation)
function resetSession() {
    CollectionState.reset();
    CollectionState.calculateLayout(
        LayoutState.radius, 
        LayoutState.maxHW, 
        LayoutState.minHW
    );
    ConversationState.reset();
    updateSuggestions();
}

// Passive talk (auto-trigger)
function passiveTalk() {
    const roundIndex = ConversationState.getRoundIndex();
    const question = getDefaultQuestion(roundIndex);
    
    ConversationState.setQuestion(question);
    UI.setHumanNote('Automatically Asked: ' + question);
    triggerConversation();
}

// Update suggestion bubbles
function updateSuggestions() {
    const roundIndex = ConversationState.getRoundIndex();
    const lastExchange = ConversationState.getLastExchange();
    const lastAnswer = lastExchange ? lastExchange.alien : null;
    
    // Get 3 progressive questions
    const suggestions = getProgressiveQuestions(
        roundIndex,
        lastAnswer,
        '', '', '' // No need to filter current display with new UI
    );
    
    // Update bubble UI with click handlers
    UI.setQuestions(suggestions, (q) => {
        handleSubmit(q);
    });
}

// Main conversation trigger with memory
async function triggerConversation() {
    if (getRequestInFlight()) return;
    setRequestInFlight(true);
    
    // Show progress bar
    UI.showProgress();
    
    // Reset display state
    CollectionState.startToDisplay = false;
    UI.hideAlien();
    UI.hideAlienNote();
    
    // Start animation
    AnimationState.reset();
    AnimationState.aoa = generateArrival(
        LayoutState.radius,
        LayoutState.center,
        LayoutState.angNum,
        LayoutState.notchWidth
    );
    
    // Generate bounding boxes
    boundingBoxes = generateBoundingBoxes(LayoutState.radius);
    
    try {
        // Get conversation history for context
        const historyText = ConversationState.getFormattedHistory();
        const currentQuestion = ConversationState.humanQuestion;
        
        // Send API request with context
        const response = await sendChatMessage(currentQuestion, historyText);
        
        // Parse response
        const parsed = parseResponse(response);
        ConversationState.setResponse(response, parsed);
        
        // Update UI with response (will show when animation finishes)
        UI.setAlienText(ConversationState.alienAnswer);
        
    } catch (error) {
        console.error('Chat request failed:', error);
        UI.setHumanNote('Connection issue. Please try again.');
        
        const fallback = parseResponse(FALLBACK_RESPONSE);
        ConversationState.setResponse(FALLBACK_RESPONSE, fallback);
        UI.setAlienText(ConversationState.alienAnswer);
    } finally {
        setRequestInFlight(false);
        // Note: hideProgress is called in finishAnimation()
    }
}
