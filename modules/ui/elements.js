// UI Element references and management - Bubble Design

const UI = {
    // DOM Elements
    progressContainer: null,
    progressBar: null,
    inputBubble: null,
    inputField: null,
    questionBubbles: null,
    statusText: null,
    alienResponse: null,
    alienText: null,
    alienNote: null,
    
    // State
    isSubmitting: false,
    
    // Initialize all UI elements
    init() {
        this.createProgressBar();
        this.createInputBubble();
        this.createQuestionBubbles();
        this.createStatusText();
        this.createAlienResponse();
    },
    
    // Progress Bar
    createProgressBar() {
        this.progressContainer = document.createElement('div');
        this.progressContainer.id = 'progress-container';
        
        this.progressBar = document.createElement('div');
        this.progressBar.id = 'progress-bar';
        
        this.progressContainer.appendChild(this.progressBar);
        document.body.appendChild(this.progressContainer);
    },
    
    // Input Bubble
    createInputBubble() {
        this.inputBubble = document.createElement('div');
        this.inputBubble.id = 'input-bubble';
        
        this.inputField = document.createElement('input');
        this.inputField.type = 'text';
        this.inputField.placeholder = 'Ask something...';
        
        this.inputBubble.appendChild(this.inputField);
        document.body.appendChild(this.inputBubble);
        
        // Enter key handler
        this.inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !this.isSubmitting) {
                const value = this.inputField.value.trim();
                if (value) {
                    this.onSubmit(value);
                }
            }
        });
    },
    
    // Question Bubbles Container
    createQuestionBubbles() {
        this.questionBubbles = document.createElement('div');
        this.questionBubbles.id = 'question-bubbles';
        document.body.appendChild(this.questionBubbles);
    },
    
    // Status Text
    createStatusText() {
        this.statusText = document.createElement('div');
        this.statusText.id = 'status-text';
        document.body.appendChild(this.statusText);
    },
    
    // Alien Response Area
    createAlienResponse() {
        this.alienResponse = document.createElement('div');
        this.alienResponse.id = 'alien-response';
        
        this.alienText = document.createElement('div');
        this.alienText.id = 'alien-text';
        
        this.alienNote = document.createElement('div');
        this.alienNote.id = 'alien-note';
        
        this.alienResponse.appendChild(this.alienText);
        this.alienResponse.appendChild(this.alienNote);
        document.body.appendChild(this.alienResponse);
    },
    
    // Set question bubbles (3 suggestions)
    setQuestions(questions, onClick) {
        this.questionBubbles.innerHTML = '';
        
        questions.forEach((q, index) => {
            const bubble = document.createElement('div');
            bubble.className = 'question-bubble';
            bubble.textContent = q;
            
            bubble.addEventListener('click', () => {
                if (!this.isSubmitting && onClick) {
                    onClick(q, index);
                }
            });
            
            this.questionBubbles.appendChild(bubble);
        });
    },
    
    // Update suggestions (wrapper for compatibility)
    setSuggestions(questions) {
        this.setQuestions(questions, (q) => {
            this.inputField.value = q;
            this.onSubmit(q);
        });
    },
    
    // Set button handlers (legacy compatibility)
    setButtonHandlers(handlerA, handlerB, handlerC) {
        // Handlers are now managed through setQuestions
    },
    
    // Set submit callback
    setSubmitCallback(callback) {
        this.onSubmit = callback;
    },
    
    // Get input value
    getInputValue() {
        return this.inputField.value;
    },
    
    // Clear input
    clearInput() {
        this.inputField.value = '';
    },
    
    // Set status text
    setStatus(text) {
        this.statusText.textContent = text;
    },
    
    // Clear status
    clearStatus() {
        this.statusText.textContent = '';
    },
    
    // Set alien text
    setAlienText(text) {
        this.alienText.textContent = text;
    },
    
    // Show alien text
    showAlien() {
        this.alienText.classList.add('visible');
    },
    
    // Hide alien text
    hideAlien() {
        this.alienText.classList.remove('visible');
    },
    
    // Set alien note
    setAlienNoteText(text) {
        this.alienNote.textContent = text;
    },
    
    // Show alien note
    showAlienNote() {
        this.alienNote.classList.add('visible');
    },
    
    // Hide alien note
    hideAlienNote() {
        this.alienNote.classList.remove('visible');
    },
    
    // Set human note (mapped to status)
    setHumanNote(text) {
        this.setStatus(text);
    },
    
    // Progress Bar Control
    showProgress() {
        this.progressContainer.classList.add('active');
        this.isSubmitting = true;
        this.inputField.disabled = true;
        this.inputBubble.style.opacity = '0.5';
    },
    
    hideProgress() {
        this.progressContainer.classList.remove('active');
        this.isSubmitting = false;
        this.inputField.disabled = false;
        this.inputBubble.style.opacity = '1';
        this.inputField.focus();
    },
    
    setProgress(percent) {
        this.progressBar.style.width = percent + '%';
    },
    
    // Animation progress (attack/decay/sustain/release phases)
    updateAnimationProgress(timePassed, totalDuration) {
        const percent = Math.min((timePassed / totalDuration) * 100, 100);
        this.setProgress(percent);
    }
};
