// Animation state management

const AnimationState = {
    // Timing parameters (in milliseconds)
    attack: 3000,
    decay: 300,
    sustain: 3500,
    release: 3500,
    
    // Current state
    startingTime: 0,
    isRunning: false,
    
    // Visual parameters
    peak: -0.07,
    aoa: [], // Array of arrival lines
    
    // Reset animation state
    reset() {
        this.startingTime = millis();
        this.isRunning = true;
        this.aoa = [];
    },
    
    // Get current phase based on elapsed time
    getPhase() {
        const timePassed = millis() - this.startingTime;
        const totalDuration = this.attack + this.decay + this.sustain + this.release;
        
        if (timePassed < this.attack) return 'attack';
        if (timePassed < this.attack + this.decay) return 'decay';
        if (timePassed < this.attack + this.decay + this.sustain) return 'sustain';
        if (timePassed < totalDuration) return 'release';
        return 'finished';
    },
    
    // Get current lerp value for animation
    getLerpValue() {
        const timePassed = millis() - this.startingTime;
        
        if (timePassed < this.attack) {
            return map(timePassed, 0, this.attack, 0.5, this.peak);
        } else if (timePassed < this.attack + this.decay) {
            return map(timePassed - this.attack, 0, this.decay, this.peak, 0);
        } else if (timePassed < this.attack + this.decay + this.sustain) {
            return 0;
        } else if (timePassed < this.attack + this.decay + this.sustain + this.release) {
            return map(timePassed - this.attack - this.decay - this.sustain, 0, this.release, 0, 0.5);
        }
        return 0.5;
    },
    
    // Get noise distribution proportion
    getNoiseDistributionProportion() {
        const timePassed = millis() - this.startingTime;
        const totalDuration = this.attack + this.decay + this.sustain + this.release;
        return timePassed / totalDuration;
    },
    
    // Check if animation has finished
    isFinished() {
        const timePassed = millis() - this.startingTime;
        return timePassed >= (this.attack + this.decay + this.sustain + this.release);
    },
    
    // Get revival time for passive talk
    getRevivalTime() {
        return this.attack + this.decay + this.sustain + this.release + 
               max(this.attack + this.decay + this.sustain + this.release);
    }
};
