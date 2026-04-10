// Diffusion / motion blur rendering effect

/**
 * Apply diffusion effect to canvas pixels
 * Creates the organic "fog" effect around the ring
 * 
 * @param {Array} aoa - Array of arrival lines (for timing)
 * @param {number} timePassed - Milliseconds since animation started
 * @param {number} totalDuration - Total animation duration
 */
function applyDiffusion(aoa, timePassed, totalDuration) {
    const config = RenderConfig;
    const noiseDistributionProportion = timePassed / totalDuration;
    const colorOff = sin(config.z_off);
    
    loadPixels();
    const pixelNum = width * height;
    
    for (let i = 0; i < pixelNum; i++) {
        const posX = i % width;
        const posY = floor(i / width);
        
        // Calculate noise values
        const noiseVal = noise(
            (posX / width) * config.xy_increment,
            (posY / height) * config.xy_increment,
            config.z_off
        );
        
        // Background color from noise
        const rNoise = 230 - noiseVal * 194 + colorOff * 10;
        const gNoise = 230 - noiseVal * 184 + colorOff * 12;
        const bNoise = 230 - noiseVal * 186 + colorOff * 16;
        
        // Current pixel color
        const rArrival = pixels[i * 4];
        const gArrival = pixels[i * 4 + 1];
        const bArrival = pixels[i * 4 + 2];
        
        // Apply diffusion during animation
        const shouldDiffuse = rNoise - rArrival >= 15 && 
                             timePassed < totalDuration && 
                             aoa.length > 0;
        
        if (shouldDiffuse) {
            // Pick random neighbor
            const orientation = random(2 * PI);
            const deltaX = round(cos(orientation) * config.blurDistance);
            const deltaY = round(sin(orientation) * config.blurDistance);
            const destination = width * (deltaY + posY) + (deltaX + posX);
            
            // Blend colors if neighbor is different
            if (pixels[destination * 4] !== rArrival) {
                pixels[destination * 4 + 2] = round(
                    bNoise * noiseDistributionProportion + bArrival * (1 - noiseDistributionProportion)
                );
                pixels[destination * 4 + 1] = round(
                    gNoise * noiseDistributionProportion + gArrival * (1 - noiseDistributionProportion)
                );
                pixels[destination * 4 + 0] = round(
                    rNoise * noiseDistributionProportion + rArrival * (1 - noiseDistributionProportion)
                );
            }
        } else {
            // Set to background color
            pixels[i * 4] = rNoise;
            pixels[i * 4 + 1] = gNoise;
            pixels[i * 4 + 2] = bNoise;
        }
    }
    
    updatePixels();
    config.updateNoise();
}

/**
 * Draw the arrival ring with animation lerping
 * 
 * @param {Array} aoa - Array of arrival lines
 * @param {number} lerpValue - Current animation lerp value
 */
function drawArrivalLines(aoa, lerpValue) {
    if (aoa.length === 0) return;
    
    for (let i = 0; i < aoa.length; i++) {
        const pointLerpedA = aoa[i][0].copy();
        const pointLerpedB = aoa[i][1].copy();
        
        pointLerpedA.lerp(aoa[i][1], lerpValue);
        pointLerpedB.lerp(aoa[i][0], lerpValue);
        
        line(pointLerpedA.x, pointLerpedA.y, pointLerpedB.x, pointLerpedB.y);
    }
}
