// Rendering configuration parameters

const RenderConfig = {
    // Ring generation parameters
    notchMax: 8,
    branchMax: 60,
    branchGaussian: 1.4,
    branchLengthStandard: 60,
    branchCurveness: 6,
    thickness: 2.7,
    enclosingThickness: 0.5,
    wreckleness: 4,
    
    // Pixel density
    pixelDens: 1,
    
    // Motion blur / diffusion parameters
    blurDistance: 0.9,
    noiseScale: 0.015,
    noiseIndex: 0,
    xy_increment: 3,
    z_increment: 0.04,
    threshold: 3,
    noiseDistributionProportionStandard: 0.03,
    
    // Colors
    inkColor: null, // Set during setup
    
    // Current noise offset (animated)
    z_off: 0,
    
    // Initialize color
    initColor() {
        this.inkColor = color(10, 10, 10);
    },
    
    // Update noise offset
    updateNoise() {
        this.z_off += this.z_increment;
    }
};

// Layout state (calculated during setup)
const LayoutState = {
    radius: 0,
    center: null,
    angNum: 0,
    notchWidth: 0,
    minHW: 0,
    maxHW: 0,
    
    // Initialize layout based on screen size
    init() {
        this.minHW = min(windowWidth, windowHeight);
        this.maxHW = max(windowWidth, windowHeight);
        this.radius = this.minHW * 0.27;
        this.angNum = floor(PI * 4 * 100) + 1;
        this.center = createVector(width / 2, height / 2);
        this.notchWidth = floor(random(18, 26));
    },
    
    // Recalculate on resize
    update() {
        this.init();
    }
};
